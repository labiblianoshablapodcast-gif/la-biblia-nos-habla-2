'use client';

import Image from "next/image";
import {useEffect,useState} from "react";
import {createPortal} from "react-dom";

export default function MissionGallery({
  images,
  title
}:{
  images: readonly string[];
  title: string;
}){
  const [selected,setSelected]=useState<string|null>(null);

  useEffect(()=>{
    if(!selected)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow="hidden";
    const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setSelected(null)};
    window.addEventListener("keydown",close);
    return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",close)};
  },[selected]);

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

    {selected && createPortal(<div className="lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={()=>setSelected(null)}>
      <button className="lightboxClose" type="button" aria-label="Cerrar fotografía" autoFocus onClick={()=>setSelected(null)}>×</button>
      <div className="lightboxImage" onClick={event=>event.stopPropagation()}>
        <Image src={selected} alt={title} fill sizes="95vw"/>
      </div>
    </div>,document.body)}
  </>;
}
