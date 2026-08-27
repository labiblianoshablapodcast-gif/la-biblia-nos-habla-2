type Verse={number:number;text:string;heading?:string};

// Headings are separate metadata: never change words, verse numbers, or offsets.
// Only attach titles to verses actually returned by the selected translation.
export function withSectionHeadings<T extends Verse>(verses:T[],headings:Record<string,string>={}) {
  return verses.map(verse=>{
    const heading=headings[String(verse.number)];
    return heading && !verse.heading ? {...verse,heading} : verse;
  });
}
