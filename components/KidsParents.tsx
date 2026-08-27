"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {FormEvent} from "react";
import {createClient} from "@/lib/supabase/client";
import styles from "@/app/kids/kids.module.css";
type Progress={lesson_id:string;age_group:string;learner_slot:number;score:number;total:number;completed_at:string};
class RequestTimeoutError extends Error{}
function withTimeout<T>(request:Promise<T>,milliseconds=15000){
 return new Promise<T>((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new RequestTimeoutError()),milliseconds);
  request.then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});
 });
}
export default function KidsParents(){
 const [ready,setReady]=useState(false),[checked,setChecked]=useState(false),[signedIn,setSignedIn]=useState(false),[register,setRegister]=useState(false),[adult,setAdult]=useState(false),[loading,setLoading]=useState(false);
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[message,setMessage]=useState(""),[progress,setProgress]=useState<Progress[]>([]),[deleteConfirm,setDeleteConfirm]=useState(false);
 async function loadProgress(){try{const response=await withTimeout(fetch("/api/kids/progreso",{cache:"no-store"}));const data=await response.json();if(response.ok)setProgress(data.progress||[]);else setMessage(data.error||"No se pudo consultar el progreso.");}catch{setMessage("No se pudo consultar el progreso. Intente nuevamente.");}}
 useEffect(()=>{
  let live=true;
  (async()=>{try{
   const response=await fetch("/api/kids/progreso?estado=1",{cache:"no-store"});const data=await response.json();
   if(!live)return;setReady(data.ready===true);
   if(data.ready){const {data:{user}}=await createClient().auth.getUser();if(live){setSignedIn(Boolean(user));if(user)await loadProgress();}}
  }catch{if(live)setMessage("No pudimos comprobar la conexión. Vuelva a intentar más tarde.");}finally{if(live)setChecked(true);}})();
  return()=>{live=false;};
 },[]);
 async function submit(event:FormEvent){
  event.preventDefault();if(!ready||!adult||loading)return;setLoading(true);setMessage("");
  try{
   const client=createClient();
   const result=await withTimeout(register?client.auth.signUp({email:email.trim(),password}):client.auth.signInWithPassword({email:email.trim(),password}));
   if(result.error){setMessage(register?"No se pudo crear la cuenta. Verifique los datos o intente iniciar sesión si ya tiene cuenta.":"No se pudo entrar. Revise su correo, contraseña y confirmación de correo.");return;}
   setPassword("");
   if(register&&!result.data.session){setMessage("Revise su correo para confirmar la cuenta. Después vuelva aquí y elija Entrar. No comparta su contraseña con los niños.");setRegister(false);return;}
   setSignedIn(true);await loadProgress();
  }catch(error){setMessage(error instanceof RequestTimeoutError?(register?"No recibimos confirmación a tiempo. Revise si llegó el correo de confirmación antes de volver a crear la cuenta. Si ya llegó, confirme su correo y elija Entrar.":"El acceso tardó demasiado. Revise su conexión e intente nuevamente."):"No se pudo conectar. Intente nuevamente.");}finally{setLoading(false);}
 }
 async function signOut(){setLoading(true);try{const {error}=await createClient().auth.signOut({scope:"local"});if(error)throw error;setSignedIn(false);setProgress([]);setMessage("");setDeleteConfirm(false);}catch{setMessage("No se pudo cerrar la sesión. Intente nuevamente.");}finally{setLoading(false);}}
 async function removeProgress(){setLoading(true);try{const response=await fetch("/api/kids/progreso",{method:"DELETE"});const data=await response.json();if(!response.ok)throw Error(data.error);setProgress([]);setDeleteConfirm(false);setMessage("Se borró el progreso Kids de esta cuenta. Puede empezar nuevamente cuando lo desee.");}catch{setMessage("No se pudo borrar el progreso. Intente nuevamente.");}finally{setLoading(false);}}
 if(!checked)return <section className={styles.panel}><p role="status">Comprobando acceso privado…</p></section>;
 if(!ready)return <section className={styles.panel}><h2>Progreso privado pendiente de activación</h2><p>Las historias, los quizzes y las hojas ya se pueden usar. El ministerio debe activar la configuración de Supabase antes de habilitar cuentas y guardar resultados.</p><p>No se ha guardado ningún resultado en la nube desde esta pantalla.</p><Link href="/kids">Continuar con las actividades →</Link><p role="status">{message}</p></section>;
 return <>
  {!signedIn?<section className={styles.panel}><h2>Cuenta del adulto responsable</h2><p>Use su correo, no el del niño. No se requieren nombres, fotos ni fechas de nacimiento de menores. Esta cuenta no da acceso al Panel Pastoral.</p><div className={styles.authTabs}><button aria-pressed={!register} onClick={()=>{setRegister(false);setMessage("");}}>Entrar</button><button aria-pressed={register} onClick={()=>{setRegister(true);setMessage("");}}>Crear cuenta</button></div><form onSubmit={submit}><label className={styles.field}>Correo del adulto<input type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email" maxLength={254} required/></label><label className={styles.field}>Contraseña<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete={register?"new-password":"current-password"} minLength={register?10:1} maxLength={128} required/></label>{register&&<p className={styles.hint}>Utilice al menos 10 caracteres. Si ya tiene una cuenta del sitio, elija Entrar.</p>}<label className={styles.consent}><input type="checkbox" checked={adult} onChange={event=>setAdult(event.target.checked)} required/>Soy mayor de edad y responsable de acompañar estas actividades.</label><button className={styles.primary} disabled={loading||!adult}>{loading?"Procesando…":register?"Crear cuenta de adulto":"Entrar a mi progreso"}</button></form></section>:<section className={styles.panel}><h2>El progreso de mi familia</h2><p>Use siempre el mismo número para cada niño. Cada grupo de edad conserva su resultado por separado. Se muestra el intento más reciente, no un historial de respuestas.</p>{progress.length===0?<p>Todavía no hay actividades guardadas.</p>:<ul className={styles.rows}>{progress.map(item=><li key={`${item.learner_slot}-${item.age_group}-${item.lesson_id}`}><strong>Explorador {item.learner_slot} · {item.age_group} años</strong><span>David y Goliat · {item.score} de {item.total} respuestas correctas</span><span>{new Date(item.completed_at).toLocaleDateString("es",{timeZone:"America/New_York"})}</span><Link href={`/kids/david-y-goliat?edad=${item.age_group}&perfil=${item.learner_slot}`}>Repasar actividad →</Link></li>)}</ul>}<div className={styles.ageCards}>{[1,2,3].map(slot=><div key={slot}><strong>Explorador {slot}</strong><p><Link href={`/kids/david-y-goliat?edad=4-6&perfil=${slot}`}>4–6 años →</Link><br/><Link href={`/kids/david-y-goliat?edad=7-10&perfil=${slot}`}>7–10 años →</Link></p></div>)}</div><div className={styles.controls}><button onClick={loadProgress} disabled={loading}>Actualizar progreso</button><button onClick={signOut} disabled={loading}>Cerrar sesión en este dispositivo</button></div>{progress.length>0&&!deleteConfirm&&<button className={styles.danger} onClick={()=>setDeleteConfirm(true)}>Borrar el progreso de mi cuenta</button>}{deleteConfirm&&<div><p>Esto elimina todos los resultados Kids de su cuenta y no se puede deshacer. No borra su cuenta ni otros estudios.</p><button className={styles.danger} disabled={loading} onClick={removeProgress}>Sí, borrar mis resultados Kids</button><button className={styles.primary} disabled={loading} onClick={()=>setDeleteConfirm(false)}>Cancelar</button></div>}</section>}
  <p role="status">{message}</p><section className={styles.panel}><h2>Qué se guarda</h2><p>El correo del adulto se usa para entrar. Cada resultado guarda un número de explorador (1, 2 o 3), grupo de edad, lección, puntuación y fecha. No se guardan las respuestas individuales ni grabaciones de voz.</p><p>Los resultados están vinculados a su cuenta y las reglas de acceso los limitan a esa cuenta. Los administradores técnicos de la base de datos conservan acceso administrativo. Puede borrar sus resultados desde aquí.</p><p>La lectura en voz usa las funciones de su dispositivo; nuestra app no activa el micrófono.</p></section>
 </>;
}
