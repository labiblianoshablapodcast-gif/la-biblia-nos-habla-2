"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

export default function AdminScrollReset(){
 const pathname=usePathname();

 useEffect(()=>{
  const goToSelectedSection=()=>{
   const main=document.querySelector<HTMLElement>(".adminMain");
   if(!main)return;

   main.scrollTo({top:0,left:0,behavior:"auto"});

   const isStacked=window.matchMedia("(max-width: 900px)").matches;
   if(isStacked){
    const top=main.getBoundingClientRect().top+window.scrollY-12;
    window.scrollTo({top:Math.max(0,top),left:0,behavior:"auto"});
   }else{
    window.scrollTo({top:0,left:0,behavior:"auto"});
   }
  };

  goToSelectedSection();
  const frame=window.requestAnimationFrame(()=>window.requestAnimationFrame(goToSelectedSection));
  const timer=window.setTimeout(goToSelectedSection,160);

  return ()=>{
   window.cancelAnimationFrame(frame);
   window.clearTimeout(timer);
  };
 },[pathname]);

 return null;
}
