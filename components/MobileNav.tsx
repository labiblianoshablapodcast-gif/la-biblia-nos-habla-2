"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const links=[
 {href:"/",icon:"⌂",label:"Inicio"},
 {href:"/biblia",icon:"📖",label:"Biblia"},
 {href:"/galeria",icon:"▣",label:"Galería"},
 {href:"/conexion",icon:"♢",label:"Peticiones"},
 {href:"/donaciones",icon:"♡",label:"Donar"}
];

export default function MobileNav(){
 const pathname=usePathname();
 return <nav className="mobileBottomNav" aria-label="Navegación móvil">
  {links.map(item=>{
   const active=item.href==="/"?pathname==="/":pathname.startsWith(item.href);
   return <Link key={item.href} href={item.href} aria-current={active?"page":undefined}>
    <span aria-hidden="true">{item.icon}</span><small>{item.label}</small>
   </Link>;
  })}
 </nav>;
}
