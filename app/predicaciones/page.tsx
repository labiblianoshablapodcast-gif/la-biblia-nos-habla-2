import {createClient} from "@/lib/supabase/server";
import {featuredSermon} from "@/data/featured-sermon";

export default async function Predicaciones({
  searchParams
}:{
  searchParams:Promise<{q?:string;category?:string}>
}){
  const params=await searchParams;
  const q=(params.q||"").trim();
  const category=(params.category||"").trim();

  const supabase=await createClient();
  let query=supabase
    .from("sermons")
    .select("*")
    .eq("published",true)
    .order("featured",{ascending:false})
    .order("created_at",{ascending:false});

  if(q){
    query=query.or(`title.ilike.%${q}%,scripture.ilike.%${q}%,description.ilike.%${q}%`);
  }
  if(category){
    query=query.eq("category",category);
  }

  const {data,error}=await query.limit(60);
  const {data:categories}=await supabase
    .from("sermons")
    .select("category")
    .eq("published",true)
    .not("category","is",null);

  const uniqueCategories=[...new Set((categories??[]).map(item=>item.category).filter(Boolean))];

  return <>
    <section className="pageHero sermonsHero">
      <p className="eyebrow">Biblioteca de la Palabra</p>
      <h1>Predicaciones y estudios</h1>
      <p>Busque mensajes por título, tema, texto bíblico o categoría.</p>
    </section>

    <section className="section featuredSermonSection">
      <div>
        <p className="eyebrow">Mensaje destacado</p>
        <h2>{featuredSermon.title}</h2>
        <blockquote>{featuredSermon.scripture}</blockquote>
        <p className="lead">{featuredSermon.description}</p>
        <a className="btn" href={featuredSermon.youtubeUrl} target="_blank" rel="noopener noreferrer">Ver mensaje</a>
      </div>
      <div className="featuredSermonVisual"><span>▶</span><strong>Mensaje de la semana</strong></div>
    </section>

    <section className="section soft">
      <form className="sermonSearchForm">
        <input name="q" defaultValue={q} placeholder="Buscar por tema, título o versículo…"/>
        <select name="category" defaultValue={category}>
          <option value="">Todas las categorías</option>
          {uniqueCategories.map(item=><option key={item} value={item}>{item}</option>)}
        </select>
        <button className="btn" type="submit">Buscar</button>
      </form>

      {error && <div className="notice">
        <strong>La biblioteca está preparada.</strong>
        <p>Ejecute el SQL actualizado en Supabase para activar todos sus campos.</p>
      </div>}

      <div className="sermonLibraryGrid">
        {(data??[]).map(sermon=>(
          <article className={`sermonLibraryCard ${sermon.featured?"sermonFeatured":""}`} key={sermon.id}>
            {sermon.featured&&<span className="featuredBadge">Destacado</span>}
            <small>{sermon.category||"Predicación"}</small>
            <h2>{sermon.title}</h2>
            {sermon.scripture&&<blockquote>{sermon.scripture}</blockquote>}
            <p>{sermon.description}</p>
            <div className="sermonMeta">
              <span>{sermon.preacher||"Pastor Gilberto Maldonado"}</span>
              {sermon.created_at&&<span>{new Date(sermon.created_at).toLocaleDateString("es-US",{dateStyle:"medium"})}</span>}
            </div>
            <div className="sermonActions">
              {sermon.youtube_url&&<a className="btn" href={sermon.youtube_url} target="_blank" rel="noopener noreferrer">Ver video</a>}
              {sermon.audio_url&&<a className="btn secondaryDark" href={sermon.audio_url} target="_blank" rel="noopener noreferrer">Escuchar audio</a>}
            </div>
          </article>
        ))}

        {!data?.length&&!error&&<div className="notice">
          <strong>No encontramos predicaciones con esos criterios.</strong>
          <p>Pruebe otra palabra o seleccione todas las categorías.</p>
        </div>}
      </div>
    </section>
  </>;
}
