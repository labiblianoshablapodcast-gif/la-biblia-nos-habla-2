import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {getYouTubeThumbnail} from "@/lib/youtube";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createMedia(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();

  const title=String(formData.get("title")||"").trim();
  const description=String(formData.get("description")||"").trim();
  const media_type=String(formData.get("media_type")||"video");
  const category=String(formData.get("category")||"").trim();
  const series_name=String(formData.get("series_name")||"").trim();
  const scripture=String(formData.get("scripture")||"").trim();
  const media_url=String(formData.get("media_url")||"").trim();
  const manualThumbnail=String(formData.get("thumbnail_url")||"").trim();
  const thumbnail_url=manualThumbnail || getYouTubeThumbnail(media_url);
  const published=formData.get("published")==="on";
  const featured=formData.get("featured")==="on";

  if(!title||!media_url) return;

  if(featured){
    await supabase.from("media_items").update({featured:false}).eq("featured",true);
  }

  await supabase.from("media_items").insert({
    title,description,media_type,category,series_name,scripture,
    media_url,thumbnail_url,published,featured,created_by:user?.id
  });

  revalidatePath("/multimedia");
  revalidatePath("/admin/multimedia");
  redirect("/admin/multimedia");
}

async function deleteMedia(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("media_items").delete().eq("id",id);
  revalidatePath("/multimedia");
  revalidatePath("/admin/multimedia");
}

export default async function MultimediaAdmin(){
  const supabase=await createClient();
  const {data,error}=await supabase.from("media_items").select("*").order("created_at",{ascending:false});

  return <div className="adminShell adminShellPro">
    <AdminNav/>
    <main className="adminMain">
      <p className="eyebrow">Videos, audio y podcast</p>
      <h1>Centro Multimedia</h1>

      {error&&<div className="notice">
        <strong>Falta crear la tabla multimedia.</strong>
        <p>Ejecute el SQL de la versión 7.0A en Supabase.</p>
      </div>}

      <form action={createMedia} className="adminForm">
        <label>Título<input name="title" required/></label>
        <label>Tipo de contenido
          <select name="media_type">
            <option value="video">Video</option>
            <option value="short">Short</option>
            <option value="podcast">Podcast</option>
            <option value="audio">Audio</option>
            <option value="live">Transmisión en vivo</option>
          </select>
        </label>
        <label>Categoría<input name="category" placeholder="Salvación, Fe, Misiones…"/></label>
        <label>Serie<input name="series_name" placeholder="Ej. Evangelio de Juan"/></label>
        <label>Texto bíblico<input name="scripture" placeholder="Ej. Juan 3:16"/></label>
        <label>Descripción<textarea name="description" rows={5}/></label>
        <label>Enlace del video o audio<input name="media_url" type="url" required/></label>
        <label>Miniatura opcional<input name="thumbnail_url" type="url" placeholder="YouTube se detecta automáticamente"/></label>
        <div className="adminChecks">
          <label><input type="checkbox" name="published" defaultChecked/> Publicar</label>
          <label><input type="checkbox" name="featured"/> Destacar</label>
        </div>
        <button className="btn" type="submit">Publicar contenido</button>
      </form>

      <div className="adminContentList">
        {(data??[]).map(item=><article key={item.id}>
          <div>
            <small>{item.media_type} · {item.published?"Publicado":"Borrador"} {item.featured?"· Destacado":""}</small>
            <h3>{item.title}</h3>
            <p>{item.category||"Sin categoría"} {item.series_name?`· ${item.series_name}`:""}</p>
          </div>
          <form action={deleteMedia}>
            <input type="hidden" name="id" value={item.id}/>
            <button className="dangerButton" type="submit">Eliminar</button>
          </form>
        </article>)}
      </div>
    </main>
  </div>;
}
