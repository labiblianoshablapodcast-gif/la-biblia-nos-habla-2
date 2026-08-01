import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
export default async function Peticiones(){
 const supabase=await createClient();
 const {data,error}=await supabase.from("prayer_requests").select("*").order("created_at",{ascending:false});
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Seguimiento pastoral</p><h1>Peticiones y solicitudes</h1>{error&&<div className="notice">{error.message}</div>}<div className="adminTable">{(data??[]).map(item=><article key={item.id}><div className="requestHeader"><div><strong>{item.name||"Sin nombre"}</strong><small>{item.request_type||"Solicitud"}</small></div><span className="statusBadge">{item.status||"Nuevo"}</span></div><p>{item.request}</p><div className="contactMeta">{item.email&&<a href={`mailto:${item.email}`}>✉ {item.email}</a>}{item.phone&&<a href={`tel:${item.phone}`}>☎ {item.phone}</a>}<span>{item.created_at?new Date(item.created_at).toLocaleString("es-US"):""}</span></div></article>)}{!data?.length&&!error&&<p>No hay solicitudes todavía.</p>}</div></section></div>;
}
