"use client";

import {useLayoutEffect} from "react";
import {usePathname} from "next/navigation";

export default function AdminScrollReset(){
 const pathname=usePathname();

 useLayoutEffect(()=>{
  const main=document.querySelector<HTMLElement>(".adminMain");
  if(!main)return;

  main.scrollTop=0;
  main.scrollLeft=0;

  if(window.matchMedia("(max-width: 900px)").matches){
   const top=main.getBoundingClientRect().top+window.scrollY-12;
   window.scrollTo(0,Math.max(0,top));
  }else{
   window.scrollTo(0,0);
  }
 },[pathname]);

 return null;
}
