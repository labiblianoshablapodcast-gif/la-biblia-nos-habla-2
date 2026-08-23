import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import {youtube} from "@/data/youtube";
import styles from "./home.module.css";

const quickLinks=[
 {icon:"▤",title:"Leer la Biblia",text:"Acceda a los libros y encuentre una palabra para hoy.",href:"/biblia",image:"/images/biblia-abierta-portada.png",alt:"Biblia abierta sobre una mesa"},
 {icon:"☀",title:"Texto de hoy para meditar",text:"Vea el día, la fecha y el versículo preparado para hoy.",href:"/devocionales",image:"/images/biblia-abierta-portada.png",alt:"Biblia abierta para la meditación diaria"},
 {icon:"♢",title:"Pedir oración",text:"Comparta su necesidad con nuestro equipo pastoral.",href:"/conexion",image:"/images/manos-orando-conexion-v2.png",alt:"Manos unidas en oración"},
 {icon:"✦",title:"Nuevos creyentes",text:"Si aceptó a Cristo, queremos acompañarle en su próximo paso.",href:"/primeros-pasos",image:"/images/nuevos-creyentes-discipulado.jpg",alt:"Nuevo creyente leyendo la Biblia acompañado por un mentor cristiano"},
 {icon:"⌂",title:"Nuestra iglesia",text:"Conozca quiénes somos, nuestros horarios y ubicación.",href:"/iglesia",image:"/images/iglesia-principe-de-paz-congregacion.jpeg",alt:"Congregación de la Iglesia Príncipe de Paz"},
 {icon:"◎",title:"Misiones",text:"Vea cómo compartimos el Evangelio y servimos a comunidades.",href:"/misiones",image:"/images/misiones/lanquin-2026-comunidad-02.jpg",alt:"Comunidad reunida durante la misión en Lanquín"}
];

