import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const BASE = "https://4.dbt.io/api";

function key() {
  return process.env.BIBLE_BRAIN_API_KEY || process.env.BIBLEBRAIN_API_KEY || process.env.DBP_API_KEY || process.env.FCBH_API_KEY || "";
}
async function call(path: string, k: string, params: Record<string,string> = {}) {
  const u = new URL(BASE + path);
  u.searchParams.set("v","4"); u.searchParams.set("key",k);
  Object.entries(params).forEach(([a,b]) => u.searchParams.set(a,b));
  const r = await fetch(u.toString(), {cache:"no-store", headers:{Accept:"application/json"}});
  const t = await r.text(); let d:any;
  try { d = JSON.parse(t); } catch { d = t.slice(0,1200); }
  return {status:r.status, ok:r.ok, data:d};
}
function strings(v:any, out:string[]=[]):string[] {
  if(typeof v==="string") out.push(v);
  else if(Array.isArray(v)) v.forEach(x=>strings(x,out));
  else if(v && typeof v==="object") Object.values(v).forEach(x=>strings(x,out));
  return out;
}
function ids(v:any):string[] {
  const s=new Set<string>();
  const walk=(x:any)=>{
    if(Array.isArray(x)) return x.forEach(walk);
    if(!x||typeof x!=="object") return;
    for(const z of [x.fileset_id,x.filesetId,x.fileset]) if(typeof z==="string") s.add(z);
    Object.values(x).forEach(walk);
  }; walk(v); return [...s];
}
export async function GET() {
  const k=key();
  if(!k) return NextResponse.json({ok:false,error:"Falta BIBLE_BRAIN_API_KEY"},{status:503});

  // KEKIBS is the confirmed Q'eqchi' Bible from the prior API response.
  const bible=await call("/bibles/KEKIBS",k);
  const bibleText=strings(bible.data).join(" ");
  const confirmed=/Q.?eqchi|Kekchi|Quecchi|Cacce|Kekch/i.test(bibleText);

  // Probe the documented fileset/file discovery shapes and known NT fileset,
  // then explicitly test representative OT books.
  const discovery=await Promise.all([
    call("/bibles/KEKIBS/filesets",k),
    call("/filesets/KEKIBSN2DA",k),
    call("/bibles/KEKIBS",k,{media:"audio"}),
  ]);

  const discovered=[...new Set(discovery.flatMap(x=>ids(x.data)))];
  if(!discovered.includes("KEKIBSN2DA")) discovered.push("KEKIBSN2DA");

  const candidateOt=[
    "KEKIBSO1DA","KEKIBSO2DA","KEKIBSO1DA-opus16","KEKIBSO2DA-opus16",
    "KEKIBSC1DA","KEKIBSC2DA","KEKIBSC1DA-opus16","KEKIBSC2DA-opus16"
  ];

  const probeFileset=async(fs:string, book:string, chapter:string)=>{
    const variants=await Promise.all([
      call(`/bibles/filesets/${fs}/${book}/${chapter}`,k),
      call(`/bibles/filesets/${fs}/${book}/${chapter}`,k,{verse_start:"1"}),
      call(`/bibles/filesets/${fs}`,k,{book_id:book,chapter}),
    ]);
    const text=variants.map(v=>strings(v.data).join(" ")).join(" ");
    const hasMedia=/https?:\/\/|\.mp3|\.opus|\.m4a|audio/i.test(text);
    return {fileset:fs,book,chapter,statuses:variants.map(v=>v.status),hasMedia,sample:hasMedia?text.slice(0,450):undefined};
  };

  // Genesis, Psalms and Malachi prove coverage across beginning/middle/end of OT.
  const otTests:any[]=[];
  for(const fs of candidateOt){
    const g=await probeFileset(fs,"GEN","1");
    if(g.hasMedia || g.statuses.some((x:number)=>x===200)) otTests.push(g);
  }
  // Control: known NT audio should succeed if endpoint/key access is healthy.
  const ntControl=await probeFileset("KEKIBSN2DA","MAT","1");

  const usableOt=otTests.filter(x=>x.hasMedia);
  let breadth:any[]=[];
  for(const hit of usableOt.slice(0,2)){
    breadth.push(await probeFileset(hit.fileset,"PSA","1"));
    breadth.push(await probeFileset(hit.fileset,"MAL","1"));
  }

  return NextResponse.json({
    ok:bible.ok,
    language:"Q'eqchi'",
    iso639_3:"kek",
    confirmedQeqchiBible:confirmed,
    bibleId:"KEKIBS",
    bibleStatus:bible.status,
    discoveredFilesets:discovered,
    ntControl,
    otGenesisCandidates:otTests,
    otBreadthTests:breadth,
    conclusion: usableOt.length
      ? "Se encontro audio candidato del AT. Revise Genesis/Salmos/Malaquias para confirmar cobertura."
      : "La API aprobada funciona, pero no se encontro un fileset de audio del AT bajo KEKIBS con los identificadores estandar probados."
  },{headers:{"Cache-Control":"no-store"}});
}
