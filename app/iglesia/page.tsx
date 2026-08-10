import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";

export default function Iglesia(){
 return <>
  <section className="pageHero churchHero">
   <Image src="/images/church-worship-hero.jpg" alt="Congregación reunida en una iglesia durante un servicio" fill priority sizes="100vw"/>
   <div className="churchHeroOverlay"></div>
   <div className="churchHeroContent">
    <p className="eyebrow">Iglesia Príncipe de Paz</p>
    <h1>Un lugar para adorar, crecer y servir.</h1>
    <p>Le esperamos en Philadelphia. Toda persona es bienvenida.</p>
   </div>
  </section>

  <section className="section churchScheduleSection">
   <div>
    <p className="eyebrow">Horarios semanales</p>
    <h2>Reúnase con nosotros</h2>
    <p className="lead">Cada servicio es una oportunidad para adorar a Dios y crecer juntos en la fe.</p>
   </div>
   <div className="scheduleGrid">
    {church.schedule.map(item=><article className="scheduleCard" key={item.day}>
      <small>{item.day}</small><strong>{item.time}</strong><p>{item.title}</p>
    </article>)}
   </div>
  </section>

  <section className="section soft churchLocationSection">
   <div className="churchLocationCopy">
    <p className="eyebrow">Visítenos</p>
    <h2>Estamos en el corazón de Philadelphia.</h2>
    <address className="churchAddressCard">
     <span className="churchAddressMarker" aria-hidden="true">⌖</span>
     <span>
      <small>Dirección de la iglesia</small>
      <strong>{church.address}</strong>
      <em>Iglesia Príncipe de Paz</em>
     </span>
    </address>
    <p className="churchLocationNote">Consulte la ruta y el tiempo estimado de llegada antes de salir.</p>
    <div className="churchActions">
     <a className="btn" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Ver ruta <span aria-hidden="true">↗</span></a>
     <Link className="btn secondaryDark" href="/conexion">Planificar visita</Link>
    </div>
   </div>
   <div className="mapPlaceholder"><span aria-hidden="true">⌖</span><small>Philadelphia, Pennsylvania</small><strong>3661 N Marvine St</strong><p>Iglesia Príncipe de Paz</p></div>
  </section>

  <section className="section dark virtualStudySection">
   <p className="eyebrow">Jueves · 8:00–9:00 PM</p>
   <h2>Estudio Bíblico Virtual</h2>
   <p>Participe por cámara mediante WhatsApp.</p>
   <a className="btn" href={church.whatsappVideo} target="_blank" rel="noopener noreferrer">Entrar al estudio <span aria-hidden="true">↗</span></a>
  </section>
 </>;
}
