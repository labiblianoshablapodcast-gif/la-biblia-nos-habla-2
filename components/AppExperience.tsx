"use client";

import {useEffect,useState} from "react";

export default function AppExperience(){
 const [showSplash,setShowSplash]=useState(false);

 useEffect(()=>{
  const standalone=window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & {standalone?:boolean}).standalone));
  if(!standalone) return;

  document.documentElement.classList.add("pwaStandalone");
  setShowSplash(true);
  const timer=window.setTimeout(()=>setShowSplash(false),1400);
  return ()=>window.clearTimeout(timer);
 },[]);

 if(!showSplash) return null;
 return <div className="appLaunchScreen" role="status" aria-label="Abriendo La Biblia Nos Habla">
  <img src="/api/pwa-icon?size=180" alt="" width="112" height="112"/>
  <div className="appLaunchTitle">La Biblia Nos Habla</div>
  <div className="appLaunchTagline">Una palabra de esperanza para su vida</div>
 </div>;
}
