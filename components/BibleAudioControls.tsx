'use client';

import {useEffect,useMemo,useRef,useState} from "react";
import {getRvr60Audio} from "@/lib/rvr60-audio";

type Timing={verse:number;start:number};
type AudioPayload={
  ok:boolean;
  audioUrl?:string;
  timings?:Timing[];
  filesetId?:string;
  error?:string;
};

export default function BibleAudioControls({
  language,bookCode,chapter
}:{
  language:"qeqchi"|"rvr60";
  bookCode?:string;
  chapter?:number;
}){
 const label=language==="qeqchi"?"Q’eqchi’ · Li Santil Hu":"Español · RVR1960";
 const audioRef=useRef<HTMLAudioElement|null>(null);
 const [payload,setPayload]=useState<AudioPayload|null>(null);
 const [loading,setLoading]=useState(language==="rvr60");
 const [speed,setSpeed]=useState(1);
 const [playing,setPlaying]=useState(false);
 const [progress,setProgress]=useState(0);

 useEffect(()=>{
   setPlaying(false);
   setProgress(0);
   setLoading(false);
   const audioUrl=language==="rvr60" && bookCode && chapter?getRvr60Audio(bookCode,chapter):null;
   setPayload(audioUrl?{ok:true,audioUrl,timings:[]}:{ok:false,error:"Todavía no hemos subido el audio de este capítulo."});
   return ()=>{window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse:null}}));};
 },[language,bookCode,chapter]);

 const timings=useMemo(()=>payload?.timings??[],[payload?.timings]);

 function emitVerse(verse:number|null){
   window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse}}));
 }

 function startOffset(audio:HTMLAudioElement){
   return language==="rvr60" && Number.isFinite(audio.duration) && audio.duration>15?15:0;
 }

 function syncVerse(){
   const audio=audioRef.current;
   if(!audio)return;
   const offset=startOffset(audio);
   setProgress(Number.isFinite(audio.duration)&&audio.duration>offset?Math.max(0,Math.min(100,(audio.currentTime-offset)/(audio.duration-offset)*100)):0);
   if(!timings.length)return;
   const current=audio.currentTime;
   let active:number|null=null;
   for(const timing of timings){
     if(timing.start<=current)active=timing.verse;
     else break;
   }
   emitVerse(active);
 }

 function skip(seconds:number){
   const audio=audioRef.current;
   if(!audio)return;
   audio.currentTime=Math.max(startOffset(audio),Math.min(audio.duration||Infinity,audio.currentTime+seconds));
   syncVerse();
 }

 function toggleSpeed(){
   const options=[1,1.25,1.5,0.75];
   const index=options.indexOf(speed);
   const next=options[(index+1)%options.length];
   setSpeed(next);
   if(audioRef.current)audioRef.current.playbackRate=next;
 }

 const ready=Boolean(payload?.ok && payload.audioUrl);

 return <section className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
   <div className="bibleAudioHeader">
     <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
     <div>
       <small>ESCUCHAR LA BIBLIA</small>
       <strong>{label}</strong>
     </div>
     <span className="bibleAudioBadge">Audio</span>
   </div>

   {ready && <audio
     key={payload!.audioUrl}
     ref={audioRef}
     src={payload!.audioUrl}
     preload="metadata"
     onPlay={()=>setPlaying(true)}
     onPause={()=>setPlaying(false)}
     onLoadedMetadata={()=>{const audio=audioRef.current;if(audio){audio.playbackRate=speed;audio.currentTime=startOffset(audio);syncVerse();}}}
     onError={()=>{setPlaying(false);setPayload({ok:false,error:"No pudimos cargar el audio. Recarga la página para intentarlo de nuevo."});}}
     onTimeUpdate={syncVerse}
     onSeeked={syncVerse}
     onEnded={()=>{setPlaying(false);emitVerse(null);}}
   />}

   <div className="bibleAudioControls">
     <button type="button" className="audioSkip" aria-label="Retroceder 10 segundos" onClick={()=>skip(-10)} disabled={!ready}>↶</button>
     <button
       type="button"
       className="audioPlay"
       aria-label={playing?"Pausar":"Reproducir"}
       disabled={!ready}
       onClick={()=>{
         const audio=audioRef.current;
         if(!audio)return;
         if(audio.paused){if(audio.currentTime<startOffset(audio)||audio.ended)audio.currentTime=startOffset(audio);void audio.play().catch(()=>{setPlaying(false);setPayload({ok:false,error:"No pudimos reproducir el audio. Recarga la página para intentarlo de nuevo."});});}
         else audio.pause();
       }}
     >{playing?"❚❚":"▶"}</button>
     <button type="button" className="audioSkip" aria-label="Adelantar 10 segundos" onClick={()=>skip(10)} disabled={!ready}>↷</button>
     <div className="audioProgress" aria-hidden="true"><span style={{width:`${progress}%`}}/></div>
     <button type="button" className="audioSpeed" disabled={!ready} onClick={toggleSpeed}>{speed}×</button>
   </div>

   <p className="bibleAudioStatus">
     {loading
       ?"Conectando el audio RVR1960…"
       :ready
         ?timings.length
           ?"Audio RVR1960 conectado · el texto seguirá el versículo automáticamente."
           :"Audio RVR1960 conectado."
         :payload?.error||"Audio no disponible para este capítulo."}
   </p>
 </section>;
}
