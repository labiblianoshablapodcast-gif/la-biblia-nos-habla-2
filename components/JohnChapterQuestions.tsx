'use client';

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {johnQuestions} from "@/data/john-questions";

type SavedStudy={written:string[];choices:Array<number|null>;completed:boolean};

export default function JohnChapterQuestions({chapter}:{chapter:number}){
  const study=johnQuestions[chapter];
  const storageKey=`john-study-${chapter}`;
  const [written,setWritten]=useState(["","",""]);
  const [choices,setChoices]=useState<Array<number|null>>([null,null]);
  const [completed,setCompleted]=useState(false);
  const [message,setMessage]=useState("");
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(storageKey)||"null") as SavedStudy|null;
      if(saved){
        setWritten(saved.written?.slice(0,3) || ["","",""]);
        setChoices(saved.choices?.slice(0,2) || [null,null]);
        setCompleted(Boolean(saved.completed));
      }
    }catch{/* Una respuesta dañada no debe impedir abrir el estudio. */}
    setReady(true);
  },[storageKey]);

  useEffect(()=>{
    if(ready) localStorage.setItem(storageKey,JSON.stringify({written,choices,completed}));
  },[written,choices,completed,ready,storageKey]);

  const answered=useMemo(()=>written.filter(answer=>answer.trim()).length+choices.filter(choice=>choice!==null).length,[written,choices]);
  if(!study)return null;

  function finishStudy(){
    if(answered<5){
      setMessage(`Faltan ${5-answered} ${5-answered===1?"respuesta":"respuestas"}.`);
      return;
    }
    setCompleted(true);
    setMessage("¡Muy bien! Sus respuestas quedaron guardadas en este dispositivo.");
  }

  return <section className="johnStudy" aria-labelledby="john-study-title">
    <header className="johnStudyHeader">
      <div>
        <p className="eyebrow">Plan de Juan · Día {String(chapter).padStart(2,"0")}</p>
        <h2 id="john-study-title">Reflexione sobre Juan {chapter}</h2>
        <p>{study.title} · Tres respuestas personales y dos preguntas de selección.</p>
      </div>
      <div className="johnStudyProgress" aria-label={`${answered} de 5 preguntas contestadas`}>
        <strong>{answered}/5</strong><span>contestadas</span>
      </div>
    </header>

    <div className="johnWrittenQuestions">
      {study.written.map((question,index)=><label key={question}>
        <span className="johnQuestionNumber">{index+1}</span>
        <b>{question}</b>
        <textarea value={written[index]||""} onChange={event=>{
          const next=[...written]; next[index]=event.target.value; setWritten(next); setCompleted(false); setMessage("");
        }} rows={3} placeholder="Escriba su respuesta personal..."/>
      </label>)}
    </div>

    <div className="johnChoiceQuestions">
      {study.multipleChoice.map((item,index)=><fieldset key={item.question}>
        <legend>Pregunta {index+4}</legend>
        <b>{item.question}</b>
        {item.options.map((option,optionIndex)=><label key={option} className={completed?(optionIndex===item.correctIndex?"correctChoice":choices[index]===optionIndex?"incorrectChoice":""):""}>
          <input type="radio" name={`juan-${chapter}-choice-${index}`} checked={choices[index]===optionIndex} onChange={()=>{
            const next=[...choices]; next[index]=optionIndex; setChoices(next); setCompleted(false); setMessage("");
          }}/><span>{option}</span>
        </label>)}
        {completed&&<p className="choiceExplanation">{item.explanation}</p>}
      </fieldset>)}
    </div>

    <footer className="johnStudyFooter">
      <button type="button" className="btn" onClick={finishStudy}>{completed?"✓ Estudio completado":"Completar estudio"}</button>
      {chapter<21&&completed&&<Link className="textLink" href={`/biblia/juan/${chapter+1}`}>Continuar con Juan {chapter+1} →</Link>}
      {chapter===21&&completed&&<Link className="textLink" href="/primeros-pasos">Continuar mis primeros pasos →</Link>}
      <p className={message.startsWith("Faltan")?"studyMessage warning":"studyMessage"} aria-live="polite">{message}</p>
    </footer>
  </section>;
}
