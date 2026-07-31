import Link from "next/link";
export default function Admin(){
 return <div className="adminShell"><aside className="adminNav"><h2>Panel Pastoral</h2>{["Inicio","Predicaciones","Podcast","Biblioteca","Devocionales","Misiones","Galería","Eventos","Miembros","Oración","Configuración"].map(x=><Link href="#" key={x}>{x}</Link>)}</aside>
 <section className="adminMain"><p className="eyebrow">Prototipo administrativo</p><h1>Bienvenido, Pastor Gilberto</h1>
 <div className="statGrid"><div className="stat"><strong>0</strong><span>Peticiones nuevas</span></div><div className="stat"><strong>0</strong><span>Visitantes</span></div><div className="stat"><strong>0</strong><span>Recursos</span></div><div className="stat"><strong>0</strong><span>Eventos</span></div></div>
 <div className="notice" style={{marginTop:30}}><strong>Próximo paso:</strong> conectar Supabase para autenticación, base de datos, archivos y permisos por rol.</div></section></div>;
}
