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
  const startsAt=String(formData.get("starts_at")||"").trim();
  if(!user||!title||!startsAt) redirect("/admin/eventos?estado=incompleto");
  const {error}=await supabase.from("events").insert({
    title,
    starts_at:startsAt,
    location:String(formData.get("location")||"").trim(),
    description:String(formData.get("description")||"").trim(),
    image_url:String(formData.get("image_url")||"").trim()||null,
    image_path:String(formData.get("image_path")||"").trim()||null,
    published:formData.get("published")==="on",
    created_by:user?.id
  });
  if(error) redirect("/admin/eventos?estado=error");
  revalidatePath("/eventos");
  revalidatePath("/iglesia");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos?estado=guardado#eventos-guardados");
}

async function updateEvent(formData:FormData){
  "use server";
  const supabase=await createClient();
  const id=Number(formData.get("id"));
  const title=String(formData.get("title")||"").trim();
  if(!id||!title) return;
  const {error}=await supabase.from("events").update({
    title,
    starts_at:String(formData.get("starts_at")||"").trim()||null,
    location:String(formData.get("location")||"").trim(),
    description:String(formData.get("description")||"").trim(),
    image_url:String(formData.get("image_url")||"").trim()||null,
    image_path:String(formData.get("image_path")||"").trim()||null,
    published:formData.get("published")==="on"
  }).eq("id",id);
  if(error) redirect("/admin/eventos?estado=error");
  revalidatePath("/eventos");
  revalidatePath("/iglesia");
  revalidatePath("/admin/eventos");
  redirect("/admin/eventos?estado=actualizado#eventos-guardados");
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
  redirect("/admin/eventos?estado=eliminado#eventos-guardados");
}

function localDateTime(value:string|null){
  if(!value) return "";
  const date=new Date(value);
  const offset=date.getTimezoneOffset();
  return new Date(date.getTime()-offset*60000).toISOString().slice(0,16);
}

const messages:Record<string,{title:string;text:string;kind:string}>={
 guardado:{title:"Evento publicado correctamente",text:"El evento quedó guardado y ya puede verse en las páginas de Eventos e Iglesia.",kind:"success"},
 actualizado:{title:"Cambios guardados",text:"La información del evento fue actualizada correctamente.",kind:"success"},
 eliminado:{title:"Evento eliminado",text:"El evento fue retirado del calendario.",kind:"warning"},
 incompleto:{title:"Faltan datos importantes",text:"Complete el título y la fecha del evento antes de guardarlo.",kind:"error"},
 error:{title:"No se pudo guardar",text:"Inténtelo nuevamente. Si continúa, revise la conexión a internet.",kind:"error"}
};

export default async function EventosAdmin({searchParams}:{searchParams:Promise<{estado?:string}>}){
 const {estado}=await searchParams;
 const message=estado?messages[estado]:null;
 const supabase=await createClient();
 const {data}=await supabase.from("events").select("*").order("starts_at",{ascending:true});

 return <div className="adminShell">
  <AdminNav/>
  <main className="adminMain photoManagerPage">
   <header className="photoManagerHeader">
    <div><p className="eyebrow">Calendario ministerial</p><h1>Eventos</h1><p>Cree eventos con fotografía y publíquelos sin tocar código.</p></div>
    <a className="btn secondaryDark" href="/eventos" target="_blank" rel="noreferrer">Ver página pública ↗</a>
   </header>
   {message&&<div className={"photoSaveNotice "+message.kind} role="status">
    <span>{message.kind==="success"?"✓":message.kind==="error"?"!":"−"}</span>
    <div><strong>{message.title}</strong><p>{message.text}</p></div>
   </div>}
   <form action={createEvent} className="adminForm">
    <label>Título<input name="title" required/></label>
    <label>Fecha y hora<input name="starts_at" type="datetime-local" required/></label>
    <label>Lugar<input name="location" placeholder="Ej. Iglesia Príncipe de Paz"/></label>
    <label>Descripción<textarea name="description" rows={5}/></label>
    <PhotoUploadField folder="events" label="Fotografía del evento"/>
    <label><input type="checkbox" name="published" defaultChecked/> Publicar en la página de Iglesia y Eventos</label>
    <button className="btn" type="submit">Guardar evento</button>
   </form>

   <div id="eventos-guardados" className="eventAdminGrid">
    {(data??[]).map(event=><article className="eventAdminCard" key={event.id}>
      {event.image_url&&<img className="eventAdminImage" src={event.image_url} alt={event.title}/>}<span className={"adminStatusBadge "+(event.published?"published":"draft")}>{event.published?"Publicado":"Borrador"}</span>
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
  </main>
 </div>;
}
