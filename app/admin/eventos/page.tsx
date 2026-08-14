import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();

  const title=String(formData.get("title")||"").trim();
  const starts_at=String(formData.get("starts_at")||"").trim();
  const location=String(formData.get("location")||"").trim();
  const description=String(formData.get("description")||"").trim();
  const published=formData.get("published")==="on";

  if(!title) return;
  await supabase.from("events").insert({
    title,starts_at:starts_at||null,location,description,published,created_by:user?.id
  });
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

async function deleteEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  if(id) await supabase.from("events").delete().eq("id",id);
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
}

export default async function EventosAdmin(){
 const supabase=await createClient();
 const {data}=await supabase.from("events").select("*").order("starts_at",{ascending:true});

 return <div className="adminShell">
  <AdminNav/>
  <section className="adminMain">
   <p className="eyebrow">Calendario</p><h1>Eventos</h1>
   <form action={createEvent} className="adminForm">
    <label>Título<input name="title" required/></label>
    <label>Fecha y hora<input name="starts_at" type="datetime-local"/></label>
    <label>Lugar<input name="location"/></label>
    <label>Descripción<textarea name="description" rows={5}/></label>
    <label><input type="checkbox" name="published"/> Publicar en la página</label>
    <button className="btn" type="submit">Guardar evento</button>
   </form>

   <div className="adminContentList">
    {(data??[]).map(event=><article key={event.id}>
      <div><small>{event.published?"Publicado":"Borrador"}</small><h3>{event.title}</h3><p>{event.starts_at ? new Date(event.starts_at).toLocaleString("es-US") : "Sin fecha"}</p></div>
      <form action={deleteEvent}><input type="hidden" name="id" value={event.id}/><button className="dangerButton" type="submit">Eliminar</button></form>
    </article>)}
   </div>
  </section>
 </div>;
}
