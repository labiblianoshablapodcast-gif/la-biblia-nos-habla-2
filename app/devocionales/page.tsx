import {createClient} from "@/lib/supabase/server";
import styles from "./devocionales.module.css";

export const dynamic="force-dynamic";

type Devotional={
  id:number;
  title:string;
  scripture:string|null;
  reflection:string;
  prayer:string|null;
  featured:boolean;
  created_at:string;
};

function formatDate(value:Date|string){
  return new Intl.DateTimeFormat("es-US",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric",
    timeZone:"America/New_York"
  }).format(new Date(value));
}

export default async function DevocionalesPage(){
  const supabase=await createClient();
  const {data}=await supabase
    .from("devotionals")
    .select("id,title,scripture,reflection,prayer,featured,created_at")
    .eq("published",true)
    .order("featured",{ascending:false})
    .order("created_at",{ascending:false})
    .limit(7);

  const devotionals=(data??[]) as Devotional[];
  const featured=devotionals[0];
  const recent=devotionals.slice(1);
  const today=formatDate(new Date());

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>Una palabra para su vida</p>
        <h1>Meditación del día de hoy</h1>
        <p className={styles.date}>{today}</p>
      </div>
    </section>

    <section className={styles.content}>
      {featured ? <article className={styles.devotional}>
        <div className={styles.mainCopy}>
          <span className={styles.badge}>{featured.featured ? "Meditación destacada" : "Reflexión bíblica"}</span>
          <h2>{featured.title}</h2>
          {featured.scripture && <blockquote className={styles.scripture}>{featured.scripture}</blockquote>}
          <p className={styles.reflection}>{featured.reflection}</p>
        </div>
        <aside className={styles.prayer}>
          <span>Para terminar</span>
          <h3>Oremos juntos</h3>
          <p>{featured.prayer || "Señor, permite que tu Palabra permanezca en nuestro corazón y dirija cada paso de este día. Amén."}</p>
        </aside>
      </article> : <div className={styles.empty}>
        <h2>Muy pronto compartiremos la meditación de hoy.</h2>
        <p>Mientras tanto, continúe leyendo y guardando la Palabra de Dios en su corazón.</p>
      </div>}

      {recent.length>0 && <section className={styles.recent} aria-labelledby="recent-devotionals">
        <header className={styles.recentHeader}>
          <div><p>Para seguir creciendo</p><h2 id="recent-devotionals">Meditaciones recientes</h2></div>
        </header>
        <div className={styles.recentGrid}>
          {recent.map(item=><article key={item.id}>
            <small>{formatDate(item.created_at)}</small>
            <h3>{item.title}</h3>
            <p>{item.reflection}</p>
          </article>)}
        </div>
      </section>}
    </section>
  </main>;
}
