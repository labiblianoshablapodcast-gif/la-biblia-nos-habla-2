"use client";

import { useEffect, useMemo, useState } from "react";

type ApiTarget = { resources?: { video?: string[] } };
type ApiResponse = { targets?: ApiTarget[] };
const SCRIPTURE_EARTH = "https://www.scriptureearth.org";

function normalizeVideoUrl(value:string){try{return new URL(value,SCRIPTURE_EARTH).toString()}catch{return value}}
function rawName(url:string){try{return decodeURIComponent(new URL(url).pathname.split("/").pop()||"").replace(/\.(mp4|webm|mov)$/i,"")}catch{return ""}}
function spanishTitle(url:string,index:number){
 const value=rawName(url).toLowerCase().replace(/[_-]+/g," ");
 const rules:Array<[RegExp,string,string]>=[
  [/buen.?samarit|good.?samarit/,"La parábola del buen samaritano","Lucas 10:25-37"],
  [/zaque|zacchae/,"Jesús y Zaqueo","Lucas 19:1-10"],
  [/paral[ií]tic|paralyt/,"Jesús sana a un paralítico","Lucas 5:17-26"],
  [/camina.*agua|walk.*water/,"Jesús camina sobre el agua","Mateo 14:22-36"],
  [/saulo|saul/,"La conversión de Saulo","Hechos 9:1-19"],
  [/crucif/,"La crucifixión de Jesús","Evangelios"],
  [/resurrec|resurrect/,"La resurrección de Jesús","Evangelios"],
  [/nacim|birth/,"El nacimiento de Jesús","Lucas 2"],
 ];
 for(const [pattern,title] of rules)if(pattern.test(value))return title;
 const lucas=value.match(/(?:luc|luke)[^0-9]*(\d{1,2})/);if(lucas)return `Evangelio de Lucas · capítulo ${Number(lucas[1])}`;
 const juan=value.match(/(?:juan|john|jhn)[^0-9]*(\d{1,2})/);if(juan)return `Evangelio de Juan · capítulo ${Number(juan[1])}`;
 return `Video bíblico en Q’eqchi’ ${index+1}`;
}
function group(title:string){const v=title.toLowerCase();if(v.includes("lucas"))return"Evangelio de Lucas";if(v.includes("juan"))return"Evangelio de Juan";if(v.includes("saulo"))return"Hechos";return"Historias bíblicas"}

