import books from "@/data/bible-books.json";

export type BibleBook = typeof books[number];
export type BibleVerse = { number:number; text:string };
export type BibleChapter = {
  translation:"RV1909";
  book:string;
  chapter:number;
  verses:BibleVerse[];
  source:string;
};

export function getBook(slug:string): BibleBook | undefined {
  return books.find((book)=>book.slug===slug);
}

export function chapterUrl(code:string, chapter:number) {
  return `https://ebible.org/spaRV1909/${code}${String(chapter).padStart(2,"0")}.htm`;
}

function decodeEntities(text:string) {
  return text
    .replace(/&nbsp;/g," ")
    .replace(/&aacute;/g,"á").replace(/&eacute;/g,"é").replace(/&iacute;/g,"í")
    .replace(/&oacute;/g,"ó").replace(/&uacute;/g,"ú").replace(/&ntilde;/g,"ñ")
    .replace(/&Aacute;/g,"Á").replace(/&Eacute;/g,"É").replace(/&Iacute;/g,"Í")
    .replace(/&Oacute;/g,"Ó").replace(/&Uacute;/g,"Ú").replace(/&Ntilde;/g,"Ñ")
    .replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,"&")
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
}

function htmlToText(html:string) {
  const body=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return decodeEntities(
    body
      .replace(/<script[\s\S]*?<\/script>/gi," ")
      .replace(/<style[\s\S]*?<\/style>/gi," ")
      .replace(/<nav[\s\S]*?<\/nav>/gi," ")
      .replace(/<header[\s\S]*?<\/header>/gi," ")
      .replace(/<footer[\s\S]*?<\/footer>/gi," ")
      .replace(/<br\s*\/?>/gi,"\n")
      .replace(/<\/p>/gi,"\n")
      .replace(/<[^>]+>/g," ")
      .replace(/[ \t]+/g," ")
      .replace(/\n\s+/g,"\n")
      .replace(/\n{2,}/g,"\n")
      .trim()
  );
}

function extractVerses(text:string): BibleVerse[] {
  const lines=text.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  const verses:BibleVerse[]=[];
  let current: BibleVerse | null=null;

  for(const line of lines){
    const match=line.match(/^(\d+)\s+(.+)$/);
    if(match){
      if(current) verses.push(current);
      current={number:Number(match[1]),text:match[2].trim()};
    }else if(current){
      current.text += " " + line;
    }
  }
  if(current) verses.push(current);

  if(!verses.length){
    const fallback=text.match(/(?:^|\s)(\d{1,3})\s+([^\d]+?)(?=(?:\s\d{1,3}\s)|$)/g) ?? [];
    return fallback.map(chunk=>{
      const m=chunk.trim().match(/^(\d+)\s+([\s\S]+)$/);
      return {number:Number(m?.[1] ?? 0),text:(m?.[2] ?? "").trim()};
    }).filter(v=>v.number>0 && v.text);
  }
  return verses;
}

export async function getChapter(code:string, chapter:number): Promise<BibleChapter | null> {
  try{
    const response=await fetch(chapterUrl(code,chapter),{next:{revalidate:86400}});
    if(!response.ok) return null;
    const html=await response.text();
    const text=htmlToText(html);
    const verses=extractVerses(text);
    if(!verses.length) return null;
    return {
      translation:"RV1909",
      book:code,
      chapter,
      verses,
      source:"eBible.org · Reina-Valera 1909 · Dominio público"
    };
  }catch{
    return null;
  }
}

export { books };
