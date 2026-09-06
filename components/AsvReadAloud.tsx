'use client';

import {useEffect,useRef,useState} from 'react';

type Verse={number:number;text:string};

export default function AsvReadAloud({bookName,chapter,verses}:{bookName:string;chapter:number;verses:Verse[]}){
 const [supported,setSupported]=useState(false);
 const [state,setState]=useState<'idle'|'playing'|'paused'>('idle');
 const [error,setError]=useState('');
 const [progress,setProgress]=useState(0);
 const [speed,setSpeed]=useState(1);
 const rate=useRef(1);
 const generation=useRef(0);
 const current=useRef<SpeechSynthesisUtterance|null>(null);
 const index=useRef(0);

 function highlight(verse:number|null){
  window.dispatchEvent(new CustomEvent('bible-audio-verse',{detail:{verse}}));
 }
 function cancel(){
  generation.current++;
  if(current.current){current.current.onend=null;current.current.onerror=null;}
  current.current=null;
  window.speechSynthesis.cancel();
 }
 useEffect(()=>{
  setSupported('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
  return ()=>{
   generation.current++;
   if(current.current){current.current.onend=null;current.current.onerror=null;}
   current.current=null;
   if('speechSynthesis' in window)window.speechSynthesis.cancel();
   window.dispatchEvent(new CustomEvent('bible-audio-verse',{detail:{verse:null}}));
  };
 },[]);

 function speak(position:number,session:number){
  if(session!==generation.current)return;
  if(position>=verses.length){current.current=null;index.current=0;setState('idle');setProgress(100);highlight(null);return;}
  index.current=position;
  setProgress(verses.length?position/verses.length*100:0);
  const utterance=new SpeechSynthesisUtterance(verses[position].text);
  const voices=window.speechSynthesis.getVoices().filter(voice=>/^en(?:-|$)/i.test(voice.lang));
  const voice=voices.find(v=>v.localService&&/^en-US$/i.test(v.lang))??voices.find(v=>/^en-US$/i.test(v.lang))??voices[0];
  utterance.lang=voice?.lang??'en-US';
  utterance.rate=rate.current;
  if(voice)utterance.voice=voice;
  current.current=utterance;
  highlight(verses[position].number);
  utterance.onend=()=>{if(session===generation.current)speak(position+1,session);};
  utterance.onerror=()=>{
   if(session!==generation.current)return;
   current.current=null;setState('idle');highlight(null);
   setError('No se pudo continuar la lectura. Pulsa Escuchar para reintentar.');
  };
  window.speechSynthesis.speak(utterance);
 }
 function play(){
  if(!supported)return;
  if(state==='playing'){
   cancel();setState('paused');return;
  }
  cancel();window.speechSynthesis.resume();setError('');setState('playing');
  speak(index.current,generation.current);
 }
 function stop(){cancel();index.current=0;setState('idle');setError('');setProgress(0);highlight(null);}
 return <section className="bibleAudioCard" aria-label="Lectura en inglés ASV">
  <div className="bibleAudioHeader">
   <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
   <div><small>ESCUCHAR LA BIBLIA</small><strong>English · ASV</strong></div>
   <span className="bibleAudioBadge">Lectura en voz alta</span>
  </div>
  <div className="bibleAudioControls">
   <button type="button" className="audioSkip" aria-label="Versículo anterior" disabled={!supported||!verses.length} onClick={()=>{const p=Math.max(0,index.current-1);cancel();index.current=p;setProgress(p/verses.length*100);if(state==='playing')speak(p,generation.current);}}>↶</button>
   <button type="button" className="audioPlay" aria-label={state==='playing'?'Pausar':'Escuchar en inglés'} onClick={play} disabled={!supported||!verses.length}>{state==='playing'?'❚❚':'▶'}</button>
   <button type="button" className="audioSkip" aria-label="Versículo siguiente" disabled={!supported||!verses.length} onClick={()=>{const p=Math.min(verses.length-1,index.current+1);cancel();index.current=p;setProgress(p/verses.length*100);if(state==='playing')speak(p,generation.current);}}>↷</button>
   <div className="audioProgress" aria-hidden="true"><span style={{width:`${progress}%`}}/></div>
   <button type="button" className="audioSpeed" disabled={!supported||!verses.length} onClick={()=>{const rates=[1,1.25,1.5,.75];const next=rates[(rates.indexOf(speed)+1)%rates.length];rate.current=next;setSpeed(next);if(state==='playing'){cancel();speak(index.current,generation.current);}}}>{speed}×</button>
  </div>
  <button type="button" className="audioSkip" style={{marginTop:12,padding:"0 14px"}} onClick={stop} disabled={state==='idle'}>■ Detener</button>
  <p className="bibleAudioStatus" role="status">{error||(!supported?'La lectura en voz alta no está disponible en este navegador.':state==='paused'?'Lectura pausada. Continuar reinicia el versículo actual.':`Voz del dispositivo · ${bookName} ${chapter}.`)}</p>
 </section>;
}
