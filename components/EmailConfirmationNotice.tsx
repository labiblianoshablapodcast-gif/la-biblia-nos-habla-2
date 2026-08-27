"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {confirmationProblem} from "@/lib/email-confirmation";
import styles from "./email-confirmation.module.css";

export default function EmailConfirmationNotice(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{
  const inspect=()=>setVisible(confirmationProblem(window.location.search,window.location.hash));
  inspect();
  window.addEventListener("hashchange",inspect);
  window.addEventListener("popstate",inspect);
  return()=>{window.removeEventListener("hashchange",inspect);window.removeEventListener("popstate",inspect);};
 },[]);
 if(!visible)return null;
 return <aside className={styles.notice} aria-label="Aviso del enlace de confirmación">
  <div role="alert"><h2>Este enlace venció o ya fue utilizado</h2><p>Si ya confirmó su correo, entre con su contraseña. Si todavía no lo ha confirmado, puede solicitar otro correo desde el espacio para padres. No cree otra cuenta.</p></div>
  <div className={styles.actions}><Link href="/kids/padres#confirmacion" onClick={()=>setVisible(false)}>Ir al acceso para padres</Link><button type="button" onClick={()=>setVisible(false)}>Cerrar aviso</button></div>
 </aside>;
}
