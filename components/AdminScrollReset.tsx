"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";

export default function AdminScrollReset(){
 const router=useRouter();

 useEffect(()=>{
  const goToPanelContent=()=>{
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
  };

  const handleAdminNavigation=(event:MouseEvent)=>{
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;

   const target=event.target;
   if(!(target instanceof Element))return;

   const link=target.closest<HTMLAnchorElement>('a[href^="/admin"]');
   if(!link)return;

   event.preventDefault();
   link.blur();
   goToPanelContent();

   const href=link.getAttribute("href");
   if(href)router.push(href,{scroll:false});
  };

  document.addEventListener("click",handleAdminNavigation,true);
  return ()=>document.removeEventListener("click",handleAdminNavigation,true);
 },[router]);

 return null;
}
