"use client";

import {useEffect,useRef,useState} from "react";

type Photo={src:string;alt:string};

function eligibleImage(target:HTMLImageElement){
 if(target.closest("header,footer,nav,[data-no-lightbox],.managedGalleryItem,.galleryViewer"))return false;
 const source=target.currentSrc||target.src;
 return Boolean(source&&!source.includes("/icons/")&&target.naturalWidth>=180&&target.naturalHeight>=120);
}

export default function GlobalPhotoViewer(){
 const [photo,setPhoto]=useState<Photo|null>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 const previousFocus=useRef<HTMLElement|null>(null);

 function showPhoto(target:HTMLImageElement){
  if(!eligibleImage(target))return;
  previousFocus.current=target;
  setPhoto({src:target.currentSrc||target.src,alt:target.alt||"Fotografía"});
 }

 useEffect(()=>{
  const prepare=(image:HTMLImageElement)=>{
   if(!eligibleImage(image))return;
   image.tabIndex=0;
   image.setAttribute("role","button");
   image.setAttribute("aria-label",image.alt?("Ampliar fotografía: "+image.alt):"Ampliar fotografía");
  };
  const prepareAll=()=>document.querySelectorAll<HTMLImageElement>("img").forEach(prepare);
  prepareAll();

  const openPhoto=(event:MouseEvent)=>{
   const target=event.target;
   if(!(target instanceof HTMLImageElement)||!eligibleImage(target))return;
   event.preventDefault();event.stopPropagation();showPhoto(target);
  };
  const openWithKeyboard=(event:KeyboardEvent)=>{
   const target=event.target;
   if(!(target instanceof HTMLImageElement)||!eligibleImage(target)||!["Enter"," "].includes(event.key))return;
   event.preventDefault();showPhoto(target);
  };
  const prepareLoaded=(event:Event)=>{if(event.target instanceof HTMLImageElement)prepare(event.target);};
  const observer=new MutationObserver(prepareAll);
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener("click",openPhoto,true);
  document.addEventListener("keydown",openWithKeyboard,true);
  document.addEventListener("load",prepareLoaded,true);
  return()=>{
   observer.disconnect();
   document.removeEventListener("click",openPhoto,true);
   document.removeEventListener("keydown",openWithKeyboard,true);
   document.removeEventListener("load",prepareLoaded,true);
  };
 },[]);

 useEffect(()=>{
  if(!photo)return;
  const previous=document.body.style.overflow;
  document.body.style.overflow="hidden";
  closeRef.current?.focus();
  const close=(event:KeyboardEvent)=>{if(event.key==="Escape")setPhoto(null);};
  window.addEventListener("keydown",close);
  return()=>{
   document.body.style.overflow=previous;
   window.removeEventListener("keydown",close);
   previousFocus.current?.focus();
  };
 },[photo]);

 if(!photo)return null;
 return <div className="globalPhotoViewer" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={()=>setPhoto(null)}>
  <button ref={closeRef} className="globalPhotoViewerClose" type="button" aria-label="Cerrar fotografía" onClick={()=>setPhoto(null)}>×</button>
  <figure onClick={event=>event.stopPropagation()}>
   <img src={photo.src} alt={photo.alt} data-no-lightbox/>
   {photo.alt&&photo.alt!=="Fotografía"&&<figcaption>{photo.alt}</figcaption>}
  </figure>
 </div>;
}
