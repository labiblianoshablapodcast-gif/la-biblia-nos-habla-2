import Link from "next/link";
import {youtube} from "@/data/youtube";

export default function YouTubePage(){
  return <>
    <section className="pageHero youtubeHero">
      <p className="eyebrow">Centro multimedia</p>
      <h1>YouTube</h1>
      <p>Predicaciones, estudios, podcast, misiones y contenido pastoral en nuestros canales oficiales.</p>
    </section>

    <section className="section">
      <div className="youtubeChannelGrid">
        <article className="youtubeChannelCard">
          <div className="youtubeIcon">▶</div>
          <p className="eyebrow">Canal ministerial</p>
          <h2>La Biblia Nos Habla</h2>
          <p>Podcast, estudios bíblicos, mensajes y contenido para fortalecer la fe.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.ministryUrl} target="_blank" rel="noopener noreferrer">Abrir canal</a>
            <a className="btn secondaryDark" href={youtube.ministryVideosUrl} target="_blank" rel="noopener noreferrer">Ver videos</a>
          </div>
        </article>

        <article className="youtubeChannelCard">
          <div className="youtubeIcon">▶</div>
          <p className="eyebrow">Canal pastoral</p>
          <h2>Pastor Gilberto Maldonado</h2>
          <p>Predicaciones, enseñanzas, testimonios y contenido del ministerio pastoral.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.pastorUrl} target="_blank" rel="noopener noreferrer">Abrir canal</a>
            <a className="btn secondaryDark" href={youtube.pastorVideosUrl} target="_blank" rel="noopener noreferrer">Ver videos</a>
          </div>
        </article>
      </div>
    </section>

    <section className="section dark youtubeLiveSection">
      <p className="eyebrow">Transmisiones</p>
      <h2>Conéctese en vivo</h2>
      <p>Cuando haya una transmisión activa, puede abrir directamente la página en vivo de cada canal.</p>
      <div className="youtubeActions centered">
        <a className="btn" href={youtube.ministryLiveUrl} target="_blank" rel="noopener noreferrer">La Biblia Nos Habla en vivo</a>
        <a className="btn secondary" href={youtube.pastorLiveUrl} target="_blank" rel="noopener noreferrer">Pastor Gilberto en vivo</a>
      </div>
    </section>

    <section className="section youtubeHelp">
      <p className="eyebrow">Manténgase conectado</p>
      <h2>Suscríbase y comparta</h2>
      <p className="lead">Cada suscripción, comentario y video compartido ayuda a que el mensaje del Evangelio alcance a más personas.</p>
      <Link className="textLink" href="/predicaciones">Explorar predicaciones →</Link>
    </section>
  </>;
}
