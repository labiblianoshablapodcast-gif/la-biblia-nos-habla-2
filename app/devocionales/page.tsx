import {createClient} from "@/lib/supabase/server";

export default async function Devocionales(){
  const supabase=await createClient();
  const {data,error}=await supabase
    .from("devotionals")
    .select("*")
    .eq("published",true)
    .order("featured",{ascending:false})
    .order("created_at",{ascending:false})
    .limit(24);

  return <>
    <section className="pageHero devotionalsHero">
      <p className="eyebrow">Alimento para el alma</p>
      <h1>Devocionales</h1>
      <p>Reflexiones bíblicas para comenzar el día con fe, oración y dirección.</p>
    </section>

    <section className="section">
      {error && <div className="notice">
        <strong>La sección está preparada.</strong>
        <p>Ejecute el SQL de la versión 5.2 en Supabase para activar los devocionales.</p>
      </div>}

      <div className="devotionalGrid">
        {(data??[]).map(item=>(
          <article className={`devotionalCard ${item.featured ? "featuredDevotional" : ""}`} key={item.id}>
            {item.featured && <span className="featuredBadge">Destacado</span>}
            <small>{item.created_at ? new Date(item.created_at).toLocaleDateString("es-US",{dateStyle:"long"}) : ""}</small>
            <h2>{item.title}</h2>
            {item.scripture && <blockquote>{item.scripture}</blockquote>}
            <p>{item.reflection}</p>
            {item.prayer && <div className="devotionalPrayer"><strong>Oración</strong><p>{item.prayer}</p></div>}
          </article>
        ))}

        {!data?.length && !error && <div className="notice">
          <strong>Los primeros devocionales se publicarán próximamente.</strong>
          <p>Desde el Panel Pastoral podrá escribirlos y publicarlos sin modificar el código.</p>
        </div>}
      </div>
    </section>
  </>;
}
