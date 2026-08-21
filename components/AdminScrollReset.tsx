"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";

export default function AdminScrollReset(){
 const pathname=usePathname();

 useEffect(()=>{
  const reset=()=>{
   window.scrollTo({top:0,left:0,behavior:"auto"});
   document.documentElement.scrollTop=0;
   document.body.scrollTop=0;

   document.querySelectorAll<HTMLElement>(".adminShell, .adminMain").forEach(element=>{
    element.scrollTo({top:0,left:0,behavior:"auto"});
   });

   document.querySelector<HTMLElement>(".adminMain h1")?.focus({preventScroll:true});
  };

  reset();
  const frame=window.requestAnimationFrame(reset);
  return ()=>window.cancelAnimationFrame(frame);
 },[pathname]);

 return null;
}