export default function Home(){
 return <main className={styles.home}>
  <section className={styles.hero}>
   <div className={styles.heroPortrait}><Image className={styles.heroImage} src="/images/pastor-y-yudelka-hero-v2.png" alt="Pastores Gilberto y Yudelka Maldonado" fill priority sizes="100vw"/></div>
   <div className={styles.heroOverlay}/>
   <div className={styles.heroContent}>
    <p className={styles.eyebrow}>BIENVENIDO A LA BIBLIA NOS HABLA</p>
    <h1>Una palabra de esperanza<br/>para su vida.</h1>
    <p>Aquí encontrará la Biblia, enseñanza, misiones y una iglesia donde será bienvenido.</p>
    <p className={styles.pastorNames}>Pastores Gilberto y Yudelka Maldonado</p>
    <div className={styles.heroActions}>
     <Link className={styles.goldButton} href="/biblia">▤&nbsp; Leer la Biblia</Link>
     <Link className={styles.outlineButton} href="/conexion">♢&nbsp; Necesito oración</Link>
    </div>
   </div>
  </section>

  <section className={styles.mobileChurchCard} aria-label="Información de la iglesia">
   <span className={styles.mobilePin}>●</span>
   <h2>Iglesia Príncipe de Paz</h2>
   <a href={church.mapsUrl} target="_blank" rel="noreferrer">{church.address}</a>
   <div className={styles.mobileSchedule}>
    {church.schedule.filter(item=>["Miércoles","Sábado","Domingo"].includes(item.day)).map(item=><article key={item.day}><span className={styles.scheduleClock} aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.25 2"/></svg></span><small>{item.day}</small><strong>{item.time}</strong></article>)}
   </div>
  </section>

  <section className={styles.mobileConnect} aria-label="Conéctate con nosotros">
   <h2>Conéctate con nosotros</h2>
   <div className={styles.connectGrid}>
    <a className={styles.studyAction} href={church.whatsappVideo} target="_blank" rel="noopener noreferrer" aria-label="Participar en el estudio bíblico virtual">
     <span className={styles.connectIcon} aria-hidden="true"><svg viewBox="0 0 48 48" role="img"><path d="M8 11.5c6.2-2.1 11.6-1.2 16 2.6 4.4-3.8 9.8-4.7 16-2.6v25.2c-6-1.9-11.3-1-16 2.7-4.7-3.7-10-4.6-16-2.7V11.5Z"/><path d="M24 14.1v25.3M13 18c3.2-.6 5.8-.1 8 1.4M27 19.4c2.2-1.5 4.8-2 8-1.4M13 24c3.2-.6 5.8-.1 8 1.4M27 25.4c2.2-1.5 4.8-2 8-1.4"/></svg></span>
     <span className={styles.connectCopy}><small>JUEVES · 8:00–9:00 PM</small><strong>Estudio bíblico virtual</strong><b>Participar por WhatsApp <span aria-hidden="true">→</span></b></span>
    </a>
    <a className={styles.youtubeAction} href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer" aria-label="Ver los mensajes pastorales en YouTube">
     <span className={styles.youtubeLogo} aria-hidden="true"><svg viewBox="0 0 68 48" role="img"><path d="M66.5 7.6a8.5 8.5 0 0 0-6-6C55.2 0 34 0 34 0S12.8 0 7.5 1.6a8.5 8.5 0 0 0-6 6C0 12.9 0 24 0 24s0 11.1 1.5 16.4a8.5 8.5 0 0 0 6 6C12.8 48 34 48 34 48s21.2 0 26.5-1.6a8.5 8.5 0 0 0 6-6C68 35.1 68 24 68 24s0-11.1-1.5-16.4Z"/><path className={styles.youtubePlay} d="m27 34 18-10-18-10v20Z"/></svg></span>
     <span className={styles.connectCopy}><small>CANAL PASTORAL</small><strong>Mensajes en YouTube</strong><b>Ver las enseñanzas <span aria-hidden="true">→</span></b></span>
    </a>
   </div>
   <blockquote>“Tu palabra es lámpara a mis pies” <cite>— Salmo 119:105</cite></blockquote>
  </section>

  <section className={styles.quickGrid} aria-label="Accesos principales">
   {quickLinks.map(item=><Link className={styles.quickCard} href={item.href} key={item.href}>
    <div className={styles.cardImage}><Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 17vw"/></div>
    <div className={styles.cardCopy}>
     <h2><span>{item.icon}</span>{item.title}</h2>
     <p>{item.text}</p><b aria-hidden="true">→</b>
    </div>
   </Link>)}
  </section>

  <section className={styles.churchPanel}>
   <a className={styles.locationCard} href={church.mapsUrl} target="_blank" rel="noreferrer" aria-label="Abrir la ubicación de Iglesia Príncipe de Paz en Google Maps">
    <span className={styles.locationPin}>⌖</span>
    <small>VISÍTENOS</small>
    <h2>Iglesia<br/>Príncipe de Paz</h2>
    <strong>{church.address}</strong>
    <b>Ver dirección en Google Maps&nbsp; →</b>
   </a>
   <div className={styles.schedulePanel}>
    <div className={styles.churchTitle}><span>⌂</span><div><small>IGLESIA</small><h2>Príncipe de Paz</h2><p>Philadelphia, Pennsylvania</p></div></div>
    <h3>HORARIO DE SERVICIOS</h3>
    <div className={styles.scheduleGrid}>{church.schedule.map(item=><article key={item.day}><span>▣</span><div><strong>{item.day}</strong><b>{item.time}</b><small>{item.title}</small></div></article>)}</div>
   </div>
   <address className={styles.contactPanel}>
    <div><span>✉</span><p><small>CORREO ELECTRÓNICO</small><a href={`mailto:${church.email}`}>{church.email}</a></p></div>
    <div><span>♢</span><p><small>¿NECESITA ORACIÓN?</small><Link href="/conexion">Envíe su petición</Link></p></div>
   </address>
  </section>
 </main>;
}
