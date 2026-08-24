import Link from "next/link";
import Image from "next/image";
import BibleHomeClient from "@/components/BibleHomeClient";
import {books} from "@/lib/bible";
import styles from "./biblia.module.css";
import "./mobile-hero-refinement.css";

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
      <p className={styles.eyebrow}>Reina-Valera Revisada 1960 · Biblia.com</p>
      <h1>Biblioteca Bíblica</h1>
      <p>Los 66 libros, 1,189 capítulos y herramientas personales para acompañar su lectura.</p>
      <div className={styles.heroDetails} aria-label="Información de la biblioteca">
        <span><strong>66</strong> libros</span><span><strong>1,189</strong> capítulos</span>
      </div>
    </div>
    <div className={styles.heroImage}>
      <Image src="/images/biblia-abierta-portada.png" alt="Biblia abierta sobre una mesa" fill priority sizes="(max-width: 760px) 100vw, 48vw"/>
      <div className={styles.imageShade}/><p>“Lámpara es a mis pies tu palabra.” <span>Salmos 119:105</span></p>
    </div>
  </section>
  <section className={styles.library}>
    <div className={styles.searchPanel}><BibleHomeClient/></div>
    <div className={styles.sourceNote}><a href="https://biblia.com/" target="_blank" rel="noreferrer"><img src="https://api.biblia.com/v1/PoweredByBiblia_small.png" alt="Powered by Biblia"/></a><span>Texto bíblico: Reina-Valera Revisada 1960. Este sitio utiliza los servicios web de <a href="https://biblia.com/" target="_blank" rel="noreferrer">Biblia</a> de <a href="https://www.logos.com/" target="_blank" rel="noreferrer">Logos Bible Software</a>.</span></div>
    <section className={styles.studyPlan} aria-labelledby="daily-devotional-title"><div className={styles.planIntro}><p>Versículo de hoy</p><h2 id="daily-devotional-title">Texto de hoy para meditar</h2><span>Vea el día, la fecha y el texto bíblico preparado para su meditación.</span><Link href="/devocionales">Leer el texto de hoy <b aria-hidden="true">→</b></Link></div><div className={styles.planDays}>{[["Leer","La Palabra","Escuche lo que Dios quiere enseñarle"],["Meditar","La reflexión","Aplique la verdad a su vida"],["Orar","La respuesta","Termine hablando con el Señor"]].map(([step,title,description])=><Link key={step} href="/devocionales"><span>{step}</span><strong>{title}</strong><small>{description}</small></Link>)}</div></section>
    <section className={styles.studyPlan} aria-labelledby="qeqchi-title"><div className={styles.planIntro}><p>Nuevo · Idioma de Guatemala</p><h2 id="qeqchi-title">Biblia en Q’eqchi’</h2><span>Lea Li Santil Hu, el Nuevo Testamento en Q’eqchi’, directamente en nuestra biblioteca bíblica.</span><Link href="/biblia/mateo/1?version=qeqchi">Comenzar a leer <b aria-hidden="true">→</b></Link></div><div className={styles.planDays}>{[["Mateo","mateo","Li resil li Jesucristo"],["Marcos","marcos","Li chaq’rab sa’ Q’eqchi’"],["Juan","juan","Li A̱tin ut li yu’am"],["Hechos","hechos","Li c’anjel li iglesia"],["Romanos","romanos","Li pa̱ba̱l ut li rusilal"],["Apocalipsis","apocalipsis","Li xch’ool li colba-ib"]].map(([name,slug,description])=><Link key={slug} href={`/biblia/${slug}/1?version=qeqchi`}><span>Q’eqchi’</span><strong>{name}</strong><small>{description}</small></Link>)}</div></section>
    <section className={styles.studyPlan} aria-labelledby="dictionary-title"><div className={styles.planIntro}><p>Nuevo · Hebreo y griego</p><h2 id="dictionary-title">Diccionario bíblico</h2><span>Busque palabras importantes, vea el término original, su transliteración, significado y número Strong.</span><Link href="/diccionario">Abrir diccionario <b aria-hidden="true">→</b></Link></div><div className={styles.planDays}>{[["חֶסֶד","ḥésed","Misericordia fiel"],["χάρις","cháris","Gracia"],["שָׁלוֹם","shalóm","Paz integral"],["λόγος","lógos","Palabra"]].map(([original,transliteration,meaning])=><Link key={original} href={`/diccionario?q=${encodeURIComponent(transliteration)}`}><span>Palabra original</span><strong>{original}</strong><small>{transliteration} · {meaning}</small></Link>)}</div></section>
    <section className={styles.studyPlan} aria-labelledby="john-plan-title"><div className={styles.planIntro}><p>Plan de estudio · 21 días</p><h2 id="john-plan-title">Conozca a Jesús en el Evangelio de Juan</h2><span>Lea un capítulo cada día, medite en el tema central y permita que la Palabra transforme su vida.</span><Link href="/biblia/juan/1">Comenzar el plan <b aria-hidden="true">→</b></Link></div><div className={styles.planDays}>{johnPlan.map((theme,index)=><Link key={theme} href={`/biblia/juan/${index+1}`}><span>Día {String(index+1).padStart(2,"0")}</span><strong>Juan {index+1}</strong><small>{theme}</small></Link>)}</div></section>
    <div className={styles.sectionHeading}><p>39 libros</p><h2>Antiguo Testamento</h2></div><div className={styles.bookGrid}>{old.map((b,index)=><Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1`}><span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span><span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span><span className={styles.arrow} aria-hidden="true">→</span></Link>)}</div>
    <div className={styles.sectionHeading}><p>27 libros</p><h2>Nuevo Testamento</h2></div><div className={styles.bookGrid}>{fresh.map((b,index)=><Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1`}><span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span><span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span><span className={styles.arrow} aria-hidden="true">→</span></Link>)}</div>
  </section>
 </main>;
}
