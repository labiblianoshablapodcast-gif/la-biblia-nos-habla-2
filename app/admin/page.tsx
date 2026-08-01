import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";

export default async function Admin(){
  const supabase=await createClient();

  const [
    {count:prayerCount},
    {count:resourceCount},
    {count:eventCount},
    {count:missionCount}
  ]=await Promise.all([
    supabase.from("prayer_requests").select("*",{count:"exact",head:true}),
    supabase.from("resources").select("*",{count:"exact",head:true}),
    supabase.from("events").select("*",{count:"exact",head:true}),
    supabase.from("missions").select("*",{count:"exact",head:true})
  ]);

  return <div className="adminShell">
    <AdminNav/>
    <section className="adminMain">
      <p className="eyebrow">Resumen ministerial</p>
      <h1>Bienvenido, Pastor Gilberto</h1>
      <div className="statGrid">
        <div className="stat"><strong>{prayerCount ?? 0}</strong><span>Peticiones</span></div>
        <div className="stat"><strong>{resourceCount ?? 0}</strong><span>Recursos</span></div>
        <div className="stat"><strong>{eventCount ?? 0}</strong><span>Eventos</span></div>
        <div className="stat"><strong>{missionCount ?? 0}</strong><span>Misiones</span></div>
      </div>
      <div className="notice" style={{marginTop:30}}>
        <strong>Panel conectado a Supabase</strong>
        <p>Cuando añada las variables de entorno y ejecute el esquema SQL, los contadores y registros funcionarán en vivo.</p>
      </div>
    </section>
  </div>;
}
