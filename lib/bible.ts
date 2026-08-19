import books from "@/data/bible-books.json";

export type BibleBook = typeof books[number];
export type BibleVerse = { number:number; text:string };
export type BibleChapter = {
  translation:"RVR60";
  book:string;
  chapter:number;
  verses:BibleVerse[];
  source:string;
};

const BIBLIA_BOOKS:Record<string,string>={
  GEN:"Genesis",EXO:"Exodus",LEV:"Leviticus",NUM:"Numbers",DEU:"Deuteronomy",
  JOS:"Joshua",JDG:"Judges",RUT:"Ruth","1SA":"1 Samuel","2SA":"2 Samuel",
  "1KI":"1 Kings","2KI":"2 Kings","1CH":"1 Chronicles","2CH":"2 Chronicles",
  EZR:"Ezra",NEH:"Nehemiah",EST:"Esther",JOB:"Job",PSA:"Psalms",
  PRO:"Proverbs",ECC:"Ecclesiastes",SNG:"Song of Songs",ISA:"Isaiah",
  JER:"Jeremiah",LAM:"Lamentations",EZK:"Ezekiel",DAN:"Daniel",HOS:"Hosea",
  JOL:"Joel",AMO:"Amos",OBA:"Obadiah",JON:"Jonah",MIC:"Micah",NAM:"Nahum",
  HAB:"Habakkuk",ZEP:"Zephaniah",HAG:"Haggai",ZEC:"Zechariah",MAL:"Malachi",
  MAT:"Matthew",MRK:"Mark",LUK:"Luke",JHN:"John",ACT:"Acts",ROM:"Romans",
  "1CO":"1 Corinthians","2CO":"2 Corinthians",GAL:"Galatians",EPH:"Ephesians",
  PHP:"Philippians",COL:"Colossians","1TH":"1 Thessalonians","2TH":"2 Thessalonians",
  "1TI":"1 Timothy","2TI":"2 Timothy",TIT:"Titus",PHM:"Philemon",HEB:"Hebrews",
  JAS:"James","1PE":"1 Peter","2PE":"2 Peter","1JN":"1 John","2JN":"2 John",
  "3JN":"3 John",JUD:"Jude",REV:"Revelation"
};

export function getBook(slug:string): BibleBook | undefined {
  return books.find((book)=>book.slug===slug);
}

export function chapterUrl(code:string, chapter:number) {
  const book=BIBLIA_BOOKS[code] ?? code;
  return `https://biblia.com/bible/rvr60/${encodeURIComponent(book)}/${chapter}`;
}

function parseVerses(text:string):BibleVerse[]{
  const verses:BibleVerse[]=[];
  const marker=/<<<VERSE:(\d+)>>>([\s\S]*?)(?=<<<VERSE:\d+>>>|$)/g;
  for(const match of text.matchAll(marker)){
    const clean=match[2]
      .replace(/^\s*\d+\s*\|\s*/,"")
      .replace(/\s+/g," ")
      .trim();
    if(clean)verses.push({number:Number(match[1]),text:clean});
  }
  return verses;
}

export {books};

export async function getChapter(code:string, chapter:number): Promise<BibleChapter | null> {
  const apiKey=process.env.BIBLIA_API_KEY1 ?? process.env.BIBLIA_API_KEY;
  const book=BIBLIA_BOOKS[code];
  if(!apiKey || !book)return null;

  const query=new URLSearchParams({
    passage:`${book} ${chapter}`,
    formatting:"none",
    redLetter:"false",
    footnotes:"false",
    citation:"false",
    paragraphs:"false",
    header:"",
    eachVerse:"<<<VERSE:[VerseNum]>>>[VerseText]",
    footer:"",
    key:apiKey
  });

  try{
    const response=await fetch(
      `https://api.biblia.com/v1/bible/content/RVR60.txt?${query.toString()}`,
      {next:{revalidate:3600}}
    );
    if(!response.ok)return null;

    const verses=parseVerses(await response.text());
    if(!verses.length)return null;

    return {
      translation:"RVR60",
      book,
      chapter,
      verses,
      source:"Reina-Valera Revisada 1960 · Biblia.com · Logos Bible Software"
    };
  }catch{
    return null;
  }
}
