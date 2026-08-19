"use client";

import {useMemo,useState} from "react";
import {bibleDictionary,normalizeDictionarySearch} from "@/data/bible-dictionary";
import styles from "@/app/diccionario/diccionario.module.css";

export default function BibleDictionarySearch({initialQuery=""}:{initialQuery?:string}){
  const [query,setQuery]=useState(initialQuery);
  const [language,setLanguage]=useState<"Todos"|"Hebreo"|"Griego">("Todos");
  const normalized=normalizeDictionarySearch(query);
  const popularWords=["Gracia","Fe","Salvación","Espíritu","Poder","Oración","Pacto","Gloria","Sabiduría","Reino","Adoración","Humildad"];

  const results=useMemo(()=>bibleDictionary.filter(entry=>{
    if(language!=="Todos" && entry.language!==language)return false;
    if(!normalized)return true;
    const haystack=normalizeDictionarySearch([
      entry.spanish,entry.original,entry.transliteration,entry.strong,
      entry.gloss,...entry.aliases
    ].join(" "));
    return haystack.includes(normalized);
  }),[normalized,language]);

  return <>
    <div className={styles.searchBox}>
      <label htmlFor="dictionary-search">Buscar palabra, término original o número Strong</label>
      <div className={styles.searchRow}>
        <input id="dictionary-search" type="search" value={query}
          onChange={event=>setQuery(event.target.value)}
          placeholder="Ej. gracia, agápē, G5485, shalom..."/>
        <span aria-live="polite">{results.length} {results.length===1?"resultado":"resultados"}</span>
      </div>
      <div className={styles.filters} aria-label="Filtrar por idioma">
        {(["Todos","Hebreo","Griego"] as const).map(value=>
          <button key={value} type="button" className={language===value?styles.active:""} onClick={()=>setLanguage(value)}>
            {value}
          </button>
        )}
      </div>
      <div className={styles.popularWords}>
        <span>Palabras populares</span>
        <div>
          {popularWords.map(word=><button key={word} type="button"
            className={normalizeDictionarySearch(query)===normalizeDictionarySearch(word)?styles.selectedWord:""}
            onClick={()=>{setQuery(word);setLanguage("Todos")}}>
            {word}
          </button>)}
        </div>
      </div>
    </div>

    {results.length ? <div className={styles.grid}>
      {results.map(entry=><article className={styles.card} key={entry.id}>
        <div className={styles.cardTop}>
          <div><span className={styles.language}>{entry.language}</span><h2>{entry.spanish}</h2></div>
          <strong className={styles.strong}>{entry.strong}</strong>
        </div>
        <p className={entry.language==="Hebreo"?styles.hebrew:styles.original}
          lang={entry.language==="Hebreo"?"he":"el"} dir={entry.language==="Hebreo"?"rtl":"ltr"}>{entry.original}</p>
        <p className={styles.transliteration}>{entry.transliteration}</p>
        <p className={styles.gloss}>{entry.gloss}</p>
        <p className={styles.explanation}>{entry.explanation}</p>
        <div className={styles.references}>{entry.references.map(reference=><span key={reference}>{reference}</span>)}</div>
        <a className={styles.stepLink} href={`https://www.stepbible.org/?q=strong=${entry.strong}`} target="_blank" rel="noreferrer">
          Abrir estudio completo en STEP Bible <span aria-hidden="true">↗</span>
        </a>
      </article>)}
    </div> : <div className={styles.empty}>
      <strong>No encontramos esa palabra en la selección inicial.</strong>
      <p>Puede buscarla directamente en el léxico completo de STEP Bible.</p>
      <a href={`https://www.stepbible.org/?q=${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">Buscar en STEP Bible ↗</a>
    </div>}
  </>;
}
