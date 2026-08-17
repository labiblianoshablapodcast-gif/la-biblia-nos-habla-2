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

const OPTIMIZABLE_TYPES=new Set(["image/jpeg","image/png","image/webp"]);
const OPTIMIZE_FROM_BYTES=1200*1024;
const MAX_IMAGE_EDGE=2000;

function readableSize(bytes:number){
 return bytes>=1024*1024?`${(bytes/1024/1024).toFixed(1)} MB`:`${Math.max(1,Math.round(bytes/1024))} KB`;
}

async function optimizePhoto(file:File){
 if(!OPTIMIZABLE_TYPES.has(file.type)||file.size<OPTIMIZE_FROM_BYTES||typeof createImageBitmap!=="function")return file;

 try{
  const bitmap=await createImageBitmap(file);
  const scale=Math.min(1,MAX_IMAGE_EDGE/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement("canvas");
  canvas.width=Math.max(1,Math.round(bitmap.width*scale));
  canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const context=canvas.getContext("2d");
  if(!context){
   bitmap.close();
   return file;
  }

  context.drawImage(bitmap,0,0,canvas.width,canvas.height);
  bitmap.close();

  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/webp",.86));
  if(!blob||blob.size>=file.size)return file;

  const baseName=file.name.replace(/\.[^.]+$/,"");
  return new File([blob],`${baseName}.webp`,{type:"image/webp",lastModified:Date.now()});
 }catch{
  return file;
 }
}

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
  setStatus("Preparando fotografía…");

  const preparedFile=await optimizePhoto(file);
  const wasOptimized=preparedFile!==file;
  setStatus(wasOptimized?"Subiendo fotografía optimizada…":"Subiendo fotografía…");

  const supabase=createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){
   setStatus("La sesión terminó. Inicie sesión nuevamente.");
   setUploading(false);
   return;
  }

  const safe=preparedFile.name.toLowerCase().replace(/[^a-z0-9._-]+/g,"-");
  const storagePath=`${folder}/${user.id}/${Date.now()}-${safe}`;
  const {error}=await supabase.storage.from("site-media").upload(storagePath,preparedFile,{
   cacheControl:"31536000",upsert:false,contentType:preparedFile.type
  });

  if(error){
   setStatus(`No se pudo subir: ${error.message}`);
   setUploading(false);
   return;
  }

  const {data}=supabase.storage.from("site-media").getPublicUrl(storagePath);
  setUrl(data.publicUrl);
  setPath(storagePath);
  setStatus(wasOptimized
   ?`✓ Fotografía optimizada (${readableSize(file.size)} → ${readableSize(preparedFile.size)}) y cargada. Ahora presione Guardar.`
   :"✓ Fotografía cargada. Ahora complete los datos y presione Guardar.");
  setUploading(false);
 }

 return <div className={"adminPhotoField professionalDropzone "+(url?"hasPhoto":"")}>
  <label className="photoDropzoneLabel" htmlFor={id}>
   <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" disabled={uploading} onChange={e=>upload(e.target.files?.[0])}/>
   {!url&&<><span className="photoDropIcon">＋</span><strong>{label}</strong><small>Toque aquí para abrir sus fotos</small></>}
   {url&&<img src={url} alt="Vista previa de la fotografía seleccionada"/>}
  </label>
  <input type="hidden" name={name} value={url}/>
  <input type="hidden" name={pathName} value={path}/>
  <p className={"photoUploadStatus "+(uploading?"uploading":url?"ready":"")} role="status" aria-live="polite">
   {status||"JPG, PNG, WEBP o HEIC · máximo 10 MB"}
  </p>
  {url&&<label className="photoChangeButton" htmlFor={id}>Cambiar fotografía</label>}
 </div>;
}
