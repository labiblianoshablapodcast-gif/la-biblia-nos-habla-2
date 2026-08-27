import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import BibleAudioControls from "@/components/BibleAudioControls";
import BibleReaderTools from "@/components/BibleReaderTools";
import JohnChapterQuestions from "@/components/JohnChapterQuestions";
import {getBook,getChapter,getQeqchiChapter,chapterUrl,qeqchiChapterUrl} from "@/lib/bible";
import {getAsvChapter,asvChapterUrl} from "@/lib/asv-chapter";
import {readerVersion,versionQuery as queryForVersion} from "@/lib/bible-version";

export default async function ChapterPage({
 params,searchParams
}:{
 params:Promise<{book:string;chapter:string}>;
 searchParams:Promise<{version?:string}>;
}){
 const {book:slug,chapter:raw}=await params;
 const query=await searchParams;
 const version=readerVersion(query.version);
 const book=getBook(slug);
 const chapter=Number(raw);
 if(!book || !Number.isInteger(chapter) || chapter<1 || chapter>book.chapters) notFound();

 const bibleChapter=version==="qeqchi"
   ? await getQeqchiChapter(book.code,chapter)
   : version==="asv" ? await getAsvChapter(book.code,chapter)
   : await getChapter(book.code,chapter);
 const versionQuery=queryForVersion(version);
 const translationName=version==="qeqchi"
   ? "Li Santil Hu · Q’eqchi’ · Ortografía tradicional"
   : version==="asv" ? "American Standard Version (ASV) · English"
   : "Reina-Valera Revisada 1960";
 const displayBook=version==="asv"&&bibleChapter?bibleChapter.book:book.name;

 return <>
  <section className="pageHero bibleChapterHero">
    <p className="eyebrow">Santa Biblia · {translationName}</p>
    <h1>{displayBook} {chapter}</h1>
    <p>{book.testament}</p>
  </section>

  <section className="section bibleReader">
    <div className="toolbar bibleVersionSwitcher" aria-label="Seleccionar versión de la Biblia">
      <Link className={version==="rvr60"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={`/biblia/${book.slug}/${chapter}`}>Español · RVR1960</Link>
      <Link className={version==="qeqchi"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={`/biblia/${book.slug}/${chapter}?version=qeqchi`}>Q’eqchi’ · Li Santil Hu</Link>
      <Link className={version==="asv"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} aria-current={version==="asv"?"page":undefined} href={`/biblia/${book.slug}/${chapter}?version=asv`}>English · ASV</Link>
    </div>

    <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>
    {version!=="asv" && <BibleAudioControls language={version}/>}

    {bibleChapter ? (
      <BibleReaderTools
        key={`${version}-${book.slug}-${chapter}`}
        bookName={displayBook}
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
          :version==="asv"?"No pudimos obtener este capítulo ASV de YouVersion en este momento. Puede abrir la fuente original."
          :"Verifique que BIBLIA_API_KEY esté disponible en Vercel o ábralo directamente en Biblia.com."}</p>
        <a className="btn" href={version==="qeqchi"?qeqchiChapterUrl(book.code,chapter):version==="asv"?asvChapterUrl(book.code,chapter):chapterUrl(book.code,chapter)} target="_blank" rel="noreferrer">Abrir fuente original</a>
      </div>
    )}

    {version==="asv" ? (
      <div className="bibliaAttribution">
        <p><strong>American Standard Version (ASV, 1901) · English.</strong><br/>
        Fuente: <a href={asvChapterUrl(book.code,chapter)} target="_blank" rel="noreferrer">YouVersion</a>.
        {bibleChapter && "copyright" in bibleChapter && bibleChapter.copyright ? ` ${bibleChapter.copyright}` : ""}</p>
      </div>
    ) : version==="qeqchi" ? (
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

    <Link className="textLink" href={`/biblia${versionQuery}`}>← Volver a todos los libros</Link>
  </section>
 </>;
}
