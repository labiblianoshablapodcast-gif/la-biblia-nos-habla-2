import AdminNav from "@/components/AdminNav";
import PhotoUploadField from "@/components/PhotoUploadField";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createPhoto(formData:FormData){
 "use server";
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const title=String(formData.get("title")||"").trim();
 const alt_text=String(formData.get("alt_text")||"").trim();
 const category=String(formData.get("category")||"Iglesia").trim();
 const image_url=String(formData.get("image_url")||"").trim();
 const storage_path=String(formData.get("image_path")||"").trim();
 const published=formData.get("published")==="on";
 if(!user||!title||!image_url||!storage_path)redirect("/admin/fotos?estado=incompleta");
 const {error}=await supabase.from("gallery_items").insert({
  title,alt_text:alt_text||title,category,image_url,storage_path,published,created_by:user.id
 });
 if(error)redirect("/admin/fotos?estado=error");
 revalidatePath("/galeria");
 revalidatePath("/iglesia");
 revalidatePath("/eventos");
 revalidatePath("/admin/fotos");
 redirect("/admin/fotos?estado=guardada#biblioteca");
}

async function updatePhoto(formData:FormData){
 "use server";
 const supabase=await createClient();
 const id=Number(formData.get("id"));
 if(!id)return;
 await supabase.from("gallery_items").update({
  title:String(formData.get("title")||"").trim(),
  category:String(formData.get("category")||"Iglesia").trim(),
  published:formData.get("published")==="on"
 }).eq("id",id);
 revalidatePath("/galeria");
 revalidatePath("/iglesia");
 revalidatePath("/eventos");
 revalidatePath("/admin/fotos");
 redirect("/admin/fotos?estado=actualizada#biblioteca");
}

async function deletePhoto(formData:FormData){
 "use server";
 const supabase=await createClient();
 const id=Number(formData.get("id"));
 const path=String(formData.get("storage_path")||"");
 if(path)await supabase.storage.from("site-media").remove([path]);
 if(id)await supabase.from("gallery_items").delete().eq("id",id);
 revalidatePath("/galeria");
 revalidatePath("/iglesia");
 revalidatePath("/eventos");
 revalidatePath("/admin/fotos");
 redirect("/admin/fotos?estado=eliminada#biblioteca");
}

const messages:Record<string,{title:string;text:string;kind:string}>={
 guardada:{title:"Fotografía guardada correctamente",text:"Ya aparece en la biblioteca y está visible en las secciones correspondientes. Las fotos de categoría Eventos aparecen también en Iglesia y Eventos.",kind:"success"},
 actualizada:{title:"Cambios guardados",text:"La información y el estado de publicación fueron actualizados.",kind:"success"},
 eliminada:{title:"Fotografía eliminada",text:"La imagen fue retirada de la biblioteca.",kind:"warning"},
 incompleta:{title:"Falta completar la fotografía",text:"Espere a que la imagen termine de subir y complete el título antes de guardarla.",kind:"error"},
 error:{title:"No se pudo guardar",text:"Inténtelo nuevamente. Si continúa, revise la conexión a internet.",kind:"error"}
};

export default async function FotosAdmin({searchParams}:{searchParams:Promise<{estado?:string}>}){
 const {estado}=await searchParams;
 const message=estado?messages[estado]:null;
 const supabase=await createClient();
 const {data}=await supabase.from("gallery_items").select("*").order("created_at",{ascending:false});

 return <div className="adminShell adminShellPro">
  <AdminNav/>
  <main className="adminMain photoManagerPage">
   <header className="photoManagerHeader">
    <div><p className="eyebrow">Biblioteca multimedia</p><h1>Fotos y galerías</h1></div>
    <a className="btn secondaryDark" href="/galeria" target="_blank" rel="noreferrer">Ver galería pública ↗</a>
   </header>

   {message&&<div className={"photoSaveNotice "+message.kind} role="status">
    <span>{message.kind==="success"?"✓":message.kind==="error"?"!":"−"}</span>
    <div><strong>{message.title}</strong><p>{message.text}</p></div>
   </div>}

   <section className="photoUploadStudio">
    <div className="photoUploadIntro">
     <span className="photoStudioIcon">▣</span>
     <p className="eyebrow">Nueva fotografía</p>
     <h2>Publique un momento especial</h2>
     <p>Seleccione la foto, añada un título y elija dónde pertenece. Cuando vea el mensaje verde, presione Guardar fotografía.</p>
     <ol>
      <li><strong>1</strong> Seleccione la imagen</li>
      <li><strong>2</strong> Complete la información</li>
      <li><strong>3</strong> Guarde y confirme</li>
     </ol>
    </div>

    <form action={createPhoto} className="adminForm adminPhotoForm professionalPhotoForm">
     <PhotoUploadField folder="gallery" label="Seleccione una fotografía"/>
     <div className="photoFormFields">
      <label>Título de la fotografía<input name="title" placeholder="Ej. Compartiendo antes de salir a Lanquín" required/></label>
      <label>Descripción breve<input name="alt_text" placeholder="¿Quiénes aparecen y qué está sucediendo?"/></label>
      <label>Categoría
       <select name="category" defaultValue="Iglesia">
        <option>Iglesia</option><option>Eventos</option><option>Misiones</option>
        <option>Pastores</option><option>Familia</option><option>Alabanza</option>
       </select>
      </label>
      <label className="adminCheckbox"><input type="checkbox" name="published" defaultChecked/> Publicar inmediatamente en Galería y secciones relacionadas</label>
     </div>
     <button className="btn photoPrimaryButton" type="submit">Guardar fotografía</button>
    </form>
   </section>

   <section id="biblioteca" className="photoLibrarySection">
    <div className="photoLibraryHeading">
     <div><p className="eyebrow">Contenido guardado</p><h2>Biblioteca de fotografías</h2></div>
     <strong>{data?.length??0} foto{data?.length===1?"":"s"}</strong>
    </div>
    <div className="adminPhotoGrid">
     {(data??[]).map(photo=><article key={photo.id}>
      <div className="adminPhotoThumb"><img src={photo.image_url} alt={photo.alt_text||photo.title}/><span>{photo.published?"Publicada":"Borrador"}</span></div>
      <form action={updatePhoto}>
       <input type="hidden" name="id" value={photo.id}/>
       <label>Título<input name="title" defaultValue={photo.title}/></label>
       <label>Categoría
        <select name="category" defaultValue={photo.category||"Iglesia"}>
         <option>Iglesia</option><option>Eventos</option><option>Misiones</option>
         <option>Pastores</option><option>Familia</option><option>Alabanza</option>
        </select>
       </label>
       <label className="adminCheckbox"><input type="checkbox" name="published" defaultChecked={photo.published}/> Visible en Galería y secciones relacionadas</label>
       <button className="btn" type="submit">Guardar cambios</button>
      </form>
      <form action={deletePhoto}>
       <input type="hidden" name="id" value={photo.id}/>
       <input type="hidden" name="storage_path" value={photo.storage_path}/>
       <button className="dangerButton" type="submit">Eliminar fotografía</button>
      </form>
     </article>)}
     {!data?.length&&<div className="notice"><strong>Todavía no hay fotografías cargadas.</strong><p>Use el estudio superior para publicar la primera.</p></div>}
    </div>
   </section>
  </main>
 </div>;
}
