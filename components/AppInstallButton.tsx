'use client';

import {useEffect,useState} from 'react';
import {track} from '@vercel/analytics';

type InstallPromptEvent = Event & {
  prompt:()=>Promise<void>;
  userChoice:Promise<{outcome:'accepted'|'dismissed';platform:string}>;
};

const INSTALL_TRACK_KEY='lbnh_pwa_install_tracked_v1';
const INSTALL_ID_KEY='lbnh_pwa_install_id_v1';

function getPlatform(){
  const ua=navigator.userAgent.toLowerCase();
  if(/iphone|ipad|ipod/.test(ua))return 'ios';
  if(/android/.test(ua))return 'android';
  return 'desktop';
}

function getInstallId(){
  try{
    const existing=localStorage.getItem(INSTALL_ID_KEY);
    if(existing)return existing;
    const id=crypto.randomUUID();
    localStorage.setItem(INSTALL_ID_KEY,id);
    return id;
  }catch{
    return crypto.randomUUID();
  }
}

async function registerInstall(source:string){
  try{
    await fetch('/api/pwa-install',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({installId:getInstallId(),platform:getPlatform(),source}),
      keepalive:true
    });
  }catch{
    // Analytics no debe interferir con la instalación.
  }
}

function trackInstalledOnce(source:string){
  try{
    if(localStorage.getItem(INSTALL_TRACK_KEY)==='1'){
      void registerInstall(source);
      return;
    }
    track('pwa_install',{platform:getPlatform(),source});
    localStorage.setItem(INSTALL_TRACK_KEY,'1');
    void registerInstall(source);
  }catch{
    track('pwa_install',{platform:getPlatform(),source});
    void registerInstall(source);
  }
}

export default function AppInstallButton(){
  const [promptEvent,setPromptEvent]=useState<InstallPromptEvent|null>(null);
  const [showIosHelp,setShowIosHelp]=useState(false);
  const [installed,setInstalled]=useState(false);

  useEffect(()=>{
    const standalone=window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & {standalone?:boolean}).standalone===true;
    setInstalled(standalone);
    if(standalone)trackInstalledOnce('standalone_open');

    const handlePrompt=(event:Event)=>{
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const handleInstalled=()=>{
      setInstalled(true);
      trackInstalledOnce('appinstalled_event');
    };
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
      if(choice.outcome==='accepted'){
        setInstalled(true);
        trackInstalledOnce('install_prompt_accepted');
      }
      setPromptEvent(null);
      return;
    }

    const ua=navigator.userAgent.toLowerCase();
    const isIos=/iphone|ipad|ipod/.test(ua);
    if(isIos){
      track('pwa_install_help_opened',{platform:'ios'});
      setShowIosHelp(true);
      return;
    }

    alert('Abra el menú del navegador y seleccione “Instalar app” o “Añadir a pantalla de inicio”.');
  }

  if(installed)return null;

  return <>
    <style jsx>{`
      .appInstallButton{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:9px;flex:0 0 auto;min-height:44px;margin:0;padding:10px 15px;border:1px solid #c99b3c;border-radius:12px;background:#071829;color:#fff;font-family:inherit;font-size:12px;font-weight:700;line-height:1.2;white-space:nowrap;cursor:pointer;box-shadow:0 3px 10px rgba(7,24,41,.1);transition:background .15s ease,box-shadow .15s ease}
      .appInstallButton:hover{background:#12334b;box-shadow:0 4px 14px rgba(7,24,41,.18)}
      .appInstallButton:focus-visible{outline:3px solid #d7aa4b;outline-offset:3px}
      .appInstallIcon{display:flex;align-items:center;justify-content:center;color:#e0b454}
      @media(max-width:700px){.appInstallButton{padding:9px 11px;gap:7px;font-size:11px}}
    `}</style>
    <button className="appInstallButton" type="button" onClick={handleInstall} aria-label="Instalar La Biblia Nos Habla">
      <span className="appInstallIcon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg></span>
      <span>Instalar app</span>
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
