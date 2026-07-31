import sermons from "@/data/sermons.json";
export default function Predicaciones() {
 return <><section className="pageHero"><p className="eyebrow">Biblioteca ministerial</p><h1>Predicaciones y Podcast</h1><p>Busque enseñanzas por tema, texto bíblico o serie.</p></section>
 <section className="section"><input className="search" placeholder="Buscar mensaje..."/><div className="cardList">{sermons.map(s=><article className="contentCard" key={s.title}><small>{s.category} · {s.scripture}</small><h3>{s.title}</h3><p>Contenido preparado para conectarse al panel administrativo y al canal oficial.</p></article>)}</div></section></>;
}
