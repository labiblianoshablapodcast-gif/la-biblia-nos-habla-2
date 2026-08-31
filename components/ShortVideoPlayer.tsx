import {getYouTubeId} from "@/lib/youtube";
import styles from "./ShortVideoPlayer.module.css";

type Props={
  url:string;
  title:string;
  poster?:string|null;
};

export default function ShortVideoPlayer({url,title,poster}:Props){
  const youtubeId=getYouTubeId(url);

  if(youtubeId){
    return <div className={styles.frame}>
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
      />
    </div>;
  }

  return <div className={styles.frame}>
    <video controls playsInline preload="metadata" poster={poster||undefined}>
      <source src={url}/>
      Su navegador no puede reproducir este video.
    </video>
  </div>;
}
