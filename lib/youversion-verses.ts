export type YouVersionVerse = {number:number;text:string};

function attribute(attributes:string,name:string):string|undefined {
  return attributes.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*["']([^"']*)["']`,"i"))?.[1];
}

function decodeText(text:string):string {
  const entities:Record<string,string>={amp:"&",quot:'"',apos:"'",lt:"<",gt:">",nbsp:" ",rsquo:"’",lsquo:"‘",rdquo:"”",ldquo:"“",ndash:"–",mdash:"—",hellip:"…"};
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi,(whole,name:string)=>{
    if(name.startsWith("#")){
      const code=name[1].toLowerCase()==="x"?Number.parseInt(name.slice(2),16):Number(name.slice(1));
      return code>0&&code<=0x10ffff?String.fromCodePoint(code):whole;
    }
    return entities[name.toLowerCase()]??whole;
  });
}

// Markup verified against the live YouVersion ASV API. Render only plain text.
export function parseYouVersionVerses(html:string):YouVersionVerse[] {
  const markers:Array<{number:number;start:number;end:number}>=[];
  for(const match of html.matchAll(/<span\b([^>]*)>\s*<\/span>/gi)){
    if(!attribute(match[1],"class")?.split(/\s+/).includes("yv-v"))continue;
    const number=attribute(match[1],"v");
    if(!number||!/^\d+$/.test(number))return [];
    markers.push({number:Number(number),start:match.index!,end:match.index!+match[0].length});
  }
  if(!markers.length||markers[0].number!==1)return [];
  const verses:YouVersionVerse[]=[];
  for(let index=0;index<markers.length;index++){
    const marker=markers[index];
    if(marker.number!==index+1)return [];
    const fragment=html.slice(marker.end,markers[index+1]?.start??html.length)
      .replace(/<span\b([^>]*)>[\s\S]*?<\/span>/gi,(whole,attrs:string)=>
        attribute(attrs,"class")?.split(/\s+/).includes("yv-vlbl")?"":whole)
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,"")
      .replace(/<\/?(?:div|p|br|li)\b[^>]*>/gi," ")
      .replace(/<[^>]+>/g,"");
    const text=decodeText(fragment).replace(/\s+/g," ").trim();
    if(!text)return [];
    verses.push({number:marker.number,text});
  }
  return verses;
}
