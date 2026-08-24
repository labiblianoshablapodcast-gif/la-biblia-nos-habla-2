'use client';
import {useRouter} from "next/navigation";
import books from "@/data/bible-books.json";

export default function ChapterControls({
 slug,chapter,total,query=""
}:{slug:string;chapter:number;total:number;query?:string}){
 const router=useRouter();
 const go=(next:number|string)=>router.push(`/biblia/${slug}/${next}${query}`);
 const changeBook=(nextSlug:string)=>router.push(`/biblia/${nextSlug}/1${query}`);
 return <div className="chapterControls">
   <label>Libro
     <select value={slug} onChange={e=>changeBook(e.target.value)} aria-label="Cambiar libro de la Biblia">
       {books.map(book=><option key={book.slug} value={book.slug}>{book.name}</option>)}
     </select>
   </label>
   <button disabled={chapter<=1} onClick={()=>go(chapter-1)}>← Anterior</button>
   <label>Capítulo
     <select value={chapter} onChange={e=>go(e.target.value)}>
       {Array.from({length:total},(_,i)=><option key={i+1}>{i+1}</option>)}
     </select>
   </label>
   <button disabled={chapter>=total} onClick={()=>go(chapter+1)}>Siguiente →</button>
 </div>;
}
