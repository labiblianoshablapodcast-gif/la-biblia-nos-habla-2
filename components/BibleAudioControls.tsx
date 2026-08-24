'use client';

export default function BibleAudioControls({language}:{language:"qeqchi"|"rvr60"}){
 const label=language==="qeqchi"?"Q’eqchi’ · Li Santil Hu":"Español · RVR1960";
 return <section className="bibleAudioCard" aria-label={`Audio bíblico ${label}`}>
   <div className="bibleAudioHeader">
     <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
     <div>
       <small>ESCUCHAR LA BIBLIA</small>
       <strong>{label}</strong>
     </div>
     <span className="bibleAudioBadge">Audio</span>
   </div>
   <div className="bibleAudioControls">
     <button type="button" className="audioSkip" aria-label="Retroceder">↶</button>
     <button type="button" className="audioPlay" aria-label="Reproducir" disabled title="El audio se conectará en la próxima etapa">▶</button>
     <button type="button" className="audioSkip" aria-label="Adelantar">↷</button>
     <div className="audioProgress" aria-hidden="true"><span/></div>
     <button type="button" className="audioSpeed" disabled>1×</button>
   </div>
   <p className="bibleAudioStatus">Reproductor listo. Estamos conectando la fuente de audio autorizada para esta versión.</p>
 </section>;
}
