import Link from "next/link";
import BibleSearch from "@/components/BibleSearch";
import {books} from "@/lib/bible";

export default function BibliaPage(){
 const old=books.filter(b=>b.testament==="Antiguo Testamento");
 const fresh=books.filter(b=>b.testament==="Nuevo Testamento");
 return <>
 <section className="pageHero">
   <p className="eyebrow">Versión oficial del proyecto</p>
   <h1>Santa Biblia</h1>
   <p>Reina-Valera 1960 · Integración preparada para una fuente autorizada.</p>
 </section>
 <section className="section">
   <div className="notice">
     <strong>Reina-Valera 1960</strong>
     <p>La plataforma está configurada para mostrar la RVR1960 mediante una licencia o API autorizada. Mientras se completa esa conexión, podrá navegar por los 66 libros y todos sus capítulos.</p>
   </div>
   <BibleSearch/>
   <p className="sourceNote">La RVR1960 está protegida por derechos de autor. No incluimos ni distribuimos el texto completo sin autorización.</p>
   <h2>Antiguo Testamento</h2>
   <div className="bookGrid">{old.map(b=><Link className="bookLink" key={b.slug} href={`/biblia/${b.slug}/1`}><strong>{b.name}</strong><small>{b.chapters} capítulos</small></Link>)}</div>
   <h2 style={{marginTop:70}}>Nuevo Testamento</h2>
   <div className="bookGrid">{fresh.map(b=><Link className="bookLink" key={b.slug} href={`/biblia/${b.slug}/1`}><strong>{b.name}</strong><small>{b.chapters} capítulos</small></Link>)}</div>
 </section></>;
}
