'use client';

import Link from "next/link";
import {useState} from "react";

const links=[
  ["Inicio","/"],
  ["Biblia","/biblia"],
  ["Misiones","/misiones"],
  ["Nuestros Pastores","/el-pastor"],
  ["Iglesia","/iglesia"],
  ["Eventos","/eventos"],
  ["Contacto y oración","/conexion"]
];

export default function MobileHeader(){
  const [open,setOpen]=useState(false);

  return <>
    <button
      className="mobileMenuButton"
      aria-label="Abrir menú"
      aria-expanded={open}
      onClick={()=>setOpen(!open)}
    >
      <span></span><span></span><span></span>
    </button>

    {open && <div className="mobileMenuOverlay" onClick={()=>setOpen(false)}>
      <nav className="mobileMenuPanel" onClick={event=>event.stopPropagation()}>
        <div className="mobileMenuTop">
          <strong>La Biblia Nos Habla</strong>
          <button onClick={()=>setOpen(false)} aria-label="Cerrar menú">×</button>
        </div>

        {links.map(([label,href])=>(
          <Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>
        ))}

        <Link className="mobileMenuDonate" href="/donaciones" onClick={()=>setOpen(false)}>
          ♡ Donar
        </Link>

        <Link className="mobileMenuAdmin" href="/admin" onClick={()=>setOpen(false)}>
          Panel Pastoral
        </Link>
      </nav>
    </div>}
  </>;
}
