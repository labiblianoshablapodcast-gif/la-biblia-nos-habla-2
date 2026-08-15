import {createClient} from "@/lib/supabase/server";
import {church} from "@/data/church";

export default async function Eventos(){
 const supabase=await createClient();
 const {data}=await supabase.from("events").select("*").eq("published",true).order("starts_at",{ascending:true}).limit(12);
 return <>
  <section className="pageHero eventsHero">
   <p className="eyebrow">Calendario ministerial</p>
   <h1>Servicios y próximos eventos</h1>
   <p>Conozca las reuniones semanales y actividades especiales.</p>
  </section>

  <section className="section">
   <p className="eyebrow">Cada semana</p><h2>Horarios regulares</h2>
   <div className="scheduleGrid">
    {church.schedule.map(item=><article className="scheduleCard" key={item.day}>
      <small>{item.day}</small><strong>{item.time}</strong><p>{item.title}</p>
    </article>)}
   </div>
  </section>

  <section className="section soft">
   <p className="eyebrow">Próximamente</p><h2>Eventos especiales</h2>
   <div className="eventPublicGrid">
    {(data??[]).map(event=><article className="eventPublicCard" key={event.id}>
      {event.image_url&&<img className="eventPublicImage" src={event.image_url} alt=""/>}
      <div className="eventPublicBody">
       <small>{event.starts_at ? new Date(event.starts_at).toLocaleString("es-US",{dateStyle:"long",timeStyle:"short"}) : "Fecha por confirmar"}</small>
       <h3>{event.title}</h3><p>{event.description}</p>{event.location&&<strong>📍 {event.location}</strong>}
      </div>
    </article>)}
    {!data?.length&&<div className="notice"><strong>No hay eventos especiales publicados todavía.</strong><p>Los servicios semanales continúan según el horario regular.</p></div>}
   </div>
  </section>
 </>;
}
