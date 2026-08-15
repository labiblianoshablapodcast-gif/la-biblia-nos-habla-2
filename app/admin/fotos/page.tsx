import AdminNav from "@/components/AdminNav";
import PhotoUploadField from "@/components/PhotoUploadField";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

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
 if(!user||!title||!image_url||!storage_path)return;
 await supabase.from("gallery_items").insert({
  title,alt_text:alt_text||title,category,image_url,storage_path,published,created_by:user.id
 });
 revalidatePath("/galeria");
 revalidatePath("/admin/fotos");
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
 revalidatePath("/admin/fotos");
}

async function deletePhoto(formData:FormData){
 "use server";
 const supabase=await createClient();
 const id=Number(formData.get("id"));
 const path=String(formData.get("storage_path")||"");
 if(path)await supabase.storage.from("site-media").remove([path]);
 if(id)await supabase.from("gallery_items").delete().eq("id",id);
 revalidatePath("/galeria");
 revalidatePath("/admin/fotos");
}

export default async function FotosAdmin(){
 const supabase=await createClient();
 const {data}=await supabase.from("gallery_items").select("*").order("created_at",{ascending:false});

 return <div className="adminShell adminShellPro">
  <AdminNav/>
  <main className="adminMain">
   <p className="eyebrow">Biblioteca multimedia</p>
   <h1>Fotos y galerías</h1>
   <p className="lead">Suba fotografías desde el teléfono o computadora y decida cuándo aparecen en el sitio.</p>

   <form action={createPhoto} className="adminForm adminPhotoForm">
    <label>Título<input name="title" placeholder="Ej. Servicio especial de familias" required/></label>
    <label>Descripción para accesibilidad<input name="alt_text" placeholder="Describa brevemente lo que aparece"/></label>
    <label>Categoría
     <select name="category" defaultValue="Iglesia">
      <option>Iglesia</option><option>Eventos</option><option>Misiones</option>
      <option>Pastores</option><option>Familia</option><option>Alabanza</option>
     </select>
    </label>
    <PhotoUploadField folder="gallery"/>
    <label className="adminCheckbox"><input type="checkbox" name="published"/> Publicar inmediatamente</label>
    <button className="btn" type="submit">Guardar fotografía</button>
   </form>

   <section className="adminPhotoGrid">
    {(data??[]).map(photo=><article key={photo.id}>
     <img src={photo.image_url} alt={photo.alt_text||photo.title}/>
     <form action={updatePhoto}>
      <input type="hidden" name="id" value={photo.id}/>
      <label>Título<input name="title" defaultValue={photo.title}/></label>
      <label>Categoría<input name="category" defaultValue={photo.category}/></label>
      <label className="adminCheckbox"><input type="checkbox" name="published" defaultChecked={photo.published}/> Publicada</label>
      <button className="btn" type="submit">Guardar cambios</button>
     </form>
     <form action={deletePhoto}>
      <input type="hidden" name="id" value={photo.id}/>
      <input type="hidden" name="storage_path" value={photo.storage_path}/>
      <button className="dangerButton" type="submit">Eliminar fotografía</button>
     </form>
    </article>)}
    {!data?.length&&<div className="notice"><strong>Todavía no hay fotografías cargadas.</strong><p>Use el formulario superior para publicar la primera.</p></div>}
   </section>
  </main>
 </div>;
}
