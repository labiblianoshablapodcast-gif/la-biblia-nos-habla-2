import Link from "next/link";
import styles from "@/app/shorts.module.css";

const playlistId="PL7LXVezFOYluNQg4KDx0RZ96kgBY9H8JU";
const playlistUrl=`https://www.youtube.com/playlist?list=${playlistId}`;

export default function PodcastEpisodes({home=false}:{home?:boolean}){
 return <section className={styles.section} aria-labelledby="podcast-episodes-heading" id="episodios">
  <header className={styles.header}>
   <div>
    <p className={styles.eyebrow}>LA BIBLIA NOS HABLA · PODCAST</p>
    <h2 id="podcast-episodes-heading">Último episodio</h2>
    <p>Vea el episodio más reciente o abra la lista del reproductor para escoger uno anterior.</p>
   </div>
   {home && <Link className={styles.allLink} href="/podcast#episodios">Ver episodios anteriores →</Link>}
  </header>
  <iframe
   title="Último episodio y lista de La Biblia Nos Habla"
   src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}`}
   style={{display:"block",width:"100%",maxWidth:900,aspectRatio:"16 / 9",minHeight:200,margin:"0 auto 18px",border:0,borderRadius:12,background:"#000"}}
   loading="lazy"
   referrerPolicy="strict-origin-when-cross-origin"
   allow="encrypted-media; picture-in-picture; web-share"
   allowFullScreen
  />
  <a className={styles.allLink} href={playlistUrl} target="_blank" rel="noopener noreferrer">Ver todos los episodios en YouTube ↗</a>
 </section>;
}
