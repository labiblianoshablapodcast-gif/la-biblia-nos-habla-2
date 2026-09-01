import Link from "next/link";
import Image from "next/image";
import BibleHomeClient from "@/components/BibleHomeClient";
import {books} from "@/lib/bible";
import {readerVersion,versionQuery} from "@/lib/bible-version";
import styles from "./biblia.module.css";
import "./mobile-readability.css";

export default async function BibliaPage({searchParams}:{searchParams:Promise<{version?:string}>}){
 const version=readerVersion((await searchParams).version);
 const suffix=versionQuery(version);
 const old=books.filter(b=>b.testament==="Antiguo Testamento");
 const fresh=books.filter(b=>b.testament==="Nuevo Testamento");
 return <main className={styles.page}>
  <section className={styles.hero}>
    <div className={styles.heroCopy}>
      <p className={styles.eyebrow}>RVR1960 · Q’eqchi’ · English ASV</p>
      <h1>Biblioteca Bíblica</h1>
      <p>La Palabra de Dios y herramientas para acompañar su lectura.</p>
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
    <nav className={styles.versionSwitcher} aria-label="Seleccionar versión de la Biblia o recursos Q’eqchi’">
      <Link className={`${styles.versionButton} ${version==="rvr60"?styles.versionActive:styles.versionInactive}`} aria-label="RVR1960 — Biblia en español" aria-current={version==="rvr60"?"page":undefined} href="/biblia">RVR1960</Link>
      <Link className={`${styles.versionButton} ${version==="qeqchi"?styles.versionActive:styles.versionInactive}`} aria-label="Q’eqchi’ — Li Santil Hu" aria-current={version==="qeqchi"?"page":undefined} href="/biblia?version=qeqchi">Q’eqchi’</Link>
      <Link className={`${styles.versionButton} ${styles.versionInactive}`} aria-label="Videos bíblicos en Q’eqchi’" href="/biblia/qeqchi-videos">▶ Videos Q’eqchi’</Link>
      <Link className={`${styles.versionButton} ${version==="asv"?styles.versionActive:styles.versionInactive}`} aria-label="ASV — Bible in English" aria-current={version==="asv"?"page":undefined} href="/biblia?version=asv">ASV</Link>
    </nav>
    <div className={styles.searchPanel}><BibleHomeClient version={version}/></div>
    <div className={styles.sourceNote}>
      <a href="https://biblia.com/" target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://api.biblia.com/v1/PoweredByBiblia_small.png" alt="Powered by Biblia"/>
      </a>
      <span>RVR1960 mediante <a href="https://biblia.com/" target="_blank" rel="noreferrer">Biblia.com</a> de Logos Bible Software. ASV en inglés mediante <a href="https://www.bible.com/versions/12-asv-american-standard-version" target="_blank" rel="noreferrer">YouVersion</a>. Li Santil Hu y recursos multimedia en Q’eqchi’ mediante Scripture Earth.</span>
    </div>

    <p><Link className="textLink" href="/estudios">¿Busca planes y preguntas? Ir a Estudios bíblicos →</Link></p>

    <div className={styles.sectionHeading}><p>39 libros</p><h2>Antiguo Testamento</h2></div>
    <div className={styles.bookGrid}>{old.map((b,index)=>
      <Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1${suffix}`}>
        <span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span>
        <span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>)}
    </div>

    <div className={styles.sectionHeading}><p>27 libros</p><h2>Nuevo Testamento</h2></div>
    <div className={styles.bookGrid}>{fresh.map((b,index)=>
      <Link className={styles.bookLink} key={b.slug} href={`/biblia/${b.slug}/1${suffix}`}>
        <span className={styles.bookNumber}>{String(index+1).padStart(2,"0")}</span>
        <span><strong>{b.name}</strong><small>{b.chapters} capítulos</small></span>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </Link>)}
    </div>
  </section>
 </main>;
}
