import Link from "next/link";
import {youtube} from "@/data/youtube";
import {church} from "@/data/church";

export default function Footer(){
 return <footer>
  <div><strong>La Biblia Nos Habla</strong><p>Iglesia Príncipe de Paz · Philadelphia</p><p>{church.address}</p></div>
  <div className="footerNav"><Link href="/iglesia">Horarios e iglesia</Link><Link href="/eventos">Eventos</Link><Link href="/donaciones">Diezmos y ofrendas</Link><Link href="/conexion">Contacto y oración</Link></div>
  <div><p>{church.email}</p><p className="footerLinks"><a href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">YouTube ministerial</a><br/><a href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">YouTube pastoral</a></p></div>
 </footer>;
}
