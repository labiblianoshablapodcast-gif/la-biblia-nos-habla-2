import Link from "next/link";
import books from "@/data/books.json";

export default function BibliaPage() {
  return <>
    <section className="pageHero"><p className="eyebrow">Módulo central</p><h1>Biblia completa</h1><p>Navegue por los 66 libros. El proyecto está preparado para conectar una traducción bíblica autorizada.</p></section>
    <section className="section">
      <div className="notice"><strong>Importante:</strong> el texto bíblico completo debe provenir de una traducción de dominio público o de una licencia/API autorizada. La estructura técnica ya está lista para conectarla sin cambiar el diseño.</div>
      <div className="toolbar"><input className="search" placeholder="Buscar libro o referencia..."/></div>
      <div className="bookGrid">{books.map((book)=><Link className="bookLink" key={book} href={`/biblia/${encodeURIComponent(book)}/1`}>{book}</Link>)}</div>
    </section>
  </>;
}
