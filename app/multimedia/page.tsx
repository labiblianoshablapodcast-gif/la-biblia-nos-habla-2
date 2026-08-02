import MediaCard from "@/components/MediaCard";
import {createClient} from "@/lib/supabase/server";
import {youtube} from "@/data/youtube";

export default async function Multimedia({
  searchParams
}:{
  searchParams:Promise<{tipo?:string;categoria?:string}>
}){
  const params=await searchParams;
  const type=(params.tipo||"").trim();
  const category=(params.categoria||"").trim();

  const supabase=await createClient();
  let query=supabase
    .from("media_items")
    .select("*")
    .eq("published",true)
    .order("featured",{ascending:false})
    .order("created_at",{ascending:false});

  if(type) query=query.eq("media_type",type);
  if(category) query=query.eq("category",category);

  const {data,error}=await query.limit(48);
  const {data:categoryRows}=await supabase
    .from("media_items")
    .select("category")
    .eq("published",true)
    .not("category","is",null);

  const categories=[...new Set((categoryRows??[]).map(item=>item.category).filter(Boolean))];

  return <>
    <section className="pageHero multimediaHero">
      <p className="eyebrow">Centro Multimedia</p>
      <h1>Vea, escuche y comparta la Palabra.</h1>
      <p>Predicaciones, podcast, audios, Shorts y transmisiones reunidos en un solo lugar.</p>
    </section>

    <section className="section mediaChannelStrip">
      <div>
        <p className="eyebrow">Canales oficiales</p>
        <h2>Conéctese directamente</h2>
      </div>
      <div className="mediaChannelActions">
        <a className="btn" href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">La Biblia Nos Habla</a>
        <a className="btn secondaryDark" href={youtube.pastor.url} target="_blank" rel="noopener noreferrer">Pastor Gilberto</a>
        <a className="btn secondaryDark" href={youtube.ministry.live} target="_blank" rel="noopener noreferrer">Transmisiones en vivo</a>
      </div>
    </section>

    <section className="section soft">
      <form className="mediaFilters">
        <select name="tipo" defaultValue={type}>
          <option value="">Todo el contenido</option>
          <option value="video">Videos</option>
          <option value="short">Shorts</option>
          <option value="podcast">Podcast</option>
          <option value="audio">Audio</option>
          <option value="live">En vivo</option>
        </select>

        <select name="categoria" defaultValue={category}>
          <option value="">Todas las categorías</option>
          {categories.map(item=><option key={item} value={item}>{item}</option>)}
        </select>

        <button className="btn" type="submit">Filtrar</button>
      </form>

      {error&&<div className="notice">
        <strong>El Centro Multimedia está preparado.</strong>
        <p>Ejecute la sección SQL de la versión 7.0A en Supabase para publicar contenido dinámico.</p>
      </div>}

      <div className="mediaLibraryGrid">
        {(data??[]).map(item=><MediaCard item={item} key={item.id}/>)}

        {!data?.length&&!error&&<div className="notice">
          <strong>Próximamente habrá contenido publicado aquí.</strong>
          <p>Mientras tanto puede visitar los canales oficiales de YouTube.</p>
        </div>}
      </div>
    </section>

    <section className="section dark multimediaClosing">
      <p className="eyebrow">Comparta el mensaje</p>
      <h2>Una palabra compartida puede alcanzar una vida.</h2>
      <p>Suscríbase, comparta los mensajes y ayúdenos a llevar el Evangelio más lejos.</p>
      <a className="btn" href={youtube.ministry.url} target="_blank" rel="noopener noreferrer">Suscribirme en YouTube</a>
    </section>
  </>;
}
