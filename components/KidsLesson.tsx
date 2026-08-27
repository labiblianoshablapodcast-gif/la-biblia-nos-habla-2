"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import KidsArt,{KidsIcon,Lumi} from "@/components/KidsArt";
import {kidsLesson,kidsQuestions,gradeKidsQuiz} from "@/lib/kids";
import type {KidsAge} from "@/lib/kids";
import styles from "@/app/kids/kids.module.css";

export default function KidsLesson({age,slot}:{age:KidsAge;slot:number}){
 const [scene,setScene]=useState(0),[playing,setPlaying]=useState(false),[voice,setVoice]=useState(false);
 const [answers,setAnswers]=useState<number[]>([-1,-1,-1]),[checked,setChecked]=useState(false),[consent,setConsent]=useState(false),[saving,setSaving]=useState(false),[message,setMessage]=useState("");
 const [selectedSlot,setSelectedSlot]=useState(slot);
 const text=age==="4-6"?kidsLesson.scenes[scene].young:kidsLesson.scenes[scene].older;
 const score=gradeKidsQuiz(age,answers);
 useEffect(()=>{setVoice("speechSynthesis" in window);return()=>{if("speechSynthesis" in window)window.speechSynthesis.cancel();};},[]);
 useEffect(()=>{if(!playing)return;const timer=window.setTimeout(()=>{if(scene===5)setPlaying(false);else setScene(value=>value+1);},age==="4-6"?14000:20000);return()=>window.clearTimeout(timer);},[playing,scene,age]);
 useEffect(()=>{if("speechSynthesis" in window)window.speechSynthesis.cancel();},[scene]);
 function move(next:number){setPlaying(false);setScene(next);}
 function speak(){setPlaying(false);window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang="es";utterance.rate=age==="4-6"?.8:.9;window.speechSynthesis.speak(utterance);}
 async function save(){
  setSaving(true);setMessage("");
  try{const response=await fetch("/api/kids/progreso",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lesson:kidsLesson.id,age,slot:selectedSlot,answers,adultConsent:consent})});const result=await response.json();setMessage(response.ok?"Progreso guardado. Puede verlo en el espacio para padres.":result.error||"No se pudo guardar. Intente nuevamente.");}
  catch{setMessage("No se pudo conectar. Las respuestas siguen aquí mientras mantenga esta página abierta.");}finally{setSaving(false);}
 }
 return <>
  <section className={styles.story} aria-label="Historia animada">
   <div className={styles.stage} key={scene}><KidsArt scene={scene}/></div>
   <div className={styles.storyText}><p className={styles.eyebrow}>Escena {scene+1} de 6 · {age} años</p><h2>{kidsLesson.scenes[scene].title}</h2><p>{text}</p>
    <div className={styles.controls}><button onClick={()=>move(Math.max(0,scene-1))} disabled={scene===0}>← Anterior</button><button onClick={()=>{if(scene===5)setScene(0);setPlaying(value=>!value);}} aria-pressed={playing}>{playing?"Pausar":"Reproducir historia"}</button><button onClick={()=>move(Math.min(5,scene+1))} disabled={scene===5}>Siguiente →</button>{voice&&<button onClick={speak}>Escuchar escena</button>}</div>
    <p className={styles.hint}>La historia avanza sin sonido. “Escuchar escena” usa la voz disponible en su dispositivo. Puede leer y cambiar las escenas a su ritmo.</p>
   </div>
  </section>
  <aside className={styles.lumi}><Lumi/><p><strong>¡Soy Lumi!</strong> Recordemos juntos: podemos confiar en Dios y pedir ayuda. Nunca imites el uso de una honda ni lances piedras a personas o animales.</p></aside>
  <section className={styles.panel} aria-labelledby="kids-quiz"><p className={styles.eyebrow}>Aprendemos jugando</p><h2 id="kids-quiz">¿Qué descubriste?</h2><p>Elige una respuesta en cada pregunta. Un adulto puede ayudarte a leer.</p>
   {kidsQuestions[age].map((question,index)=><fieldset key={index} className={styles.question}><legend>{index+1}. {question.prompt}</legend><div className={styles.options}>{question.options.map((option,choice)=><label key={choice} className={answers[index]===choice?styles.selected:""}><input type="radio" name={`kids-q-${index}`} checked={answers[index]===choice} onChange={()=>{setAnswers(previous=>previous.map((value,i)=>i===index?choice:value));setChecked(false);setMessage("");}}/><KidsIcon kind={option.icon}/><span>{option.text}</span></label>)}</div>{checked&&<p className={styles.explanation}>{answers[index]===question.answer?"✓ ¡Bien! ":"Vamos a aprender: "}{question.explanation}</p>}</fieldset>)}
   <button className={styles.primary} disabled={score===null} onClick={()=>setChecked(true)}>Ver mis respuestas</button>
   {checked&&<div className={styles.result} role="status"><strong>{score} de 3 respuestas correctas</strong><p>{score===3?"¡Muy bien! Ahora comparte con tu familia lo que aprendiste.":"¡Gracias por intentarlo! Lee las explicaciones y vuelve a elegir si lo deseas."}</p></div>}
  </section>
  <section className={styles.panel}><p className={styles.eyebrow}>Para hacer en familia</p><h2>Tu hoja de actividades</h2><p>{age==="4-6"?"Colorea a David y sus ovejas, cuenta cinco piedras y conversa con un adulto.":"Ordena la historia, responde con tus propias palabras y prepara un plan para pedir ayuda."}</p><a className={styles.primary} href={`/api/kids/hoja?edad=${age}`}>Descargar hoja PDF · {age} años</a><p className={styles.hint}>Una página, tamaño carta. Lista para imprimir en blanco y negro.</p><Link href="/biblia/1-samuel/17">Leer 1 Samuel 17 en nuestra Biblia →</Link></section>
  {checked&&<section className={styles.panel}><h2>Espacio para el adulto</h2><p>Guardar es opcional. Solo se registra el grupo de edad, el número de explorador, el resultado más reciente y la fecha. No pedimos nombres, fotos ni fechas de nacimiento de los niños.</p><label className={styles.field}>Guardar para<select value={selectedSlot} onChange={event=>setSelectedSlot(Number(event.target.value))}>{[1,2,3].map(value=><option key={value} value={value}>Explorador {value}</option>)}</select></label><label className={styles.consent}><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/>Soy el adulto responsable y autorizo guardar este resultado en mi cuenta.</label><button className={styles.primary} disabled={!consent||saving} onClick={save}>{saving?"Guardando…":"Guardar con mi cuenta de adulto"}</button><p role="status">{message}</p><Link href="/kids/padres">Entrar o crear cuenta de adulto →</Link><p className={styles.hint}>Si necesita iniciar sesión, abra el acceso de padres en otra pestaña para conservar estas respuestas. El guardado requiere que el ministerio active Supabase.</p></section>}
 </>;
}
