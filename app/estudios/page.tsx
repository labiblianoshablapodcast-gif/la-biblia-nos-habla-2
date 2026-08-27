import Link from "next/link";
import {studyPlans} from "@/lib/study-plans";
import {StudyPlanCard} from "@/components/StudyPlanClient";
import styles from "./estudios.module.css";

export const metadata={title:"Estudios bíblicos | La Biblia Nos Habla",description:"Planes de Juan, Romanos y Hebreos para leer, reflexionar y guardar su progreso dentro de nuestra app."};

export default function EstudiosPage(){
  return <div className={styles.page}>
    <header className={styles.hero}><p className={styles.eyebrow}>Leer · Comprender · Vivir</p><h1>Estudios bíblicos</h1><p>Un espacio para crecer en la Palabra, un día a la vez. Todas las lecturas y actividades se realizan aquí.</p><Link className={styles.back} href="/biblia">← Ir a la Biblia</Link></header>
    <div className={styles.content}>
      <div className={styles.cards}>{studyPlans.map(plan=><StudyPlanCard key={plan.id} plan={plan}/>)}</div>
      <section className={styles.resources} aria-labelledby="study-resources"><div><p className={styles.eyebrow}>Para profundizar</p><h2 id="study-resources">Herramientas de estudio</h2></div><Link href="/diccionario"><strong>Diccionario bíblico →</strong><span>Palabras en hebreo y griego, significados y referencias Strong.</span></Link><Link href="/devocionales"><strong>Texto de hoy para meditar →</strong><span>Una lectura, una reflexión y un momento de oración.</span></Link></section>
      <p className={styles.storageNote}>Guías y reflexiones propias de La Biblia Nos Habla. El progreso de los planes se guarda en este dispositivo; no se sincroniza entre dispositivos.</p>
    </div>
  </div>;
}
