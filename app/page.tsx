import Link from "next/link";
import SectionCard from "@/components/SectionCard";

export default function Home() {
  return <>
    <section className="hero"><div>
      <p className="eyebrow">Plataforma Ministerial 2.0</p>
      <h1>La Palabra que transforma vidas.</h1>
      <p>Predicación, discipulado, Biblia completa, oración, misiones y cuidado pastoral desde la Iglesia Príncipe de Paz en Philadelphia.</p>
      <Link className="btn" href="/biblia">Leer la Biblia</Link>
      <Link className="btn secondary" href="/conexion">Necesito ayuda</Link>
    </div></section>

    <section className="section">
      <p className="eyebrow">Comience aquí</p><h2>Un lugar para crecer en Cristo</h2>
      <div className="grid">
        <SectionCard icon="📖" title="Biblia completa" description="Los 66 libros, navegación por capítulos y búsqueda." href="/biblia"/>
        <SectionCard icon="🌱" title="Primeros pasos" description="Estudio guiado del Evangelio de Juan." href="/primeros-pasos"/>
        <SectionCard icon="🎙️" title="Predicaciones" description="Mensajes, podcast y estudios bíblicos." href="/predicaciones"/>
        <SectionCard icon="🙏" title="Oración" description="Comparta su petición y reciba acompañamiento." href="/conexion"/>
        <SectionCard icon="🌎" title="Misiones" description="Cobán, Lanquín y el trabajo misionero." href="/misiones"/>
        <SectionCard icon="👤" title="Conozca al Pastor" description="Testimonio, llamado y cobertura ministerial." href="/pastor"/>
      </div>
    </section>

    <section className="section dark">
      <p className="eyebrow">Estudio bíblico virtual</p><h2>Jueves · 8:00–9:00 p.m.</h2>
      <p className="lead">Conéctese por videollamada de WhatsApp.</p>
      <a className="btn" target="_blank" href="https://call.whatsapp.com/video/qML9y0YBPzT4FX9A6eroEW">Entrar a la videollamada</a>
    </section>
  </>;
}
