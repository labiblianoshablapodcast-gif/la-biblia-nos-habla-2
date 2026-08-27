import {fetchAsvPassage,ASV_NAME} from "@/lib/youversion-asv";
import {parseYouVersionVerses} from "@/lib/youversion-verses";

export function asvChapterUrl(code:string,chapter:number){
  return `https://www.bible.com/bible/12/${code}.${chapter}.ASV`;
}

export async function getAsvChapter(code:string,chapter:number){
  const result=await fetchAsvPassage(code,chapter);
  if(!result.ok)return null;
  const verses=parseYouVersionVerses(result.content);
  if(!verses.length)return null;
  return {
    translation:"ASV" as const,
    book:result.reference.replace(/\s+\d+$/, ""),
    chapter,verses,copyright:result.copyright,
    source:`${ASV_NAME} · YouVersion`,
  };
}
