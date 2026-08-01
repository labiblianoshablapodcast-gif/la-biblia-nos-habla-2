import Link from "next/link";
import BibleHomeClient from "@/components/BibleHomeClient";
import {books} from "@/lib/bible";

export default function BibliaPage(){
 const old=books.filter(b=>b.testament==="Antiguo Testamento");
 const fresh=books.filter(b=>b.testament==="Nuevo Testamento");
 return <>
  <section className="pageHero">
    <p className="eyebrow">Reina-Valera 1909 · Dominio público</p>
    <h1>Biblioteca Bíblica</h1>
    <p>Los 66 libros, 1,189 capítulos y herramientas personales de lectura.</p>
  </section>

  <section className="section">
    <BibleHomeClient/>
    <p className="sourceNote">Texto bíblico: Santa Biblia Reina-Valera 1909. Preparada para añadir RVR1960 cuando se obtenga autorización.</p>

    <h2>Antiguo Testamento</h2>
    <div className="bookGrid">{old.map(b=>
      <Link className="bookLink" key={b.slug} href={`/biblia/${b.slug}/1`}>
        <strong>{b.name}</strong><small>{b.chapters} capítulos</small>
      </Link>)}
    </div>

    <h2 style={{marginTop:70}}>Nuevo Testamento</h2>
    <div className="bookGrid">{fresh.map(b=>
      <Link className="bookLink" key={b.slug} href={`/biblia/${b.slug}/1`}>
        <strong>{b.name}</strong><small>{b.chapters} capítulos</small>
      </Link>)}
    </div>
  </section>
 </>;
}
