'use client';

import {useRef, useState} from "react";

export default function QeqchiChapterAudio({src, bookName, chapter}: {
  src?: string; bookName: string; chapter: number;
}) {
  const player = useRef<HTMLAudioElement>(null);
  const [failed, setFailed] = useState(false);
  const label = `${bookName} ${chapter} · Q’eqchi’`;
  return <section className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
    <div className="bibleAudioHeader">
      <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
      <div><small>ESCUCHAR LA BIBLIA</small><strong>{label}</strong></div>
      <span className="bibleAudioBadge">Audio original</span>
    </div>
    {src ? <>
      <audio ref={player} controls preload="none" src={src}
        aria-label={`Escuchar ${label}`} style={{width:"100%", marginTop:"16px"}}
        onError={() => setFailed(true)} onCanPlay={() => setFailed(false)}>
        Su navegador no admite la reproducción de audio.
      </audio>
      {failed && <div role="status" className="bibleAudioStatus">
        <p>No pudimos cargar este audio. Compruebe su conexión e intente nuevamente.</p>
        <button type="button" className="btn secondary" onClick={() => {
          setFailed(false);
          player.current?.load();
        }}>Volver a cargar el audio</button>
      </div>}
      <p className="bibleAudioStatus">Capítulo completo · Audio original en Q’eqchi’</p>
    </> : <p className="bibleAudioStatus">Audio pendiente de incorporar para este capítulo.</p>}
  </section>;
}
