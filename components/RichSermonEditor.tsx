"use client";

import {useEffect,useRef,useState} from "react";
import {createSlug} from "@/lib/slug";

type Props={defaultTitle?:string;defaultSlug?:string;defaultHtml?:string};

export default function RichSermonEditor({defaultTitle="",defaultSlug="",defaultHtml=""}:Props){
  const editor=useRef<HTMLDivElement>(null);
  const [title,setTitle]=useState(defaultTitle);
  const [slug,setSlug]=useState(defaultSlug);
  const [manualSlug,setManualSlug]=useState(Boolean(defaultSlug));
  const [html,setHtml]=useState(defaultHtml);

  useEffect(()=>{
    if(!manualSlug) setSlug(createSlug(title));
  },[title,manualSlug]);

  function command(name:string,value?:string){
    document.execCommand(name,false,value);
    editor.current?.focus();
    setHtml(editor.current?.innerHTML||"");
  }

  function addLink(){
    const url=window.prompt("Pegue el enlace");
    if(url) command("createLink",url);
  }

  return <>
    <label className="wideField">Título de la predicación
      <input name="title" value={title} onChange={e=>setTitle(e.target.value)} required/>
    </label>
    <label className="wideField">Dirección amigable (slug)
      <input name="slug" value={slug} onChange={e=>{setManualSlug(true);setSlug(createSlug(e.target.value));}} required/>
      <small className="fieldHelp">Se publicará como: /predicaciones/{slug||"titulo-de-la-predicacion"}</small>
    </label>

    <div className="wideField richEditorField">
      <span className="richEditorLabel">Bosquejo profesional</span>
      <div className="richToolbar" role="toolbar" aria-label="Herramientas del editor">
        <button type="button" onClick={()=>command("bold")}><strong>B</strong></button>
        <button type="button" onClick={()=>command("italic")}><em>I</em></button>
        <button type="button" onClick={()=>command("underline")}><u>U</u></button>
        <button type="button" onClick={()=>command("formatBlock","h2")}>Título</button>
        <button type="button" onClick={()=>command("formatBlock","h3")}>Subtítulo</button>
        <button type="button" onClick={()=>command("insertUnorderedList")}>• Lista</button>
        <button type="button" onClick={()=>command("insertOrderedList")}>1. Lista</button>
        <button type="button" onClick={()=>command("formatBlock","blockquote")}>Cita</button>
        <button type="button" onClick={addLink}>Enlace</button>
        <button type="button" onClick={()=>command("removeFormat")}>Limpiar</button>
      </div>
      <div
        ref={editor}
        className="richEditorCanvas"
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{__html:defaultHtml}}
        onInput={()=>setHtml(editor.current?.innerHTML||"")}
        data-placeholder="Escriba aquí la introducción, los puntos principales, textos bíblicos y conclusión…"
      />
      <input type="hidden" name="content_html" value={html}/>
    </div>
  </>;
}
