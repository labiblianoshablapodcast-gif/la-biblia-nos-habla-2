import AdminNav from "@/components/AdminNav";

const checks=[
  ["GitHub conectado","Los cambios publicados en main llegan automáticamente a Vercel."],
  ["Vercel en producción","El sitio compila correctamente con Next.js."],
  ["Supabase conectado","Las variables públicas están configuradas en Vercel."],
  ["FormSubmit activo","Las solicitudes siguen llegando por correo electrónico."],
  ["Seguimiento pastoral","Las peticiones y decisiones por Cristo quedan registradas."]
];

export default function Configuracion(){
 return <div className="adminShell">
  <AdminNav/>
  <section className="adminMain">
    <p className="eyebrow">Estado de la plataforma</p>
    <h1>Configuración</h1>
    <div className="setupChecklist">
      {checks.map(([title,description])=><article key={title}>
        <span>✓</span>
        <div><strong>{title}</strong><p>{description}</p></div>
      </article>)}
    </div>
    <div className="notice" style={{marginTop:30}}>
      <strong>Último paso manual</strong>
      <p>Ejecute <code>supabase-2-7-security.sql</code> en el SQL Editor y cree su usuario pastoral en Authentication.</p>
    </div>
  </section>
 </div>;
}
