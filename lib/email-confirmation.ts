// Only known confirmation errors are interpreted. Never render provider text or tokens.
export function confirmationProblem(search:string,hash:string){
 for(const source of [hash.replace(/^#/,""),search.replace(/^\?/,"")]){
  const params=new URLSearchParams(source);
  if(params.get("error_code")==="otp_expired")return true;
  if(params.get("error")==="access_denied"&&params.get("error_description")==="Email link is invalid or has expired")return true;
 }
 return false;
}
export class EmailRequestTimeout extends Error{}
export function boundedEmailRequest<T>(request:Promise<T>,milliseconds=15000):Promise<T>{
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new EmailRequestTimeout()),milliseconds);
  request.then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});
 });
}
export function resendFeedback(code?:string){
 if(code==="over_email_send_rate_limit"||code==="over_request_rate_limit")return "Se alcanzó el límite de solicitudes. Espere unos minutos antes de volver a intentar.";
 if(code==="email_address_not_authorized"||code==="email_provider_disabled"||code==="signup_disabled")return "El envío necesita una revisión del ministerio. Puede continuar con las actividades sin guardar en la nube.";
 return "No pudimos solicitar el correo. Intente más tarde; no necesita crear otra cuenta.";
}
