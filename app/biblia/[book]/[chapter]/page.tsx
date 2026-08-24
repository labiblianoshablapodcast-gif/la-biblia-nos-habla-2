import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import BibleAudioControls from "@/components/BibleAudioControls";
import BibleReaderTools from "@/components/BibleReaderTools";
import JohnChapterQuestions from "@/components/JohnChapterQuestions";
import {getBook,getChapter,getQeqchiChapter,chapterUrl,qeqchiChapterUrl} from "@/lib/bible";

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

 const bibleChapter=version==="qeqchi"
   ? await getQeqchiChapter(book.code,chapter)
   : await getChapter(book.code,chapter);
 const versionQuery=version==="qeqchi"?"?version=qeqchi":"";
 const translationName=version==="qeqchi"
   ? "Li Santil Hu · Q’eqchi’ · Ortografía tradicional"
   : "Reina-Valera Revisada 1960";

 return <>
  <section className="pageHero bibleChapterHero">
    <p className="eyebrow">Santa Biblia · {translationName}</p>
    <h1>{book.name} {chapter}</h1>
    <p>{book.testament}</p>
  </section>

  <section className="section bibleReader">
    <div className="toolbar bibleVersionSwitcher" aria-label="Seleccionar versión de la Biblia">
      <Link className={version==="rvr60"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={`/biblia/${book.slug}/${chapter}`}>Español · RVR1960</Link>
      <Link className={version==="qeqchi"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={`/biblia/${book.slug}/${chapter}?version=qeqchi`}>Q’eqchi’ · Li Santil Hu</Link>
    </div>

    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>
    <BibleAudioControls language={version}/>

    {bibleChapter ? (
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
          ?"Puede abrir la fuente original Q’eqchi’ mientras revisamos este capítulo."
          :"Verifique que BIBLIA_API_KEY esté disponible en Vercel o ábralo directamente en Biblia.com."}</p>
        <a className="btn" href={version==="qeqchi"?qeqchiChapterUrl(book.code,chapter):chapterUrl(book.code,chapter)} target="_blank" rel="noreferrer">Abrir fuente original</a>
      </div>
    )}

    {version==="qeqchi" ? (
      <div className="bibliaAttribution">
        <p><strong>Li Santil Hu — La Santa Biblia en el idioma Kekchí/Q’eqchi’ de Guatemala [kek], ortografía tradicional.</strong><br/>
        Texto © 1988–2019 Wycliffe Bible Translators, Inc. Tercera edición revisada © 2019.
        Compartido sin cambiar las palabras ni la puntuación de las Escrituras bajo licencia
        <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" rel="noreferrer"> CC BY-NC-ND 4.0</a>.
        Fuente: <a href="https://scriptureearth.org/00spa.php?idx=264&iso_code=kek&language=Kekch%C3%AD" target="_blank" rel="noreferrer">Scripture Earth</a>.</p>
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
