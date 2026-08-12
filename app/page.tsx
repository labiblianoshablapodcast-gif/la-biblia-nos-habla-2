import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import styles from "./home.module.css";

const quickLinks=[
 {icon:"▤",title:"Leer la Biblia",text:"Acceda a los libros y encuentre una palabra para hoy.",href:"/biblia",image:"/images/biblia-abierta-portada.png",alt:"Biblia abierta sobre una mesa"},
 {icon:"◉",title:"Ver predicaciones",text:"Escuche mensajes que edifican y fortalecen su fe.",href:"/predicaciones",image:"/images/pastor-gilberto.jpg",alt:"Pastor Gilberto Maldonado predicando"},
 {icon:"♢",title:"Pedir oración",text:"Comparta su necesidad con nuestro equipo pastoral.",href:"/conexion",image:"/images/gallery-05.jpg",alt:"Momento de oración"},
 {icon:"✦",title:"Nuevos creyentes",text:"Si aceptó a Cristo, queremos acompañarle en su próximo paso.",href:"/primeros-pasos",image:"/images/gallery-04.jpg",alt:"Personas compartiendo su fe"},
 {icon:"⌂",title:"Nuestra iglesia",text:"Conozca quiénes somos, nuestros horarios y ubicación.",href:"/iglesia",image:"/images/iglesia-principe-de-paz-congregacion.jpeg",alt:"Congregación de la Iglesia Príncipe de Paz"},
 {icon:"◎",title:"Misiones",text:"Vea cómo compartimos el Evangelio y servimos a comunidades.",href:"/misiones",image:"/images/misiones/lanquin-2026-comunidad-02.jpg",alt:"Comunidad reunida durante la misión en Lanquín"}
];

export default function Home(){
 return <main className={styles.home}>
  <section className={styles.hero}>
   <Image className={styles.heroImage} src="/images/pastor-y-yudelka-hero.jpg" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" fill priority sizes="100vw"/>
   <div className={styles.heroOverlay}/>
   <div className={styles.heroContent}>
    <p className={styles.eyebrow}>BIENVENIDO A LA BIBLIA NOS HABLA</p>
    <h1>Una palabra de esperanza<br/>para su vida.</h1>
    <p>Aquí encontrará la Biblia, predicaciones, misiones y una iglesia donde será bienvenido.</p>
    <div className={styles.heroActions}>
     <Link className={styles.goldButton} href="/biblia">▤&nbsp; Leer la Biblia</Link>
     <Link className={styles.outlineButton} href="/predicaciones">▶&nbsp; Ver el último mensaje</Link>
     <Link className={styles.outlineButton} href="/conexion">♢&nbsp; Necesito oración</Link>
    </div>
   </div>
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
