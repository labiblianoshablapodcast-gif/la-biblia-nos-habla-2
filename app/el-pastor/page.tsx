import Image from "next/image";
import styles from "./pastor.module.css";
import heritage from "./heritage.module.css";

export const metadata = { title: "Conozca al Pastor | La Biblia Nos Habla", description: "La historia y llamado ministerial del Pastor Gilberto Maldonado y Yudelka Maldonado." };

const photos = [
  ["gallery-01.jpg", "Pastor y Yudelka", "Pastor Gilberto y Yudelka Maldonado"],
  ["iglesia-principe-de-paz-congregacion.jpeg", "Ministerio", "Nuestra congregación y ministerio"],
  ["misiones/lanquin-2026-grupo-misionero.jpg", "Misiones", "Equipo misionero en Lanquín"],
  ["iglesia-familias.jpeg", "Familia", "Familias de nuestra congregación"],
  ["iglesia-dia-de-las-madres.jpeg", "Eventos", "Celebración especial en la iglesia"],
  ["iglesia-congregacion-adorando.jpeg", "Ministerio", "Alabanza y adoración"],
  ["misiones/lanquin-2026-culto-templo.jpg", "Misiones", "Culto misionero en Lanquín"],
  ["pastor-gilberto.jpg", "Pastor y Yudelka", "Un llamado compartido"]
];

export default function ElPastorPage() {
  return <>
    <section className={styles.hero}>
      <Image className={styles.heroImage} src="/images/pastor-y-yudelka-hero-v2.png" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" fill sizes="100vw" priority />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <p>CONOZCA AL PASTOR</p>
        <h1>Un testimonio<br/>de la <em>gracia de Dios.</em></h1>
        <span>Pastor Gilberto Maldonado y Yudelka Maldonado</span>
      </div>
    </section>

    <section className={styles.mobileHero}>
      <div className={styles.mobileHeroPhoto}>
       <Image src="/images/pastor-y-yudelka-hero-v2.png" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" fill sizes="100vw" priority />
       <div />
      </div>
      <div className={styles.mobileHeroCopy}>
       <p>CONOZCA AL PASTOR</p>
       <h1>Un testimonio de la <em>gracia de Dios.</em></h1>
       <span>Pastor Gilberto Maldonado y Yudelka Maldonado</span>
      </div>
    </section>

    <section className={styles.bio}><Image src="/images/pastor-gilberto.jpg" alt="Pastor Gilberto Maldonado y Yudelka Maldonado" width={1152} height={2048}/><div><p className={styles.eyebrow}>UN TESTIMONIO DE LA GRACIA DE DIOS</p><h2>Conozca al Pastor</h2><p>La historia del Pastor <b>Gilberto Maldonado</b> es un testimonio vivo del poder transformador de Jesucristo. Después de permanecer privado de libertad durante 17 años y medio, Dios cambió completamente su vida, dándole una nueva oportunidad, una nueva familia en la fe y un propósito eterno.</p><p>Al recuperar su libertad, comenzó a congregarse en la <b>Iglesia Internacional Príncipe de Paz</b>, donde fue recibido con amor por el <b>Pastor Rev. Rodolfo Solórzano</b> y su esposa <b>Masiel Solórzano</b>. Bajo su liderazgo pastoral encontró discipulado, restauración y crecimiento espiritual.</p><p>Con el tiempo sirvió fielmente en diferentes áreas del ministerio, especialmente como director del Ministerio de Alabanza, ministrando con el piano y el bajo para la gloria de Dios.</p><p>Reconociendo el llamado de Dios sobre su vida, el <b>Pastor Rev. Rodolfo Solórzano</b> lo discipuló, preparó y posteriormente lo ordenó al ministerio pastoral. Hoy continúa sirviendo bajo la cobertura espiritual de la <b>Iglesia Internacional Príncipe de Paz</b>, pastoreando la congregación en Filadelfia.</p><p>Junto a su esposa <b>Yudelka Maldonado</b>, dedica su vida a la predicación del Evangelio, al discipulado, a las misiones y al desarrollo del ministerio <b>La Biblia Nos Habla</b>, cuyo propósito es llevar la Palabra de Dios a miles de personas mediante la enseñanza bíblica y la tecnología.</p><blockquote><small>NUESTRO LLAMADO</small>“Servimos a Cristo porque Él transformó nuestras vidas, y ahora vivimos para que otros conozcan el poder del Evangelio.”</blockquote></div></section>

    <section className={heritage.section}><div className={heritage.photo}><Image src="/images/pastor-rodolfo-solorzano.webp" alt="Pastor Rev. Rodolfo Solórzano junto al Pastor Gilberto Maldonado" fill sizes="(max-width: 800px) 100vw, 45vw" /></div><div className={heritage.copy}><p>NUESTRA HERENCIA ESPIRITUAL</p><h2>Gratitud por un liderazgo fiel.</h2><p>Con profundo respeto y agradecimiento reconocemos el ministerio del Pastor Rev. Rodolfo Solórzano y de Masiel Solórzano. Su amor, consejo y discipulado han sido una parte importante del crecimiento espiritual y ministerial del Pastor Gilberto.</p><blockquote>“Honramos a quienes Dios ha usado para guiarnos, enseñarnos y afirmarnos en el llamado.”</blockquote><strong>Pastor Rev. Rodolfo Solórzano</strong><span>Iglesia Internacional Príncipe de Paz</span></div></section>

    <section className={styles.gallery}><p className={styles.eyebrow}>MOMENTOS QUE DAN TESTIMONIO</p><h2>Galería del ministerio</h2><div>{photos.map(([file, category, alt]) => <figure key={file}><Image src={`/images/${file}`} alt={alt} width={1600} height={1200}/><figcaption><b>{alt}</b><small>{category}</small></figcaption></figure>)}</div></section>
  </>;
}
