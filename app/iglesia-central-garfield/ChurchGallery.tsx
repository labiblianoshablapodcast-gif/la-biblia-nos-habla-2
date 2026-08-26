"use client";

import {useEffect, useState} from "react";
import media from "./garfield-media.module.css";
import refine from "./garfield-refinement.module.css";

const photos=[
 {className:media.photoExterior,label:"Edificio de Iglesia Cristiana Príncipe de Paz",caption:"Nuestra iglesia en Garfield"},
 {className:media.photoWorship,label:"Congregación reunida para adorar",caption:"Adoración en familia"},
 {className:media.photoPreaching,label:"Rev. Rodolfo Solórzano predicando",caption:"Predicación de la Palabra"},
 {className:media.photoChildren,label:"Niños y líderes del ministerio infantil",caption:"Ministerio para nuestros niños"}
] as const;

export default function ChurchGallery(){
 const [selected,setSelected]=useState<number|null>(null);

 useEffect(()=>{
  if(selected===null)return;
  const onKeyDown=(event:KeyboardEvent)=>{
   if(event.key==="Escape")setSelected(null);
   if(event.key==="ArrowLeft")setSelected(current=>current===null?null:(current+photos.length-1)%photos.length);
   if(event.key==="ArrowRight")setSelected(current=>current===null?null:(current+1)%photos.length);
  };
  document.body.style.overflow="hidden";
  window.addEventListener("keydown",onKeyDown);
  return ()=>{document.body.style.overflow="";window.removeEventListener("keydown",onKeyDown);};
 },[selected]);

 return <>
  <div className={media.photoGrid}>
   {photos.map((photo,index)=><figure className={`${media.photo} ${photo.className}`} key={photo.caption}>
    <span role="img" aria-label={photo.label}/><button className={refine.photoButton} type="button" onClick={()=>setSelected(index)} aria-label={`Ver foto: ${photo.caption}`}/><figcaption>{photo.caption}<b aria-hidden="true">Ver foto ↗</b></figcaption>
   </figure>)}
  </div>
  {selected!==null&&<div className={refine.lightbox} role="dialog" aria-modal="true" aria-label={photos[selected].caption} onMouseDown={event=>{if(event.target===event.currentTarget)setSelected(null);}}>
   <button className={refine.lightboxClose} type="button" onClick={()=>setSelected(null)} aria-label="Cerrar foto">×</button>
   <button className={`${refine.lightboxNav} ${refine.lightboxPrev}`} type="button" onClick={()=>setSelected((selected+photos.length-1)%photos.length)} aria-label="Foto anterior">‹</button>
   <figure className={`${refine.lightboxPhoto} ${photos[selected].className}`}><span role="img" aria-label={photos[selected].label}/><figcaption>{photos[selected].caption}</figcaption></figure>
   <button className={`${refine.lightboxNav} ${refine.lightboxNext}`} type="button" onClick={()=>setSelected((selected+1)%photos.length)} aria-label="Foto siguiente">›</button>
  </div>}
 </>;
}
