import Image from "next/image";
import Link from "next/link";
import {createClient} from "@/lib/supabase/server";

export default async function Predicaciones({searchParams}:{searchParams:Promise<{q?:string;category?:string;series?:string}>}){
  const params=await searchParams;
  const q=(params.q||"").trim(); const category=(params.category||"").trim(); const series=(params.series||"").trim();
  const supabase=await createClient();
  let query=supabase.from("sermons").select("*").eq("published",true).order("featured",{ascending:false}).order("published_at",{ascending:false});
  if(q) query=query.or(`title.ilike.%${q}%,scripture.ilike.%${q}%,summary.ilike.%${q}%,category.ilike.%${q}%`);
  if(category) query=query.eq("category",category);
  if(series) query=query.eq("series_name",series);
  const {data,error}=await query.limit(60);
  const [{data:categories},{data:seriesRows}]=await Promise.all([
    supabase.from("sermon_categories").select("name").order("name"),
    supabase.from("sermon_series").select("name").order("name")
  ]);

  return <><section className="pageHero sermonsHero"><p className="eyebrow">Biblioteca de la Palabra</p><h1>Predicaciones</h1><p>Busque por tema, texto bíblico, categoría o serie.</p></section>
  <section className="section soft">
    <form className="sermonProSearch"><input name="q" defaultValue={q} placeholder="Buscar predicación…"/><select name="category" defaultValue={category}><option value="">Todas las categorías</option>{(categories??[]).map(x=><option key={x.name}>{x.name}</option>)}</select><select name="series" defaultValue={series}><option value="">Todas las series</option>{(seriesRows??[]).map(x=><option key={x.name}>{x.name}</option>)}</select><button className="btn">Buscar</button></form>
    {error&&<div className="notice"><strong>Ejecute la migración 8.2A.</strong><p>{error.message}</p></div>}
    <div className="sermonProGrid">{(data??[]).map(item=><article className={`sermonProCard ${item.featured?"sermonProFeatured":""}`} key={item.id}>
      <Link className="sermonProImage" href={`/predicaciones/${item.slug}`}>{item.thumbnail_url?<Image src={item.thumbnail_url} alt={item.title} fill sizes="(max-width:800px) 100vw, 33vw"/>:<div className="sermonProPlaceholder">📖</div>}{item.featured&&<span>Destacado</span>}</Link>
      <div className="sermonProCopy"><small>{item.category||"Predicación"}{item.series_name?` · ${item.series_name}`:""}</small><h2><Link href={`/predicaciones/${item.slug}`}>{item.title}</Link></h2>{item.scripture&&<blockquote>{item.scripture}</blockquote>}<p>{item.summary||item.description}</p><Link className="textLink" href={`/predicaciones/${item.slug}`}>Abrir predicación →</Link></div>
    </article>)}{!data?.length&&!error&&<div className="notice"><strong>No hay resultados.</strong><p>Pruebe otra búsqueda.</p></div>}</div>
  </section></>;
}
