'use client';

import {useEffect,useState} from "react";

type BeforeInstallPromptEvent = Event & {
  prompt:()=>Promise<void>;
  userChoice:Promise<{outcome:"accepted"|"dismissed"}>;
};

export default function InstallApp(){
  const [deferred,setDeferred]=useState<BeforeInstallPromptEvent|null>(null);
  const [isIOS,setIsIOS]=useState(false);
  const [isStandalone,setIsStandalone]=useState(false);
  const [showIOSHelp,setShowIOSHelp]=useState(false);

  useEffect(()=>{
    const ua=window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && Boolean((window.navigator as Navigator & {standalone?:boolean}).standalone))
    );

    function handleBeforeInstall(event:Event){
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt",handleBeforeInstall);
    return ()=>window.removeEventListener("beforeinstallprompt",handleBeforeInstall);
  },[]);

  async function install(){
    if(deferred){
      await deferred.prompt();
      const result=await deferred.userChoice;
      if(result.outcome==="accepted") setDeferred(null);
      return;
    }
    if(isIOS) setShowIOSHelp(true);
  }

  if(isStandalone) return null;

  return <section className="installAppCard">
    <div>
      <p className="eyebrow">Instale la aplicación</p>
      <h2>La Biblia Nos Habla en su teléfono</h2>
      <p>
        Puede instalarla en iPhone, Samsung y otros teléfonos Android.
        Tendrá un icono propio y se abrirá como una aplicación.
      </p>
    </div>

    <button className="btn" onClick={install}>
      {isIOS ? "Instalar en iPhone" : "Instalar en Samsung / Android"}
    </button>

    {showIOSHelp && <div className="iosInstallHelp">
      <button className="closeHelp" onClick={()=>setShowIOSHelp(false)}>×</button>
      <strong>Cómo instalar en iPhone</strong>
      <ol>
        <li>Abra esta página en Safari.</li>
        <li>Pulse el botón Compartir.</li>
        <li>Seleccione “Añadir a pantalla de inicio”.</li>
        <li>Pulse “Añadir”.</li>
      </ol>
    </div>}
  </section>;
}
