import Image from "next/image";
import Link from "next/link";

const timeline = [
  {
    title: "Una vida alcanzada por la gracia",
    text: "Después de una juventud marcada por decisiones difíciles y años de encarcelamiento, Jesucristo transformó completamente mi vida. En el lugar donde muchos pensaban que todo había terminado, Dios comenzó una nueva historia."
  },
  {
    title: "Ministerio dentro de la prisión",
    text: "Durante aproximadamente diecisiete años y medio, el Señor me permitió servir como maestro bíblico, músico de capilla, consejero y pastor interino. Allí aprendí que ningún lugar está fuera del alcance de la gracia de Dios."
  },
  {
    title: "Servicio después de recuperar la libertad",
    text: "Al regresar a la sociedad, continué sirviendo al Señor, creciendo en la Palabra y colaborando en diferentes áreas de la iglesia: alabanza, enseñanza, medios, evangelismo y formación de discípulos."
  },
  {
    title: "Iglesia Internacional Príncipe de Paz",
    text: "Dios me abrió las puertas para servir en la Iglesia Internacional Príncipe de Paz, bajo el liderazgo del Rev. Rodolfo Solórzano. Allí recibí orientación, confianza y oportunidades que fortalecieron mi llamado ministerial."
  },
  {
    title: "Llamado pastoral",
    text: "Con el respaldo del liderazgo espiritual y la confirmación del Señor, fui ordenado al ministerio y posteriormente asumí la responsabilidad pastoral de la Iglesia Príncipe de Paz Philadelphia."
  },
  {
    title: "Misiones y enseñanza",
    text: "El Señor también ha permitido servir en misiones, predicar el Evangelio, fortalecer congregaciones y documentar la obra realizada en Guatemala, incluyendo Cobán 2022 y Lanquín 2026."
  }
];

export default function ElPastor(){
  return <>
    <section className="pastorHero">
      <div className="pastorHeroImage">
        <Image
          src="/images/pastor/pastor-gilberto.webp"
          alt="Pastor Gilberto Maldonado"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 48vw"
        />
      </div>
      <div className="pastorHeroCopy">
        <p className="eyebrow">Testimonio y trayectoria ministerial</p>
        <h1>Pastor Gilberto Maldonado</h1>
        <blockquote>“Por la gracia de Dios soy lo que soy.”</blockquote>
        <p>
          Una historia de redención, servicio y fidelidad al llamado de Jesucristo.
          El centro de este testimonio no es el hombre, sino el poder transformador
          de Dios.
        </p>
        <div className="pastorHeroActions">
          <a className="btn" href="#trayectoria">Ver trayectoria</a>
          <Link className="btn secondary" href="/misiones">Ver misiones</Link>
        </div>
      </div>
    </section>

    <section className="section pastorIntro">
      <p className="eyebrow">Rescatado con propósito</p>
      <h2>De la prisión al púlpito</h2>
      <p className="lead">
        Mi vida es testimonio de que Jesucristo puede levantar, restaurar y usar
        a una persona sin importar cuán oscuro haya sido su pasado.
      </p>
    </section>

    <section className="section pastorTimelineSection" id="trayectoria">
      <div className="pastorTimelineHeader">
        <p className="eyebrow">Trayectoria del ministerio</p>
        <h2>Una historia escrita por la gracia</h2>
      </div>

      <div className="pastorTimeline">
        {timeline.map((item,index)=>(
          <article className="pastorTimelineItem" key={item.title}>
            <div className="pastorTimelineNumber">{String(index+1).padStart(2,"0")}</div>
            <div className="pastorTimelineContent">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="section pastorVisualStory">
      <div className="pastorVisualCard">
        <div className="pastorVisualImage">
          <Image
            src="/images/pastor/ordenacion-ministerial.webp"
            alt="Ordenación y servicio ministerial"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="pastorVisualCopy">
          <p className="eyebrow">Llamado pastoral</p>
          <h2>Servir con fidelidad y humildad</h2>
          <p>
            El ministerio pastoral no es una posición para recibir reconocimiento,
            sino una responsabilidad para cuidar, enseñar, acompañar y servir al
            pueblo de Dios.
          </p>
        </div>
      </div>
    </section>

    <section className="section gratitudeSection">
      <div className="gratitudePhoto">
        <Image
          src="/images/pastor/pastor-gilberto-rev-solorzano.webp"
          alt="Rev. Rodolfo Solórzano junto al Pastor Gilberto Maldonado"
          fill
          sizes="(max-width: 900px) 100vw, 45vw"
        />
      </div>

      <div className="gratitudeCopy">
        <p className="eyebrow">Reconocimiento y gratitud</p>
        <h2>Rev. Rodolfo Solórzano y Pastora Masiel Solórzano</h2>

        <blockquote>
          “Acordaos de vuestros pastores, que os hablaron la palabra de Dios.”
          <span>Hebreos 13:7</span>
        </blockquote>

        <p>
          Expreso mi profundo agradecimiento al <strong>Rev. Rodolfo Solórzano</strong>
          y a su esposa, la <strong>Pastora Masiel Solórzano</strong>, por su liderazgo,
          confianza, consejo y amor por la obra de Dios.
        </p>

        <p>
          Gracias por abrirme las puertas para servir, por acompañarme durante mi
          formación ministerial y por continuar siendo una cobertura de bendición
          para mi vida, mi familia y la Iglesia Príncipe de Paz Philadelphia.
        </p>

        <p>
          Mi oración es que el Señor les recompense abundantemente, fortalezca sus
          vidas y les conceda muchos años más de servicio para la gloria de Jesucristo.
        </p>

        <div className="gratitudeSignature">
          <span>Con respeto y gratitud,</span>
          <strong>Pastor Gilberto Maldonado</strong>
        </div>
      </div>
    </section>

    <section className="section dark pastorMissionCall">
      <p className="eyebrow">La visión continúa</p>
      <h2>Predicar la Palabra. Formar discípulos. Servir a las personas.</h2>
      <p>
        Seguimos creyendo que ninguna vida está demasiado lejos para ser alcanzada
        por la gracia de Dios.
      </p>
      <Link className="btn" href="/contacto">Solicitar oración</Link>
    </section>
  </>;
}
