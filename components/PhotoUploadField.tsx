'use client';

import {useId,useState} from "react";
import {createClient} from "@/lib/supabase/client";

type Props={
 folder:"gallery"|"events";
 name?:string;
 pathName?:string;
 currentUrl?:string|null;
 currentPath?:string|null;
 label?:string;
};

export default function PhotoUploadField({
 folder,
 name="image_url",
 pathName="image_path",
 currentUrl="",
 currentPath="",
 label="Fotografía"
}:Props){
 const id=useId();
 const [url,setUrl]=useState(currentUrl||"");
 const [path,setPath]=useState(currentPath||"");
 const [status,setStatus]=useState("");
 const [uploading,setUploading]=useState(false);

 async function upload(file?:File){
  if(!file)return;
  if(!file.type.startsWith("image/")){
   setStatus("Seleccione una fotografía válida.");
   return;
  }
  if(file.size>10*1024*1024){
   setStatus("La fotografía debe pesar 10 MB o menos.");
   return;
  }

  setUploading(true);
  setStatus("Subiendo fotografía…");
  const supabase=createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){
   setStatus("La sesión terminó. Inicie sesión nuevamente.");
   setUploading(false);
   return;
  }

  const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
  const storagePath=`${folder}/${user.id}/${Date.now()}-${safe}`;
  const {error}=await supabase.storage.from("site-media").upload(storagePath,file,{
   cacheControl:"3600",upsert:false,contentType:file.type
  });

  if(error){
   setStatus(`No se pudo subir: ${error.message}`);
   setUploading(false);
   return;
  }

  const {data}=supabase.storage.from("site-media").getPublicUrl(storagePath);
  setUrl(data.publicUrl);
  setPath(storagePath);
  setStatus("✓ Fotografía cargada. Ahora complete los datos y presione Guardar.");
  setUploading(false);
 }

 return <div className={"adminPhotoField professionalDropzone "+(url?"hasPhoto":"")}>
  <label className="photoDropzoneLabel" htmlFor={id}>
   <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" onChange={e=>upload(e.target.files?.[0])}/>
   {!url&&<><span className="photoDropIcon">＋</span><strong>{label}</strong><small>Toque aquí para abrir sus fotos</small></>}
   {url&&<img src={url} alt="Vista previa de la fotografía seleccionada"/>}
  </label>
  <input type="hidden" name={name} value={url}/>
  <input type="hidden" name={pathName} value={path}/>
  <p className={"photoUploadStatus "+(uploading?"uploading":url?"ready":"")}>
   {status||"JPG, PNG, WEBP o HEIC · máximo 10 MB"}
  </p>
  {url&&<label className="photoChangeButton" htmlFor={id}>Cambiar fotografía</label>}
 </div>;
}
