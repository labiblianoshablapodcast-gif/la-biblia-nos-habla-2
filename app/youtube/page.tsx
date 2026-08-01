import Link from "next/link";
import {youtube} from "@/data/youtube";

export default function YouTubePage(){
  return <>
    <section className="pageHero youtubeHero">
      <p className="eyebrow">Canales oficiales</p>
      <h1>YouTube</h1>
      <p>Acceda a los canales correctos del ministerio y del Pastor Gilberto Maldonado.</p>
    </section>

    <section className="section">
      <div className="youtubeChannelGrid">
        <article className="youtubeChannelCard">
          <div className="youtubeIcon">▶</div>
          <p className="eyebrow">Canal ministerial</p>
          <h2>{youtube.ministry.name}</h2>
          <p>{youtube.ministry.handle}</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">Abrir canal</a>
            <a className="btn secondaryDark" href={youtube.ministry.videos} target="_blank" rel="noopener noreferrer">Ver videos</a>
          </div>
        </article>

        <article className="youtubeChannelCard">
          <div className="youtubeIcon">▶</div>
          <p className="eyebrow">Canal pastoral</p>
          <h2>{youtube.pastor.name}</h2>
          <p>Enlace directo por ID oficial del canal.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">Abrir canal correcto</a>
            <a className="btn secondaryDark" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">Ver videos</a>
          </div>
        </article>
      </div>

      <div className="notice" style={{marginTop:30}}>
        <strong>Canal pastoral corregido</strong>
        <p>La plataforma ahora usa el ID estable del canal para evitar que YouTube abra una página vacía.</p>
      </div>
    </section>

    <section className="section dark youtubeLiveSection">
      <p className="eyebrow">Centro multimedia</p>
      <h2>Más contenido, en un solo lugar</h2>
      <Link className="btn" href="/multimedia">Abrir Centro Multimedia</Link>
    </section>
  </>;
}
