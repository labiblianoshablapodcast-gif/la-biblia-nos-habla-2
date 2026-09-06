'use client';

import {useEffect,useRef,useState} from 'react';

type Verse={number:number;text:string};

export default function AsvReadAloud({bookName,chapter,verses}:{bookName:string;chapter:number;verses:Verse[]}){
 const [supported,setSupported]=useState(false);
 const [state,setState]=useState<'idle'|'playing'|'paused'>('idle');
 const [error,setError]=useState('');
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
  if(position>=verses.length){current.current=null;index.current=0;setState('idle');highlight(null);return;}
  index.current=position;
  const utterance=new SpeechSynthesisUtterance(verses[position].text);
  const voices=window.speechSynthesis.getVoices().filter(voice=>/^en(?:-|$)/i.test(voice.lang));
  const voice=voices.find(v=>v.localService&&/^en-US$/i.test(v.lang))??voices.find(v=>/^en-US$/i.test(v.lang))??voices[0];
  utterance.lang=voice?.lang??'en-US';
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
 function stop(){cancel();index.current=0;setState('idle');setError('');highlight(null);}
 return <section className="bibleAudioCard" aria-label="Lectura en inglés ASV">
  <div className="bibleAudioHeader">
   <div className="bibleAudioIcon" aria-hidden="true">🎧</div>
   <div><small>ESCUCHAR LA BIBLIA</small><strong>English · ASV</strong></div>
   <span className="bibleAudioBadge">Lectura en voz alta</span>
  </div>
  <div className="bibleAudioControls asvAudioControls">
   <button type="button" className="btn" onClick={play} disabled={!supported||!verses.length}>
    {state==='playing'?'❚❚ Pausar':state==='paused'?'▶ Continuar':'▶ Escuchar en inglés'}
   </button>
   <button type="button" className="btn secondary" onClick={stop} disabled={state==='idle'}>■ Detener</button>
  </div>
  <p className="bibleAudioStatus" role="status">{error||(!supported?'La lectura en voz alta no está disponible en este navegador.':state==='paused'?'Lectura pausada. Continuar reinicia el versículo actual.':`Voz del dispositivo · ${bookName} ${chapter}.`)}</p>
 </section>;
}
