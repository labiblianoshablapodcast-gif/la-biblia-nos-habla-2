import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
export default async function NuevosCreyentes(){
 const supabase=await createClient();
 const {data,error}=await supabase.from("new_believers").select("*").order("created_at",{ascending:false});
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Discipulado y seguimiento</p><h1>Nuevos creyentes</h1>{error&&<div className="notice">{error.message}</div>}<div className="adminTable">{(data??[]).map(person=><article key={person.id}><div className="requestHeader"><strong>{person.full_name||"Sin nombre"}</strong><span className="statusBadge">{person.status||"Nuevo"}</span></div><div className="contactMeta">{person.email&&<a href={`mailto:${person.email}`}>✉ {person.email}</a>}{person.phone&&<a href={`tel:${person.phone}`}>☎ {person.phone}</a>}<span>{person.created_at?new Date(person.created_at).toLocaleString("es-US"):""}</span></div></article>)}{!data?.length&&!error&&<p>No hay nuevos creyentes todavía.</p>}</div></section></div>;
}
