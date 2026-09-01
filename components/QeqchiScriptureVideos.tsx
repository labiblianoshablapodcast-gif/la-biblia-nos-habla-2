"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ApiTarget = { resources?: { video?: string[] } };
type ApiResponse = { targets?: ApiTarget[] };
const SCRIPTURE_EARTH = "https://www.scriptureearth.org";

function normalizeVideoUrl(value:string){try{return new URL(value,SCRIPTURE_EARTH).toString()}catch{return value}}
function rawName(url:string){try{return decodeURIComponent(new URL(url).pathname.split("/").pop()||"").replace(/\.(mp4|webm|mov)$/i,"")}catch{return ""}}
function spanishTitle(url:string,index:number){const value=rawName(url).toLowerCase().replace(/[_-]+/g," ");const rules:Array<[RegExp,string]>=[[/buen.?samarit|good.?samarit/,"La parábola del buen samaritano"],[/zaque|zacchae/,"Jesús y Zaqueo"],[/paral[ií]tic|paralyt/,"Jesús sana a un paralítico"],[/calma.*torment|storm/,"Jesús calma la tormenta"],[/camina.*agua|walk.*water/,"Jesús camina sobre el agua"],[/saulo|saul/,"La conversión de Saulo"],[/crucif/,"La crucifixión de Jesús"],[/resurrec|resurrect/,"La resurrección de Jesús"],[/nacim|birth/,"El nacimiento de Jesús"]];for(const [pattern,title] of rules)if(pattern.test(value))return title;const lucas=value.match(/(?:luc|luke)[^0-9]*(\d{1,2})/);if(lucas)return `Evangelio de Lucas · capítulo ${Number(lucas[1])}`;const juan=value.match(/(?:juan|john|jhn)[^0-9]*(\d{1,2})/);if(juan)return `Evangelio de Juan · capítulo ${Number(juan[1])}`;return `Video bíblico en Q’eqchi’ ${index+1}`}
function group(title:string){const v=title.toLowerCase();if(v.includes("lucas"))return"Evangelio de Lucas";if(v.includes("juan"))return"Evangelio de Juan";if(v.includes("saulo"))return"Hechos";return"Historias bíblicas"}
function clock(value:number){if(!Number.isFinite(value))return"0:00";const m=Math.floor(value/60),s=Math.floor(value%60);return `${m}:${String(s).padStart(2,"0")}`}
function artwork(title:string){const v=title.toLowerCase();if(v.includes("nacimiento"))return"/images/qeqchi/nativity-modern-approved.jpg";if(v.includes("paralítico"))return"/images/qeqchi/jesus-sana-paralitico-modern.jpg";if(v.includes("samaritano"))return"/images/qeqchi/buen-samaritano-modern.jpg";if(v.includes("zaqueo"))return"/images/qeqchi/jesus-zaqueo-modern.jpg";if(v.includes("saulo"))return"/images/qeqchi/conversion-saulo-modern.jpg";if(v.includes("tormenta"))return"/images/qeqchi/jesus-calma-tormenta-modern.jpg";if(v.includes("crucifixión"))return"/images/qeqchi/crucifixion-jesus-modern.jpg";if(v.includes("resurrección"))return"/images/qeqchi/resurreccion-jesus-modern.jpg";return""}

