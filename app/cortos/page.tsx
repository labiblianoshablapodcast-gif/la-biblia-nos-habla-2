import Link from "next/link";
import ShortVideoPlayer from "@/components/ShortVideoPlayer";
import {createClient} from "@/lib/supabase/server";
import styles from "../shorts.module.css";

export const dynamic="force-dynamic";

export default async function CortosPage(){
  const supabase=await createClient();
  const {data}=await supabase
    .from("media_items")
    .select("id,title,description,scripture,media_url,thumbnail_url,created_at")
    .eq("published",true)
    .eq("media_type","short")
    .order("created_at",{ascending:false});

  const shorts=data??[];

  return <main className={styles.archive}>
    <header className={styles.archiveHero}>
      <p className={styles.eyebrow}>UNA PALABRA BREVE PARA SU DÍA</p>
      <h1>60 Segundos de Fe</h1>
      <p>Mensajes cortos de esperanza, enseñanza y fe para compartir la Palabra de Dios de una manera sencilla y directa.</p>
      <Link className={styles.back} href="/">← Volver al inicio</Link>
    </header>

    {shorts.length>0
      ?<section className={styles.grid} aria-label="Cortos de 60 Segundos de Fe">
        {shorts.map(item=><article className={styles.card} key={item.id}>
          <ShortVideoPlayer url={item.media_url} title={item.title} poster={item.thumbnail_url}/>
          <h2>{item.title}</h2>
          {item.scripture&&<p className={styles.scripture}>{item.scripture}</p>}
          {item.description&&<p>{item.description}</p>}
        </article>)}
      </section>
      :<div className={styles.archiveEmpty}>
        <strong>Los primeros cortos estarán aquí.</strong>
        <p>Cuando se publique el primer video en el Panel Pastoral, aparecerá automáticamente en esta página.</p>
      </div>}
  </main>;
}
