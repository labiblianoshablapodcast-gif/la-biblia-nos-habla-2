'use client';

import {useEffect,useState} from "react";

type ActivePhoto={src:string;alt:string};

export default function GlobalPhotoViewer(){
 const [photo,setPhoto]=useState<ActivePhoto|null>(null);

 useEffect(()=>{
  function openFromImage(image:HTMLImageElement){
   if(image.closest(".galleryViewer,.globalPhotoViewer"))return;
   if(image.dataset.noLightbox!==undefined)return;
   if(image.closest("a,button"))return;
   const src=image.currentSrc||image.src;
   if(!src)return;
   setPhoto({src,alt:image.alt||"Fotografía"});
  }
  function onClick(event:MouseEvent){
   const target=event.target as HTMLElement|null;
   const image=target?.closest("main img") as HTMLImageElement|null;
   if(!image)return;
   openFromImage(image);
  }
  function onKey(event:KeyboardEvent){
   if(event.key==="Escape")setPhoto(null);
   if((event.key==="Enter"||event.key===" ")&&event.target instanceof HTMLImageElement&&event.target.closest("main")){
    event.preventDefault();openFromImage(event.target);
   }
  }
  document.addEventListener("click",onClick);
  document.addEventListener("keydown",onKey);
  return()=>{document.removeEventListener("click",onClick);document.removeEventListener("keydown",onKey)};
 },[]);

 useEffect(()=>{
  if(!photo)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  return()=>{document.body.style.overflow=previous};
 },[photo]);

 if(!photo)return null;
 return <div className="globalPhotoViewer" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={()=>setPhoto(null)}>
  <button className="globalPhotoViewerClose" type="button" aria-label="Cerrar fotografía" onClick={event=>{event.stopPropagation();setPhoto(null)}} autoFocus>×</button>
  <figure onClick={event=>event.stopPropagation()}>
   <img src={photo.src} alt={photo.alt}/>
   {photo.alt&&photo.alt!=="Fotografía"&&<figcaption>{photo.alt}</figcaption>}
  </figure>
 </div>;
}
