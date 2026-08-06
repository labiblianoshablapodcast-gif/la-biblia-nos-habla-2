import Image from "next/image";
import Link from "next/link";
import { church } from "@/data/church";
import { youtube } from "@/data/youtube";
import styles from "./home.module.css";

const paths = [
  { number: "01", title: "Leer la Biblia", text: "La Palabra de Dios, capítulo por capítulo.", href: "/biblia" },
  { number: "02", title: "Escuchar un mensaje", text: "Predicaciones que fortalecen la fe.", href: "/predicaciones" },
  { number: "03", title: "Pedir oración", text: "Un equipo dispuesto a orar con usted.", href: "/conexion" }
];

export default function Home() {
  return <>
    <section className={styles.hero}>
      <div className={styles.heroImage}>
        <Image src="/images/pastor-y-yudelka-hero.jpg" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" fill priority sizes="100vw" />
      </div>
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <p className={styles.kicker}>IGLESIA PRÍNCIPE DE PAZ · PHILADELPHIA</p>
        <h1>Una palabra de<br /><em>esperanza</em> para hoy.</h1>
        <p className={styles.heroText}>Una comunidad para conocer a Cristo, crecer en Su Palabra y servir con propósito.</p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryButton} href="/biblia">Explorar la Biblia <span>→</span></Link>
          <Link className={styles.textButton} href="/conexion">Solicitar oración</Link>
        </div>
      </div>
      <div className={styles.heroNote}><span>LA BIBLIA NOS HABLA</span><small>Fe · Palabra · Comunidad</small></div>
    </section>

    <section className={styles.intro}>
      <p className={styles.kicker}>UN LUGAR PARA COMENZAR</p>
      <div className={styles.introRow}><h2>Encuentre el próximo<br />paso en su fe.</h2><p>No importa dónde se encuentre en su caminar: aquí encontrará recursos, una comunidad y una palabra de esperanza para su vida.</p></div>
      <div className={styles.pathGrid}>{paths.map((path) => <Link href={path.href} className={styles.pathCard} key={path.href}><span>{path.number}</span><h3>{path.title}</h3><p>{path.text}</p><b>Descubrir <i>→</i></b></Link>)}</div>
    </section>

    <section className={styles.feature}>
      <div className={styles.featureImage}><Image src="/images/ministry-team.jpg" alt="Congregación reunida en la iglesia" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
      <div className={styles.featureCopy}><p className={styles.kicker}>UNA IGLESIA QUE SIRVE</p><h2>Fe que se vive<br />más allá de las paredes.</h2><p>Predicamos el Evangelio, formamos discípulos y acompañamos a las familias con el amor de Cristo.</p><Link href="/misiones" className={styles.inlineLink}>Conozca nuestras misiones <span>→</span></Link></div>
    </section>

    <section className={styles.schedule}>
      <div><p className={styles.kicker}>ESTA SEMANA</p><h2>Le esperamos.</h2><p>Venga como está. Será recibido con amor y respeto.</p><a href={church.mapsUrl} target="_blank" rel="noreferrer" className={styles.inlineLink}>Cómo llegar <span>→</span></a></div>
      <div className={styles.scheduleList}>{church.schedule.map((item) => <article key={item.day}><span>{item.day}</span><strong>{item.time}</strong><p>{item.title}</p></article>)}</div>
    </section>

    <section className={styles.pastor}>
      <div className={styles.pastorCopy}><p className={styles.kicker}>CONOZCA A SUS PASTORES</p><h2>Una historia<br />de gracia.</h2><p>Conozca el testimonio del Pastor Gilberto Maldonado y Yudelka Maldonado: una vida transformada por Cristo y dedicada a servir.</p><Link href="/el-pastor" className={styles.primaryButton}>Conozca al Pastor <span>→</span></Link></div>
      <div className={styles.pastorImage}><Image src="/images/gallery-01.jpg" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
    </section>

    <section className={styles.message}>
      <p className={styles.kicker}>RECURSOS PARA SU CAMINAR</p><h2>La Palabra permanece.</h2><p>Escuche una predicación, comparta una petición de oración o dé el primer paso hacia Jesús.</p>
      <div className={styles.messageActions}><a className={styles.primaryButton} href={youtube.pastor.videos} target="_blank" rel="noreferrer">Ver predicaciones <span>→</span></a><Link className={styles.textButton} href="/primeros-pasos">Primeros pasos con Jesús</Link></div>
    </section>
  </>;
}
