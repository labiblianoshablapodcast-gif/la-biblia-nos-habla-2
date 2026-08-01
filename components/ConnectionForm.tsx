'use client';
import {FormEvent,useMemo,useState} from 'react';
const messages:Record<string,string>={
'Aceptar a Cristo':'¡Gracias por aceptar a Cristo! Hemos recibido tu solicitud. Muy pronto un pastor se pondrá en contacto contigo. Mientras tanto, te invitamos a comenzar el estudio del Evangelio de Juan.',
'Bautismo':'Dios le bendiga. Hemos recibido su solicitud de bautismo. Muy pronto un pastor o líder se comunicará con usted para orientarle.',
'Membresía':'Dios le bendiga. Hemos recibido su interés en ser parte de la congregación. Pronto nos comunicaremos con usted.',
'Consejería':'Dios le bendiga. Hemos recibido su solicitud de consejería pastoral. La trataremos con respeto y discreción.',
'Visita pastoral':'Dios le bendiga. Hemos recibido su solicitud de visita pastoral. Nos comunicaremos para coordinar los detalles.',
'Servir':'Gracias por su deseo de servir al Señor. Hemos recibido su información y un líder se comunicará con usted.'};
export default function ConnectionForm(){
 const [request,setRequest]=useState('Aceptar a Cristo'); const [submitting,setSubmitting]=useState(false);
 const autoresponse=useMemo(()=>messages[request]??'Dios le bendiga. Hemos recibido su solicitud y pronto nos comunicaremos con usted.',[request]);
 const whatsapp=(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER??'').replace(/\D/g,'');
 const sheetsWebhook=process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK??'';
 async function handleSubmit(event:FormEvent<HTMLFormElement>){setSubmitting(true);const form=event.currentTarget;if(sheetsWebhook){const data=Object.fromEntries(new FormData(form).entries());try{await fetch(sheetsWebhook,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});}catch{}}}
 const whatsappText=encodeURIComponent(`Dios le bendiga. Acabo de llenar el formulario de La Biblia Nos Habla. Mi solicitud es: ${request}.`);
 return <div className='connectionFormWrap'><form className='ministryForm' action='https://formsubmit.co/160f6b74b723a062a9a463452e3c3808' method='POST' onSubmit={handleSubmit}>
 <input type='hidden' name='_subject' value={`Nueva solicitud: ${request}`}/><input type='hidden' name='_template' value='table'/><input type='hidden' name='_captcha' value='false'/><input type='hidden' name='_autoresponse' value={autoresponse}/><input type='hidden' name='_next' value={`https://www.labiblianoshabla.org/gracias?tipo=${encodeURIComponent(request)}`}/>
 <label>Nombre completo<input name='Nombre' required/></label><label>Correo electrónico<input type='email' name='Correo' required/></label><label>Teléfono<input type='tel' name='Telefono'/></label>
 <label>¿Cómo podemos ayudarle?<select name='Solicitud' value={request} onChange={e=>setRequest(e.target.value)}><option>Aceptar a Cristo</option><option>Bautismo</option><option>Membresía</option><option>Consejería</option><option>Visita pastoral</option><option>Servir</option></select></label>
 <label>Mensaje<textarea name='Mensaje' rows={6} required/></label><button className='btn' disabled={submitting}>{submitting?'Enviando...':'Enviar solicitud'}</button></form>
 {whatsapp?<a className='whatsappButton' href={`https://wa.me/${whatsapp}?text=${whatsappText}`} target='_blank' rel='noopener noreferrer'>💬 Hablar ahora por WhatsApp</a>:<p className='setupNote'>El botón de WhatsApp aparecerá al añadir el número en Vercel.</p>}</div>;}
