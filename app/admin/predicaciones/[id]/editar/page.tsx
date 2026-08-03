import AdminNav from "@/components/AdminNav";
import RichSermonEditor from "@/components/RichSermonEditor";
import {createClient} from "@/lib/supabase/server";
import {createSlug} from "@/lib/slug";
import {notFound,redirect} from "next/navigation";
import {revalidatePath} from "next/cache";

async function updateSermon(id:number,formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)redirect("/login");
  const title=String(formData.get("title")||"").trim();
  const slug=createSlug(String(formData.get("slug")||title));
  const status=String(formData.get("status")||"draft");
  const published=status==="published";
  const payload={
    title,slug,subtitle:String(formData.get("subtitle")||"").trim(),
    scripture:String(formData.get("scripture")||"").trim(),preacher:String(formData.get("preacher")||"").trim(),
    category:String(formData.get("category")||"").trim(),series_name:String(formData.get("series_name")||"").trim(),
    summary:String(formData.get("summary")||"").trim(),content_html:String(formData.get("content_html")||"").trim(),
    outline:String(formData.get("content_html")||"").replace(/<[^>]+>/g," ").trim(),
    tags:String(formData.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean),
    scheduled_at:String(formData.get("scheduled_at")||"")||null,
    youtube_url:String(formData.get("youtube_url")||"").trim(),audio_url:String(formData.get("audio_url")||"").trim(),
    pdf_url:String(formData.get("pdf_url")||"").trim(),thumbnail_url:String(formData.get("thumbnail_url")||"").trim(),
    seo_title:String(formData.get("seo_title")||title).trim(),seo_description:String(formData.get("seo_description")||"").trim(),
    status,published,published_at:published?new Date().toISOString():null,featured:formData.get("featured")==="on"
  };
  if(payload.featured)await supabase.from("sermons").update({featured:false}).neq("id",id);
  const {error}=await supabase.from("sermons").update(payload).eq("id",id);
  if(error)redirect(`/admin/predicaciones/${id}/editar?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/predicaciones");revalidatePath(`/predicaciones/${slug}`);revalidatePath("/admin/predicaciones");
  redirect("/admin/predicaciones?success=1");
}

export default async function Editar({params}:{params:Promise<{id:string}>}){
  const {id}=await params; const supabase=await createClient();
  const {data:item}=await supabase.from("sermons").select("*").eq("id",Number(id)).maybeSingle();
  if(!item)notFound();
  const action=updateSermon.bind(null,Number(id));
  return <div className="adminShell adminShellPro"><AdminNav/><main className="adminMain">
    <div className="adminPageIntro"><div><p className="eyebrow">Editor Profesional 8.3A</p><h1>Editar predicación</h1><p>Actualice el mensaje y guarde los cambios.</p></div><a className="btn secondaryDark" href="/admin/predicaciones">Volver</a></div>
    <form action={action} className="adminForm sermonProForm"><div className="adminFormGrid">
      <RichSermonEditor defaultTitle={item.title} defaultSubtitle={item.subtitle||""} defaultSlug={item.slug||""} defaultHtml={item.content_html||""} draftKey={`sermon-${item.id}`}/>
      <label>Texto bíblico<input name="scripture" defaultValue={item.scripture||""}/></label>
      <label>Predicador<input name="preacher" defaultValue={item.preacher||"Pastor Gilberto Maldonado"}/></label>
      <label>Categoría<input name="category" defaultValue={item.category||""}/></label>
      <label>Serie<input name="series_name" defaultValue={item.series_name||""}/></label>
      <label className="wideField">Resumen<textarea name="summary" rows={4} defaultValue={item.summary||""}/></label>
      <label className="wideField">Etiquetas<input name="tags" defaultValue={(item.tags||[]).join(", ")}/></label>
      <label>Programar publicación<input name="scheduled_at" type="datetime-local" defaultValue={item.scheduled_at?new Date(item.scheduled_at).toISOString().slice(0,16):""}/></label>
      <label>YouTube<input name="youtube_url" type="url" defaultValue={item.youtube_url||""}/></label>
      <label>Audio<input name="audio_url" type="url" defaultValue={item.audio_url||""}/></label>
      <label>PDF<input name="pdf_url" type="url" defaultValue={item.pdf_url||""}/></label>
      <label>Imagen<input name="thumbnail_url" type="url" defaultValue={item.thumbnail_url||""}/></label>
      <label>Título SEO<input name="seo_title" defaultValue={item.seo_title||""}/></label>
      <label>Descripción SEO<input name="seo_description" defaultValue={item.seo_description||""}/></label>
      <label>Estado<select name="status" defaultValue={item.status||"draft"}><option value="draft">Borrador</option><option value="published">Publicado</option></select></label>
      <label className="checkCard"><input type="checkbox" name="featured" defaultChecked={Boolean(item.featured)}/> Destacar</label>
    </div><button className="btn">Guardar cambios</button></form>
  </main></div>;
}
