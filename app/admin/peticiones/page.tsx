import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";

export default async function Peticiones(){
 const supabase=await createClient();
 const {data}=await supabase.from("prayer_requests").select("*").order("created_at",{ascending:false});
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Seguimiento pastoral</p><h1>Peticiones</h1>
 <div className="adminTable">{(data??[]).map(item=><article key={item.id}><strong>{item.name}</strong><small>{item.status}</small><p>{item.request}</p></article>)}
 {!data?.length && <p>No hay peticiones guardadas todavía.</p>}</div></section></div>;
}