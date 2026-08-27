'use client';

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import books from "@/data/bible-books.json";
import {readerVersion,versionQuery,type ReaderVersion} from "@/lib/bible-version";

type LastReading={bookName:string;bookSlug:string;chapter:number;at:string;translationKey?:string};

export default function BibleHomeClient({version="rvr60"}:{version?:ReaderVersion}){
  const suffix=versionQuery(version);
  const [query,setQuery]=useState("");
  const [last,setLast]=useState<LastReading|null>(null);

  useEffect(()=>{
    const saved=localStorage.getItem("last-bible-reading");
    if(!saved)return;
    try{
      setLast(JSON.parse(saved));
    }catch{
      localStorage.removeItem("last-bible-reading");
    }
  },[]);

  const match=query.trim().match(/^(.+?)\s+(\d+)(?::(\d+))?$/);
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return [];
    return books.filter(b=>b.name.toLowerCase().includes(q)).slice(0,10);
  },[query]);

  let directHref:string|null=null;
  if(match){
    const name=match[1].toLowerCase();
    const book=books.find(b=>b.name.toLowerCase()===name || b.name.toLowerCase().startsWith(name));
    const chapter=Number(match[2]);
    if(book && chapter>=1 && chapter<=book.chapters) directHref=`/biblia/${book.slug}/${chapter}${suffix}`;
  }

  return <div>
    <div className="bibleSearch">
      <input
        className="search"
        value={query}
        onChange={e=>setQuery(e.target.value)}
        placeholder="Buscar libro o referencia: Juan 3, Salmos 23..."
      />
      {query && <div className="searchResults">
        {directHref && <Link href={directHref}><strong>Abrir referencia</strong><small>{query}</small></Link>}
        {filtered.map(b=><Link key={b.slug} href={`/biblia/${b.slug}/1${suffix}`}><strong>{b.name}</strong><small>{b.chapters} capítulos</small></Link>)}
      </div>}
    </div>

    {last && <div className="continueReading">
      <div><small>Última lectura</small><strong>{last.bookName} {last.chapter}</strong></div>
      <Link className="btn" href={`/biblia/${last.bookSlug}/${last.chapter}${versionQuery(readerVersion(last.translationKey))}`}>Continuar leyendo</Link>
    </div>}
  </div>;
}
