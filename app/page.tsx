import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import {youtube} from "@/data/youtube";
import styles from "./home.module.css";

const quickLinks=[
 {icon:"▤",title:"Leer la Biblia",text:"Acceda a los libros y encuentre una palabra para hoy.",href:"/biblia",image:"/images/biblia-abierta-portada.png",alt:"Biblia abierta sobre una mesa"},
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
    {church.schedule.filter(item=>["Miércoles","Sábado","Domingo"].includes(item.day)).map(item=><article key={item.day}><span>▣</span><small>{item.day}</small><strong>{item.time}</strong></article>)}
   </div>
  </section>

  <section className={styles.mobileConnect} aria-label="Conéctate con nosotros">
   <h2>Conéctate con nosotros</h2>
   <div className={styles.connectGrid}>
    <a href={church.whatsappVideo} target="_blank" rel="noreferrer"><span className={styles.whatsappIcon}>☎</span><strong>Estudio bíblico</strong><small>Jueves 8–9 PM</small></a>
    <a href={youtube.ministry.videos} target="_blank" rel="noreferrer"><span className={styles.youtubeIcon}>▶</span><strong>Mensajes en YouTube</strong><small>Vea las enseñanzas</small></a>
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
