import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

const sections=[
  ["Resumen","/admin","⌂"],
  ["Predicaciones","/admin/predicaciones","🎙"],
  ["Multimedia","/admin/multimedia","▶"],
  ["Devocionales","/admin/devocionales","☀"],
  ["Eventos","/admin/eventos","📅"],
  ["Peticiones","/admin/peticiones","🙏"],
  ["Nuevos creyentes","/admin/nuevos-creyentes","♥"],
  ["Misiones","/admin/misiones","🌎"],
  ["Configuración","/admin/configuracion","⚙"],
  ["Estado Supabase","/admin/configuracion/supabase","●"]
];

export default function AdminNav(){
 return <aside className="adminNav adminNavPro">
  <div className="adminBrand">
   <span>LB</span>
   <div><strong>Panel Pastoral</strong><small>La Biblia Nos Habla</small></div>
  </div>
  <nav>
   {sections.map(([label,href,icon])=><Link href={href} key={href}><span>{icon}</span>{label}</Link>)}
  </nav>
  <div className="adminNavFooter">
   <Link href="/">Ver sitio público</Link>
   <SignOutButton/>
  </div>
 </aside>;
}
