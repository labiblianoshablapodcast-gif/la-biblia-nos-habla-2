'use client';

import {useEffect,useMemo,useRef,useState} from "react";
import {getRvr60Audio} from "@/lib/rvr60-audio";

type Timing={verse:number;start:number};
type AudioPayload={ok:boolean;audioUrl?:string;timings?:Timing[];filesetId?:string;error?:string};

export default function BibleAudioControls({language,bookCode,chapter}:{language:"qeqchi"|"rvr60";bookCode?:string;chapter?:number}){
 const label=language==="qeqchi"?"Q’eqchi’ · Li Santil Hu":"Español · RVR1960";
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const cardRef=useRef<HTMLElement|null>(null);
 const [payload,setPayload]=useState<AudioPayload|null>(null);
 const [loading,setLoading]=useState(language==="rvr60");
 const [speed,setSpeed]=useState(1);
 const [playing,setPlaying]=useState(false);
 const [progress,setProgress]=useState(0);
 const [showFloating,setShowFloating]=useState(false);

 useEffect(()=>{
  let cancelled=false;
  setPlaying(false);setProgress(0);setShowFloating(false);
  const localAudio=language==="rvr60"&&bookCode&&chapter?getRvr60Audio(bookCode,chapter):null;
  if(!localAudio){setLoading(false);setPayload({ok:false,error:"Todavía no hemos subido el audio de este capítulo."});return;}
  setPayload({ok:true,audioUrl:localAudio,timings:[]});
  setLoading(language==="rvr60");
  if(language==="rvr60"&&bookCode&&chapter){
   fetch(`/api/bible-brain/rvr1960?book=${encodeURIComponent(bookCode)}&chapter=${chapter}`,{cache:"no-store"})
    .then(async response=>{
     const data=await response.json().catch(()=>null) as AudioPayload|null;
     if(cancelled||!data?.ok)return;
     if(Array.isArray(data.timings)&&data.timings.length){
      setPayload(current=>current?.ok?{...current,timings:data.timings,filesetId:data.filesetId}:current);
     }
    }).catch(()=>{}).finally(()=>{if(!cancelled)setLoading(false);});
  }else setLoading(false);
  return()=>{cancelled=true;window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse:null}}));};
 },[language,bookCode,chapter]);

 useEffect(()=>{
  const update=()=>{const card=cardRef.current;setShowFloating(Boolean(card&&card.getBoundingClientRect().bottom<0));};
  update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);
  return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
 },[]);

 const timings=useMemo(()=>payload?.timings??[],[payload?.timings]);
 const ready=Boolean(payload?.ok&&payload.audioUrl);
 function emitVerse(verse:number|null){window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse}}));}
 function startOffset(audio:HTMLAudioElement){return language==="rvr60"&&Number.isFinite(audio.duration)&&audio.duration>15?15:0;}
 function syncVerse(){
  const audio=audioRef.current;if(!audio)return;
  const offset=startOffset(audio);
  setProgress(Number.isFinite(audio.duration)&&audio.duration>offset?Math.max(0,Math.min(100,(audio.currentTime-offset)/(audio.duration-offset)*100)):0);
  if(!timings.length)return;
  let active:number|null=null;
  for(const timing of timings){if(timing.start<=audio.currentTime)active=timing.verse;else break;}
  emitVerse(active);
 }
 function skip(seconds:number){const audio=audioRef.current;if(!audio)return;audio.currentTime=Math.max(startOffset(audio),Math.min(audio.duration||Infinity,audio.currentTime+seconds));syncVerse();}
 function togglePlay(){const audio=audioRef.current;if(!audio)return;if(audio.paused){if(audio.currentTime<startOffset(audio)||audio.ended)audio.currentTime=startOffset(audio);void audio.play().catch(()=>{setPlaying(false);});}else audio.pause();}
 function toggleSpeed(){const options=[1,1.25,1.5,0.75];const next=options[(options.indexOf(speed)+1)%options.length];setSpeed(next);if(audioRef.current)audioRef.current.playbackRate=next;}
 function controls(floating=false){return <div className={floating?"bibleAudioControls bibleAudioFloatingControls":"bibleAudioControls"}>
  <button type="button" className="audioSkip" aria-label="Retroceder 10 segundos" onClick={()=>skip(-10)} disabled={!ready}>↶</button>
  <button type="button" className="audioPlay" aria-label={playing?"Pausar":"Reproducir"} disabled={!ready} onClick={togglePlay}>{playing?"❚❚":"▶"}</button>
  <button type="button" className="audioSkip" aria-label="Adelantar 10 segundos" onClick={()=>skip(10)} disabled={!ready}>↷</button>
  <div className="audioProgress" aria-hidden="true"><span style={{width:`${progress}%`}}/></div>
  <button type="button" className="audioSpeed" disabled={!ready} onClick={toggleSpeed}>{speed}×</button>
 </div>;}

 return <>
  <section ref={cardRef} className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
   <div className="bibleAudioHeader"><div className="bibleAudioIcon" aria-hidden="true">🎧</div><div><small>ESCUCHAR LA BIBLIA</small><strong>{label}</strong></div><span className="bibleAudioBadge">Audio</span></div>
   {ready&&<audio key={payload?.audioUrl} ref={audioRef} src={payload?.audioUrl} preload="metadata" onPlay={()=>{setPlaying(true);syncVerse();}} onPause={()=>setPlaying(false)} onLoadedMetadata={()=>{const audio=audioRef.current;if(audio){audio.playbackRate=speed;audio.currentTime=startOffset(audio);syncVerse();}} onError={()=>setPlaying(false)} onTimeUpdate={syncVerse} onSeeked={syncVerse} onEnded={()=>{setPlaying(false);emitVerse(null);}}/>}
   {controls()}
   <p className="bibleAudioStatus">{loading?"Preparando seguimiento de versículos…":ready?(timings.length?"Audio conectado · el versículo leído se resaltará y seguirá automáticamente.":"Audio conectado. El seguimiento automático depende de los timestamps disponibles."):(payload?.error||"Audio no disponible para este capítulo.")}</p>
  </section>
  {showFloating&&ready&&<aside className="bibleAudioFloating" aria-label={`Controles flotantes de ${label}`}><div className="bibleAudioFloatingTitle"><span>🎧</span><strong>{label}</strong></div>{controls(true)}</aside>}
 </>;
}
