import AdminNav from "@/components/AdminNav";
import VideoUploadField from "@/components/VideoUploadField";
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
  const media_type=String(formData.get("media_type")||"short");
  const category=String(formData.get("category")||"").trim();
  const series_name=String(formData.get("series_name")||"").trim();
  const scripture=String(formData.get("scripture")||"").trim();
  const uploadedMedia=String(formData.get("media_upload_url")||"").trim();
  const manualMedia=String(formData.get("media_url")||"").trim();
  const media_url=uploadedMedia||manualMedia;
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

  revalidatePath("/");
  revalidatePath("/cortos");
  revalidatePath("/multimedia");
  revalidatePath("/admin/multimedia");
  redirect("/admin/multimedia");
}

async function deleteMedia(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("media_items").delete().eq("id",id);
  revalidatePath("/");
  revalidatePath("/cortos");
  revalidatePath("/multimedia");
  revalidatePath("/admin/multimedia");
}

export default async function MultimediaAdmin(){
  const supabase=await createClient();
  const {data,error}=await supabase.from("media_items").select("*").order("created_at",{ascending:false});

  return <div className="adminShell adminShellPro">
    <AdminNav/>
    <main className="adminMain">
      <p className="eyebrow">VIDEOS CORTOS, AUDIO Y PODCAST</p>
      <h1>60 Segundos de Fe</h1>
      <p>Suba un corto directamente desde su teléfono o pegue un enlace de YouTube. El contenido marcado como destacado aparecerá primero en Inicio.</p>

      {error&&<div className="notice">
        <strong>Falta crear la tabla multimedia.</strong>
        <p>Ejecute el SQL de multimedia en Supabase antes de publicar.</p>
      </div>}

      <form action={createMedia} className="adminForm">
        <label>Título<input name="title" required placeholder="Ej. Dios todavía tiene el control"/></label>
        <label>Tipo de contenido
          <select name="media_type" defaultValue="short">
            <option value="short">60 Segundos de Fe · Short</option>
            <option value="video">Video</option>
            <option value="podcast">Podcast</option>
            <option value="audio">Audio</option>
            <option value="live">Transmisión en vivo</option>
          </select>
        </label>
        <label>Texto bíblico<input name="scripture" placeholder="Ej. Salmo 46:1"/></label>
        <label>Descripción<textarea name="description" rows={4} placeholder="Una frase breve que acompañe el video"/></label>

        <VideoUploadField label="Subir video desde el teléfono"/>

        <label>O pegue un enlace de YouTube / video<input name="media_url" type="url" placeholder="https://youtube.com/shorts/..."/></label>
        <label>Miniatura opcional<input name="thumbnail_url" type="url" placeholder="YouTube se detecta automáticamente"/></label>
        <label>Categoría<input name="category" placeholder="Fe, Salvación, Oración, Misiones…"/></label>
        <label>Serie<input name="series_name" placeholder="Ej. 60 Segundos de Fe" defaultValue="60 Segundos de Fe"/></label>
        <div className="adminChecks">
          <label><input type="checkbox" name="published" defaultChecked/> Publicar</label>
          <label><input type="checkbox" name="featured" defaultChecked/> Destacar en Inicio</label>
        </div>
        <button className="btn" type="submit">Publicar corto</button>
      </form>

      <div className="adminContentList">
        {(data??[]).map(item=><article key={item.id}>
          <div>
            <small>{item.media_type} · {item.published?"Publicado":"Borrador"} {item.featured?"· Destacado":""}</small>
            <h3>{item.title}</h3>
            <p>{item.scripture||item.category||"Sin texto bíblico"} {item.series_name?`· ${item.series_name}`:""}</p>
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
