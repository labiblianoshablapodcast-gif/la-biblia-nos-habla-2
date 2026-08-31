'use client';

import {useId,useRef,useState} from "react";
import {createClient} from "@/lib/supabase/client";

type Props={
  name?:string;
  label?:string;
};

const MAX_VIDEO_BYTES=100*1024*1024;
const ALLOWED_TYPES=new Set(["video/mp4","video/quicktime","video/webm"]);

function readableSize(bytes:number){
  return `${(bytes/1024/1024).toFixed(1)} MB`;
}

export default function VideoUploadField({name="media_upload_url",label="Subir video corto"}:Props){
  const id=useId();
  const uploadRef=useRef(false);
  const [url,setUrl]=useState("");
  const [status,setStatus]=useState("MP4, MOV o WEBM · máximo 100 MB");
  const [uploading,setUploading]=useState(false);

  async function upload(file?:File){
    if(!file)return;
    if(!ALLOWED_TYPES.has(file.type)){
      setStatus("Seleccione un video MP4, MOV o WEBM.");
      return;
    }
    if(file.size>MAX_VIDEO_BYTES){
      setStatus("El video debe pesar 100 MB o menos.");
      return;
    }

    uploadRef.current=true;
    setUploading(true);
    setStatus(`Subiendo video (${readableSize(file.size)})…`);

    const supabase=createClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){
      setStatus("La sesión terminó. Inicie sesión nuevamente.");
      uploadRef.current=false;
      setUploading(false);
      return;
    }

    const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
    const storagePath=`shorts/${user.id}/${Date.now()}-${safe}`;
    const {error}=await supabase.storage.from("site-media").upload(storagePath,file,{
      cacheControl:"31536000",
      upsert:false,
      contentType:file.type
    });

    if(error){
      setStatus(`No se pudo subir: ${error.message}`);
      uploadRef.current=false;
      setUploading(false);
      return;
    }

    const {data}=supabase.storage.from("site-media").getPublicUrl(storagePath);
    setUrl(data.publicUrl);
    setStatus("✓ Video cargado. Complete el título y presione Publicar contenido.");
    uploadRef.current=false;
    setUploading(false);
  }

  return <div className="adminPhotoField professionalDropzone">
    <label className="photoDropzoneLabel" htmlFor={id}>
      <input id={id} type="file" accept="video/mp4,video/quicktime,video/webm" disabled={uploading} onChange={e=>upload(e.target.files?.[0])}/>
      <span className="photoDropIcon">▶</span>
      <strong>{url?"Video listo":label}</strong>
      <small>{url?"Puede publicar este corto ahora":"Toque aquí para elegir un video del teléfono"}</small>
    </label>
    <input type="hidden" name={name} value={url}/>
    <p className={"photoUploadStatus "+(uploading?"uploading":url?"ready":"")} role="status" aria-live="polite">{status}</p>
  </div>;
}
