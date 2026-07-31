import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import {getBook,getAuthorizedRVR1960Chapter} from "@/lib/bible";

export default async function ChapterPage({params}:{params:Promise<{book:string;chapter:string}>}){
 const {book:slug,chapter:raw}=await params;
 const book=getBook(slug);
 const chapter=Number(raw);

 if(!book || !Number.isInteger(chapter) || chapter<1 || chapter>book.chapters) notFound();

 const bibleChapter=await getAuthorizedRVR1960Chapter(book.code,chapter);

 return <>
 <section className="pageHero bibleChapterHero">
   <p className="eyebrow">Santa Biblia · Reina-Valera 1960</p>
   <h1>{book.name} {chapter}</h1>
   <p>{book.testament}</p>
 </section>

 <section className="section bibleReader">
   <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters}/>

   {bibleChapter && bibleChapter.verses.length ? (
     <article className="scriptureText">
       {bibleChapter.verses.map(verse=>(
         <p key={verse.number}><sup>{verse.number}</sup> {verse.text}</p>
       ))}
       {bibleChapter.source && <p className="sourceNote">Fuente autorizada: {bibleChapter.source}</p>}
     </article>
   ) : (
     <div className="notice">
       <strong>La navegación está lista para la RVR1960.</strong>
       <p>Para mostrar el texto completo debemos añadir las credenciales de una fuente autorizada en Vercel.</p>
       <p>Variables necesarias:</p>
       <code>RVR1960_API_URL</code><br/>
       <code>RVR1960_API_KEY</code>
     </div>
   )}

   <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters}/>

   <section className="pastoralNotes">
     <p className="eyebrow">Espacio pastoral</p>
     <h2>Comentario y aplicación</h2>
     <p>Preparado para añadir comentarios del Pastor Gilberto, preguntas de estudio, predicaciones relacionadas y notas personales.</p>
   </section>

   <Link className="textLink" href="/biblia">← Volver a todos los libros</Link>
 </section>
 </>;
}
