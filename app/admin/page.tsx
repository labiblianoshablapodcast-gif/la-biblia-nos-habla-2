import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";

export default async function Admin(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();

 const [
  {count:requests},
  {count:believers},
  {count:sermons},
  {count:events},
  {count:devotionals},
  {count:donations},
  {data:recentRequests},
  {data:recentBelievers}
 ]=await Promise.all([
  supabase.from("prayer_requests").select("*",{count:"exact",head:true}),
  supabase.from("new_believers").select("*",{count:"exact",head:true}),
  supabase.from("sermons").select("*",{count:"exact",head:true}),
  supabase.from("events").select("*",{count:"exact",head:true}),
  supabase.from("devotionals").select("*",{count:"exact",head:true}),
  supabase.from("paypal_donations").select("*",{count:"exact",head:true}),
  supabase.from("prayer_requests").select("*").order("created_at",{ascending:false}).limit(5),
  supabase.from("new_believers").select("*").order("created_at",{ascending:false}).limit(5)
 ]);

 return <div className="adminShell adminShellPro">
  <AdminNav/>
  <main className="adminMain adminDashboard">
   <section className="adminWelcome">
    <div>
     <p className="eyebrow">Centro de administración</p>
     <h1>Bienvenido, Pastor Gilberto</h1>
     <small className="adminUserEmail">{user?.email}</small>
     <p>Administre el contenido y el seguimiento pastoral desde un solo lugar.</p>
    </div>
    <div className="adminQuickActions">
     <Link className="btn" href="/admin/predicaciones">Nueva predicación</Link>
     <Link className="btn secondaryDark" href="/admin/devocionales">Nuevo devocional</Link>
     <Link className="btn secondaryDark" href="/admin/eventos">Nuevo evento</Link>
    </div>
   </section>

   <section className="adminStatsPro">
    <Link href="/admin/peticiones"><strong>{requests??0}</strong><span>Peticiones</span></Link>
    <Link href="/admin/nuevos-creyentes"><strong>{believers??0}</strong><span>Nuevos creyentes</span></Link>
    <Link href="/admin/predicaciones"><strong>{sermons??0}</strong><span>Predicaciones</span></Link>
    <Link href="/admin/devocionales"><strong>{devotionals??0}</strong><span>Devocionales</span></Link>
    <Link href="/admin/eventos"><strong>{events??0}</strong><span>Eventos</span></Link>
    <Link href="/admin/donaciones"><strong>{donations??0}</strong><span>Donaciones</span></Link>
   </section>

   <section className="adminDashboardGrid">
    <article className="adminPanelCard">
     <div className="adminPanelHeader"><div><p className="eyebrow">Seguimiento</p><h2>Peticiones recientes</h2></div><Link href="/admin/peticiones">Ver todas →</Link></div>
     <div className="adminRecentList">
      {(recentRequests??[]).map(item=><div key={item.id}>
       <div><strong>{item.name||"Sin nombre"}</strong><span>{item.request_type||"Petición"}</span></div>
       <small>{item.created_at?new Date(item.created_at).toLocaleDateString("es-US"):""}</small>
      </div>)}
      {!recentRequests?.length&&<p>No hay peticiones recientes.</p>}
     </div>
    </article>

    <article className="adminPanelCard">
     <div className="adminPanelHeader"><div><p className="eyebrow">Discipulado</p><h2>Nuevos creyentes</h2></div><Link href="/admin/nuevos-creyentes">Ver todos →</Link></div>
     <div className="adminRecentList">
      {(recentBelievers??[]).map(item=><div key={item.id}>
       <div><strong>{item.full_name||"Sin nombre"}</strong><span>{item.status||"Nuevo"}</span></div>
       <small>{item.created_at?new Date(item.created_at).toLocaleDateString("es-US"):""}</small>
      </div>)}
      {!recentBelievers?.length&&<p>No hay registros recientes.</p>}
     </div>
    </article>
   </section>

   <section className="adminManagementGrid">
    <Link href="/admin/predicaciones"><span>🎙</span><h3>Predicaciones</h3><p>Publicar videos, audio, temas y textos bíblicos.</p></Link>
    <Link href="/admin/devocionales"><span>☀</span><h3>Devocionales</h3><p>Crear reflexiones y destacar el mensaje del día.</p></Link>
    <Link href="/admin/eventos"><span>📅</span><h3>Eventos</h3><p>Programar campañas, servicios y conferencias.</p></Link>
    <Link href="/admin/donaciones"><span>$</span><h3>Donaciones</h3><p>Consultar nombres, cantidades, fechas y estados de PayPal.</p></Link>
    <Link href="/admin/configuracion"><span>⚙</span><h3>Configuración</h3><p>Revisar conexiones, seguridad y estado del sistema.</p></Link>
   </section>
  </main>
 </div>;
}
