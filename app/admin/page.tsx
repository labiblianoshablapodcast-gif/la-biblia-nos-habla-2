import Link from "next/link";
const nav=["Inicio","Predicaciones","Podcast","Biblioteca","Devocionales","Misiones","Galería","Eventos","Miembros","Oración","Configuración"];
export default function Admin(){
 return <div className="adminShell"><aside className="adminNav"><h2>Panel Pastoral</h2>{nav.map(x=><Link href="#" key={x}>{x}</Link>)}</aside>
 <section className="adminMain"><p className="eyebrow">Panel Pastoral · Fase inicial</p><h1>Bienvenido, Pastor Gilberto</h1>
 <div className="statGrid"><div className="stat"><strong>0</strong><span>Peticiones nuevas</span></div><div className="stat"><strong>0</strong><span>Visitantes</span></div><div className="stat"><strong>4</strong><span>Predicaciones iniciales</span></div><div className="stat"><strong>2</strong><span>Misiones</span></div></div>
 <section className="adminActions"><h2>Publicación rápida</h2><div className="grid">
 <article className="contentCard"><h3>Nueva predicación</h3><p>Título, texto bíblico, descripción y enlace de YouTube.</p><button disabled>Disponible al conectar Supabase</button></article>
 <article className="contentCard"><h3>Nuevo devocional</h3><p>Versículo, reflexión, aplicación y oración.</p><button disabled>Disponible al conectar Supabase</button></article>
 <article className="contentCard"><h3>Nueva galería</h3><p>Crear álbum y cargar fotografías.</p><button disabled>Disponible al conectar Storage</button></article>
 </div></section>
 <div className="notice" style={{marginTop:30}}><strong>Siguiente conexión:</strong> Supabase Auth para proteger este panel y Supabase Database para publicar sin editar GitHub.</div></section></div>;
}
