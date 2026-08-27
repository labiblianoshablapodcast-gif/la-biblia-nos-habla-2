import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {validKidsSubmission} from "@/lib/kids";
export const dynamic="force-dynamic";
const json=(value:unknown,status=200)=>NextResponse.json(value,{status,headers:{"Cache-Control":"private, no-store"}});
const unavailable=()=>json({error:"El progreso privado todavía no está disponible. El ministerio debe activar Estudio Kids en Supabase."},503);
function configured(){return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);}
async function ready(client:Awaited<ReturnType<typeof createClient>>){const {data,error}=await client.rpc("kids_progress_ready");return !error&&data===true;}
export async function GET(request:Request){
 try{
  if(!configured())return unavailable();
  const client=await createClient();
  if(new URL(request.url).searchParams.get("estado")==="1")return json({ready:await ready(client)});
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user)return json({error:"Entre con su cuenta de adulto para consultar el progreso."},401);
  if(!await ready(client))return unavailable();
  const result=await client.from("kids_progress").select("lesson_id,age_group,learner_slot,score,total,completed_at").eq("parent_id",user.id).order("completed_at",{ascending:false});
  return result.error?unavailable():json({progress:result.data});
 }catch{return unavailable();}
}
export async function POST(request:Request){
 try{
  if(request.headers.get("origin")!==new URL(request.url).origin)return json({error:"Solicitud no permitida."},403);
  if(!configured())return unavailable();
  const raw=await request.text();
  if(raw.length>4096)return json({error:"Solicitud demasiado grande."},413);
  let body:unknown;try{body=JSON.parse(raw);}catch{return json({error:"Datos inválidos."},400);}
  const submission=validKidsSubmission(body);
  if(!submission)return json({error:"Complete las tres preguntas y la autorización del adulto."},400);
  const client=await createClient();
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user)return json({error:"Primero entre con su cuenta de adulto. Puede hacerlo en otra pestaña sin perder estas respuestas."},401);
  if(!await ready(client))return unavailable();
  const {error:saveError}=await client.from("kids_progress").upsert({...submission,parent_id:user.id,completed_at:new Date().toISOString()},{onConflict:"parent_id,learner_slot,age_group,lesson_id"});
  return saveError?unavailable():json({ok:true,score:submission.score,total:3});
 }catch{return unavailable();}
}
export async function DELETE(request:Request){
 try{
  if(request.headers.get("origin")!==new URL(request.url).origin)return json({error:"Solicitud no permitida."},403);
  if(!configured())return unavailable();
  const client=await createClient();
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user)return json({error:"Debe iniciar sesión."},401);
  const {error:deleteError}=await client.from("kids_progress").delete().eq("parent_id",user.id);
  return deleteError?unavailable():json({ok:true});
 }catch{return unavailable();}
}
