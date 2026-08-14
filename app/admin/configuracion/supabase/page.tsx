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
    ["Permiso administrativo",Boolean(profile&&["leader","editor","admin","pastor"].includes(profile.role))]
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
        <strong>Archivo requerido</strong>
        <p>Ejecute una sola vez <code>supabase/002_centro_pastoral_8_0A.sql</code> en Supabase SQL Editor.</p>
        <p>Después cree su usuario en Authentication → Users y asígnele el rol <strong>pastor</strong> siguiendo las instrucciones incluidas.</p>
      </div>
    </main>
  </div>;
}
