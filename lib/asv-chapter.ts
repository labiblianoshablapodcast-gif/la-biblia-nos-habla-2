import {fetchAsvPassage,ASV_NAME} from "@/lib/youversion-asv";
import {parseYouVersionVerses} from "@/lib/youversion-verses";
import sectionHeadings from "@/data/english-section-headings.json";
import {withSectionHeadings} from "@/lib/section-headings";

const headingsByBook:Record<string,Record<string,Record<string,string>>>=sectionHeadings.books;

export function asvChapterUrl(code:string,chapter:number){
  return `https://www.bible.com/bible/12/${code}.${chapter}.ASV`;
}

export async function getAsvChapter(code:string,chapter:number){
  const result=await fetchAsvPassage(code,chapter);
  if(!result.ok)return null;
  const verses=withSectionHeadings(parseYouVersionVerses(result.content),headingsByBook[code]?.[String(chapter)]);
  if(!verses.length)return null;
  return {
    translation:"ASV" as const,
    book:result.reference.replace(/\s+\d+$/, ""),
    chapter,verses,copyright:result.copyright,
    source:`${ASV_NAME} · YouVersion`,
  };
}
