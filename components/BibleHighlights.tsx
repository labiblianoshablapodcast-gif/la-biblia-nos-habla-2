'use client';

import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from "react";
import {mergeRanges,parseHighlights,subtractRange,textSegments,type ChapterHighlights,type HighlightRange} from "@/lib/bible-highlights";
import styles from "./BibleHighlights.module.css";

type SelectionPart = HighlightRange & {number:number;text:string};
const HighlightContext = createContext<{
  saved:ChapterHighlights;
  choose:(parts:SelectionPart[])=>void;
}>({saved:{},choose:()=>{}});

export function BibleHighlights({chapterKey,children}:{chapterKey:string;children:ReactNode}) {
  // The keyed inner component prevents selections/state leaking across navigation.
  return <HighlightSession key={chapterKey} storageKey={`bible-highlights-v1-${chapterKey}`}>{children}</HighlightSession>;
}

function HighlightSession({storageKey,children}:{storageKey:string;children:ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const [saved,setSaved] = useState<ChapterHighlights>({});
  const [pending,setPending] = useState<SelectionPart[]>([]);
  const [ready,setReady] = useState(false);
  const [message,setMessage] = useState("");

  useEffect(()=>{
    function load() {
      try {setSaved(parseHighlights(localStorage.getItem(storageKey)));setReady(true);}
      catch {setMessage("No se pudieron leer sus resaltados. No se modificó lo guardado.");setReady(false);}
    }
    load();
    function sync(event:StorageEvent) {if (event.key === storageKey || event.key === null) load();}
    window.addEventListener("storage",sync);
    return ()=>window.removeEventListener("storage",sync);
  },[storageKey]);

  useEffect(()=>{
    function capture() {
      const selection = window.getSelection();
      // Keep the captured offsets when tapping the toolbar collapses selection (iOS).
      if (!selection || selection.isCollapsed || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const elementFor = (node:Node)=>node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
      const start = elementFor(range.startContainer)?.closest("[data-highlight-verse]");
      const end = elementFor(range.endContainer)?.closest("[data-highlight-verse]");
      if (!start || !end || !root.current?.contains(start) || !root.current.contains(end)) {setPending([]);return;}
      const parts:SelectionPart[] = [];
      root.current.querySelectorAll<HTMLElement>("[data-highlight-verse]").forEach(element=>{
        if (!range.intersectsNode(element)) return;
        const text = element.textContent || "";
        const prefix = document.createRange();
        prefix.selectNodeContents(element);
        let from = 0, to = text.length;
        if (element.contains(range.startContainer)) {prefix.setEnd(range.startContainer,range.startOffset);from=prefix.toString().length;}
        if (element.contains(range.endContainer)) {prefix.selectNodeContents(element);prefix.setEnd(range.endContainer,range.endOffset);to=prefix.toString().length;}
        while (from < to && /\s/.test(text[from])) from++;
        while (to > from && /\s/.test(text[to-1])) to--;
        if (to > from) parts.push({number:Number(element.dataset.highlightVerse),text,start:from,end:to});
      });
      if (parts.length) {setPending(parts);setMessage("");}
    }
    document.addEventListener("selectionchange",capture);
    return ()=>document.removeEventListener("selectionchange",capture);
  },[]);

  function choose(parts:SelectionPart[]) {setPending(parts);setMessage("");}
  function close() {setPending([]);window.getSelection()?.removeAllRanges();}
  function apply(remove:boolean) {
    if (!ready || !pending.length) return;
    try {
      // Re-read before writing to preserve changes made in another open tab.
      const next = parseHighlights(localStorage.getItem(storageKey));
      for (const part of pending) {
        const ranges = next[part.number]?.text === part.text ? next[part.number].ranges : [];
        const updated = remove ? subtractRange(ranges,part) : mergeRanges([...ranges,{start:part.start,end:part.end}]);
        if (updated.length) next[part.number] = {text:part.text,ranges:updated};
        else delete next[part.number];
      }
      localStorage.setItem(storageKey,JSON.stringify(next));
      setSaved(next);close();setMessage(remove ? "Resaltado quitado." : "Resaltado guardado en este dispositivo.");
    } catch {setMessage("No se pudo guardar. Revise si su navegador permite almacenar datos; inténtelo nuevamente.");}
  }
  const hasMarked = pending.some(p=>saved[p.number]?.text === p.text && saved[p.number].ranges.some(r=>r.start < p.end && r.end > p.start));

  return <HighlightContext.Provider value={{saved,choose}}>
    <div ref={root}>
      <p className={styles.help}>Para resaltar, mantenga presionada una palabra, ajuste la selección y pulse «Resaltar». Las marcas se guardan en este navegador; no se sincronizan con otros dispositivos.</p>
      <p role="status" className={styles.status}>{message}</p>
      {children}
      {pending.length > 0 && <div className={styles.toolbar} role="region" aria-label="Resaltar selección" onKeyDown={event=>{if(event.key === "Escape") close();}}>
        <span className={styles.preview}>“{pending.map(p=>p.text.slice(p.start,p.end)).join(" ")}”</span>
        <div className={styles.actions}>
          <button type="button" disabled={!ready} onMouseDown={e=>e.preventDefault()} onClick={()=>apply(false)}>Resaltar</button>
          <button type="button" disabled={!ready || !hasMarked} onMouseDown={e=>e.preventDefault()} onClick={()=>apply(true)}>Quitar marca</button>
          <button type="button" aria-label="Cerrar resaltador" onClick={close}>✕</button>
        </div>
      </div>}
    </div>
  </HighlightContext.Provider>;
}

export function BibleHighlightedText({number,text}:{number:number;text:string}) {
  const {saved,choose} = useContext(HighlightContext);
  return <span className={styles.text} data-highlight-verse={number}>
    {textSegments(text,saved[number]).map(segment=>segment.marked
      ? <mark key={segment.start} className={styles.mark} tabIndex={0} role="button" aria-label={`Editar resaltado: ${segment.text}`}
          onClick={()=>{if(window.getSelection()?.isCollapsed) choose([{number,text,start:segment.start,end:segment.end}]);}}
          onKeyDown={e=>{if(e.key === "Enter" || e.key === " "){e.preventDefault();choose([{number,text,start:segment.start,end:segment.end}]);}}}>
          {segment.text}
        </mark>
      : <span key={segment.start}>{segment.text}</span>)}
  </span>;
}
