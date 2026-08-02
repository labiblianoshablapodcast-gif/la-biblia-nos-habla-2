import {youtube} from "@/data/youtube";

const platforms=[
  {name:"YouTube",description:"Predicaciones, estudios y episodios en video.",url:youtube.ministry.videos,icon:"▶"},
  {name:"Spotify",description:"Conecte aquí el enlace oficial del podcast.",url:process.env.NEXT_PUBLIC_SPOTIFY_URL,icon:"◉"},
  {name:"Apple Podcasts",description:"Conecte aquí el enlace oficial en Apple Podcasts.",url:process.env.NEXT_PUBLIC_APPLE_PODCASTS_URL,icon:"◌"},
  {name:"Amazon Music",description:"Conecte aquí el enlace oficial en Amazon Music.",url:process.env.NEXT_PUBLIC_AMAZON_MUSIC_URL,icon:"♫"}
];

export default function Podcast(){
 return <>
  <section className="pageHero podcastHero">
   <p className="eyebrow">Podcast La Biblia Nos Habla</p>
   <h1>La Palabra para escuchar dondequiera que esté.</h1>
   <p>Predicaciones, estudios y conversaciones para crecer en el conocimiento de Dios.</p>
  </section>

  <section className="section">
   <p className="eyebrow">Escuche en su plataforma preferida</p>
   <h2>Un mensaje. Diferentes maneras de recibirlo.</h2>
   <div className="podcastGrid">
    {platforms.map(platform=>(
      <article className="podcastCard" key={platform.name}>
       <span>{platform.icon}</span>
       <h3>{platform.name}</h3>
       <p>{platform.description}</p>
       {platform.url
        ? <a className="btn" href={platform.url} target="_blank" rel="noopener noreferrer">Abrir plataforma</a>
        : <span className="comingSoon">Enlace pendiente</span>}
      </article>
    ))}
   </div>
  </section>

  <section className="section dark podcastCallout">
   <p className="eyebrow">Contenido oficial</p>
   <h2>También puede ver todos los mensajes en YouTube</h2>
   <a className="btn" href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">Abrir La Biblia Nos Habla</a>
  </section>
 </>;
}
