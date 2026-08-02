import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createDevotional(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();

  const title=String(formData.get("title")||"").trim();
  const scripture=String(formData.get("scripture")||"").trim();
  const reflection=String(formData.get("reflection")||"").trim();
  const prayer=String(formData.get("prayer")||"").trim();
  const published=formData.get("published")==="on";
  const featured=formData.get("featured")==="on";

  if(!title || !reflection) return;

  if(featured){
    await supabase.from("devotionals").update({featured:false}).eq("featured",true);
  }

  await supabase.from("devotionals").insert({
    title,scripture,reflection,prayer,published,featured,created_by:user?.id
  });

  revalidatePath("/devocionales");
  revalidatePath("/admin/devocionales");
  redirect("/admin/devocionales");
}

async function deleteDevotional(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("devotionals").delete().eq("id",id);
  revalidatePath("/devocionales");
  revalidatePath("/admin/devocionales");
}

export default async function DevocionalesAdmin(){
  const supabase=await createClient();
  const {data,error}=await supabase.from("devotionals").select("*").order("created_at",{ascending:false});

  return <div className="adminShell">
    <AdminNav/>
    <section className="adminMain">
      <p className="eyebrow">Contenido diario</p>
      <h1>Devocionales</h1>

      {error && <div className="notice">
        <strong>Falta activar la tabla de devocionales.</strong>
        <p>Ejecute el archivo SQL actualizado en Supabase.</p>
      </div>}

      <form action={createDevotional} className="adminForm">
        <label>Título<input name="title" required/></label>
        <label>Versículo o referencia<input name="scripture"/></label>
        <label>Reflexión<textarea name="reflection" rows={7} required/></label>
        <label>Oración final<textarea name="prayer" rows={4}/></label>
        <div className="adminChecks">
          <label><input type="checkbox" name="published"/> Publicar ahora</label>
          <label><input type="checkbox" name="featured"/> Marcar como destacado</label>
        </div>
        <button className="btn" type="submit">Guardar devocional</button>
      </form>

      <div className="adminContentList">
        {(data??[]).map(item=><article key={item.id}>
          <div>
            <small>{item.published ? "Publicado" : "Borrador"} {item.featured ? "· Destacado" : ""}</small>
            <h3>{item.title}</h3>
            <p>{item.scripture}</p>
          </div>
          <form action={deleteDevotional}>
            <input type="hidden" name="id" value={item.id}/>
            <button className="dangerButton" type="submit">Eliminar</button>
          </form>
        </article>)}
      </div>
    </section>
  </div>;
}
