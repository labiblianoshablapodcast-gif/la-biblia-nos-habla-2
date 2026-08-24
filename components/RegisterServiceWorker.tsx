"use client";
import {useEffect} from "react";

export default function RegisterServiceWorker(){
 useEffect(()=>{
  const registerWorker=async()=>{
   try{
    if("serviceWorker" in navigator){
     await navigator.serviceWorker.register("/sw.js",{scope:"/"});
    }
   }catch{
    // La app debe seguir funcionando aunque el navegador no permita registrar el worker.
   }
  };
  void registerWorker();
 },[]);
 return null;
}
