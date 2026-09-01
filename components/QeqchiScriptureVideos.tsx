"use client";

import { useEffect, useMemo, useState } from "react";

type ApiTarget = { label?: string; resources?: { video?: string[] } };
type ApiResponse = { ok?: boolean; targets?: ApiTarget[] };

const SCRIPTURE_EARTH = "https://www.scriptureearth.org";

function normalizeVideoUrl(value: string) {
  try { return new URL(value, SCRIPTURE_EARTH).toString(); } catch { return value; }
}

function rawName(url: string) {
  try {
    const pathname = new URL(url).pathname;
    return decodeURIComponent(pathname.split("/").pop() || "").replace(/\.(mp4|webm|mov)$/i, "");
  } catch { return ""; }
}

function spanishTitle(url: string, index: number) {
  const raw = rawName(url);
  const value = raw.toLowerCase().replace(/[_-]+/g, " ");
  const rules: Array<[RegExp,string]> = [
    [/buen.?samarit|good.?samarit/, "La parábola del buen samaritano"],
    [/zaque|zacchae/, "Jesús y Zaqueo"],
    [/paral[ií]tic|paralyt/, "Jesús sana a un paralítico"],
    [/transfigur/, "La transfiguración de Jesús"],
    [/bautiz|baptis/, "El bautismo de Jesús"],
    [/camina.*agua|walk.*water/, "Jesús camina sobre el agua"],
    [/magos|wise.?men|magi/, "La visita de los magos"],
    [/crucif/, "La crucifixión de Jesús"],
    [/resurrec|resurrect/, "La resurrección de Jesús"],
    [/saulo|saul/, "La conversión de Saulo"],
    [/nacim|birth/, "El nacimiento de Jesús"],
    [/tentaci|tempt/, "La tentación de Jesús"],
    [/sembrador|sower/, "La parábola del sembrador"],
    [/hijo.?pr[oó]digo|prodigal/, "La parábola del hijo pródigo"],
    [/oveja.?perdida|lost.?sheep/, "La oveja perdida"],
    [/entrada.*jerusal|triumph.*entry/, "La entrada triunfal en Jerusalén"],
    [/ultima.?cena|last.?supper/, "La última cena"],
    [/getseman|gethsemane/, "Jesús en Getsemaní"],
    [/ascensi|ascension/, "La ascensión de Jesús"],
  ];
  for (const [pattern,title] of rules) if (pattern.test(value)) return title;

  const lucas = value.match(/(?:luc|luke)[^0-9]*(\d{1,2})/);
  if (lucas) return `Evangelio de Lucas · capítulo ${Number(lucas[1])}`;
  const juan = value.match(/(?:juan|john|jhn)[^0-9]*(\d{1,2})/);
  if (juan) return `Evangelio de Juan · capítulo ${Number(juan[1])}`;
  const mateo = value.match(/(?:mat|matt|mateo)[^0-9]*(\d{1,2})/);
  if (mateo) return `Evangelio de Mateo · capítulo ${Number(mateo[1])}`;
  const hechos = value.match(/(?:hech|acts|act)[^0-9]*(\d{1,2})/);
  if (hechos) return `Hechos de los Apóstoles · capítulo ${Number(hechos[1])}`;

  return `Video bíblico en Q’eqchi’ ${index + 1}`;
}

function videoGroup(title: string) {
  const value = title.toLowerCase();
  if (value.includes("lucas")) return "Evangelio de Lucas";
  if (value.includes("juan")) return "Evangelio de Juan";
  if (value.includes("mateo")) return "Evangelio de Mateo";
  if (value.includes("hechos") || value.includes("saulo")) return "Hechos";
  if (value.includes("jesús") || value.includes("parábola") || value.includes("oveja")) return "Vida de Jesús";
  return "Historias bíblicas";
}

