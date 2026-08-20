"use client";
import {useEffect} from "react";

export default function RegisterServiceWorker(){
 useEffect(()=>{
  // Versiones anteriores registraban un service worker que ya no existe.
  // Safari puede conservarlo y mezclar archivos de despliegues distintos.
  const removeLegacyWorker=async()=>{
   try{
    if("serviceWorker" in navigator){
     const registrations=await navigator.serviceWorker.getRegistrations();
     await Promise.all(registrations.map(registration=>registration.unregister()));
    }
    if("caches" in window){
     const names=await caches.keys();
     await Promise.all(names.map(name=>caches.delete(name)));
    }
   }catch{
    // La limpieza no debe impedir que el sitio cargue.
   }
  };
  void removeLegacyWorker();
 },[]);
 return null;
}
