import Link from "next/link";
import {youtube} from "@/data/youtube";

export default function YouTubePage(){
  return <>
    <section className="pageHero youtubeHero">
      <p className="eyebrow">Canal oficial</p>
      <h1>YouTube Pastoral</h1>
      <p>Predicaciones, estudios bíblicos, mensajes y contenido del Pastor Gilberto Maldonado.</p>
    </section>

    <section className="section">
      <div className="youtubeChannelGrid">
        <article className="youtubeChannelCard">
          <div className="youtubeIcon">▶</div>
          <p className="eyebrow">Canal pastoral</p>
          <h2>{youtube.pastor.name}</h2>
          <p>Acceda directamente al canal oficial y vea los mensajes más recientes.</p>
          <div className="youtubeActions">
            <a className="btn" href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">Abrir canal pastoral</a>
            <a className="btn secondaryDark" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">Ver videos</a>
          </div>
        </article>
      </div>
    </section>

    <section className="section dark youtubeLiveSection">
      <p className="eyebrow">Centro multimedia</p>
      <h2>Más contenido, en un solo lugar</h2>
      <Link className="btn" href="/multimedia">Abrir Centro Multimedia</Link>
    </section>
  </>;
}
