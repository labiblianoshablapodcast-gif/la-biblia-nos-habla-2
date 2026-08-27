'use client';

import Link from "next/link";
import {useEffect,useRef,useState} from "react";

const links=[
  ["Inicio","/"],
  ["Biblia","/biblia"],
  ["Estudios bíblicos","/estudios"],
  ["Estudio Kids","/kids"],
  ["Misiones","/misiones"],
  ["Nuestros Pastores","/el-pastor"],
  ["Iglesia","/iglesia"],
  ["Iglesia Central – Garfield","/iglesia-central-garfield"],
  ["Eventos","/eventos"],
  ["Galería","/galeria"],
  ["Contacto y oración","/conexion"]
];

export default function MobileHeader(){
  const [open,setOpen]=useState(false);
  const triggerRef=useRef<HTMLButtonElement>(null);
  const panelRef=useRef<HTMLElement>(null);

  useEffect(()=>{
    if(!open)return;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    panelRef.current?.querySelector<HTMLElement>("button,a[href]")?.focus();

    function handleKey(event:KeyboardEvent){
      if(event.key==="Escape"){setOpen(false);return;}
      if(event.key!=="Tab"||!panelRef.current)return;
      const focusable=Array.from(panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"));
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }

    document.addEventListener("keydown",handleKey);
    return()=>{
      document.body.style.overflow=previousOverflow;
      document.removeEventListener("keydown",handleKey);
      triggerRef.current?.focus();
    };
  },[open]);

  return <>
    <button ref={triggerRef} className="mobileMenuButton" type="button"
      aria-label={open?"Cerrar menú":"Abrir menú"} aria-expanded={open}
      aria-controls="mobile-site-menu" onClick={()=>setOpen(value=>!value)}>
      <span></span><span></span><span></span>
    </button>

    {open&&<div className="mobileMenuOverlay" role="dialog" aria-modal="true"
      aria-label="Menú del sitio" onClick={()=>setOpen(false)}>
      <nav ref={panelRef} id="mobile-site-menu" className="mobileMenuPanel"
        aria-label="Navegación móvil" onClick={event=>event.stopPropagation()}>
        <div className="mobileMenuTop">
          <strong>La Biblia Nos Habla</strong>
          <button type="button" onClick={()=>setOpen(false)} aria-label="Cerrar menú">×</button>
        </div>
        {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
        <Link className="mobileMenuDonate" href="/donaciones" onClick={()=>setOpen(false)}>♡ Donar</Link>
        <Link className="mobileMenuAdmin" href="/admin" onClick={()=>setOpen(false)}>Panel Pastoral</Link>
      </nav>
    </div>}
  </>;
}
