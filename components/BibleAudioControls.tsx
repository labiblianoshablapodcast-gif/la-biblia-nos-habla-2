'use client';

import {useEffect,useMemo,useRef,useState} from "react";

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

 useEffect(()=>{
   if(language!=="rvr60" || !bookCode || !chapter)return;
   const controller=new AbortController();
   setLoading(true);
   setPayload(null);
   fetch(`/api/bible-brain/rvr1960?book=${encodeURIComponent(bookCode)}&chapter=${chapter}`,{
     signal:controller.signal,
     cache:"no-store"
   })
     .then(async response=>{
       const data=await response.json() as AudioPayload;
       if(!response.ok)throw new Error(data.error||"No se pudo cargar el audio.");
       return data;
     })
     .then(data=>setPayload(data))
     .catch(error=>{
       if((error as Error).name!=="AbortError")setPayload({ok:false,error:(error as Error).message});
     })
     .finally(()=>setLoading(false));
   return ()=>controller.abort();
 },[language,bookCode,chapter]);

 const timings=useMemo(()=>payload?.timings??[],[payload?.timings]);

 function emitVerse(verse:number|null){
   window.dispatchEvent(new CustomEvent("bible-audio-verse",{detail:{verse}}));
 }

 function syncVerse(){
   const audio=audioRef.current;
   if(!audio || !timings.length)return;
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
   audio.currentTime=Math.max(0,Math.min(audio.duration||Infinity,audio.currentTime+seconds));
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
     ref={audioRef}
     src={payload!.audioUrl}
     preload="metadata"
     onTimeUpdate={syncVerse}
     onSeeked={syncVerse}
     onEnded={()=>emitVerse(null)}
   />}

   <div className="bibleAudioControls">
     <button type="button" className="audioSkip" aria-label="Retroceder 10 segundos" onClick={()=>skip(-10)} disabled={!ready}>↶</button>
     <button
       type="button"
       className="audioPlay"
       aria-label={audioRef.current?.paused===false?"Pausar":"Reproducir"}
       disabled={!ready}
       onClick={()=>{
         const audio=audioRef.current;
         if(!audio)return;
         if(audio.paused)void audio.play();
         else audio.pause();
       }}
     >▶</button>
     <button type="button" className="audioSkip" aria-label="Adelantar 10 segundos" onClick={()=>skip(10)} disabled={!ready}>↷</button>
     <div className="audioProgress" aria-hidden="true"><span/></div>
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
