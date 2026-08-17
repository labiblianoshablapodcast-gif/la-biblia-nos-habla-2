import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {church} from "@/data/church";
import styles from "./eventos.module.css";

const shortDays=[
 {day:"Mié",time:"8:00 PM",label:"Adoración"},
 {day:"Jue",time:"8:00 PM",label:"Estudio bíblico"},
 {day:"Sáb",time:"8:00 PM",label:"Adoración"},
 {day:"Dom",time:"10:00 AM",label:"Servicio principal"}
];

export default async function Eventos(){
 const supabase=await createClient();
 const {data}=await supabase.from("events").select("*").eq("published",true).order("starts_at",{ascending:true}).limit(12);
 return <>
  <section className={styles.hero}>
   <div className={styles.heroGlow}/>
   <div className={styles.heroInner}>
    <div className={styles.heroCopy}>
     <p className="eyebrow">Calendario ministerial</p>
     <h1>Servicios y próximos eventos</h1>
     <p>Conozca las reuniones semanales y actividades especiales.</p>
     <a href="#calendario">Ver horarios <span aria-hidden="true">↓</span></a>
    </div>
    <div className={styles.calendarVisual} aria-label="Resumen de nuestros servicios semanales">
     <div className={styles.calendarTop}>
      <div><small>Esta semana</small><strong>Nos reunimos para adorar</strong></div>
      <span className={styles.calendarMark}>✦</span>
     </div>
     <div className={styles.calendarGrid}>
      {shortDays.map((item,index)=><div className={index===3?styles.calendarDayFeatured:styles.calendarDay} key={item.day}>
       <span>{item.day}</span><strong>{item.time}</strong><small>{item.label}</small>
      </div>)}
     </div>
     <div className={styles.calendarFooter}><span>⌖</span><p><strong>Iglesia Príncipe de Paz</strong><small>Philadelphia, Pennsylvania</small></p></div>
    </div>
   </div>
  </section>

  <section id="calendario" className={`section ${styles.scheduleSection}`}>
   <div className={styles.sectionHeading}><div><p className="eyebrow">Cada semana</p><h2>Horarios regulares</h2></div><p>Hay un lugar para usted y su familia. Le esperamos para adorar, aprender y crecer juntos.</p></div>
   <div className="scheduleGrid">
    {church.schedule.map(item=><article className="scheduleCard" key={item.day}>
      <small>{item.day}</small><strong>{item.time}</strong><p>{item.title}</p>
    </article>)}
   </div>
  </section>

  <section className={`section soft ${styles.specialSection}`}>
   <div className={styles.sectionHeading}><div><p className="eyebrow">Próximamente</p><h2>Eventos especiales</h2></div><p>Celebraciones y actividades que fortalecen nuestra comunión y servicio.</p></div>
   <div className="eventPublicGrid">
    {(data??[]).map(event=><article className="eventPublicCard" key={event.id}>
      {event.image_url&&<img className="eventPublicImage" src={event.image_url} alt={event.title}/>} 
      <div className="eventPublicBody">
       <small>{event.starts_at ? new Date(event.starts_at).toLocaleString("es-US",{dateStyle:"long",timeStyle:"short",timeZone:"America/New_York"}) : "Fecha por confirmar"}</small>
       <h3>{event.title}</h3><p>{event.description}</p>{event.location&&<strong>⌖ {event.location}</strong>}
      </div>
    </article>)}
    {!data?.length&&<div className={styles.emptyEvent}>
     <div className={styles.emptyGraphic} aria-hidden="true"><span>✦</span><b>PRÓXIMO</b><i/></div>
     <div><p className="eyebrow">Calendario en preparación</p><h3>Muy pronto anunciaremos nuestra próxima actividad.</h3><p>Los servicios semanales continúan según el horario regular. También puede visitar la página de Iglesia para conocer nuestra congregación.</p><Link href="/iglesia">Conocer nuestra iglesia →</Link></div>
    </div>}
   </div>
  </section>
 </>;
}
