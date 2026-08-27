import {NextResponse} from "next/server";
import {fetchAsvPassage} from "@/lib/youversion-asv";
import {parseYouVersionVerses} from "@/lib/youversion-verses";

export async function GET(){
  const result=await fetchAsvPassage("GEN",1);
  const verses=result.ok?parseYouVersionVerses(result.content):[];
  return NextResponse.json(result.ok?{
    provider:"youversion",version:"ASV",readable:verses.length>0,reference:result.reference,
    verseCount:verses.length,sample:verses.slice(0,2),copyright:result.copyright,
  }:{provider:"youversion",version:"ASV",readable:false,status:result.status,reason:result.reason},
  {headers:{"Cache-Control":"public, s-maxage=60"}});
}
