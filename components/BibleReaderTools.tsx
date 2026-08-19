'use client';

import {useEffect,useMemo,useState} from "react";

type Verse={number:number;text:string};

export default function BibleReaderTools({
  bookName,bookSlug,chapter,verses,translationName="Reina-Valera Revisada 1960",translationKey="rvr60"
}:{
  bookName:string;bookSlug:string;chapter:number;verses:Verse[];
  translationName?:string;translationKey?:string;
}) {
  const key=`${translationKey}-${bookSlug}-${chapter}`;
  const [dark,setDark]=useState(false);
  const [fontSize,setFontSize]=useState(27);
  const [favorites,setFavorites]=useState<number[]>([]);
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [selected,setSelected]=useState<number|null>(null);

  useEffect(()=>{
    setDark(localStorage.getItem("bible-dark")==="1");
    setFontSize(Number(localStorage.getItem("bible-font")||27));
    setFavorites(JSON.parse(localStorage.getItem(`favorites-${key}`)||"[]"));
    setNotes(JSON.parse(localStorage.getItem("bible-notes")||"{}"));
    localStorage.setItem("last-bible-reading",JSON.stringify({
      bookName,bookSlug,chapter,translationKey,at:new Date().toISOString()
    }));
  },[bookName,bookSlug,chapter,key,translationKey]);

  useEffect(()=>{localStorage.setItem("bible-dark",dark?"1":"0")},[dark]);
  useEffect(()=>{localStorage.setItem("bible-font",String(fontSize))},[fontSize]);

  const selectedVerse=useMemo(()=>verses.find(v=>v.number===selected),[selected,verses]);

  function toggleFavorite(number:number){
    const next=favorites.includes(number)
      ? favorites.filter(x=>x!==number)
      : [...favorites,number];
    setFavorites(next);
    localStorage.setItem(`favorites-${key}`,JSON.stringify(next));
  }

  function saveNote(number:number,value:string){
    const noteKey=`${key}-${number}`;
    const next={...notes,[noteKey]:value};
    setNotes(next);
    localStorage.setItem("bible-notes",JSON.stringify(next));
  }

  async function shareVerse(verse:Verse){
    const text=`${bookName} ${chapter}:${verse.number} — ${verse.text} (${translationName})`;
    if(navigator.share){
      await navigator.share({title:`${bookName} ${chapter}:${verse.number}`,text});
    }else{
      await navigator.clipboard.writeText(text);
      alert("Versículo copiado.");
    }
  }

  return <div className={dark?"readerShell darkReader":"readerShell"}>
    <div className="readerToolbar">
      <strong>{translationName}</strong>
      <button onClick={()=>setDark(!dark)}>{dark?"☀️ Modo claro":"🌙 Modo oscuro"}</button>
      <button onClick={()=>setFontSize(Math.max(20,fontSize-2))}>A−</button>
      <button onClick={()=>setFontSize(Math.min(40,fontSize+2))}>A+</button>
      <span>{favorites.length} favoritos en este capítulo</span>
    </div>

    <article className="scriptureText interactiveText" style={{fontSize}}>
      {verses.map(verse=>{
        const noteKey=`${key}-${verse.number}`;
        const favorite=favorites.includes(verse.number);
        return <section className={favorite?"verseRow favoriteVerse":"verseRow"} key={verse.number}>
          <p onClick={()=>setSelected(selected===verse.number?null:verse.number)}>
            <sup>{verse.number}</sup> {verse.text}
          </p>
          <div className="verseActions">
            <button title="Guardar favorito" onClick={()=>toggleFavorite(verse.number)}>{favorite?"★":"☆"}</button>
            <button title="Compartir" onClick={()=>shareVerse(verse)}>↗</button>
            <button title="Escribir nota" onClick={()=>setSelected(verse.number)}>📝</button>
          </div>
          {selected===verse.number && <div className="verseNote">
            <label>Nota personal sobre {bookName} {chapter}:{verse.number}
              <textarea
                rows={3}
                value={notes[noteKey]||""}
                onChange={e=>saveNote(verse.number,e.target.value)}
                placeholder="Escriba aquí su nota..."
              />
            </label>
          </div>}
        </section>;
      })}
    </article>

    {selectedVerse && <div className="selectedVerseBar">
      <strong>{bookName} {chapter}:{selectedVerse.number}</strong>
      <span>Seleccionado para notas, favorito o compartir.</span>
    </div>}
  </div>;
}
