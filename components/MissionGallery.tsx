'use client';

import Image from "next/image";
import {useState} from "react";

export default function MissionGallery({
  images,
  title
}:{
  images: readonly string[];
  title: string;
}){
  const [selected,setSelected]=useState<string|null>(null);

  return <>
    <div className="missionGallery">
      {images.map((src,index)=>(
        <button
          className={index%7===0 ? "galleryItem featured" : "galleryItem"}
          key={src}
          onClick={()=>setSelected(src)}
          aria-label={`Abrir fotografía ${index+1} de ${title}`}
        >
          <Image src={src} alt={`${title} — fotografía ${index+1}`} fill sizes="(max-width: 700px) 100vw, 33vw"/>
        </button>
      ))}
    </div>

    {selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}>
      <button className="lightboxClose" onClick={()=>setSelected(null)}>×</button>
      <div className="lightboxImage" onClick={event=>event.stopPropagation()}>
        <Image src={selected} alt={title} fill sizes="95vw"/>
      </div>
    </div>}
  </>;
}
