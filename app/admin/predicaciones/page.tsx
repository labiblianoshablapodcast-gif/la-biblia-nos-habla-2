import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createSermon(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();

  const title=String(formData.get("title")||"").trim();
  const scripture=String(formData.get("scripture")||"").trim();
  const preacher=String(formData.get("preacher")||"Pastor Gilberto Maldonado").trim();
  const category=String(formData.get("category")||"").trim();
  const description=String(formData.get("description")||"").trim();
  const youtube_url=String(formData.get("youtube_url")||"").trim();
  const audio_url=String(formData.get("audio_url")||"").trim();
  const published=formData.get("published")==="on";
  const featured=formData.get("featured")==="on";

  if(!title) return;
  if(featured) await supabase.from("sermons").update({featured:false}).eq("featured",true);

  await supabase.from("sermons").insert({
    title,scripture,preacher,category,description,
    youtube_url,audio_url,published,featured,created_by:user?.id
  });

  revalidatePath("/predicaciones");
  revalidatePath("/admin/predicaciones");
  redirect("/admin/predicaciones");
}

async function deleteSermon(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("sermons").delete().eq("id",id);
  revalidatePath("/predicaciones");
  revalidatePath("/admin/predicaciones");
}

export default async function PredicacionesAdmin(){
  const supabase=await createClient();
  const {data,error}=await supabase.from("sermons").select("*").order("created_at",{ascending:false});

  return <div className="adminShell">
    <AdminNav/>
    <section className="adminMain">
      <p className="eyebrow">Biblioteca ministerial</p>
      <h1>Predicaciones</h1>

      {error&&<div className="notice">
        <strong>Falta actualizar la tabla de predicaciones.</strong>
        <p>Ejecute el SQL de la versión 5.3 en Supabase.</p>
      </div>}

      <form action={createSermon} className="adminForm">
        <label>Título<input name="title" required/></label>
        <label>Texto bíblico<input name="scripture" placeholder="Ej. Juan 3:16"/></label>
        <label>Predicador<input name="preacher" defaultValue="Pastor Gilberto Maldonado"/></label>
        <label>Categoría<input name="category" placeholder="Salvación, Fe, Familia…"/></label>
        <label>Descripción<textarea name="description" rows={5}/></label>
        <label>Enlace de YouTube<input name="youtube_url" type="url"/></label>
        <label>Enlace de audio<input name="audio_url" type="url"/></label>
        <div className="adminChecks">
          <label><input type="checkbox" name="published" defaultChecked/> Publicar</label>
          <label><input type="checkbox" name="featured"/> Destacar mensaje</label>
        </div>
        <button className="btn" type="submit">Guardar predicación</button>
      </form>

      <div className="adminContentList">
        {(data??[]).map(item=><article key={item.id}>
          <div>
            <small>{item.published?"Publicado":"Borrador"} {item.featured?"· Destacado":""}</small>
            <h3>{item.title}</h3>
            <p>{item.scripture} {item.category?`· ${item.category}`:""}</p>
          </div>
          <form action={deleteSermon}>
            <input type="hidden" name="id" value={item.id}/>
            <button className="dangerButton" type="submit">Eliminar</button>
          </form>
        </article>)}
      </div>
    </section>
  </div>;
}
