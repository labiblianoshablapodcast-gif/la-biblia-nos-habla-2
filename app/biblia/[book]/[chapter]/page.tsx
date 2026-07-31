import Link from "next/link";

export default async function ChapterPage({params}:{params:Promise<{book:string;chapter:string}>}) {
  const {book,chapter}=await params;
  const decoded=decodeURIComponent(book);
  return <>
    <section className="pageHero"><p className="eyebrow">Lectura bíblica</p><h1>{decoded} {chapter}</h1><p>Vista preparada para mostrar el texto bíblico, marcadores, notas y comentarios pastorales.</p></section>
    <section className="section">
      <div className="notice">Conecte aquí la traducción autorizada seleccionada. No se incluyó texto bíblico sin licencia.</div>
      <h2>Comentario pastoral</h2>
      <p>Esta sección permitirá añadir una explicación sencilla, aplicación práctica, preguntas y una oración relacionada con el capítulo.</p>
      <div className="toolbar"><Link className="btn secondary" href="/biblia">Volver a los libros</Link></div>
    </section>
  </>;
}
