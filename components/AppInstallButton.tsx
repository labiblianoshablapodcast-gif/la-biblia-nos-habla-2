'use client';

import {useEffect,useState} from 'react';

type InstallPromptEvent = Event & {
  prompt:()=>Promise<void>;
  userChoice:Promise<{outcome:'accepted'|'dismissed';platform:string}>;
};

export default function AppInstallButton(){
  const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
  const [showIosHelp,setShowIosHelp]=useState(false);
  const [installed,setInstalled]=useState(false);

  useEffect(()=>{
    const standalone=window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & {standalone?:boolean}).standalone===true;
    setInstalled(standalone);

    const handlePrompt=(event:Event)=>{
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const handleInstalled=()=>setInstalled(true);
    window.addEventListener('beforeinstallprompt',handlePrompt);
    window.addEventListener('appinstalled',handleInstalled);
    return()=>{
      window.removeEventListener('beforeinstallprompt',handlePrompt);
      window.removeEventListener('appinstalled',handleInstalled);
    };
  },[]);

  async function handleInstall(){
    if(promptEvent){
      await promptEvent.prompt();
      const choice=await promptEvent.userChoice;
      if(choice.outcome==='accepted')setInstalled(true);
      setPromptEvent(null);
      return;
    }

    const ua=navigator.userAgent.toLowerCase();
    const isIos=/iphone|ipad|ipod/.test(ua);
    if(isIos){
      setShowIosHelp(true);
      return;
    }

    alert('Abra el menú del navegador y seleccione “Instalar app” o “Añadir a pantalla de inicio”.');
  }

  if(installed)return null;

  return <>
    <button className="appInstallButton" type="button" onClick={handleInstall} aria-label="Bajar la app La Biblia Nos Habla">
      <span className="appInstallIcon" aria-hidden="true">↓</span>
      <span><strong>Bajar la app</strong><small>Instalar para acceso rápido</small></span>
    </button>

    {showIosHelp&&<div className="installHelpOverlay" role="dialog" aria-modal="true" aria-label="Cómo instalar la app" onClick={()=>setShowIosHelp(false)}>
      <div className="installHelpCard" onClick={event=>event.stopPropagation()}>
        <button className="installHelpClose" type="button" aria-label="Cerrar" onClick={()=>setShowIosHelp(false)}>×</button>
        <div className="installHelpIcon" aria-hidden="true">↓</div>
        <h2>Instalar La Biblia Nos Habla</h2>
        <p>En iPhone, Safari instala la app desde el menú Compartir.</p>
        <ol>
          <li>Toque <strong>Compartir</strong> en Safari.</li>
          <li>Seleccione <strong>Añadir a pantalla de inicio</strong>.</li>
          <li>Toque <strong>Añadir</strong>.</li>
        </ol>
        <button className="installHelpDone" type="button" onClick={()=>setShowIosHelp(false)}>Entendido</button>
      </div>
    </div>}
  </>;
}
