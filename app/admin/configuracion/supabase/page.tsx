import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";

export default async function SupabaseEstado(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  const {data:profile}=user
    ? await supabase.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle()
    : {data:null};

  const checks=[
    ["Variables de Vercel",Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)],
    ["Sesión iniciada",Boolean(user)],
    ["Perfil pastoral",Boolean(profile)],
    ["Permiso administrativo",Boolean(profile&&["pastor","secretary","media","treasurer"].includes(profile.role))]
  ];

  return <div className="adminShell adminShellPro">
    <AdminNav/>
    <main className="adminMain">
      <p className="eyebrow">Diagnóstico</p>
      <h1>Conexión con Supabase</h1>
      <p className="lead">Esta página confirma si el Centro Pastoral está listo para guardar contenido.</p>

      <div className="systemStatusGrid">
        {checks.map(([label,ok])=><article key={String(label)}>
          <span className={ok?"statusOk":"statusPending"}>{ok?"✓":"!"}</span>
          <div><h3>{label}</h3><p>{ok?"Configurado correctamente.":"Todavía necesita configuración."}</p></div>
        </article>)}
      </div>

      <div className="notice" style={{marginTop:30}}>
        <strong>Seguridad por responsabilidades</strong>
        <p>Después de confirmar Eventos, ejecute <code>ENDURECER_SEGURIDAD_SUPABASE.sql</code>. Esta actualización alinea Supabase con los permisos del Panel Pastoral y protege las fotografías para que cada colaborador administre únicamente sus propios archivos.</p>
        <ol>
          <li>Abra la actualización de seguridad.</li>
          <li>Copie todo el archivo y ejecútelo en Supabase → SQL Editor.</li>
          <li>Confirme que el resultado diga <strong>Seguridad preparada correctamente</strong>.</li>
          <li>Cierre sesión y vuelva a entrar para renovar los permisos.</li>
        </ol>
        <a className="btn" href="https://github.com/labiblianoshablapodcast-gif/la-biblia-nos-habla-2/blob/main/ENDURECER_SEGURIDAD_SUPABASE.sql" target="_blank" rel="noreferrer">Abrir actualización de seguridad ↗</a>
      </div>

      <div className="notice" style={{marginTop:30}}>
        <strong>Reparación completa de Eventos</strong>
        <p>Ejecute nuevamente <code>ARREGLAR_EVENTOS_SUPABASE.sql</code> en Supabase → SQL Editor. La versión actual comprueba todas las columnas que utiliza el formulario y no borra eventos existentes.</p>
        <ol>
          <li>Abra el archivo actualizado con el botón de abajo.</li>
          <li>Copie todo su contenido.</li>
          <li>Péguelo en una consulta nueva de Supabase y presione <strong>Run</strong>.</li>
          <li>Confirme que el resultado muestre <strong>estructura_completa: true</strong>.</li>
          <li>Regrese a Eventos, actualice la página y vuelva a guardar.</li>
        </ol>
        <a className="btn" href="https://github.com/labiblianoshablapodcast-gif/la-biblia-nos-habla-2/blob/main/ARREGLAR_EVENTOS_SUPABASE.sql" target="_blank" rel="noreferrer">Abrir reparación completa ↗</a>
      </div>
    </main>
  </div>;
}
