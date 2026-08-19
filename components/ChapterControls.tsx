'use client';
import {useRouter} from "next/navigation";

export default function ChapterControls({
 slug,chapter,total,query=""
}:{slug:string;chapter:number;total:number;query?:string}){
 const router=useRouter();
 const go=(next:number|string)=>router.push(`/biblia/${slug}/${next}${query}`);
 return <div className="chapterControls">
   <button disabled={chapter<=1} onClick={()=>go(chapter-1)}>← Anterior</button>
   <label>Capítulo
     <select value={chapter} onChange={e=>go(e.target.value)}>
       {Array.from({length:total},(_,i)=><option key={i+1}>{i+1}</option>)}
     </select>
   </label>
   <button disabled={chapter>=total} onClick={()=>go(chapter+1)}>Siguiente →</button>
 </div>;
}
