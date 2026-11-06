'use client';

import {useEffect,useRef,useState} from "react";
import {getRvr60Audio} from "@/lib/rvr60-audio";
import {getRvr60VerseStarts, verseAtAudioTime} from "@/lib/rvr60-verse-timing";

type Verse={number:number;text:string};

export default function BibleAudioControls({language,bookCode,chapter,verses=[]}:{language:"qeqchi"|"rvr60";bookCode?:string;chapter?:number;verses?:Verse[]}){
 const label=language==="qeqchi"?"Q’eqchi’ · Li Santil Hu":"Español · RVR1960";
 const audioRef=useRef<HTMLAudioElement|null>(null); const cardRef=useRef<HTMLElement|null>(null);
 const audioUrl=language==="rvr60"&&bookCode&&chapter?getRvr60Audio(bookCode,chapter):null;
 const initialized=useRef(false);
 const hasStarted=useRef(false);
 const activeVerseRef=useRef<number|null>(null);
 const [hasTimings,setHasTimings]=useState(false); const [speed,setSpeed]=useState(1); const [playing,setPlaying]=useState(false); const [progress,setProgress]=useState(0); const [showFloating,setShowFloating]=useState(false); const [activeVerse,setActiveVerse]=useState<number|null>(null);
 useEffect(()=>()=>{
   window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse:null}}));
 },[]);
 useEffect(()=>{const update=()=>{const card=cardRef.current;setShowFloating(Boolean(card&&card.getBoundingClientRect().bottom<0));};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};},[]);
 // Cached metadata can arrive before React attaches the audio handlers.
 useEffect(()=>{
   if(audioRef.current && audioRef.current.readyState>=HTMLMediaElement.HAVE_METADATA){
     initializeAudio();
   }
 },[]);
 const ready=Boolean(audioUrl);
 function emitVerse(verse:number|null){
   if(verse===activeVerseRef.current)return;
   activeVerseRef.current=verse;
   setActiveVerse(verse);
   window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse}}));
 }
 function verseStarts(a:HTMLAudioElement){
   return getRvr60VerseStarts(audioUrl,a.duration,verses);
 }
 function startOffset(a:HTMLAudioElement,starts=verseStarts(a)){
   const introSkip=language==="rvr60"&&Number.isFinite(a.duration)&&a.duration>15?15:0;
   return starts?Math.min(introSkip,Math.max(0,starts[0]-.5)):introSkip;
 }
 function syncVerse(){
   const a=audioRef.current;
   if(!a)return;
   const starts=verseStarts(a);
   const offset=startOffset(a,starts);
   setProgress(Number.isFinite(a.duration)&&a.duration>offset?Math.max(0,Math.min(100,(a.currentTime-offset)/(a.duration-offset)*100)):0);
   setHasTimings(Boolean(starts));
   emitVerse(starts&&hasStarted.current&&!a.ended?verseAtAudioTime(starts,a.currentTime):null);
 }
 function initializeAudio(){
   const audio=audioRef.current;
   if(!audio || initialized.current)return;
   initialized.current=true;
   audio.playbackRate=speed;
   audio.currentTime=startOffset(audio);
   syncVerse();
 }
 function skip(s:number){const a=audioRef.current;if(!a)return;a.currentTime=Math.max(startOffset(a),Math.min(a.duration||Infinity,a.currentTime+s));syncVerse();}
 function togglePlay(){const a=audioRef.current;if(!a)return;if(a.paused){if(a.currentTime<startOffset(a)||a.ended)a.currentTime=startOffset(a);void a.play().catch(()=>setPlaying(false));}else a.pause();}
 function toggleSpeed(){const opts=[1,1.25,1.5,.75];const next=opts[(opts.indexOf(speed)+1)%opts.length];setSpeed(next);if(audioRef.current)audioRef.current.playbackRate=next;}
 function controls(floating=false){return <div className={floating?"bibleAudioControls bibleAudioFloatingControls":"bibleAudioControls"}><button type="button" className="audioSkip" onClick={()=>skip(-10)} disabled={!ready}>↶</button><button type="button" className="audioPlay" onClick={togglePlay} disabled={!ready}>{playing?"❚❚":"▶"}</button><button type="button" className="audioSkip" onClick={()=>skip(10)} disabled={!ready}>↷</button><div className="audioProgress"><span style={{width:`${progress}%`}} /></div><button type="button" className="audioSpeed" onClick={toggleSpeed} disabled={!ready}>{speed}×</button></div>;}
 return <><section ref={cardRef} className="bibleAudioCard"><div className="bibleAudioHeader"><div className="bibleAudioIcon">🎧</div><div><small>ESCUCHAR LA BIBLIA</small><strong>{label}</strong></div><span className="bibleAudioBadge">Audio</span></div>
 {audioUrl && <audio
   ref={audioRef}
   src={audioUrl}
   preload="metadata"
   onPlay={()=>{
     hasStarted.current=true;
     setPlaying(true);
     syncVerse();
   }}
   onPause={()=>setPlaying(false)}
   onLoadedMetadata={initializeAudio}
   onTimeUpdate={syncVerse}
   onSeeked={syncVerse}
   onEnded={()=>{
     hasStarted.current=false;
     setPlaying(false);
     emitVerse(null);
   }}
 />}
 {controls()}<p className="bibleAudioStatus">{ready?(hasTimings?"Audio conectado · seguimiento por versículo.":"Audio disponible · seguimiento por versículo pendiente."):"Todavía no hemos subido el audio de este capítulo."}</p></section>{showFloating&&ready?<aside className="bibleAudioFloating"><div className="bibleAudioFloatingTitle"><span>🎧</span><strong>{label}{activeVerse?` · v.${activeVerse}`:""}</strong></div>{controls(true)}</aside>:null}</>;
}
