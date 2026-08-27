"use client";
import {useEffect,useRef,useState} from "react";
import type {FormEvent} from "react";
import {createClient} from "@/lib/supabase/client";
import {boundedEmailRequest,EmailRequestTimeout,resendFeedback} from "@/lib/email-confirmation";
import styles from "@/app/kids/kids.module.css";

export default function KidsConfirmationHelp(){
 const [email,setEmail]=useState(""),[adult,setAdult]=useState(false),[busy,setBusy]=useState(false),[remaining,setRemaining]=useState(0),[message,setMessage]=useState("");
 const inFlight=useRef(false),retryAt=useRef(0);
 useEffect(()=>{
  if(!remaining)return;
  const timer=setInterval(()=>setRemaining(Math.max(0,Math.ceil((retryAt.current-Date.now())/1000))),1000);
  return()=>clearInterval(timer);
 },[remaining]);
 async function resend(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!adult||inFlight.current||Date.now()<retryAt.current||!event.currentTarget.reportValidity())return;
  inFlight.current=true;setBusy(true);setMessage("");retryAt.current=Date.now()+60000;setRemaining(60);
  try{
   // Retain the existing Site URL. The app never chooses an external redirect.
   const {error}=await boundedEmailRequest(createClient().auth.resend({type:"signup",email:email.trim()}));
   setMessage(error?resendFeedback(error.code):"Solicitud recibida. Si esa cuenta necesita confirmación, recibirá un nuevo correo. Revise también Spam y use el mensaje más reciente. Si ya confirmó su cuenta, elija Entrar.");
  }catch(error){setMessage(error instanceof EmailRequestTimeout?"La respuesta tardó demasiado. Revise su correo antes de volver a solicitarlo; no podemos confirmar si se envió.":resendFeedback());}
  finally{inFlight.current=false;setBusy(false);}
 }
 return <details className={styles.panel} id="confirmacion">
  <summary style={{cursor:"pointer",fontWeight:800,minHeight:44}}>¿No llegó la confirmación o venció el enlace?</summary>
  <p>Los enlaces se usan una sola vez. Si ya logró confirmar su correo, entre con su contraseña; no necesita otro enlace ni otra cuenta.</p>
  <form onSubmit={resend} aria-label="Reenviar confirmación" aria-busy={busy}>
   <label className={styles.field}>Correo del adulto para confirmar<input type="email" autoComplete="email" required maxLength={254} value={email} disabled={busy} onChange={event=>setEmail(event.target.value)}/></label>
   <label className={styles.consent}><input type="checkbox" required checked={adult} disabled={busy} onChange={event=>setAdult(event.target.checked)}/>Soy el adulto responsable y solicito la confirmación de mi propia cuenta.</label>
   <button type="submit" className={styles.primary} disabled={busy||!adult||remaining>0}>{busy?"Solicitando correo…":remaining>0?`Espere ${remaining} s para reenviar`:"Reenviar confirmación"}</button>
  </form>
  <p role="status">{message}</p>
  <p className={styles.hint}>Nunca comparta el enlace ni su contraseña. Solicitar otro correo no crea una cuenta nueva.</p>
 </details>;
}
