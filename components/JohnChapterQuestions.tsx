'use client';

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {johnQuestions} from "@/data/john-questions";

type SavedStudy={written:string[];choices:Array<number|null>;completed:boolean};
type Participant={fullName:string;email:string};

export default function JohnChapterQuestions({chapter}:{chapter:number}){
  const study=johnQuestions[chapter];
  const storageKey=`john-study-${chapter}`;
  const [written,setWritten]=useState(["","",""]);
  const [choices,setChoices]=useState<Array<number|null>>([null,null]);
  const [completed,setCompleted]=useState(false);
  const [message,setMessage]=useState("");
  const [ready,setReady]=useState(false);
  const [participant,setParticipant]=useState<Participant>({fullName:"",email:""});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(storageKey)||"null") as SavedStudy|null;
      if(saved){
        setWritten(saved.written?.slice(0,3)||["","",""]);
        setChoices(saved.choices?.slice(0,2)||[null,null]);
        setCompleted(Boolean(saved.completed));
      }
      const identity=JSON.parse(localStorage.getItem("john-study-participant")||"null") as Participant|null;
      if(identity)setParticipant({fullName:identity.fullName||"",email:identity.email||""});
    }catch{/* Los datos se pueden escribir nuevamente. */}
    setReady(true);
  },[storageKey]);

  useEffect(()=>{
    if(ready)localStorage.setItem(storageKey,JSON.stringify({written,choices,completed}));
  },[written,choices,completed,ready,storageKey]);

  const answered=useMemo(()=>written.filter(answer=>answer.trim()).length+choices.filter(choice=>choice!==null).length,[written,choices]);
  if(!study)return null;

  async function finishStudy(){
    if(answered<5){setMessage(`Faltan ${5-answered} ${5-answered===1?"respuesta":"respuestas"}.`);return;}
    if(participant.fullName.trim().length<2){setMessage("Escriba su nombre para registrar este capítulo.");return;}
    setSaving(true);
    localStorage.setItem("john-study-participant",JSON.stringify(participant));
    let token=localStorage.getItem("john-study-participant-token");
    if(!token){token=crypto.randomUUID();localStorage.setItem("john-study-participant-token",token);}
    try{
      const response=await fetch("/api/estudio-juan/progreso",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token,fullName:participant.fullName,email:participant.email,chapter})});
      const result=await response.json() as {ok?:boolean;count?:number;milestone?:number};
      if(!response.ok||!result.ok)throw new Error("No registrado");
      setCompleted(true);
      setMessage(result.milestone?`¡Excelente! Ha completado ${result.milestone} capítulos. El Panel Pastoral recibió el aviso.`:`¡Muy bien! Capítulo registrado. Lleva ${result.count} de 21.`);
    }catch{
      setCompleted(true);
      setMessage("Sus respuestas se guardaron aquí, pero no pudimos registrar el avance pastoral. Intente nuevamente.");
    }finally{setSaving(false);}
  }

  return <section className="johnStudy" aria-labelledby="john-study-title">
    <header className="johnStudyHeader">
      <div><p className="eyebrow">Plan de Juan · Día {String(chapter).padStart(2,"0")}</p><h2 id="john-study-title">Reflexione sobre Juan {chapter}</h2><p>{study.title} · Tres respuestas personales y dos preguntas de selección.</p></div>
      <div className="johnStudyProgress" aria-label={`${answered} de 5 preguntas contestadas`}><strong>{answered}/5</strong><span>contestadas</span></div>
    </header>

    <div className="johnWrittenQuestions">
      <div className="johnParticipantPanel">
        <div><b>¿Quién está realizando el estudio?</b><span>El Panel Pastoral recibirá solamente su nombre, capítulo y fecha. Sus respuestas personales permanecen en este dispositivo.</span></div>
        <div className="johnParticipantFields">
          <label><span>Nombre completo</span><input value={participant.fullName} onChange={event=>setParticipant({...participant,fullName:event.target.value})} autoComplete="name" placeholder="Escriba su nombre"/></label>
          <label><span>Correo (opcional)</span><input value={participant.email} onChange={event=>setParticipant({...participant,email:event.target.value})} type="email" autoComplete="email" placeholder="nombre@correo.com"/></label>
        </div>
      </div>
      {study.written.map((question,index)=><label key={question}><span className="johnQuestionNumber">{index+1}</span><b>{question}</b><textarea value={written[index]||""} onChange={event=>{const next=[...written];next[index]=event.target.value;setWritten(next);setCompleted(false);setMessage("");}} rows={3} placeholder="Escriba su respuesta personal..."/></label>)}
    </div>

    <div className="johnChoiceQuestions">
      {study.multipleChoice.map((item,index)=><fieldset key={item.question}><legend>Pregunta {index+4}</legend><b>{item.question}</b>{item.options.map((option,optionIndex)=><label key={option} className={`johnChoiceOption ${completed?(optionIndex===item.correctIndex?"correctChoice":choices[index]===optionIndex?"incorrectChoice":""):""}`}><input className="johnChoiceRadio" type="radio" name={`juan-${chapter}-choice-${index}`} checked={choices[index]===optionIndex} onChange={()=>{const next=[...choices];next[index]=optionIndex;setChoices(next);setCompleted(false);setMessage("");}}/><span className="johnChoiceText">{option}</span></label>)}{completed&&<p className="choiceExplanation">{item.explanation}</p>}</fieldset>)}
    </div>

    <footer className="johnStudyFooter">
      <button type="button" className="btn" onClick={finishStudy} disabled={saving}>{saving?"Registrando…":completed?"✓ Estudio completado":"Completar estudio"}</button>
      {chapter<21&&completed&&<Link className="textLink" href={`/biblia/juan/${chapter+1}`}>Continuar con Juan {chapter+1} →</Link>}
      {chapter===21&&completed&&<Link className="textLink" href="/primeros-pasos">Continuar mis primeros pasos →</Link>}
      <p className={message.startsWith("Faltan")||message.startsWith("Escriba")||message.startsWith("Sus respuestas")?"studyMessage warning":"studyMessage"} aria-live="polite">{message}</p>
    </footer>
  </section>;
}
