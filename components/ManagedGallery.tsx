'use client';

import {useEffect,useState} from "react";

type Photo={
 id:number;
 image_url:string;
 title:string;
 alt_text?:string|null;
 category?:string|null;
};

export default function ManagedGallery({photos}:{photos:Photo[]}){
 const [active,setActive]=useState<number|null>(null);
 const photo=active===null?null:photos[active];

 useEffect(()=>{
  function close(event:KeyboardEvent){if(event.key==="Escape")setActive(null)}
  document.addEventListener("keydown",close);
  return()=>document.removeEventListener("keydown",close);
 },[]);

 return <>
  <div className="managedGalleryGrid">
   {photos.map((item,index)=><button className="managedGalleryItem" type="button" key={item.id} onClick={()=>setActive(index)} aria-label={`Ver completa: ${item.title}`}>
    <img src={item.image_url} alt={item.alt_text||item.title}/>
    <span className="galleryExpandIcon">⌕</span>
    <span className="managedGalleryCaption"><strong>{item.title}</strong><small>{item.category}</small></span>
   </button>)}
  </div>

  {photo&&<div className="galleryViewer" role="dialog" aria-modal="true" aria-label={photo.title} onClick={()=>setActive(null)}>
   <button className="galleryViewerClose" type="button" onClick={()=>setActive(null)} aria-label="Cerrar fotografía">×</button>
   {photos.length>1&&<button className="galleryViewerPrevious" type="button" onClick={event=>{event.stopPropagation();setActive(current=>current===null?0:(current-1+photos.length)%photos.length)}} aria-label="Fotografía anterior">‹</button>}
   <div className="galleryViewerContent" onClick={event=>event.stopPropagation()}>
    <img src={photo.image_url} alt={photo.alt_text||photo.title}/>
    <div><strong>{photo.title}</strong>{photo.category&&<small>{photo.category}</small>}</div>
   </div>
   {photos.length>1&&<button className="galleryViewerNext" type="button" onClick={event=>{event.stopPropagation();setActive(current=>current===null?0:(current+1)%photos.length)}} aria-label="Fotografía siguiente">›</button>}
  </div>}
 </>;
}
