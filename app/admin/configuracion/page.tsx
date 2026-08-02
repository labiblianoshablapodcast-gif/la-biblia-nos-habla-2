import AdminNav from "@/components/AdminNav";

const checks=[
 ["GitHub","Repositorio conectado y actualizaciones mediante Push origin."],
 ["Vercel","Despliegue automático de la rama main."],
 ["Dominio","labiblianoshabla.org conectado al proyecto nuevo."],
 ["Supabase","Base de datos, autenticación y seguimiento pastoral."],
 ["YouTube","Canales ministerial y pastoral conectados."],
 ["Aplicación","PWA preparada para iPhone y Android."]
];

export default function Configuracion(){
 return <div className="adminShell adminShellPro">
  <AdminNav/>
  <main className="adminMain">
   <p className="eyebrow">Estado del sistema</p>
   <h1>Configuración</h1>
   <div className="systemStatusGrid">
    {checks.map(([title,text])=><article key={title}><span>✓</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
   </div>
   <div className="notice" style={{marginTop:30}}>
    <strong>Seguridad</strong>
    <p>Solamente los usuarios autenticados con permisos pastorales deben acceder a este panel.</p>
   </div>
  </main>
 </div>;
}
