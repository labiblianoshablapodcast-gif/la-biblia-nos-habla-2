import Image from "next/image";
import {getYouTubeThumbnail} from "@/lib/youtube";

type MediaItem={
  id:number|string;
  title:string;
  description?:string|null;
  media_type:string;
  category?:string|null;
  series_name?:string|null;
  scripture?:string|null;
  media_url:string;
  thumbnail_url?:string|null;
  featured?:boolean|null;
};

const labels:Record<string,string>={
  video:"Video",
  audio:"Audio",
  podcast:"Podcast",
  live:"En vivo",
  short:"Short"
};

export default function MediaCard({item}:{item:MediaItem}){
  const thumbnail=item.thumbnail_url || getYouTubeThumbnail(item.media_url);

  return <article className={`mediaLibraryCard ${item.featured?"mediaFeatured":""}`}>
    <a className="mediaLibraryImage" href={item.media_url} target="_blank" rel="noopener noreferrer">
      {thumbnail
        ? <Image src={thumbnail} alt={item.title} fill sizes="(max-width: 800px) 100vw, 33vw"/>
        : <div className="mediaLibraryPlaceholder"><span>{item.media_type==="audio"?"♫":"▶"}</span></div>}
      <span className="mediaTypeBadge">{labels[item.media_type]||"Multimedia"}</span>
      <span className="mediaPlayButton">▶</span>
    </a>

    <div className="mediaLibraryCopy">
      <small>{item.category||"Contenido ministerial"}{item.series_name?` · ${item.series_name}`:""}</small>
      <h2>{item.title}</h2>
      {item.scripture&&<blockquote>{item.scripture}</blockquote>}
      {item.description&&<p>{item.description}</p>}
      <a className="textLink" href={item.media_url} target="_blank" rel="noopener noreferrer">
        {item.media_type==="audio"||item.media_type==="podcast"?"Escuchar ahora":"Reproducir ahora"} →
      </a>
    </div>
  </article>;
}
