import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import BibleReaderTools from "@/components/BibleReaderTools";
import JohnChapterQuestions from "@/components/JohnChapterQuestions";
import {getBook,getChapter,chapterUrl} from "@/lib/bible";

export default async function ChapterPage({params}:{params:Promise<{book:string;chapter:string}>}){
 const {book:slug,chapter:raw}=await params;
 const book=getBook(slug);
 const chapter=Number(raw);
 if(!book || !Number.isInteger(chapter) || chapter<1 || chapter>book.chapters) notFound();

 const bibleChapter=await getChapter(book.code,chapter);

 return <>
  <section className="pageHero bibleChapterHero">
    <p className="eyebrow">Santa Biblia · Reina-Valera 1909</p>
    <h1>{book.name} {chapter}</h1>
    <p>{book.testament}</p>
  </section>

  <section className="section bibleReader">
    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters}/>

    {bibleChapter ? (
      <BibleReaderTools
        bookName={book.name}
        bookSlug={book.slug}
        chapter={chapter}
        verses={bibleChapter.verses}
      />
    ) : (
      <div className="notice">
        <strong>No pudimos cargar el capítulo.</strong>
        <p>Puede abrirlo directamente desde la fuente pública.</p>
        <a className="btn" href={chapterUrl(book.code,chapter)} target="_blank">Abrir capítulo</a>
      </div>
    )}

    {book.slug==="juan" && <JohnChapterQuestions key={chapter} chapter={chapter}/>} 

    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters}/>

    <section className="pastoralNotes">
      <p className="eyebrow">Espacio pastoral</p>
      <h2>Comentario y aplicación</h2>
      <p>Preparado para comentarios del Pastor Gilberto, preguntas de estudio y predicaciones relacionadas.</p>
    </section>

    <Link className="textLink" href="/biblia">← Volver a todos los libros</Link>
  </section>
 </>;
}
