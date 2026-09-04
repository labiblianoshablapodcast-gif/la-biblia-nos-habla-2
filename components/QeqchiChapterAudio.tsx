'use client';

import {useRef, useState} from "react";

const AUDIO_VERSE_EVENT = "bible-audio-verse";

export default function QeqchiChapterAudio({src, bookName, chapter, verseCount}: {
  src?: string; bookName: string; chapter: number; verseCount: number;
}) {
  const player = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const [activeVerse, setActiveVerse] = useState<number|null>(null);
  const label = `${bookName} ${chapter} · Q’eqchi’`;

  function publishVerse(number:number|null){
    setActiveVerse(number);
    window.dispatchEvent(new CustomEvent(AUDIO_VERSE_EVENT,{detail:{verse:number}}));
  }

  function syncVerse(){
    const audio=player.current;
    if(!audio || !verseCount || !Number.isFinite(audio.duration) || audio.duration<=0) return;
    const progress=Math.max(0,Math.min(0.999999,audio.currentTime/audio.duration));
    const verse=Math.min(verseCount,Math.max(1,Math.floor(progress*verseCount)+1));
    if(verse!==activeVerse) publishVerse(verse);
  }

  return <section className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
    <div className="bibleAudioHeader">
      <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
      <div><small>ESCUCHAR LA BIBLIA</small><strong>{label}</strong></div>
      <span className="bibleAudioBadge">Audio original</span>
    </div>
    {src ? <>
      <audio ref={player} controls preload="metadata" src={src}
        aria-label={`Escuchar ${label}`} style={{width:"100%", marginTop:"16px"}}
        onError={() => setFailed(true)}
        onCanPlay={() => {setFailed(false);syncVerse()}}
        onLoadedMetadata={syncVerse}
        onTimeUpdate={syncVerse}
        onSeeked={syncVerse}
        onPlay={syncVerse}
        onPause={syncVerse}
        onEnded={() => publishVerse(null)}>
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
