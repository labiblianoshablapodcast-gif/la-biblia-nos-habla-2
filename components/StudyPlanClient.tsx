"use client";

import Link from "next/link";
import {useEffect,useState} from "react";
import type {StudyPlan} from "@/lib/study-plans";
import {studyDayUrl,studyReadingUrl} from "@/lib/study-plans";
import {emptyStudyProgress,nextStudyDay,parseStudyProgress,studyStorageKey,toggleStudyDay} from "@/lib/study-progress";
import type {StudyProgress} from "@/lib/study-progress";
import styles from "@/app/estudios/estudios.module.css";

function useStudyProgress(plan:StudyPlan){
  const [progress,setProgress]=useState(emptyStudyProgress);
  const [ready,setReady]=useState(false);
  const [error,setError]=useState(false);
  const key=studyStorageKey(plan.id);
  useEffect(()=>{
    try{
      const raw=localStorage.getItem(key);
      const saved=parseStudyProgress(raw,plan.days.length);
      // Mantiene el avance de quienes ya completaron preguntas de Juan.
      if(raw===null&&plan.id==="juan")for(let day=1;day<=21;day++){
        try{if(JSON.parse(localStorage.getItem(`john-study-${day}`)||"null")?.completed===true)saved.completed.push(day);}catch{/* Entrada antigua dañada. */}
      }
      setProgress(saved);
    }catch{setError(true);}
    setReady(true);
    const sync=(event:StorageEvent)=>{if(event.key===key||event.key===null)setProgress(parseStudyProgress(event.newValue,plan.days.length));};
    window.addEventListener("storage",sync);
    return()=>window.removeEventListener("storage",sync);
  },[key,plan.id,plan.days.length]);
  function save(next:StudyProgress){
    setProgress(next);
    try{localStorage.setItem(key,JSON.stringify(next));setError(false);}catch{setError(true);}
  }
  return {progress,ready,error,save};
}

export function StudyPlanCard({plan}:{plan:StudyPlan}){
  const {progress,ready,error}=useStudyProgress(plan);
  const done=progress.completed.length;
  return <article className={styles.card}>
    <p className={styles.eyebrow}>{plan.book} · {plan.days.length} días</p>
    <h2>{plan.title}</h2><p>{plan.description}</p>
    <div className={styles.cardProgress}>
      <span>{ready?`${done} de ${plan.days.length} días completados`:"Cargando progreso…"}</span>
      <progress value={done} max={plan.days.length} aria-label={`Progreso de ${plan.book}`}/>
    </div>
    {error&&<p role="status">No se pudo leer el progreso guardado.</p>}
    <Link className={styles.primary} href={studyDayUrl(plan,ready?nextStudyDay(progress,plan.days.length):1)}>{done===plan.days.length?"Repasar el plan":done?"Continuar estudio":"Comenzar estudio"} <span aria-hidden="true">→</span></Link>
  </article>;
}

export default function StudyPlanClient({plan,day,version,children}:{plan:StudyPlan;day:number;version:string;children?:React.ReactNode}){
  const {progress,ready,error,save}=useStudyProgress(plan);
  const lesson=plan.days[day-1];
  const completed=progress.completed.includes(day);
  return <>
    <section className={styles.progressPanel} aria-label="Avance del plan">
      <div><strong>{progress.completed.length} de {plan.days.length} días completados</strong><span>A su ritmo, sin fechas límite.</span></div>
      <progress value={progress.completed.length} max={plan.days.length} aria-label={`Progreso de ${plan.book}`}/>
      <nav className={styles.days} aria-label="Días del plan">{plan.days.map((_,index)=><Link key={index} href={studyDayUrl(plan,index+1,version)} aria-current={day===index+1?"step":undefined} aria-label={`Día ${index+1}${progress.completed.includes(index+1)?", completado":""}`}><span>Día</span><strong>{index+1}</strong>{progress.completed.includes(index+1)&&<small aria-hidden="true">✓</small>}</Link>)}</nav>
    </section>
    <section className={styles.lesson}>
      <p className={styles.eyebrow}>Día {day} de {plan.days.length}</p><h2>{lesson.title}</h2>
      <div className={styles.versionLabel}>Versión para la lectura
        <span className={styles.versions}>{[["rvr60","RVR1960"],["qeqchi","Q’eqchi’"],["asv","ASV · English"]].map(([id,label])=><Link key={id} href={studyDayUrl(plan,day,id)} aria-current={version===id?"page":undefined}>{label}</Link>)}</span>
      </div>
      <div className={styles.readings}>{lesson.chapters.map(chapter=><Link key={chapter} href={studyReadingUrl(plan,day,chapter,version)}><span><small>Leer en nuestra Biblia</small><strong>{plan.book} {chapter}</strong></span><span aria-hidden="true">→</span></Link>)}</div>
      <h3>Para meditar</h3><p>{lesson.reflection}</p>
      {plan.id!=="juan"&&<><h3>Para reflexionar</h3><p>{lesson.question}</p><label className={styles.noteLabel} htmlFor="study-note">Mi reflexión personal</label><textarea id="study-note" rows={4} maxLength={10000} disabled={!ready} value={progress.notes[String(day)]||""} onChange={event=>save({...progress,notes:{...progress.notes,[day]:event.target.value}})} placeholder="Escriba aquí lo que desea recordar…"/></>}
    </section>
    {children}
    <section className={styles.finish}>
      <button className={styles.primary} type="button" disabled={!ready} aria-pressed={completed} onClick={()=>save(toggleStudyDay(progress,day))}>{completed?"✓ Día completado · Desmarcar":"Marcar día como completado"}</button>
      <p role="status">{error?"No pudimos guardar en este dispositivo. El avance actual podría perderse al cerrar la página.":!ready?"Cargando progreso…":completed?"Día completado. Su progreso se conserva en este dispositivo.":"Su progreso y reflexión se guardan en este dispositivo, sin crear una cuenta. No se sincronizan entre teléfonos; borrar los datos del navegador los elimina."}</p>
      {progress.completed.length===plan.days.length&&<p><strong>¡Ha completado el plan! Puede volver a cualquier día para repasarlo.</strong></p>}
      <nav className={styles.dayNavigation} aria-label="Cambiar día">{day>1&&<Link href={studyDayUrl(plan,day-1,version)}>← Día anterior</Link>}{day<plan.days.length?<Link href={studyDayUrl(plan,day+1,version)}>Siguiente día →</Link>:<Link href="/estudios">Ver otros estudios →</Link>}</nav>
    </section>
  </>;
}
