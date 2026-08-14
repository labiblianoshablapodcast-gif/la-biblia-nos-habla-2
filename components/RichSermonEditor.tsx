"use client";

import {useEffect,useRef,useState} from "react";
import {createSlug} from "@/lib/slug";

type Props={
  defaultTitle?:string;
  defaultSlug?:string;
  defaultHtml?:string;
  defaultSubtitle?:string;
  draftKey?:string;
};

export default function RichSermonEditor({
  defaultTitle="",defaultSlug="",defaultHtml="",defaultSubtitle="",draftKey="new-sermon"
}:Props){
  const editor=useRef<HTMLDivElement>(null);
  const [title,setTitle]=useState(defaultTitle);
  const [subtitle,setSubtitle]=useState(defaultSubtitle);
  const [slug,setSlug]=useState(defaultSlug);
  const [manualSlug,setManualSlug]=useState(Boolean(defaultSlug));
  const [html,setHtml]=useState(defaultHtml);
  const [preview,setPreview]=useState(false);
  const [savedAt,setSavedAt]=useState("");

  useEffect(()=>{if(!manualSlug)setSlug(createSlug(title));},[title,manualSlug]);

  useEffect(()=>{
    if(defaultTitle||defaultHtml)return;
    const saved=localStorage.getItem(`sermon-draft:${draftKey}`);
    if(!saved)return;
    try{
      const draft=JSON.parse(saved);
      setTitle(draft.title||"");setSubtitle(draft.subtitle||"");setSlug(draft.slug||"");setHtml(draft.html||"");
      if(editor.current)editor.current.innerHTML=draft.html||"";
    }catch{}
  },[defaultTitle,defaultHtml,draftKey]);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      localStorage.setItem(`sermon-draft:${draftKey}`,JSON.stringify({title,subtitle,slug,html}));
      setSavedAt(new Date().toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit"}));
    },1200);
    return()=>clearTimeout(timer);
  },[title,subtitle,slug,html,draftKey]);

  function command(name:string,value?:string){
    document.execCommand(name,false,value);
    editor.current?.focus();
    setHtml(editor.current?.innerHTML||"");
  }
  function addLink(){const url=window.prompt("Pegue el enlace");if(url)command("createLink",url);}
  function addBibleQuote(){command("formatBlock","blockquote");}
  function clearDraft(){
    localStorage.removeItem(`sermon-draft:${draftKey}`);
    setTitle("");setSubtitle("");setSlug("");setHtml("");
    if(editor.current)editor.current.innerHTML="";
  }

  return <>
    <label className="wideField">Título de la predicación
      <input name="title" value={title} onChange={e=>setTitle(e.target.value)} required/>
    </label>
    <label className="wideField">Subtítulo
      <input name="subtitle" value={subtitle} onChange={e=>setSubtitle(e.target.value)} placeholder="Una frase breve que acompañe el título"/>
    </label>
    <label className="wideField">Dirección amigable (slug)
      <input name="slug" value={slug} onChange={e=>{setManualSlug(true);setSlug(createSlug(e.target.value));}} required/>
      <small className="fieldHelp">Se publicará como: /predicaciones/{slug||"titulo-de-la-predicacion"}</small>
    </label>

    <div className="wideField richEditorField">
      <div className="richEditorTopline">
        <span className="richEditorLabel">Bosquejo profesional</span>
        <small>{savedAt?`Borrador guardado localmente a las ${savedAt}`:"Guardado automático activado"}</small>
      </div>
      <div className="richToolbar" role="toolbar" aria-label="Herramientas del editor">
        <button type="button" title="Negrita" onClick={()=>command("bold")}><strong>B</strong></button>
        <button type="button" title="Cursiva" onClick={()=>command("italic")}><em>I</em></button>
        <button type="button" title="Subrayado" onClick={()=>command("underline")}><u>U</u></button>
        <button type="button" onClick={()=>command("formatBlock","h2")}>Título</button>
        <button type="button" onClick={()=>command("formatBlock","h3")}>Subtítulo</button>
        <button type="button" onClick={()=>command("insertUnorderedList")}>• Lista</button>
        <button type="button" onClick={()=>command("insertOrderedList")}>1. Lista</button>
        <button type="button" onClick={addBibleQuote}>❝ Cita bíblica</button>
        <button type="button" onClick={addLink}>Enlace</button>
        <button type="button" onClick={()=>command("undo")}>↶</button>
        <button type="button" onClick={()=>command("redo")}>↷</button>
        <button type="button" onClick={()=>command("removeFormat")}>Limpiar</button>
      </div>
      <div ref={editor} className="richEditorCanvas" contentEditable suppressContentEditableWarning
        dangerouslySetInnerHTML={{__html:defaultHtml}}
        onInput={()=>setHtml(editor.current?.innerHTML||"")}
        data-placeholder="Escriba aquí la introducción, los puntos principales, textos bíblicos y conclusión…"/>
      <input type="hidden" name="content_html" value={html}/>
      <div className="editorFooterActions">
        <button type="button" className="btn secondaryDark" onClick={()=>setPreview(true)}>Vista previa</button>
        <button type="button" className="textButton" onClick={clearDraft}>Limpiar borrador local</button>
      </div>
    </div>

    {preview&&<div className="sermonPreviewOverlay" onClick={()=>setPreview(false)}>
      <section className="sermonPreviewModal" onClick={e=>e.stopPropagation()}>
        <button type="button" className="previewClose" onClick={()=>setPreview(false)}>×</button>
        <p className="eyebrow">Vista previa</p>
        <h1>{title||"Título de la predicación"}</h1>
        {subtitle&&<p className="lead">{subtitle}</p>}
        <div className="sermonRichContent" dangerouslySetInnerHTML={{__html:html||"<p>El bosquejo aparecerá aquí.</p>"}}/>
      </section>
    </div>}
  </>;
}
