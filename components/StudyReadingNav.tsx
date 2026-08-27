import Link from "next/link";
import type {StudyPlan} from "@/lib/study-plans";
import {studyDayUrl,studyReadingUrl} from "@/lib/study-plans";
import styles from "@/app/estudios/estudios.module.css";

export default function StudyReadingNav({plan,day,chapter,version}:{plan:StudyPlan;day:number;chapter:number;version:string}){
  return <aside className={styles.readingNav} aria-label="Lecturas del estudio">
    <p>{plan.book} · Día {day} de {plan.days.length}</p>
    <nav aria-label="Continuar el estudio">{plan.days[day-1].chapters.map(number=><Link key={number} aria-current={number===chapter?"page":undefined} href={studyReadingUrl(plan,day,number,version)}>{plan.book} {number}</Link>)}<Link href={studyDayUrl(plan,day,version)}>Volver al estudio y marcar el día →</Link></nav>
  </aside>;
}
