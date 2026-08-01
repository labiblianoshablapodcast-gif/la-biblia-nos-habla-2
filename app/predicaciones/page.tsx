import sermons from "@/data/sermons.json";
import {youtube} from "@/data/youtube";

export default function Predicaciones() {
 return <>
  <section className="pageHero">
    <p className="eyebrow">Biblioteca ministerial</p>
    <h1>Predicaciones y Podcast</h1>
    <p>Mensajes organizados por tema y conectados con nuestros canales oficiales de YouTube.</p>
  </section>

  <section className="section">
    <div className="predicationTopActions">
      <a className="btn" href={youtube.ministry.videos} target="_blank" rel="noopener noreferrer">Ver canal La Biblia Nos Habla</a>
      <a className="btn secondaryDark" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">Ver canal Pastor Gilberto</a>
    </div>

    <input className="search" placeholder="Buscar mensaje..."/>

    <div className="cardList">
      {sermons.map((s,index)=><article className="contentCard sermonYoutubeCard" key={s.title}>
        <div className="sermonYoutubeBadge">YouTube</div>
        <small>{s.category} · {s.scripture}</small>
        <h3>{s.title}</h3>
        <p>Escuche este tema y explore más predicaciones en nuestros canales oficiales.</p>
        <a
          className="textLink"
          href={index % 2 === 0 ? youtube.ministry.videos : youtube.pastor.videos}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver en YouTube →
        </a>
      </article>)}
    </div>
  </section>;
 </>
}
