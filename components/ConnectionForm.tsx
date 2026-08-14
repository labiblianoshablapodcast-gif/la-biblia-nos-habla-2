'use client';

import {FormEvent, useMemo, useState} from "react";
import {createClient} from "@/lib/supabase/client";

const requestOptions=["Aceptar a Cristo","Petición de oración","Bautismo","Membresía","Consejería","Visita pastoral","Servir"];
const messages: Record<string,string> = {
  "Aceptar a Cristo": "¡Gracias por aceptar a Cristo! Hemos recibido tu solicitud. Muy pronto un pastor se pondrá en contacto contigo. Mientras tanto, te invitamos a comenzar el estudio del Evangelio de Juan.",
  "Petición de oración": "Gracias por confiar en nosotros. Su petición fue recibida y estaremos orando por usted.",
  "Bautismo": "Dios le bendiga. Hemos recibido su solicitud de bautismo. Muy pronto un pastor o líder se comunicará con usted.",
  "Membresía": "Dios le bendiga. Hemos recibido su interés en ser parte de la congregación. Pronto nos comunicaremos con usted.",
  "Consejería": "Dios le bendiga. Hemos recibido su solicitud de consejería pastoral. La trataremos con respeto y discreción.",
  "Visita pastoral": "Dios le bendiga. Hemos recibido su solicitud de visita pastoral. Nos comunicaremos para coordinar los detalles.",
  "Servir": "Gracias por su deseo de servir al Señor. Hemos recibido su información y un líder se comunicará con usted."
};

export default function ConnectionForm(){
  const [request,setRequest]=useState("Aceptar a Cristo");
  const [submitting,setSubmitting]=useState(false);
  const [databaseStatus,setDatabaseStatus]=useState("");
  const autoresponse=useMemo(()=>messages[request] ?? "Dios le bendiga. Hemos recibido su solicitud.",[request]);
  const whatsapp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g,"");

  async function handleSubmit(event:FormEvent<HTMLFormElement>){
    event.preventDefault(); setSubmitting(true);
    const form=event.currentTarget; const data=new FormData(form);
    const name=String(data.get("Nombre") ?? "").trim(); const email=String(data.get("Correo") ?? "").trim();
    const phone=String(data.get("Telefono") ?? "").trim(); const requestType=String(data.get("Solicitud") ?? request).trim();
    const message=String(data.get("Mensaje") ?? "").trim();
    try{
      const supabase=createClient();
      const {error}=await supabase.from("prayer_requests").insert({name,email,phone,request_type:requestType,request:message,status:"Nuevo"});
      if(error) throw error;
      if(requestType==="Aceptar a Cristo"){
        const {error:believerError}=await supabase.from("new_believers").insert({full_name:name,email,phone,status:"Nuevo"});
        if(believerError) throw believerError;
      }
      setDatabaseStatus("Solicitud guardada correctamente.");
    }catch(error){console.error(error);setDatabaseStatus("La solicitud será enviada por correo; no pudo guardarse internamente.");}
    form.submit();
  }

  const whatsappText=encodeURIComponent(`Dios le bendiga. Acabo de llenar el formulario. Mi solicitud es: ${request}.`);
  return <div className="connectionFormWrap connectionFormModern">
    <div className="connectionFormHeading"><div><p className="eyebrow">Formulario confidencial</p><h2>¿Cómo podemos acompañarle?</h2></div><span>Respuesta pastoral</span></div>
    <div className="requestQuickChoices" aria-label="Seleccione el tipo de ayuda">
      {requestOptions.map(option=><button type="button" key={option} className={request===option?'active':''} onClick={()=>setRequest(option)}>{option}</button>)}
    </div>
    <form className="ministryForm ministryFormModern" action="https://formsubmit.co/160f6b74b723a062a9a463452e3c3808" method="POST" onSubmit={handleSubmit}>
      <input type="hidden" name="_subject" value={`Nueva solicitud: ${request}`}/><input type="hidden" name="_template" value="table"/>
      <input type="hidden" name="_captcha" value="false"/><input type="hidden" name="_autoresponse" value={autoresponse}/>
      <input type="hidden" name="_next" value={`https://www.labiblianoshabla.org/gracias?tipo=${encodeURIComponent(request)}`}/>
      <div className="connectionFieldGrid">
        <label><span>Nombre completo</span><input name="Nombre" autoComplete="name" placeholder="Su nombre" required/></label>
        <label><span>Correo electrónico</span><input type="email" name="Correo" autoComplete="email" placeholder="nombre@correo.com" required/></label>
        <label><span>Teléfono <small>opcional</small></span><input type="tel" name="Telefono" autoComplete="tel" placeholder="(215) 000-0000"/></label>
        <label><span>Tipo de solicitud</span><select name="Solicitud" value={request} onChange={e=>setRequest(e.target.value)}>{requestOptions.map(option=><option key={option}>{option}</option>)}</select></label>
        <label className="connectionMessageField"><span>¿Cómo podemos ayudarle?</span><textarea name="Mensaje" rows={4} placeholder="Escriba aquí su mensaje..." required/></label>
      </div>
      {databaseStatus && <p className="databaseStatus">{databaseStatus}</p>}
      <div className="connectionSubmitRow"><p><b>🔒</b> Información protegida y confidencial</p><button className="btn" disabled={submitting}>{submitting ? "Enviando..." : "Enviar solicitud"}<span>→</span></button></div>
    </form>
    {whatsapp ? <a className="whatsappButton whatsappButtonModern" href={`https://wa.me/${whatsapp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">💬 Hablar ahora por WhatsApp</a> : <p className="setupNote">El botón de WhatsApp aparecerá al añadir el número en Vercel.</p>}
  </div>;
}
