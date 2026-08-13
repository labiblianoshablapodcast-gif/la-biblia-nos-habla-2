import Link from "next/link";
import Image from "next/image";
import BibleHomeClient from "@/components/BibleHomeClient";
import {books} from "@/lib/bible";
import styles from "./biblia.module.css";

const johnPlan=[
 "Jesús, la Palabra de vida","El primer milagro","Nacer de nuevo","Agua viva","El Hijo que da vida","Jesús, el Pan de vida","Ríos de agua viva",
 "La luz del mundo","Ojos abiertos por la fe","El Buen Pastor","La resurrección y la vida","Servir y seguir a Jesús","Amor que transforma","El camino, la verdad y la vida",
 "Permanecer en Cristo","La promesa del Espíritu Santo","Jesús ora por los suyos","El Rey ante Pilato","La cruz y el amor consumado","El Señor resucitado","Sígueme"
];

export default function BibliaPage(){
 const old=books.filter(b=>b.testament==="Antiguo Testamento");
 const fresh=books.filter(b=>b.testament==="Nuevo Testamento");
 return <main className={styles.page}>
  <section className={styles.hero}>
    <div className={styles.heroCopy}>
      <p className={styles.eyebrow}>Reina-Valera 1909 · Dominio público</p>
      <h1>Biblioteca Bíblica</h1>
      <p>Los 66 libros, 1,189 capítulos y herramientas personales para acompañar su lectura.</p>
      <div className={styles.heroDetails} aria-label="Información de la biblioteca">
        <span><strong>66</strong> libros</span>
        <span><strong>1,189</strong> capítulos</span>
      </div>
    </div>
    <div className={styles.heroImage}>
      <Image src="/images/biblia-abierta-portada.png" alt="Biblia abierta sobre una mesa" fill priority sizes="(max-width: 760px) 100vw, 48vw"/>
      <div className={styles.imageShade}/>
      <p>“Lámpara es a mis pies tu palabra.” <span>Salmos 119:105</span></p>
    </div>
  </section>

  <section className={styles.library}>
    <div className={styles.searchPanel}><BibleHomeClient/></div>
    <p className={styles.sourceNote}>Texto bíblico: Santa Biblia Reina-Valera 1909. Preparada para añadir RVR1960 cuando se obtenga autorización.</p>

    <section className={styles.studyPlan} aria-labelledby="john-plan-title">
      <div className={styles.planIntro}>
        <p>Plan de estudio · 21 días</p>
        <h2 id="john-plan-title">Conozca a Jesús en el Evangelio de Juan</h2>
        <span>Lea un capítulo cada día, medite en el tema central y permita que la Palabra transforme su vida.</span>
        <Link href="/biblia/juan/1">Comenzar el plan <b aria-hidden="true">→</b></Link>
      </div>
      <div className={styles.planDays}>
        {johnPlan.map((theme,index)=><Link key={theme} href={`/biblia/juan/${index+1}`}>
          <span>Día {String(index+1).padStart(2,"0")}</span>
          <strong>Juan {index+1}</strong>
          <small>{theme}</small>
        </Link>)}
      </div>
    </section>

    <div className={styles.sectionHeading}><p>39 libros</p><h2>Antiguo Testamento</h2></div>
    <div className={styles.bookGrid}>{old.map((b,index)=>
      <Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1`}>
        <span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span>
        <span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>)}
    </div>

    <div className={styles.sectionHeading}><p>27 libros</p><h2>Nuevo Testamento</h2></div>
    <div className={styles.bookGrid}>{fresh.map((b,index)=>
      <Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1`}>
        <span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span>
        <span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>)}
    </div>
  </section>
 </main>;
}
