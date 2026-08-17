import AdminNav from "@/components/AdminNav";
import PhotoUploadField from "@/components/PhotoUploadField";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

async function createEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  const title=String(formData.get("title")||"").trim();
  if(!title) return;
  await supabase.from("events").insert({
    title,
    starts_at:String(formData.get("starts_at")||"").trim()||null,
    location:String(formData.get("location")||"").trim(),
    description:String(formData.get("description")||"").trim(),
    image_url:String(formData.get("image_url")||"").trim()||null,
    image_path:String(formData.get("image_path")||"").trim()||null,
    published:formData.get("published")==="on",
    created_by:user?.id
  });
  revalidatePath("/eventos");
  revalidatePath("/iglesia");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos");
}

async function updateEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  const title=String(formData.get("title")||"").trim();
  if(!id||!title) return;
  await supabase.from("events").update({
    title,
    starts_at:String(formData.get("starts_at")||"").trim()||null,
    location:String(formData.get("location")||"").trim(),
    description:String(formData.get("description")||"").trim(),
    image_url:String(formData.get("image_url")||"").trim()||null,
    image_path:String(formData.get("image_path")||"").trim()||null,
    published:formData.get("published")==="on"
  }).eq("id",id);
  revalidatePath("/eventos");
  revalidatePath("/iglesia");
  revalidatePath("/admin/eventos");
}

async function deleteEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  const imagePath=String(formData.get("image_path")||"");
  if(imagePath) await supabase.storage.from("site-media").remove([imagePath]);
  if(id) await supabase.from("events").delete().eq("id",id);
  revalidatePath("/eventos");
  revalidatePath("/iglesia");
  revalidatePath("/admin/eventos");
}

function localDateTime(value:string|null){
  if(!value) return "";
  const date=new Date(value);
  const offset=date.getTimezoneOffset();
  return new Date(date.getTime()-offset*60000).toISOString().slice(0,16);
}

export default async function EventosAdmin(){
 const supabase=await createClient();
 const {data}=await supabase.from("events").select("*").order("starts_at",{ascending:true});

 return <div className="adminShell">
  <AdminNav/>
  <section className="adminMain">
   <p className="eyebrow">Calendario</p><h1>Eventos</h1>
   <p>Cree eventos con fotografía y edítelos sin tocar código.</p>
   <form action={createEvent} className="adminForm">
    <label>Título<input name="title" required/></label>
    <label>Fecha y hora<input name="starts_at" type="datetime-local"/></label>
    <label>Lugar<input name="location"/></label>
    <label>Descripción<textarea name="description" rows={5}/></label>
    <PhotoUploadField folder="events" label="Fotografía del evento"/>
    <label><input type="checkbox" name="published" defaultChecked/> Publicar en la página de Iglesia y Eventos</label>
    <button className="btn" type="submit">Guardar evento</button>
   </form>

   <div className="eventAdminGrid">
    {(data??[]).map(event=><article className="eventAdminCard" key={event.id}>
      {event.image_url&&<img className="eventAdminImage" src={event.image_url} alt=""/>}
      <form action={updateEvent} className="adminForm compactAdminForm">
       <input type="hidden" name="id" value={event.id}/>
       <label>Título<input name="title" defaultValue={event.title} required/></label>
       <label>Fecha y hora<input name="starts_at" type="datetime-local" defaultValue={localDateTime(event.starts_at)}/></label>
       <label>Lugar<input name="location" defaultValue={event.location??""}/></label>
       <label>Descripción<textarea name="description" rows={4} defaultValue={event.description??""}/></label>
       <PhotoUploadField folder="events" currentUrl={event.image_url??""} currentPath={event.image_path??""} label="Cambiar fotografía"/>
       <label><input type="checkbox" name="published" defaultChecked={event.published}/> Publicado</label>
       <button className="btn" type="submit">Guardar cambios</button>
      </form>
      <form action={deleteEvent}>
       <input type="hidden" name="id" value={event.id}/>
       <input type="hidden" name="image_path" value={event.image_path??""}/>
       <button className="dangerButton" type="submit">Eliminar evento</button>
      </form>
    </article>)}
   </div>
  </section>
 </div>;
}
