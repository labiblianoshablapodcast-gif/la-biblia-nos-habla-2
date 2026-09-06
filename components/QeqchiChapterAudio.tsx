'use client';

import {useRef, useState} from "react";

const AUDIO_VERSE_EVENT = "bible-audio-verse";

type VerseTimingInput={number:number;text:string};

export default function QeqchiChapterAudio({src, bookName, chapter, verses}: {
  src?: string; bookName: string; chapter: number; verses: VerseTimingInput[];
}) {
  const player = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const [speed,setSpeed]=useState(1);
  const [activeVerse, setActiveVerse] = useState<number|null>(null);
  const label = `${bookName} ${chapter} · Q’eqchi’`;

  function publishVerse(number:number|null){
    setActiveVerse(number);
    window.dispatchEvent(new CustomEvent(AUDIO_VERSE_EVENT,{detail:{verse:number}}));
  }

  function syncVerse(){
    const audio=player.current;
    if(audio)setProgress(Number.isFinite(audio.duration)&&audio.duration>0?audio.currentTime/audio.duration*100:0);
    if(!audio || !verses.length || !Number.isFinite(audio.duration) || audio.duration<=0) return;

    // Estimamos la duración de cada versículo por la cantidad de texto que contiene.
    // Los versículos largos reciben más tiempo y los cortos menos.
    const PAUSE_WEIGHT=7;
    const weights=verses.map(v=>{
      const text=v.text.trim();
      const words=text.split(/\s+/).filter(Boolean).length;
      const punctuation=(text.match(/[,.!?;:—-]/g)||[]).length;
      return Math.max(1,words + punctuation*PAUSE_WEIGHT/10);
    });
    const totalWeight=weights.reduce((sum,w)=>sum+w,0);

    // Estos audios comienzan con una introducción hablada (libro + capítulo).
    // No avanzamos los versículos hasta que esa introducción termine.
    const INTRO_SECONDS=10;
    const FOLLOW_DELAY_SECONDS=0.7;
    const readingDuration=Math.max(1,audio.duration-INTRO_SECONDS);
    const t=Math.max(0,audio.currentTime-INTRO_SECONDS-FOLLOW_DELAY_SECONDS);

    if(audio.currentTime<INTRO_SECONDS){
      if(activeVerse!==verses[0]?.number) publishVerse(verses[0]?.number ?? 1);
      return;
    }

    const target=Math.min(totalWeight,(t/readingDuration)*totalWeight);

    let cumulative=0;
    let current=verses[0]?.number ?? 1;
    for(let i=0;i<verses.length;i++){
      cumulative+=weights[i];
      current=verses[i].number;
      if(target<cumulative) break;
    }
    if(current!==activeVerse) publishVerse(current);
  }

  return <section className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
    <div className="bibleAudioHeader">
      <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
      <div><small>ESCUCHAR LA BIBLIA</small><strong>{label}</strong></div>
      <span className="bibleAudioBadge">Audio original</span>
    </div>
    <div className="bibleAudioControls">
      <button type="button" className="audioSkip" aria-label="Retroceder 10 segundos" disabled={!src||failed} onClick={()=>{const a=player.current;if(a)a.currentTime=Math.max(0,a.currentTime-10);}}>↶</button>
      <button type="button" className="audioPlay" aria-label={playing?"Pausar":"Reproducir"} disabled={!src||failed} onClick={()=>{const a=player.current;if(!a)return;if(a.paused)void a.play().catch(()=>setFailed(true));else a.pause();}}>{playing?"❚❚":"▶"}</button>
      <button type="button" className="audioSkip" aria-label="Adelantar 10 segundos" disabled={!src||failed} onClick={()=>{const a=player.current;if(a&&Number.isFinite(a.duration))a.currentTime=Math.min(a.duration,a.currentTime+10);}}>↷</button>
      <div className="audioProgress" aria-hidden="true"><span style={{width:`${progress}%`}}/></div>
      <button type="button" className="audioSpeed" disabled={!src||failed} onClick={()=>{const rates=[1,1.25,1.5,.75];const next=rates[(rates.indexOf(speed)+1)%rates.length];setSpeed(next);if(player.current)player.current.playbackRate=next;}}>{speed}×</button>
    </div>
    {src ? <>
      <audio ref={player} preload="metadata" src={src}
        aria-label={`Escuchar ${label}`} style={{width:"100%", marginTop:"16px"}}
        onError={() => setFailed(true)}
        onCanPlay={() => {setFailed(false);syncVerse()}}
        onLoadedMetadata={syncVerse}
        onTimeUpdate={syncVerse}
        onSeeked={syncVerse}
        onPlay={()=>{setPlaying(true);syncVerse();}}
        onPause={()=>{setPlaying(false);syncVerse();}}
        onEnded={() => {setPlaying(false);publishVerse(null);}}>
        Su navegador no admite la reproducción de audio.
      </audio>
      {failed && <div role="status" className="bibleAudioStatus">
        <p>No pudimos cargar este audio. Compruebe su conexión e intente nuevamente.</p>
        <button type="button" className="btn secondary" onClick={() => {
          setFailed(false);
          player.current?.load();
        }}>Volver a cargar el audio</button>
      </div>}
      <p className="bibleAudioStatus">
        Capítulo completo · Audio original en Q’eqchi’
        {activeVerse ? <> · Siguiendo versículo <strong>{activeVerse}</strong></> : null}
      </p>
    </> : <p className="bibleAudioStatus">Audio pendiente de incorporar para este capítulo.</p>}
  </section>;
}
