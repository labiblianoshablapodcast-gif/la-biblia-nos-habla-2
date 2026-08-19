import Link from "next/link";
import BibleDictionarySearch from "@/components/BibleDictionarySearch";
import styles from "./diccionario.module.css";

export const metadata={
  title:"Diccionario bíblico | La Biblia Nos Habla",
  description:"Estudio de palabras bíblicas en hebreo y griego con transliteración y números Strong."
};

export default async function DictionaryPage({searchParams}:{searchParams:Promise<{q?:string}>}){
  const {q=""}=await searchParams;
  return <main className={styles.page}>
    <section className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>Hebreo · Griego · Números Strong</p>
        <h1>Diccionario bíblico</h1>
        <p>Descubra el sentido de palabras importantes de la Biblia y conozca cómo aparecen en sus idiomas originales.</p>
        <div className={styles.heroLinks}>
          <Link href="/biblia">← Volver a la Biblia</Link>
          <a href="https://www.stepbible.org/" target="_blank" rel="noreferrer">Léxico completo ↗</a>
        </div>
      </div>
      <div className={styles.wordArt} aria-hidden="true">
        <span>חֶסֶד</span><span>χάρις</span><span>shalom</span><span>λόγος</span>
      </div>
    </section>

    <section className={styles.content}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Estudio de palabras</p>
        <h2>Busque y compare</h2>
        <p>La definición breve explica el uso bíblico general. El contexto de cada pasaje sigue siendo esencial para interpretar correctamente una palabra.</p>
      </div>
      <BibleDictionarySearch initialQuery={q}/>
      <aside className={styles.attribution}>
        <strong>Fuentes y atribución</strong>
        <p>Selección y explicaciones pastorales en español preparadas para La Biblia Nos Habla. Datos léxicos contrastados con TBESH y TBESG de <a href="https://www.stepbible.org/" target="_blank" rel="noreferrer">STEP Bible</a>, creados por Tyndale House, Cambridge y distribuidos bajo <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Los números Strong se usan como identificadores de referencia.</p>
      </aside>
    </section>
  </main>;
}
