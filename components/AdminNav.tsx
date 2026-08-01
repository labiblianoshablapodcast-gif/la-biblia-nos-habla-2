import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
const items=[["Resumen","/admin"],["Peticiones","/admin/peticiones"],["Nuevos creyentes","/admin/nuevos-creyentes"],["Predicaciones","/admin/predicaciones"],["Devocionales","/admin/devocionales"],["Eventos","/admin/eventos"],["Misiones","/admin/misiones"]];
export default function AdminNav(){return <aside className="adminNav"><h2>Panel Pastoral</h2>{items.map(([label,href])=><Link href={href} key={href}>{label}</Link>)}<SignOutButton/></aside>;}
