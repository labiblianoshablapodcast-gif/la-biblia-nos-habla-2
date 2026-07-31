import books from "@/data/bible-books.json";

export type BibleBook = typeof books[number];

export function getBook(slug:string): BibleBook | undefined {
  return books.find((book)=>book.slug===slug);
}

export type BibleChapter = {
  translation: "RVR1960";
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
  source?: string;
};

export async function getAuthorizedRVR1960Chapter(
  code:string,
  chapter:number
): Promise<BibleChapter | null> {
  const providerUrl=process.env.RVR1960_API_URL;
  const apiKey=process.env.RVR1960_API_KEY;

  if(!providerUrl || !apiKey) return null;

  const response=await fetch(
    `${providerUrl.replace(/\/$/,"")}/chapters/${code}/${chapter}`,
    {
      headers:{Authorization:`Bearer ${apiKey}`},
      next:{revalidate:86400}
    }
  );

  if(!response.ok) return null;

  const data=await response.json();

  return {
    translation:"RVR1960",
    book:data.book ?? code,
    chapter:Number(data.chapter ?? chapter),
    verses:Array.isArray(data.verses)
      ? data.verses.map((verse:{number:number;text:string})=>({
          number:Number(verse.number),
          text:String(verse.text)
        }))
      : [],
    source:data.source
  };
}

export { books };
