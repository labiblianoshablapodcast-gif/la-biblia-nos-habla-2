import {NextResponse} from "next/server";

const RESEND_ENDPOINT="https://api.resend.com/emails";
const PASTOR_EMAIL="labiblianoshablapodcast@gmail.com";

function esc(value:string){return value.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]||c));}

async function sendEmail(to:string,subject:string,html:string,replyTo?:string){
 const key=process.env.RESEND_API_KEY;
 if(!key)throw new Error("RESEND_API_KEY no está configurada");
 const from=process.env.RESEND_FROM_EMAIL||"La Biblia Nos Habla <onboarding@resend.dev>";
 const response=await fetch(RESEND_ENDPOINT,{method:"POST",headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({from,to:[to],subject,html,...(replyTo?{reply_to:replyTo}:{})})});
 if(!response.ok)throw new Error(`Resend ${response.status}: ${await response.text()}`);
}

export async function POST(request:Request){
 try{
  const body=await request.json();
  const name=String(body.name??"").trim();
  const email=String(body.email??"").trim();
  const phone=String(body.phone??"").trim();
  const requestType=String(body.requestType??"").trim();
  const message=String(body.message??"").trim();
  if(!name||!email||!requestType||!message)return NextResponse.json({ok:false,error:"Faltan datos."},{status:400});

  const safeName=esc(name),safeEmail=esc(email),safePhone=esc(phone||"No provisto"),safeType=esc(requestType),safeMessage=esc(message).replace(/\n/g,"<br>");
  const visitorHtml=`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#17233c"><h2>Dios le bendiga, ${safeName}.</h2><p>Gracias por comunicarse con <strong>La Biblia Nos Habla</strong>. Hemos recibido su solicitud: <strong>${safeType}</strong>.</p><p>Su mensaje ha sido recibido por nuestro equipo pastoral. Estaremos revisándolo y nos comunicaremos con usted tan pronto como sea posible.</p><p>Mientras tanto, queremos que sepa que agradecemos la confianza que ha depositado en nuestro ministerio y estaremos orando por usted.</p><p>Con bendiciones,<br><strong>Pastor Gilberto Maldonado</strong><br>La Biblia Nos Habla</p></div>`;
  const pastorHtml=`<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#17233c"><h2>Nueva correspondencia pastoral</h2><p><strong>Nombre:</strong> ${safeName}</p><p><strong>Correo:</strong> ${safeEmail}</p><p><strong>Teléfono:</strong> ${safePhone}</p><p><strong>Solicitud:</strong> ${safeType}</p><p><strong>Mensaje:</strong><br>${safeMessage}</p><hr><p>Puede responder directamente a este correo para contestarle a ${safeName}.</p></div>`;

  await Promise.all([
   sendEmail(email,"Hemos recibido su mensaje — La Biblia Nos Habla",visitorHtml),
   sendEmail(PASTOR_EMAIL,`Nueva solicitud pastoral — ${requestType}`,pastorHtml,email)
  ]);
  return NextResponse.json({ok:true});
 }catch(error){
  console.error("No se pudieron enviar los correos pastorales.",error);
  return NextResponse.json({ok:false,error:"No se pudo enviar el correo."},{status:500});
 }
}
