import Link from "next/link";
import {church} from "@/data/church";
import {youtube} from "@/data/youtube";

export default function Footer(){
  return <footer className="siteFooter">
    <div className="footerAbout">
      <strong>La Biblia Nos Habla</strong>
      <p>Predicando la Palabra. Formando discípulos. Documentando la obra de Dios.</p>
      <small>Toda la gloria sea para Jesucristo.</small>
    </div>

    <div>
      <h3>Explore</h3>
      <Link href="/biblia">Biblia</Link>
      <Link href="/predicaciones">Predicaciones</Link>
      <Link href="/misiones">Misiones</Link>
    </div>

    <div>
      <h3>Iglesia</h3>
      <Link href="/iglesia">Horarios y ubicación</Link>
      <Link href="/eventos">Eventos</Link>
      <Link href="/conexion">Contacto y oración</Link>
      <Link href="/donaciones">Diezmos y ofrendas</Link>
    </div>

    <div>
      <h3>Conéctese</h3>
      <a href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">YouTube ministerial</a>
      <a href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">YouTube pastoral</a>
      <a href={`mailto:${church.email}`}>{church.email}</a>
      <small>{church.address}</small>
    </div>
  </footer>;
}
