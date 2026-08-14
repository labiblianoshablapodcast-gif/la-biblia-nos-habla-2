import AdminNav from "@/components/AdminNav";
import RichSermonEditor from "@/components/RichSermonEditor";
import {createClient} from "@/lib/supabase/server";
import {createSlug} from "@/lib/slug";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createSermon(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");

  const title=String(formData.get("title")||"").trim();
  const slug=createSlug(String(formData.get("slug")||title));
  const status=String(formData.get("status")||"draft");
  const published=status==="published";

  const payload={
    title,slug,
    scripture:String(formData.get("scripture")||"").trim(),
    preacher:String(formData.get("preacher")||"Pastor Gilberto Maldonado").trim(),
    category:String(formData.get("category")||"").trim(),
    series_name:String(formData.get("series_name")||"").trim(),
    subtitle:String(formData.get("subtitle")||"").trim(),
    summary:String(formData.get("summary")||"").trim(),
    description:String(formData.get("summary")||"").trim(),
    content_html:String(formData.get("content_html")||"").trim(),
    outline:String(formData.get("content_html")||"").replace(/<[^>]+>/g," ").trim(),
    youtube_url:String(formData.get("youtube_url")||"").trim(),
    audio_url:String(formData.get("audio_url")||"").trim(),
    pdf_url:String(formData.get("pdf_url")||"").trim(),
    thumbnail_url:String(formData.get("thumbnail_url")||"").trim(),
    seo_title:String(formData.get("seo_title")||title).trim(),
    seo_description:String(formData.get("seo_description")||formData.get("summary")||"").trim(),
    tags:String(formData.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),
    scheduled_at:String(formData.get("scheduled_at")||"")||null,
    status,published,
    published_at:published?new Date().toISOString():null,
    featured:formData.get("featured")==="on",
    created_by:user.id
  };

  if(!title||!slug) return;
  if(payload.featured) await supabase.from("sermons").update({featured:false}).eq("featured",true);

  const {error}=await supabase.from("sermons").insert(payload);
  if(error) redirect(`/admin/predicaciones?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  revalidatePath("/predicaciones");
  revalidatePath(`/predicaciones/${slug}`);
  revalidatePath("/admin");
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

export default async function PredicacionesAdmin({searchParams}:{searchParams:Promise<{success?:string;error?:string}>}){
  const params=await searchParams;
  const supabase=await createClient();
  const [{data:sermons,error},{data:categories},{data:series}]=await Promise.all([
    supabase.from("sermons").select("*").order("created_at",{ascending:false}),
    supabase.from("sermon_categories").select("*").order("name"),
    supabase.from("sermon_series").select("*").order("name")
  ]);

  return <div className="adminShell adminShellPro">
    <AdminNav/>
    <main className="adminMain">
      <div className="adminPageIntro">
        <div><p className="eyebrow">Editor Profesional 8.3A</p><h1>Nueva predicación</h1><p>Prepare el mensaje, guárdelo como borrador o publíquelo inmediatamente.</p></div>
        <a className="btn secondaryDark" href="/predicaciones" target="_blank">Ver biblioteca pública</a>
      </div>

      {params.success&&<div className="successNotice"><strong>Predicación guardada correctamente.</strong></div>}
      {(params.error||error)&&<div className="notice"><strong>Falta completar la actualización.</strong><p>{params.error||error?.message}</p><p>Ejecute <code>supabase/004_editor_profesional_8_3A.sql</code>.</p></div>}

      <form action={createSermon} className="adminForm sermonProForm">
        <div className="adminFormGrid">
          <RichSermonEditor/>
          <label>Texto bíblico<input name="scripture" placeholder="Ej. Judas 1:3"/></label>
          <label>Predicador<input name="preacher" defaultValue="Pastor Gilberto Maldonado"/></label>
          <label>Categoría
            <input name="category" list="sermon-categories" placeholder="Fe, Salvación…"/>
            <datalist id="sermon-categories">{(categories??[]).map(item=><option value={item.name} key={item.id}/>)}</datalist>
          </label>
          <label>Serie
            <input name="series_name" list="sermon-series" placeholder="Ej. Evangelio de Juan"/>
            <datalist id="sermon-series">{(series??[]).map(item=><option value={item.name} key={item.id}/>)}</datalist>
          </label>
          <label className="wideField">Resumen<textarea name="summary" rows={4} placeholder="Descripción breve para la biblioteca y Google…"/></label>
          <label className="wideField">Etiquetas<input name="tags" placeholder="fe, familia, Espíritu Santo (separadas por comas)"/></label>
          <label>Programar publicación<input name="scheduled_at" type="datetime-local"/></label>
          <label>YouTube<input name="youtube_url" type="url"/></label>
          <label>Audio<input name="audio_url" type="url"/></label>
          <label>PDF<input name="pdf_url" type="url"/></label>
          <label>Imagen de portada<input name="thumbnail_url" type="url"/></label>
          <label>Título SEO<input name="seo_title"/></label>
          <label>Descripción SEO<input name="seo_description"/></label>
          <label>Estado
            <select name="status" defaultValue="draft"><option value="draft">Guardar como borrador</option><option value="published">Publicar ahora</option></select>
          </label>
          <label className="checkCard"><input type="checkbox" name="featured"/> Destacar en la biblioteca</label>
        </div>
        <button className="btn" type="submit">Guardar predicación</button>
      </form>

      <section className="adminSavedSection">
        <p className="eyebrow">Biblioteca administrativa</p><h2>Mensajes guardados</h2>
        <div className="adminSermonTable">
          {(sermons??[]).map(item=><article key={item.id}>
            <div className="adminSermonStatus"><span className={item.published?"statusPublished":"statusDraft"}>{item.published?"Publicado":"Borrador"}</span>{item.featured&&<span className="statusFeatured">Destacado</span>}</div>
            <div><h3>{item.title}</h3><p>{item.scripture||"Sin texto"} {item.category?`· ${item.category}`:""} {item.series_name?`· ${item.series_name}`:""}</p><small>/predicaciones/{item.slug||item.id}</small></div>
            <div className="adminItemActions"><a href={`/admin/predicaciones/${item.id}/editar`}>Editar</a>{item.published&&item.slug&&<a href={`/predicaciones/${item.slug}`} target="_blank">Ver</a>}<form action={deleteSermon}><input type="hidden" name="id" value={item.id}/><button className="dangerButton" type="submit">Eliminar</button></form></div>
          </article>)}
          {!sermons?.length&&!error&&<div className="notice"><p>Todavía no hay predicaciones guardadas.</p></div>}
        </div>
      </section>
    </main>
  </div>;
}
