"use client";
import {useEffect,useState} from "react";
type InstallPrompt=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
export default function InstallApp(){
 const [prompt,setPrompt]=useState<InstallPrompt|null>(null);
 const [ios,setIos]=useState(false);
 useEffect(()=>{
  setIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
  const handler=(event:Event)=>{event.preventDefault();setPrompt(event as InstallPrompt);};
  window.addEventListener("beforeinstallprompt",handler);
  return()=>window.removeEventListener("beforeinstallprompt",handler);
 },[]);
 async function install(){if(!prompt)return;await prompt.prompt();await prompt.userChoice;setPrompt(null);}
 return <div className="installAppCard">
  <div><p className="eyebrow">Instale la aplicación</p><h2>La Biblia Nos Habla en su teléfono</h2><p>Acceso rápido a la Biblia, misiones, información pastoral y oración.</p></div>
  {prompt&&<button className="btn" onClick={install}>Instalar aplicación</button>}
  {ios&&!prompt&&<div className="iosInstallHelp"><strong>En iPhone:</strong><span>Presione Compartir y luego “Añadir a pantalla de inicio”.</span></div>}
  {!ios&&!prompt&&<div className="iosInstallHelp"><strong>En Android:</strong><span>Abra el menú y seleccione “Instalar aplicación”.</span></div>}
 </div>;
}