export default function QeqchiScriptureVideos(){
 const [videos,setVideos]=useState<string[]>([]),[selected,setSelected]=useState(0),[loading,setLoading]=useState(true),[error,setError]=useState(""),[query,setQuery]=useState("");
 useEffect(()=>{let active=true;fetch("/api/scripture-earth/qeqchi?lang=kek&view=summary",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error();return await r.json() as ApiResponse}).then(body=>{if(active)setVideos([...new Set((body.targets||[]).flatMap(t=>t.resources?.video||[]).map(normalizeVideoUrl))])}).catch(()=>active&&setError("No se pudieron cargar los videos en este momento.")).finally(()=>active&&setLoading(false));return()=>{active=false}},[]);
 const current=videos[selected]||"",title=useMemo(()=>spanishTitle(current,selected),[current,selected]);
 const filtered=useMemo(()=>{const n=query.trim().toLowerCase();return videos.map((video,index)=>({video,index,title:spanishTitle(video,index)})).filter(x=>!n||x.title.toLowerCase().includes(n))},[videos,query]);
 return <section className="shell">
  <header><span className="eyebrow">🎬 VIDEOS EN Q’EQCHI’</span><h2>Enseñanzas de la Biblia</h2><p>Escucha la Palabra de Dios en Q’eqchi’ con una presentación renovada para nuestra comunidad.</p></header>
  {loading&&<p>Cargando videos…</p>}{error&&<p>{error}</p>}
  {!loading&&!error&&videos.length>0&&<div className="layout">
   <article className="playerCard">
    <div className="stage"><video key={current} controls playsInline preload="metadata"><source src={current}/></video><div className="cinemaFrame" aria-hidden="true"><div className="glow"/><div className="sceneCopy"><span>{group(title)}</span><h3>{title}</h3><p>Audio original en Q’eqchi’</p></div></div></div>
    <div className="details"><span className="pill">Q’eqchi’</span><h3>{title}</h3><p>🔊 Audio original · 🎬 Nueva experiencia visual en preparación</p></div>
   </article>
   <aside><div className="listHead"><strong>Lista de videos</strong><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar…"/></div><div className="list">{filtered.map(item=><button key={item.video} onClick={()=>setSelected(item.index)} className={item.index===selected?"active":""}><b>{item.index+1}</b><span><small>{group(item.title)}</small>{item.title}</span></button>)}</div></aside>
  </div>}
  <style jsx>{`
   .shell{margin:28px 0 38px;color:#fff}.eyebrow{color:#e7b33e;font-size:12px;font-weight:900;letter-spacing:1.3px}header h2{font-size:clamp(1.8rem,5vw,2.7rem);margin:7px 0}header p{color:#c8cdd1;margin:0 0 20px;max-width:720px}.layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(290px,.75fr);gap:18px}.playerCard,aside{background:linear-gradient(145deg,#071019,#02070b);border:1px solid rgba(231,179,62,.25);border-radius:18px;overflow:hidden}.stage{position:relative;aspect-ratio:16/9;background:#000}.stage video{width:100%;height:100%;display:block}.cinemaFrame{pointer-events:none;position:absolute;inset:0 0 52px;background:radial-gradient(circle at 65% 35%,rgba(185,128,42,.28),transparent 35%),linear-gradient(135deg,#17261f 0%,#26372c 35%,#6d4b28 68%,#16100b 100%);overflow:hidden}.cinemaFrame:before{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.82),transparent 58%),radial-gradient(circle at 28% 35%,rgba(255,220,150,.18),transparent 23%)}.glow{position:absolute;width:45%;height:80%;right:7%;top:7%;border-radius:50%;background:radial-gradient(circle,rgba(255,202,108,.18),transparent 68%)}.sceneCopy{position:absolute;z-index:2;left:6%;right:6%;bottom:9%}.sceneCopy span{color:#efbb46;font-weight:800;font-size:12px;text-transform:uppercase;letter-spacing:1px}.sceneCopy h3{font-size:clamp(1.45rem,4vw,2.55rem);max-width:680px;margin:7px 0}.sceneCopy p{margin:0;color:#e2e2e2}.details{padding:15px 18px}.details h3{font-size:1.35rem;margin:9px 0 5px}.details p{margin:0;color:#aeb7bd;font-size:13px}.pill{display:inline-block;padding:4px 9px;border-radius:999px;background:rgba(231,179,62,.14);color:#efbb46;font-size:11px;font-weight:800}.listHead{padding:15px;border-bottom:1px solid rgba(255,255,255,.08)}.listHead input{margin-top:10px;width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:#0b141b;color:white;padding:9px 12px}.list{max-height:590px;overflow:auto;padding:8px}.list button{width:100%;display:flex;gap:10px;align-items:center;text-align:left;background:transparent;color:#fff;border:1px solid transparent;border-radius:12px;padding:10px;cursor:pointer}.list button.active{border-color:#dba932;background:rgba(219,169,50,.1)}.list button b{display:grid;place-items:center;min-width:28px;height:28px;border-radius:8px;background:#17212a;color:#eab441}.list button span{display:grid;gap:2px}.list button small{color:#d7a83d;font-size:10px;font-weight:800}@media(max-width:800px){.layout{grid-template-columns:1fr}.cinemaFrame{inset:0 0 48px}.list{max-height:none}}
  `}</style>
 </section>
}