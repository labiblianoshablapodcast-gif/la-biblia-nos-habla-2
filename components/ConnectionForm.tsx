'use client';

import {FormEvent,useState} from "react";
import {createClient} from "@/lib/supabase/client";

const requestOptions=["Aceptar a Cristo","Petición de oración","Bautismo","Membresía","Consejería","Visita pastoral","Servir"];

export default function ConnectionForm(){
 const [request,setRequest]=useState("Aceptar a Cristo");
 const [submitting,setSubmitting]=useState(false);
 const [databaseStatus,setDatabaseStatus]=useState("");
 const whatsapp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER??"").replace(/\D/g,"");

 async function handleSubmit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(submitting)return;
  setSubmitting(true);
  setDatabaseStatus("Guardando su solicitud de manera privada…");

  const form=event.currentTarget;
  const data=new FormData(form);
  if(String(data.get("website")??"").trim()){
   window.location.assign("/gracias?tipo="+encodeURIComponent(request));
   return;
  }

  const name=String(data.get("Nombre")??"").trim();
  const email=String(data.get("Correo")??"").trim();
  const phone=String(data.get("Telefono")??"").trim();
  const requestType=String(data.get("Solicitud")??request).trim();
  const message=String(data.get("Mensaje")??"").trim();

  try{
   const supabase=createClient();
   const {error}=await supabase.from("prayer_requests").insert({
    name,email,phone,request_type:requestType,request:message,status:"Nuevo"
   });
   if(error)throw error;

   if(requestType==="Aceptar a Cristo"){
    const {error:believerError}=await supabase.from("new_believers").insert({
     full_name:name,email,phone,status:"Nuevo"
    });
    if(believerError)console.error("No se pudo crear el seguimiento adicional.",believerError);
   }

   setDatabaseStatus("✓ Solicitud recibida. Gracias por confiar en nosotros.");
   form.reset();
   window.setTimeout(()=>{
    window.location.assign("/gracias?tipo="+encodeURIComponent(requestType));
   },700);
  }catch(error){
   console.error("No se pudo guardar la solicitud.",error);
   setDatabaseStatus("No pudimos enviar la solicitud. Revise su conexión e inténtelo nuevamente.");
   setSubmitting(false);
  }
 }

 const whatsappText=encodeURIComponent("Dios le bendiga. Acabo de llenar el formulario. Mi solicitud es: "+request+".");
 return <div className="connectionFormWrap connectionFormModern">
  <div className="connectionFormHeading"><div><p className="eyebrow">Formulario confidencial</p><h2>¿Cómo podemos acompañarle?</h2></div><span>Respuesta pastoral</span></div>
  <div className="requestQuickChoices" role="group" aria-label="Seleccione el tipo de ayuda">
   {requestOptions.map(option=><button type="button" key={option} aria-pressed={request===option} className={request===option?"active":""} onClick={()=>setRequest(option)}>{option}</button>)}
  </div>
  <form className="ministryForm ministryFormModern" onSubmit={handleSubmit}>
   <label className="formHoneypot" aria-hidden="true">No completar<input name="website" tabIndex={-1} autoComplete="off"/></label>
   <div className="connectionFieldGrid">
    <label><span>Nombre completo</span><input name="Nombre" autoComplete="name" placeholder="Su nombre" required/></label>
    <label><span>Correo electrónico</span><input type="email" name="Correo" autoComplete="email" placeholder="nombre@correo.com" required/></label>
    <label><span>Teléfono <small>opcional</small></span><input type="tel" name="Telefono" autoComplete="tel" placeholder="(215) 000-0000"/></label>
    <label><span>Tipo de solicitud</span><select name="Solicitud" value={request} onChange={event=>setRequest(event.target.value)}>{requestOptions.map(option=><option key={option}>{option}</option>)}</select></label>
    <label className="connectionMessageField"><span>¿Cómo podemos ayudarle?</span><textarea name="Mensaje" rows={4} placeholder="Escriba aquí su mensaje..." required/></label>
   </div>
   {databaseStatus&&<p className="databaseStatus" role="status" aria-live="polite">{databaseStatus}</p>}
   <div className="connectionSubmitRow"><p><b>🔒</b> Información guardada en el sistema pastoral</p><button className="btn" disabled={submitting}>{submitting?"Enviando...":"Enviar solicitud"}<span>→</span></button></div>
  </form>
  {whatsapp?<a className="whatsappButton whatsappButtonModern" href={"https://wa.me/"+whatsapp+"?text="+whatsappText} target="_blank" rel="noopener noreferrer">💬 Hablar ahora por WhatsApp</a>:<p className="setupNote">El botón de WhatsApp aparecerá al añadir el número en Vercel.</p>}
 </div>;
}
