import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import BibleReaderTools from "@/components/BibleReaderTools";
import JohnChapterQuestions from "@/components/JohnChapterQuestions";
import {getBook,getChapter,getQeqchiChapter,hasQeqchiBook,chapterUrl,qeqchiChapterUrl} from "@/lib/bible";

type Version="rvr60"|"qeqchi";

export default async function ChapterPage({
 params,searchParams
}:{
 params:Promise<{book:string;chapter:string}>;
 searchParams:Promise<{version?:string}>;
}){
 const {book:slug,chapter:raw}=await params;
 const query=await searchParams;
 const version:Version=query.version==="qeqchi"?"qeqchi":"rvr60";
 const book=getBook(slug);
 const chapter=Number(raw);
 if(!book || !Number.isInteger(chapter) || chapter<1 || chapter>book.chapters) notFound();

 const qeqchiAvailable=hasQeqchiBook(book.code);
 const bibleChapter=version==="qeqchi"
   ? await getQeqchiChapter(book.code,chapter)
   : await getChapter(book.code,chapter);
 const versionQuery=version==="qeqchi"?"?version=qeqchi":"";
 const translationName=version==="qeqchi"?"Li Santil Hu · Q’eqchi’":"Reina-Valera Revisada 1960";

 return <>
  <section className="pageHero bibleChapterHero">
    <p className="eyebrow">Santa Biblia · {translationName}</p>
    <h1>{book.name} {chapter}</h1>
    <p>{book.testament}</p>
  </section>

  <section className="section bibleReader">
    <div className="toolbar" aria-label="Seleccionar versión de la Biblia">
      <Link className={version==="rvr60"?"btn":"btn secondary"} href={`/biblia/${book.slug}/${chapter}`}>Español · RVR1960</Link>
      <Link className={version==="qeqchi"?"btn":"btn secondary"} href={`/biblia/${book.slug}/${chapter}?version=qeqchi`}>Q’eqchi’ · Li Santil Hu</Link>
    </div>

    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>

    {version==="qeqchi" && !qeqchiAvailable ? (
      <div className="notice">
        <strong>Esta edición Q’eqchi’ contiene el Nuevo Testamento.</strong>
        <p>Seleccione Mateo, Marcos, Lucas, Juan u otro libro del Nuevo Testamento. La RVR1960 permanece disponible para los 66 libros.</p>
        <Link className="btn" href="/biblia/mateo/1?version=qeqchi">Comenzar en Mateo</Link>
      </div>
    ) : bibleChapter ? (
      <BibleReaderTools
        bookName={book.name}
        bookSlug={book.slug}
        chapter={chapter}
        verses={bibleChapter.verses}
        translationName={translationName}
        translationKey={version}
      />
    ) : (
      <div className="notice">
        <strong>No pudimos cargar el capítulo.</strong>
        <p>{version==="qeqchi"
          ?"Puede abrir este capítulo directamente en la fuente Q’eqchi’."
          :"Verifique que BIBLIA_API_KEY esté disponible en Vercel o ábralo directamente en Biblia.com."}</p>
        <a className="btn" href={version==="qeqchi"?qeqchiChapterUrl(book.code,chapter):chapterUrl(book.code,chapter)} target="_blank" rel="noreferrer">Abrir capítulo</a>
      </div>
    )}

    {version==="qeqchi" ? (
      <div className="bibliaAttribution">
        <p><strong>Li Santil Hu — Nuevo Testamento en Q’eqchi’ [kek], Guatemala.</strong><br/>
        © 2000 Wycliffe Bible Translators, Inc. Texto compartido sin modificaciones bajo licencia
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noreferrer"> CC BY-NC-ND 4.0</a>.
        Fuente: <a href="https://ebible.org/kekNT/" target="_blank" rel="noreferrer">eBible.org</a>.</p>
      </div>
    ) : (
      <div className="bibliaAttribution">
        <a href="https://biblia.com/" target="_blank" rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://api.biblia.com/v1/PoweredByBiblia_small.png" alt="Powered by Biblia"/>
        </a>
        <p>Este sitio utiliza los servicios web de <a href="https://biblia.com/" target="_blank" rel="noreferrer">Biblia</a> de <a href="https://www.logos.com/" target="_blank" rel="noreferrer">Logos Bible Software</a>.</p>
      </div>
    )}

    <div className="toolbar">
      <Link className="btn" href="/diccionario">א α Diccionario hebreo y griego</Link>
      <a className="btn secondary" href={`https://www.stepbible.org/?q=version=RVR60|reference=${encodeURIComponent(`${book.name} ${chapter}`)}`} target="_blank" rel="noreferrer">Estudio interlineal ↗</a>
    </div>

    {version==="rvr60" && book.slug==="juan" && <JohnChapterQuestions key={chapter} chapter={chapter}/>}

    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>

    <section className="pastoralNotes">
      <p className="eyebrow">Espacio pastoral</p>
      <h2>Comentario y aplicación</h2>
      <p>Preparado para comentarios del Pastor Gilberto, preguntas de estudio y predicaciones relacionadas.</p>
    </section>

    <Link className="textLink" href="/biblia">← Volver a todos los libros</Link>
  </section>
 </>;
}
