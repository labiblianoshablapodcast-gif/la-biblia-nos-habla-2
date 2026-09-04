import {notFound} from "next/navigation";
import Link from "next/link";
import ChapterControls from "@/components/ChapterControls";
import BibleAudioControls from "@/components/BibleAudioControls";
import QeqchiChapterAudio from "@/components/QeqchiChapterAudio";
import {getQeqchiAudio} from "@/lib/qeqchi-audio";
import BibleReaderTools from "@/components/BibleReaderTools";
import StudyReadingNav from "@/components/StudyReadingNav";
import {getStudyPlan,readingStudyContext,studyDayUrl,studyReadingUrl} from "@/lib/study-plans";
import {getBook,getChapter,getQeqchiChapter} from "@/lib/bible";
import {getAsvChapter,asvChapterUrl} from "@/lib/asv-chapter";
import {readerVersion,versionQuery as queryForVersion} from "@/lib/bible-version";

export default async function ChapterPage({
 params,searchParams
}:{
 params:Promise<{book:string;chapter:string}>;
 searchParams:Promise<{version?:string;plan?:string;day?:string}>;
}){
 const {book:slug,chapter:raw}=await params;
 const query=await searchParams;
 const version=readerVersion(query.version);
 const book=getBook(slug);
 const chapter=Number(raw);
 if(!book || !Number.isInteger(chapter) || chapter<1 || chapter>book.chapters) notFound();
 const study=readingStudyContext(query.plan,query.day,book.slug,chapter);
 const chapterLink=(selected:string)=>study?studyReadingUrl(study.plan,study.day,chapter,selected):`/biblia/${book.slug}/${chapter}${queryForVersion(readerVersion(selected))}`;
 const relatedPlan=getStudyPlan(book.slug);
 const relatedDay=relatedPlan?relatedPlan.days.findIndex(day=>day.chapters.includes(chapter))+1:0;

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
      <Link className={version==="rvr60"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={chapterLink("rvr60")}>Español · RVR1960</Link>
      <Link className={version==="qeqchi"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} href={chapterLink("qeqchi")}>Q’eqchi’ · Li Santil Hu</Link>
      <Link className={version==="asv"?"btn bibleVersionActive":"btn secondary bibleVersionInactive"} aria-current={version==="asv"?"page":undefined} href={chapterLink("asv")}>English · ASV</Link>
    </div>

    {study?<StudyReadingNav plan={study.plan} day={study.day} chapter={chapter} version={version}/>:<ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>}
    {version==="qeqchi" ? <QeqchiChapterAudio
      key={`${book.code}-${chapter}`}
      src={getQeqchiAudio(book.code,chapter)} bookName={book.name} chapter={chapter}
      verses={bibleChapter?.verses ?? []}
    /> : version==="rvr60" ? <BibleAudioControls language="rvr60"/> : null}

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
        <p>Intente cargarlo nuevamente o seleccione otra versión arriba. Puede continuar dentro de nuestra app.</p>
        <a className="btn" href={chapterLink(version)}>Volver a intentar</a>
      </div>
    )}

    {version==="asv" ? (
      <div className="bibliaAttribution">
        <p><strong>American Standard Version (ASV, 1901) · English.</strong><br/>
        Fuente: <a href={asvChapterUrl(book.code,chapter)} target="_blank" rel="noreferrer">YouVersion</a>.
        {bibleChapter && "copyright" in bibleChapter && bibleChapter.copyright ? ` ${bibleChapter.copyright}` : ""}</p>
        <p lang="en">Section headings are editorial reading aids from the <a href="https://berean.bible/terms.htm" target="_blank" rel="noreferrer">Berean Standard Bible (public domain)</a>, not part of the ASV text. Scripture text remains ASV from YouVersion.</p>
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

    {study?<StudyReadingNav plan={study.plan} day={study.day} chapter={chapter} version={version}/>:<>
      <ChapterControls slug={book.slug} chapter={chapter} total={book.chapters} query={versionQuery}/>
      <p><Link className="textLink" href={relatedPlan&&relatedDay?studyDayUrl(relatedPlan,relatedDay,version):"/estudios"}>Ir a Estudios bíblicos{relatedPlan?` · ${relatedPlan.book}`:""} →</Link></p>
    </>}

    <Link className="textLink" href={`/biblia${versionQuery}`}>← Volver a todos los libros</Link>
  </section>
 </>;
}
