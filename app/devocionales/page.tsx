import {createClient} from "@/lib/supabase/server";
import {books,getChapter} from "@/lib/bible";
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

const dailyPassages=[
  ["PSA",23,1],["PHP",4,13],["JER",29,11],["ISA",41,10],["PRO",3,5],
  ["ROM",8,28],["PSA",46,1],["JHN",3,16],["MAT",11,28],["JOS",1,9],
  ["PSA",119,105],["2CO",5,17],["HEB",11,1],["PSA",34,8],["ISA",40,31],
  ["PHP",4,6],["ROM",12,2],["MAT",6,33],["PSA",37,5],["GAL",2,20],
  ["1PE",5,7],["JHN",14,6],["PSA",121,1],["EPH",2,8],["PRO",18,10],
  ["ROM",5,8],["PSA",91,1],["JHN",8,12],["LAM",3,22],["REV",21,4],
  ["PSA",118,24]
] as const;

function formatDate(value:Date|string){
  return new Intl.DateTimeFormat("es-US",{
    weekday:"long",
    day:"numeric",
    month:"long",
    year:"numeric",
    timeZone:"America/New_York"
  }).format(new Date(value));
}

function getNewYorkDay(value:Date){
  const parts=new Intl.DateTimeFormat("en-US",{
    year:"numeric",month:"numeric",day:"numeric",timeZone:"America/New_York"
  }).formatToParts(value);
  const valueOf=(type:string)=>Number(parts.find(part=>part.type===type)?.value);
  return Math.floor(Date.UTC(valueOf("year"),valueOf("month")-1,valueOf("day"))/86_400_000);
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
  const now=new Date();
  const today=formatDate(now);
  const [dailyCode,dailyChapter,dailyNumber]=dailyPassages[getNewYorkDay(now)%dailyPassages.length];
  const dailyChapterText=await getChapter(dailyCode,dailyChapter);
  const dailyVerse=dailyChapterText?.verses.find(verse=>verse.number===dailyNumber);
  const dailyBook=books.find(book=>book.code===dailyCode);
  const dailyReference=`${dailyBook?.name ?? dailyChapterText?.book ?? "Biblia"} ${dailyChapter}:${dailyNumber}`;
  const scripture=dailyVerse?.text || featured?.scripture;

  return <main className={styles.page}>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.eyebrow}>Versículo de hoy</p>
        <h1>Texto de hoy para meditar</h1>
        <p className={styles.date}>{today}</p>
      </div>
    </section>

    <section className={styles.content}>
      {(scripture || featured) ? <article className={styles.devotional}>
        <div className={styles.mainCopy}>
          <span className={styles.badge}>{today}</span>
          <h2>{dailyReference}</h2>
          <blockquote className={styles.scripture}>{scripture || "El texto bíblico de hoy será publicado muy pronto."}</blockquote>
          <p className={styles.reflection}>{featured?.reflection || "Lea este texto con calma, medite en lo que Dios quiere hablar a su vida y guarde su Palabra en el corazón durante este día."}</p>
          {dailyVerse && <p className={styles.source}>Reina-Valera Revisada 1960 · Texto provisto por <a href="https://biblia.com/" target="_blank" rel="noreferrer">Biblia.com</a> y Logos Bible Software.</p>}
        </div>
        <aside className={styles.prayer}>
          <span>Para terminar</span>
          <h3>Oremos juntos</h3>
          <p>{featured?.prayer || "Señor, permite que tu Palabra permanezca en nuestro corazón y dirija cada paso de este día. Amén."}</p>
        </aside>
      </article> : <div className={styles.empty}>
        <h2>Texto de hoy para meditar</h2>
        <p>{today}. El texto bíblico de hoy será publicado muy pronto.</p>
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
