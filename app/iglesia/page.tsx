import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import {createClient} from "@/lib/supabase/server";
import styles from "./iglesia.module.css";

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

function eventDate(value:string|null){
 if(!value)return "Fecha por confirmar";
 return new Intl.DateTimeFormat("es-US",{dateStyle:"long",timeStyle:"short",timeZone:"America/New_York"}).format(new Date(value));
}

export default async function Iglesia(){
 const supabase=await createClient();
 const now=new Date().toISOString();
 const [{data:events},{data:eventPhotos}]=await Promise.all([
  supabase.from("events").select("id,title,description,location,starts_at,image_url").eq("published",true).gte("starts_at",now).order("starts_at",{ascending:true}).limit(6),
  supabase.from("gallery_items").select("id,title,alt_text,image_url,created_at").eq("published",true).ilike("category","evento%").order("created_at",{ascending:false}).limit(6)
 ]);
 const eventPhotoIds=new Set((events??[]).map(item=>item.image_url).filter(Boolean));
 const eventCards=[
  ...(events??[]).map(item=>({key:`event-${item.id}`,title:item.title,description:item.description||"Una ocasión especial para compartir como familia de fe.",meta:eventDate(item.starts_at),location:item.location,image:item.image_url})),
  ...(eventPhotos??[]).filter(item=>!eventPhotoIds.has(item.image_url)).map(item=>({key:`photo-${item.id}`,title:item.title,description:item.alt_text||"Un momento especial de nuestra iglesia.",meta:"Acontecimiento de la iglesia",location:null,image:item.image_url}))
 ].slice(0,6);

 return <>
  <section className={styles.hero} aria-label="Iglesia Príncipe de Paz">
   <div className={styles.heroPhoto}>
    <Image src="/images/iglesia-portada-congregacion-v2.png" alt="Congregación de la Iglesia Príncipe de Paz" fill priority sizes="100vw"/>
   </div>
   <div className={styles.heroShade}/>
   <div className={`${styles.heroCopy} ${styles.heroCopyDesktop}`}>
    <p className="eyebrow">Iglesia Príncipe de Paz</p>
    <span className={styles.heroRule}/>
    <h1>Un lugar para adorar, crecer y servir.</h1>
    <p>Le esperamos en Philadelphia. Toda persona es bienvenida.</p>
    <div className={styles.heroActions}>
     <a className="btn" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <span aria-hidden="true">↗</span></a>
     <a className={styles.heroTextLink} href="#eventos">Ver eventos ↓</a>
    </div>
   </div>
   <div className={styles.heroCopyMobile}>
    <p className={styles.mobileEyebrow}><span aria-hidden="true"/> Iglesia Príncipe de Paz</p>
    <span className={styles.heroRule}/>
    <h1>Un pueblo que camina hacia la <em>luz.</em></h1>
    <blockquote>“Se llamará su nombre: Admirable, Consejero, Dios Fuerte, Padre Eterno, Príncipe de Paz.” <cite>— Isaías 9:6</cite></blockquote>
    <p className={styles.mobileWelcome}>Un lugar para adorar, crecer y servir en comunidad. Toda persona es bienvenida, tal como es.</p>
    <div className={styles.campusGrid}>
     <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer"><strong>Philadelphia, PA</strong><span>3661 N Marvine St</span></a>
     <Link href="/iglesia-central-garfield"><strong>Garfield, NJ</strong><span>132 Palisade Ave · Conocer la sede central</span></Link>
    </div>
    <div className={styles.mobileActions}>
     <a className="btn" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <span aria-hidden="true">↗</span></a>
     <a href="#eventos">Ver eventos ↓</a>
    </div>
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

  <section id="eventos" className={styles.eventsSection}>
   <div className={styles.eventsHeading}>
    <div><p className="eyebrow">Vida de la iglesia</p><h2>Próximos eventos</h2></div>
    <div><p>Actividades, celebraciones y momentos especiales para crecer y compartir juntos.</p><Link href="/eventos">Ver calendario completo →</Link></div>
   </div>
   {eventCards.length>0?<div className={styles.eventsGrid}>
    {eventCards.map((event,index)=><article className={index===0?styles.eventFeatured:styles.eventCard} key={event.key}>
     {event.image?<img src={event.image} alt={event.title}/>:<div className={styles.eventPlaceholder} aria-hidden="true"><span>✦</span></div>}
     <div className={styles.eventBody}>
      <small>{event.meta}</small><h3>{event.title}</h3><p>{event.description}</p>
      {event.location&&<strong>⌖ {event.location}</strong>}
     </div>
    </article>)}
   </div>:<div className={styles.eventsEmpty}>
    <span>✦</span><div><strong>Nuevos eventos próximamente</strong><p>Mientras tanto, le esperamos en nuestros servicios semanales.</p></div>
   </div>}
  </section>

  <section className="section soft churchLocationSection">
   <div className="churchLocationCopy">
    <p className="eyebrow">Visítenos</p>
    <h2>Estamos en el corazón de Philadelphia.</h2>
    <address className="churchAddressCard">
     <span className="churchAddressMarker" aria-hidden="true">⌖</span>
     <span><small>Dirección de la iglesia</small><strong>{church.address}</strong><em>Iglesia Príncipe de Paz</em></span>
    </address>
    <p className="churchLocationNote">Consulte la ruta y el tiempo estimado de llegada antes de salir.</p>
    <div className="churchActions"><a className="btn" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Ver ruta <span aria-hidden="true">↗</span></a><Link className="btn secondaryDark" href="/conexion">Planificar visita</Link></div>
   </div>
   <div className="mapPlaceholder"><span aria-hidden="true">⌖</span><small>Philadelphia, Pennsylvania</small><strong>3661 N Marvine St</strong><p>Iglesia Príncipe de Paz</p></div>
  </section>

  <section className="section churchGallerySection">
   <div className="churchGalleryHeading"><p className="eyebrow">Nuestra familia de fe</p><h2>Momentos de nuestra iglesia</h2><p className="lead">Celebramos lo que Dios está haciendo entre nosotros: adoración, comunión, familia y servicio.</p></div>
   <div className="churchPhotoGrid">
    {churchPhotos.map(([file,alt],index)=><figure className={index===0||index===5?"churchPhotoFeatured":undefined} key={file}><Image src={`/images/${file}`} alt={alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"/><figcaption>{alt}</figcaption></figure>)}
   </div>
  </section>

  <section className="section dark virtualStudySection"><p className="eyebrow">Jueves · 8:00–9:00 PM</p><h2>Estudio Bíblico Virtual</h2><p>Participe por cámara mediante WhatsApp.</p><a className="btn" href={church.whatsappVideo} target="_blank" rel="noopener noreferrer">Entrar al estudio <span aria-hidden="true">↗</span></a></section>
 </>;
}
