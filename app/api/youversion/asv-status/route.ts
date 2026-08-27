import {NextResponse} from "next/server";
import {fetchAsvPassage} from "@/lib/youversion-asv";

export async function GET(){
  const result=await fetchAsvPassage("GEN",1);
  return NextResponse.json(result.ok?{
    provider:"youversion",version:"ASV",readable:true,reference:result.reference,
    // Public-domain text sample for validating the provider's verse markup.
    sample:result.content.slice(0,2400),characters:result.content.length,copyright:result.copyright,
  }:{provider:"youversion",version:"ASV",readable:false,status:result.status,reason:result.reason},
  {headers:{"Cache-Control":"public, s-maxage=60"}});
}
