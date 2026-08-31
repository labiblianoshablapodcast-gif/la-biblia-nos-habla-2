import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import {createClient} from "@/lib/supabase/server";
import {canAccessAdminPath} from "@/lib/admin-permissions";
import AdminScrollReset from "@/components/AdminScrollReset";

const sections=[
  ["Resumen","/admin","⌂"],
  ["Predicaciones","/admin/predicaciones","🎙"],
  ["Organizar sermones","/admin/predicaciones/organizacion","▦"],
  ["Devocionales","/admin/devocionales","☀"],
  ["60 Segundos de Fe","/admin/multimedia","▶"],
  ["Eventos","/admin/eventos","📅"],
  ["Fotos","/admin/fotos","▣"],
  ["Peticiones","/admin/peticiones","🙏"],
  ["Nuevos creyentes","/admin/nuevos-creyentes","♥"],
  ["Estudio de Juan","/admin/estudio-juan","📖"],
  ["Donaciones","/admin/donaciones","$"],
  ["Misiones","/admin/misiones","🌎"],
  ["Usuarios","/admin/usuarios","👥"],
  ["Configuración","/admin/configuracion","⚙"],
  ["Estado Supabase","/admin/configuracion/supabase","●"]
];

export default async function AdminNav(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const {data:profile}=user
  ?await supabase.from("profiles").select("role").eq("id",user.id).single()
  :{data:null};
 const role=profile?.role;
 const visibleSections=sections.filter(([,href])=>
  href==="/admin"?role==="pastor":canAccessAdminPath(role,href)
 );

 return <aside className="adminNav adminNavPro">
  <AdminScrollReset/>
  <div className="adminBrand">
   <span>LB</span>
   <div><strong>Panel Pastoral</strong><small>La Biblia Nos Habla</small></div>
  </div>
  <nav>
   {visibleSections.map(([label,href,icon])=><Link href={href} key={href}><span>{icon}</span>{label}</Link>)}
  </nav>
  <div className="adminNavFooter">
   <Link href="/">Ver sitio público</Link>
   <SignOutButton/>
  </div>
 </aside>;
}
