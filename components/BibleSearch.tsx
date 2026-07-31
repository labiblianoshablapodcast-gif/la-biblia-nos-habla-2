'use client';
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import books from "@/data/bible-books.json";

export default function BibleSearch(){
  const [query,setQuery]=useState("");
  const router=useRouter();
  const results=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q)return books;
    return books.filter(b=>b.name.toLowerCase().includes(q)).slice(0,12);
  },[query]);
  function open(bookSlug:string){
    router.push(`/biblia/${bookSlug}/1`);
  }
  return <div className="bibleSearch">
    <input className="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar libro: Juan, Salmos, Romanos..."/>
    {query && <div className="searchResults">{results.map(b=><button key={b.slug} onClick={()=>open(b.slug)}>{b.name}<small>{b.chapters} capítulos</small></button>)}</div>}
  </div>;
}
