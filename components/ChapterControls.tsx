'use client';
import {useRouter} from "next/navigation";

export default function ChapterControls({slug,chapter,total}:{slug:string;chapter:number;total:number}){
 const router=useRouter();
 return <div className="chapterControls">
   <button disabled={chapter<=1} onClick={()=>router.push(`/biblia/${slug}/${chapter-1}`)}>← Anterior</button>
   <label>Capítulo
     <select value={chapter} onChange={e=>router.push(`/biblia/${slug}/${e.target.value}`)}>
       {Array.from({length:total},(_,i)=><option key={i+1}>{i+1}</option>)}
     </select>
   </label>
   <button disabled={chapter>=total} onClick={()=>router.push(`/biblia/${slug}/${chapter+1}`)}>Siguiente →</button>
 </div>;
}
