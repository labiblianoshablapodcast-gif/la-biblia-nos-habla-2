"use client";

import {useEffect, useState} from "react";

type Photo={src:string;alt:string};

export default function GlobalPhotoViewer(){
 const [photo,setPhoto]=useState<Photo|null>(null);

 useEffect(()=>{
  const openPhoto=(event:MouseEvent)=>{
   const target=event.target;
   if(!(target instanceof HTMLImageElement)) return;
   if(target.closest("header,footer,nav,[data-no-lightbox],.managedGalleryItem,.galleryViewer")) return;
   const source=target.currentSrc||target.src;
   if(!source||source.includes("/icons/")||target.naturalWidth<180||target.naturalHeight<120) return;
   event.preventDefault();
   event.stopPropagation();
   setPhoto({src:source,alt:target.alt||"Fotografía"});
  };
  document.addEventListener("click",openPhoto,true);
  return()=>document.removeEventListener("click",openPhoto,true);
 },[]);

 useEffect(()=>{
  if(!photo) return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setPhoto(null)};
  window.addEventListener("keydown",close);
  return()=>{document.body.style.overflow=previous;window.removeEventListener("keydown",close)};
 },[photo]);

 if(!photo) return null;
 return <div className="globalPhotoViewer" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={()=>setPhoto(null)}>
  <button className="globalPhotoViewerClose" type="button" aria-label="Cerrar fotografía" onClick={()=>setPhoto(null)}>×</button>
  <figure onClick={event=>event.stopPropagation()}>
   <img src={photo.src} alt={photo.alt}/>
   {photo.alt&&photo.alt!=="Fotografía"&&<figcaption>{photo.alt}</figcaption>}
  </figure>
 </div>;
}