export default function QeqchiScriptureVideos(){
 const mediaRef=useRef<HTMLVideoElement>(null);
 const [videos,setVideos]=useState<string[]>([]),[selected,setSelected]=useState(0),[loading,setLoading]=useState(true),[error,setError]=useState(""),[query,setQuery]=useState("");
 const [playing,setPlaying]=useState(false),[time,setTime]=useState(0),[duration,setDuration]=useState(0),[volume,setVolume]=useState(1);
 useEffect(()=>{let active=true;fetch("/api/scripture-earth/qeqchi?lang=kek&view=summary",{cache:"no-store"}).then(async r=>{if(!r.ok)throw new Error();return await r.json() as ApiResponse}).then(body=>{if(active){const ordered=[...new Set((body.targets||[]).flatMap(t=>t.resources?.video||[]).map(normalizeVideoUrl))];ordered.sort((a,b)=>Number(!spanishTitle(a,0).includes("nacimiento"))-Number(!spanishTitle(b,0).includes("nacimiento")));setVideos(ordered)}}).catch(()=>active&&setError("No se pudieron cargar los videos en este momento.")).finally(()=>active&&setLoading(false));return()=>{active=false}},[]);
 const current=videos[selected]||"",title=useMemo(()=>spanishTitle(current,selected),[current,selected]);
 const modernArtwork=artwork(title);
 useEffect(()=>{setPlaying(false);setTime(0);setDuration(0)},[current]);
 const toggle=()=>{const m=mediaRef.current;if(!m)return;if(m.paused)m.play();else m.pause()};
 const filtered=useMemo(()=>{const n=query.trim().toLowerCase();return videos.map((video,index)=>({video,index,title:spanishTitle(video,index)})).filter(x=>!n||x.title.toLowerCase().includes(n))},[videos,query]);
 return <section className="shell">
  <header><span className="eyebrow">🎬 VIDEOS EN Q’EQCHI’</span><h2>Enseñanzas de la Biblia</h2><p>Escucha la Palabra de Dios en Q’eqchi’ con una presentación renovada para nuestra comunidad.</p></header>
  {loading&&<p>Cargando videos…</p>}{error&&<p>{error}</p>}
  {!loading&&!error&&videos.length>0&&<div className="layout">
   <article className="playerCard">
    <div className="stage">
      <video ref={mediaRef} key={current} className={`mediaVideo ${modernArtwork?"behindPoster":""}`} playsInline preload="auto" onClick={toggle} onLoadedMetadata={e=>setDuration(e.currentTarget.duration)} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)}><source src={current} type="video/mp4"/></video>
      {modernArtwork&&<button className="modernPoster" style={{backgroundImage:`url(${modernArtwork})`}} onClick={toggle} aria-label={playing?`Pausar ${title}`:`Reproducir ${title}`}/>}
      <div className="controls">
       <button onClick={toggle} aria-label={playing?"Pausar":"Reproducir"}>{playing?"❚❚":"▶"}</button>
       <span>{clock(time)}</span><input className="seek" type="range" min="0" max={duration||0} step="0.1" value={Math.min(time,duration||0)} onChange={e=>{const m=mediaRef.current;if(m){m.currentTime=Number(e.target.value);setTime(m.currentTime)}}}/><span>-{clock(Math.max(0,duration-time))}</span>
       <span>🔊</span><input className="vol" type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>{const v=Number(e.target.value);setVolume(v);if(mediaRef.current)mediaRef.current.volume=v}}/>
      </div>
    </div>
    <div className="details"><span className="pill">Q’eqchi’</span><h3>{title}</h3><p>🔊 Audio original · 🎬 Experiencia visual renovada</p></div>
   </article>
   <aside><div className="listHead"><strong>Lista de videos</strong><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar…"/></div><div className="list">{filtered.map(item=><button key={item.video} onClick={()=>setSelected(item.index)} className={item.index===selected?"active":""}><b>{item.index+1}</b><span><small>{group(item.title)}</small>{item.title}</span></button>)}</div></aside>
  </div>}
  <style jsx>{`
   .shell{margin:28px 0 38px;color:#fff}.eyebrow{color:#e7b33e;font-size:12px;font-weight:900;letter-spacing:1.3px}header h2{font-size:clamp(1.8rem,5vw,2.7rem);margin:7px 0}header p{color:#c8cdd1;margin:0 0 20px;max-width:720px}.layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(290px,.75fr);gap:18px}.playerCard,aside{background:linear-gradient(145deg,#071019,#02070b);border:1px solid rgba(231,179,62,.25);border-radius:18px;overflow:hidden}.stage{position:relative;aspect-ratio:16/9;background:#000;overflow:hidden}.mediaVideo{position:absolute;inset:0 0 54px;width:100%;height:calc(100% - 54px);display:block;background:#000;object-fit:cover;cursor:pointer}.mediaVideo.behindPoster{opacity:0}.modernPoster{position:absolute;inset:0 0 54px;width:100%;height:calc(100% - 54px);border:0;background-position:center;background-size:cover;background-repeat:no-repeat;cursor:pointer}.controls{position:absolute;left:0;right:0;bottom:0;height:54px;display:flex;align-items:center;gap:9px;padding:0 12px;background:#05090c;color:#fff;font-size:12px}.controls button{border:0;background:transparent;color:white;font-size:19px;padding:6px;cursor:pointer}.seek{min-width:0;flex:1;accent-color:#e4ad35}.vol{width:70px;accent-color:#e4ad35}.details{padding:15px 18px}.details h3{font-size:1.35rem;margin:9px 0 5px}.details p{margin:0;color:#aeb7bd;font-size:13px}.pill{display:inline-block;padding:4px 9px;border-radius:999px;background:rgba(231,179,62,.14);color:#efbb46;font-size:11px;font-weight:800}.listHead{padding:15px;border-bottom:1px solid rgba(255,255,255,.08)}.listHead input{margin-top:10px;width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);border-radius:999px;background:#0b141b;color:white;padding:9px 12px}.list{max-height:590px;overflow:auto;padding:8px}.list button{width:100%;display:flex;gap:10px;align-items:center;text-align:left;background:transparent;color:#fff;border:1px solid transparent;border-radius:12px;padding:10px;cursor:pointer}.list button.active{border-color:#dba932;background:rgba(219,169,50,.1)}.list button b{display:grid;place-items:center;min-width:28px;height:28px;border-radius:8px;background:#17212a;color:#eab441}.list button span{display:grid;gap:2px}.list button small{color:#d7a83d;font-size:10px;font-weight:800}@media(max-width:800px){.layout{grid-template-columns:1fr}.controls{gap:6px;padding:0 9px}.vol{display:none}.list{max-height:none}}
  `}</style>
 </section>
}
