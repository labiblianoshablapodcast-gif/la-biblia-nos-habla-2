import Link from "next/link";
import {church} from "@/data/church";

export default function Iglesia(){
 return <>
  <section className="pageHero churchHero">
   <p className="eyebrow">Iglesia Príncipe de Paz</p>
   <h1>Un lugar para adorar, crecer y servir.</h1>
   <p>Le esperamos en Philadelphia. Toda persona es bienvenida.</p>
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
   <div>
    <p className="eyebrow">Visítenos</p>
    <h2>{church.address}</h2>
    <p>Abra la dirección en Google Maps para obtener instrucciones.</p>
    <div className="churchActions">
     <a className="btn" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Abrir Google Maps</a>
     <Link className="btn secondaryDark" href="/conexion">Planificar mi visita</Link>
    </div>
   </div>
   <div className="mapPlaceholder"><span>📍</span><strong>Philadelphia, Pennsylvania</strong><p>Iglesia Príncipe de Paz</p></div>
  </section>

  <section className="section dark virtualStudySection">
   <p className="eyebrow">Jueves · 8:00–9:00 PM</p>
   <h2>Estudio Bíblico Virtual</h2>
   <p>Participe por cámara mediante WhatsApp.</p>
   <a className="btn" href={church.whatsappVideo} target="_blank" rel="noopener noreferrer">Abrir llamada de WhatsApp</a>
  </section>
 </>;
}