export default function QeqchiScriptureVideos() {
  const [videos,setVideos]=useState<string[]>([]);
  const [selected,setSelected]=useState(0);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [query,setQuery]=useState("");

  useEffect(()=>{
    let active=true;
    fetch("/api/scripture-earth/qeqchi?lang=kek&view=summary",{cache:"no-store"})
      .then(async response=>{ if(!response.ok) throw new Error(`HTTP ${response.status}`); return (await response.json()) as ApiResponse; })
      .then(body=>{ if(!active)return; const all=(body.targets||[]).flatMap(target=>target.resources?.video||[]); setVideos([...new Set(all.map(normalizeVideoUrl))]); })
      .catch(()=>{if(active)setError("No se pudieron cargar los videos en este momento.");})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[]);

  const current=videos[selected]||"";
  const title=useMemo(()=>spanishTitle(current,selected),[current,selected]);
  const filtered=useMemo(()=>{
    const needle=query.trim().toLowerCase();
    return videos.map((video,index)=>({video,index,title:spanishTitle(video,index)})).filter(item=>!needle||item.title.toLowerCase().includes(needle));
  },[videos,query]);

  return <section style={{margin:"30px 0 34px"}}>
    <div style={{marginBottom:14}}>
      <p style={{margin:"0 0 6px",color:"#e0aa37",fontWeight:800,letterSpacing:1.1,textTransform:"uppercase",fontSize:12}}>Videos bíblicos en Q’eqchi’</p>
      <h2 style={{margin:0,fontSize:"clamp(1.55rem,5vw,2.35rem)"}}>Escuchar y ver la Palabra</h2>
      <p style={{margin:"9px 0 0",color:"rgba(255,255,255,.74)",lineHeight:1.55}}>Audio original en Q’eqchi’ con títulos organizados en español. Seleccione cualquier video para reproducirlo aquí mismo.</p>
    </div>
    {loading&&<p style={{color:"rgba(255,255,255,.7)"}}>Cargando videos…</p>}
    {error&&<p style={{color:"#ffd7d7"}}>{error}</p>}
    {!loading&&!error&&videos.length>0&&<div className="qeqchi-video-grid">
      <div className="player-card">
        <video key={current} controls playsInline preload="metadata" style={{display:"block",width:"100%",aspectRatio:"16 / 9",background:"#000"}}><source src={current}/>Su navegador no puede reproducir este video.</video>
        <div style={{padding:"13px 15px"}}><span className="badge">{videoGroup(title)}</span><strong style={{display:"block",lineHeight:1.35}}>{title}</strong><span style={{display:"block",marginTop:5,color:"rgba(255,255,255,.58)",fontSize:12}}>Idioma del video: Q’eqchi’ · Fuente: Scripture Earth</span></div>
      </div>
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}><strong>{videos.length} videos disponibles</strong><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar título en español…" aria-label="Buscar videos Q’eqchi’" style={{flex:"1 1 190px",minWidth:0,borderRadius:999,border:"1px solid rgba(255,255,255,.16)",background:"rgba(255,255,255,.06)",color:"#fff",padding:"10px 13px",outline:"none"}}/></div>
        <div className="qeqchi-video-list">{filtered.map(item=>{const active=item.index===selected;return <button key={item.video} type="button" onClick={()=>setSelected(item.index)} style={{width:"100%",textAlign:"left",border:active?"1px solid #d7aa4b":"1px solid rgba(255,255,255,.08)",background:active?"rgba(215,170,75,.13)":"rgba(255,255,255,.025)",color:"#fff",borderRadius:13,padding:"11px 12px",cursor:"pointer",lineHeight:1.35}}><span style={{display:"block",color:"#e0aa37",fontWeight:800,fontSize:11,marginBottom:3}}>{videoGroup(item.title)}</span><span><strong style={{color:"#e0aa37",marginRight:7}}>{item.index+1}.</strong>{item.title}</span></button>})}</div>
        {filtered.length===0&&<p style={{color:"rgba(255,255,255,.66)"}}>No encontramos un video con ese título.</p>}
      </div>
    </div>}
    {!loading&&!error&&videos.length===0&&<p style={{color:"rgba(255,255,255,.7)"}}>Scripture Earth no devolvió videos para esta consulta.</p>}
    <style jsx>{`.qeqchi-video-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(280px,.9fr);gap:16px;align-items:start}.player-card{border:1px solid rgba(215,170,75,.45);border-radius:18px;overflow:hidden;background:#02080d;position:sticky;top:12px}.badge{display:inline-flex;margin-bottom:7px;padding:4px 8px;border-radius:999px;background:rgba(215,170,75,.13);color:#e0aa37;font-size:11px;font-weight:800}.qeqchi-video-list{display:grid;gap:7px;max-height:560px;overflow-y:auto;padding-right:4px}@media(max-width:780px){.qeqchi-video-grid{grid-template-columns:1fr}.player-card{position:static}.qeqchi-video-list{max-height:none}}`}</style>
  </section>;
}
