import Link from "next/link";
import {youtube} from "@/data/youtube";

export default function Multimedia(){
  return <>
    <section className="pageHero multimediaHero">
      <p className="eyebrow">Centro multimedia 4.0</p>
      <h1>Predicaciones, podcast y transmisiones</h1>
      <p>Todo el contenido oficial del ministerio reunido en un solo lugar.</p>
    </section>

    <section className="section">
      <div className="mediaChannelGrid">
        <article className="mediaChannelCard">
          <span className="mediaPlay">▶</span>
          <p className="eyebrow">Canal ministerial</p>
          <h2>{youtube.ministry.name}</h2>
          <p>Podcast, estudios bíblicos, misiones y contenido para el crecimiento espiritual.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">Abrir canal</a>
            <a className="btn secondaryDark" href={youtube.ministry.videos} target="_blank" rel="noopener noreferrer">Videos</a>
            <a className="btn secondaryDark" href={youtube.ministry.shorts} target="_blank" rel="noopener noreferrer">Shorts</a>
          </div>
        </article>

        <article className="mediaChannelCard">
          <span className="mediaPlay">▶</span>
          <p className="eyebrow">Canal pastoral</p>
          <h2>{youtube.pastor.name}</h2>
          <p>Predicaciones, enseñanzas, testimonios y contenido del ministerio pastoral.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">Abrir canal</a>
            <a className="btn secondaryDark" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">Videos</a>
            <a className="btn secondaryDark" href={youtube.pastor.shorts} target="_blank" rel="noopener noreferrer">Shorts</a>
          </div>
        </article>
      </div>
    </section>

    <section className="section dark mediaLive">
      <p className="eyebrow">Transmisiones en vivo</p>
      <h2>Conéctese con nosotros</h2>
      <p>Abra directamente la página de transmisiones de cualquiera de los dos canales.</p>
      <div className="youtubeActions centered">
        <a className="btn" href={youtube.ministry.live} target="_blank" rel="noopener noreferrer">La Biblia Nos Habla en vivo</a>
        <a className="btn secondary" href={youtube.pastor.live} target="_blank" rel="noopener noreferrer">Pastor Gilberto en vivo</a>
      </div>
    </section>

    <section className="section mediaCategories">
      <p className="eyebrow">Explore por contenido</p>
      <h2>Todo el ministerio en video</h2>
      <div className="grid">
        <Link className="sectionCard" href="/predicaciones"><span>🎙️</span><h3>Predicaciones</h3><p>Mensajes y enseñanzas bíblicas.</p></Link>
        <Link className="sectionCard" href="/misiones"><span>🌎</span><h3>Misiones</h3><p>Videos y memorias de Guatemala.</p></Link>
        <Link className="sectionCard" href="/primeros-pasos"><span>🌱</span><h3>Discipulado</h3><p>Contenido para nuevos creyentes.</p></Link>
      </div>
    </section>
  </>;
}
