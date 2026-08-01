import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
export default async function Admin(){
 const supabase=await createClient();
 const [{count:requests},{count:believers},{count:sermons},{count:events}]=await Promise.all([
  supabase.from("prayer_requests").select("*",{count:"exact",head:true}),
  supabase.from("new_believers").select("*",{count:"exact",head:true}),
  supabase.from("sermons").select("*",{count:"exact",head:true}),
  supabase.from("events").select("*",{count:"exact",head:true})
 ]);
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Resumen ministerial</p><h1>Bienvenido, Pastor Gilberto</h1><div className="statGrid"><div className="stat"><strong>{requests??0}</strong><span>Solicitudes</span></div><div className="stat"><strong>{believers??0}</strong><span>Nuevos creyentes</span></div><div className="stat"><strong>{sermons??0}</strong><span>Predicaciones</span></div><div className="stat"><strong>{events??0}</strong><span>Eventos</span></div></div><div className="notice" style={{marginTop:30}}><strong>Supabase conectado</strong><p>Las solicitudes se guardan en la base de datos y continúan llegando por correo.</p></div></section></div>;
}
