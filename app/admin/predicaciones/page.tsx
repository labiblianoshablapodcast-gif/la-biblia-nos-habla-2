import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createSermon(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  const payload={
    title:String(formData.get("title")||"").trim(),
    scripture:String(formData.get("scripture")||"").trim(),
    preacher:String(formData.get("preacher")||"Pastor Gilberto Maldonado").trim(),
    category:String(formData.get("category")||"").trim(),
    series_name:String(formData.get("series_name")||"").trim(),
    description:String(formData.get("description")||"").trim(),
    outline:String(formData.get("outline")||"").trim(),
    youtube_url:String(formData.get("youtube_url")||"").trim(),
    audio_url:String(formData.get("audio_url")||"").trim(),
    pdf_url:String(formData.get("pdf_url")||"").trim(),
    thumbnail_url:String(formData.get("thumbnail_url")||"").trim(),
    published:formData.get("published")==="on",
    featured:formData.get("featured")==="on",
    created_by:user.id
  };

  if(!payload.title) return;

  if(payload.featured){
    await supabase.from("sermons").update({featured:false}).eq("featured",true);
  }

  const {error}=await supabase.from("sermons").insert(payload);
  if(error) redirect(`/admin/predicaciones?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  revalidatePath("/predicaciones");
  revalidatePath("/admin");
  revalidatePath("/admin/predicaciones");
  redirect("/admin/predicaciones?success=1");
}

async function deleteSermon(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("sermons").delete().eq("id",id);
  revalidatePath("/predicaciones");
  revalidatePath("/admin/predicaciones");
}

export default async function PredicacionesAdmin({
  searchParams
}:{
  searchParams:Promise<{success?:string;error?:string}>
}){
  const params=await searchParams;
  const supabase=await createClient();
  const {data,error}=await supabase.from("sermons").select("*").order("created_at",{ascending:false});

  return <div className="adminShell adminShellPro">
    <AdminNav/>
    <main className="adminMain">
      <div className="adminPageIntro">
        <div>
          <p className="eyebrow">Biblioteca ministerial</p>
          <h1>Predicaciones</h1>
          <p>Publique mensajes, bosquejos, videos, audios y documentos desde este panel.</p>
        </div>
        <a className="btn secondaryDark" href="/predicaciones" target="_blank">Ver biblioteca pública</a>
      </div>

      {params.success&&<div className="successNotice"><strong>Predicación guardada correctamente.</strong></div>}
      {(params.error||error)&&<div className="notice">
        <strong>No se pudo completar la operación.</strong>
        <p>{params.error||error?.message}</p>
        <p>Ejecute el archivo <code>supabase/002_centro_pastoral_8_0A.sql</code>.</p>
      </div>}

      <form action={createSermon} className="adminForm sermonEditorForm">
        <div className="adminFormGrid">
          <label className="wideField">Título de la predicación<input name="title" required/></label>
          <label>Texto bíblico<input name="scripture" placeholder="Ej. 2 Crónicas 20:20"/></label>
          <label>Predicador<input name="preacher" defaultValue="Pastor Gilberto Maldonado"/></label>
          <label>Categoría<input name="category" placeholder="Fe, Salvación, Familia…"/></label>
          <label>Serie<input name="series_name" placeholder="Ej. Caminando por fe"/></label>
          <label className="wideField">Descripción breve<textarea name="description" rows={3}/></label>
          <label className="wideField">Bosquejo completo<textarea name="outline" rows={14} placeholder="Introducción, puntos principales, textos y conclusión…"/></label>
          <label>Enlace de YouTube<input name="youtube_url" type="url"/></label>
          <label>Enlace de audio<input name="audio_url" type="url"/></label>
          <label>Enlace del PDF<input name="pdf_url" type="url"/></label>
          <label>Enlace de miniatura<input name="thumbnail_url" type="url"/></label>
        </div>
        <div className="adminChecks">
          <label><input type="checkbox" name="published"/> Publicar inmediatamente</label>
          <label><input type="checkbox" name="featured"/> Destacar en la biblioteca</label>
        </div>
        <button className="btn" type="submit">Guardar predicación</button>
      </form>

      <section className="adminSavedSection">
        <p className="eyebrow">Contenido guardado</p>
        <h2>Biblioteca administrativa</h2>
        <div className="adminContentList">
          {(data??[]).map(item=><article key={item.id}>
            <div>
              <small>{item.published?"Publicado":"Borrador"} {item.featured?"· Destacado":""}</small>
              <h3>{item.title}</h3>
              <p>{item.scripture||"Sin texto bíblico"} {item.category?`· ${item.category}`:""} {item.series_name?`· ${item.series_name}`:""}</p>
            </div>
            <div className="adminItemActions">
              {item.youtube_url&&<a href={item.youtube_url} target="_blank" rel="noopener noreferrer">Video</a>}
              {item.pdf_url&&<a href={item.pdf_url} target="_blank" rel="noopener noreferrer">PDF</a>}
              <form action={deleteSermon}>
                <input type="hidden" name="id" value={item.id}/>
                <button className="dangerButton" type="submit">Eliminar</button>
              </form>
            </div>
          </article>)}
          {!data?.length&&!error&&<div className="notice"><p>Todavía no hay predicaciones guardadas.</p></div>}
        </div>
      </section>
    </main>
  </div>;
}
