import AdminNav from "@/components/AdminNav";

const checks=[
 ["GitHub","Repositorio conectado y actualizaciones automáticas."],
 ["Vercel","Despliegue automático de la rama main."],
 ["Dominio","labiblianoshabla.org conectado al proyecto."],
 ["Supabase","Base de datos, autenticación, fotos y seguimiento pastoral."],
 ["YouTube","Canal pastoral conectado."],
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
    <strong>Activación única del administrador de contenido</strong>
    <p>Ejecute una sola vez el archivo <code>supabase-content-manager.sql</code> en el editor SQL de Supabase. Esto crea la biblioteca de fotos, activa las imágenes de eventos y prepara los permisos del equipo.</p>
   </div>
   <div className="notice" style={{marginTop:18}}>
    <strong>Seguridad</strong>
    <p>El panel solamente permite entrar a personas autenticadas con un rol de trabajo. Solo el Pastor puede invitar usuarios o cambiar permisos.</p>
   </div>
  </main>
 </div>;
}
