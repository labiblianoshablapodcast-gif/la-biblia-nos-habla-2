import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";

const churchPhotos = [
 ["iglesia-congregacion-adorando.jpeg", "Congregación adorando unida"],
 ["iglesia-aniversario-familia.jpeg", "Celebración del aniversario de la iglesia"],
 ["iglesia-pastor-y-lideres.jpeg", "Pastor Gilberto junto a líderes de la iglesia"],
 ["iglesia-familias.jpeg", "Familias de nuestra congregación"],
 ["iglesia-hermanas.jpeg", "Hermanas de la Iglesia Príncipe de Paz"],
 ["iglesia-dia-de-las-madres.jpeg", "Celebración del Día de las Madres"],
 ["iglesia-servicio-de-oracion.jpeg", "Servicio de oración y adoración"],
 ["iglesia-grupo-ministerial.jpeg", "Grupo ministerial de la iglesia"],
 ["iglesia-aniversario-pastoral.jpeg", "Aniversario pastoral"],
 ["iglesia-biblia-nos-habla.png", "La Biblia Nos Habla desde Iglesia Príncipe de Paz"]
] as const;

export default function Iglesia(){
 return <>
  <section className="pageHero churchHero">
   <Image src="/images/iglesia-portada-congregacion.jpeg" alt="Congregación de la Iglesia Príncipe de Paz" fill priority sizes="100vw"/>
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

  <section className="section churchGallerySection">
   <div className="churchGalleryHeading">
    <p className="eyebrow">Nuestra familia de fe</p>
    <h2>Momentos de nuestra iglesia</h2>
    <p className="lead">Celebramos lo que Dios está haciendo entre nosotros: adoración, comunión, familia y servicio.</p>
   </div>
   <div className="churchPhotoGrid">
    {churchPhotos.map(([file, alt], index)=><figure className={index===0 || index===5 ? "churchPhotoFeatured" : undefined} key={file}>
     <Image src={`/images/${file}`} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"/>
     <figcaption>{alt}</figcaption>
    </figure>)}
   </div>
  </section>

  <section className="section dark virtualStudySection">
   <p className="eyebrow">Jueves · 8:00–9:00 PM</p>
   <h2>Estudio Bíblico Virtual</h2>
   <p>Participe por cámara mediante WhatsApp.</p>
   <a className="btn" href={church.whatsappVideo} target="_blank" rel="noopener noreferrer">Entrar al estudio <span aria-hidden="true">↗</span></a>
  </section>
 </>;
}
