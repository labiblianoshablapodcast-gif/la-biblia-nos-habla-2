import Link from "next/link";
import Image from "next/image";
import BibleHomeClient from "@/components/BibleHomeClient";
import {books} from "@/lib/bible";
import styles from "./biblia.module.css";

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
