import {revalidatePath} from "next/cache";
import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";

type Completion={chapter:number;completed_at:string};
type Milestone={id:number;milestone:number;reached_at:string;seen_at:string|null};
type Participant={id:string;full_name:string;email:string|null;created_at:string;last_activity_at:string;john_study_completions:Completion[];john_study_milestones:Milestone[]};

function dateTime(value:string){return new Date(value).toLocaleString("es-US",{timeZone:"America/New_York",dateStyle:"medium",timeStyle:"short"});}

async function markMilestonesSeen(){
  "use server";
  const session=await createClient();
  const {data:{user}}=await session.auth.getUser();
  if(!user)return;
  await createAdminClient().from("john_study_milestones").update({seen_at:new Date().toISOString()}).is("seen_at",null);
  revalidatePath("/admin/estudio-juan");
}

export default async function JohnStudyAdmin(){
  const session=await createClient();
  const {data:{user}}=await session.auth.getUser();
  let participants:Participant[]=[];
  let loadError="";
  try{
    const {data,error}=await createAdminClient().from("john_study_participants").select("id,full_name,email,created_at,last_activity_at,john_study_completions(chapter,completed_at),john_study_milestones(id,milestone,reached_at,seen_at)").order("last_activity_at",{ascending:false});
    if(error)throw error;
    participants=(data||[]) as unknown as Participant[];
  }catch{loadError="Todavía falta activar las tablas del estudio en Supabase.";}
  const totalChapters=participants.reduce((sum,item)=>sum+(item.john_study_completions?.length||0),0);
  const unseen=participants.reduce((sum,item)=>sum+(item.john_study_milestones||[]).filter(note=>!note.seen_at).length,0);

  return <div className="adminShell adminShellPro"><AdminNav/><main className="adminMain adminDashboard">
    <section className="adminWelcome"><div><p className="eyebrow">Seguimiento pastoral</p><h1>Estudio del Evangelio de Juan</h1><small className="adminUserEmail">{user?.email}</small><p>Nombre, capítulos terminados y fecha de cada participante.</p></div>{unseen>0&&<form action={markMilestonesSeen}><button className="btn" type="submit">Marcar {unseen} {unseen===1?"aviso":"avisos"} como vistos</button></form>}</section>
    {loadError&&<div className="adminStudySetup"><strong>{loadError}</strong><p>Ejecute una sola vez el archivo <code>ACTIVAR_PROGRESO_ESTUDIO_JUAN.sql</code> en el Editor SQL de Supabase.</p></div>}
    <section className="adminStatsPro"><div><strong>{participants.length}</strong><span>Participantes</span></div><div><strong>{totalChapters}</strong><span>Capítulos completados</span></div><div><strong>{unseen}</strong><span>Avisos nuevos</span></div></section>
    <section className="adminPanelCard"><div className="adminPanelHeader"><div><p className="eyebrow">Progreso</p><h2>Participantes</h2></div></div>
      <div className="studyAdminTableWrap"><table className="studyAdminTable"><thead><tr><th>Participante</th><th>Progreso</th><th>Capítulos</th><th>Última actividad</th><th>Avisos</th></tr></thead><tbody>
        {participants.map(item=>{const completions=[...(item.john_study_completions||[])].sort((a,b)=>a.chapter-b.chapter);const latest=completions.reduce((value,current)=>!value||new Date(current.completed_at)>new Date(value)?current.completed_at:value,"");return <tr key={item.id}><td><strong>{item.full_name}</strong>{item.email&&<small>{item.email}</small>}</td><td><b>{completions.length}/21</b></td><td><div className="chapterPills">{completions.map(entry=><span key={entry.chapter} title={dateTime(entry.completed_at)}>{entry.chapter}</span>)}</div></td><td>{latest?dateTime(latest):dateTime(item.last_activity_at)}</td><td><div className="milestonePills">{(item.john_study_milestones||[]).map(note=><span className={!note.seen_at?"newMilestone":""} key={note.id}>{note.milestone} capítulos{!note.seen_at&&<em>Nuevo</em>}</span>)}</div></td></tr>})}
        {!participants.length&&!loadError&&<tr><td colSpan={5}>Todavía no hay participantes registrados.</td></tr>}
      </tbody></table></div>
    </section>
  </main></div>;
}
