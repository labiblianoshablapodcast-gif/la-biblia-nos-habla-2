import {NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";

export async function POST(request:Request){
  try{
    const body=await request.json() as {token?:string;fullName?:string;email?:string;chapter?:number};
    const token=body.token?.trim()||"";
    const fullName=body.fullName?.trim()||"";
    const email=body.email?.trim()||"";
    const chapter=Number(body.chapter);
    if(!/^[a-zA-Z0-9-]{16,80}$/.test(token)||fullName.length<2||fullName.length>120||email.length>180||!Number.isInteger(chapter)||chapter<1||chapter>21){
      return NextResponse.json({ok:false,error:"Datos incompletos."},{status:400});
    }
    const supabase=createAdminClient();
    const {data:participant,error:participantError}=await supabase.from("john_study_participants").upsert({participant_token:token,full_name:fullName,email:email||null,last_activity_at:new Date().toISOString()},{onConflict:"participant_token"}).select("id").single();
    if(participantError||!participant)throw participantError||new Error("Participante no registrado");
    const {data:completion,error:completionError}=await supabase.from("john_study_completions").upsert({participant_id:participant.id,chapter},{onConflict:"participant_id,chapter",ignoreDuplicates:true}).select("id");
    if(completionError)throw completionError;
    const {count,error:countError}=await supabase.from("john_study_completions").select("id",{count:"exact",head:true}).eq("participant_id",participant.id);
    if(countError)throw countError;
    const completedCount=count||0;
    let milestone:number|undefined;
    if(completion?.length&&[5,10,15,20].includes(completedCount)){
      milestone=completedCount;
      const {error}=await supabase.from("john_study_milestones").upsert({participant_id:participant.id,milestone},{onConflict:"participant_id,milestone",ignoreDuplicates:true});
      if(error)throw error;
    }
    return NextResponse.json({ok:true,count:completedCount,milestone});
  }catch(error){
    console.error("No se pudo registrar el estudio de Juan",error);
    return NextResponse.json({ok:false,error:"No se pudo registrar el avance."},{status:500});
  }
}
