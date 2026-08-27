import Link from "next/link";
import {notFound} from "next/navigation";
import {getStudyPlan,getStudyDay} from "@/lib/study-plans";
import {readerVersion} from "@/lib/bible-version";
import StudyPlanClient from "@/components/StudyPlanClient";
import JohnChapterQuestions from "@/components/JohnChapterQuestions";
import styles from "../../estudios.module.css";

export default async function StudyDayPage({params,searchParams}:{params:Promise<{plan:string;day:string}>;searchParams:Promise<{version?:string}>}){
  const route=await params;
  const plan=getStudyPlan(route.plan);
  const day=/^\d+$/.test(route.day)?Number(route.day):0;
  if(!plan||!getStudyDay(plan,day))notFound();
  const version=readerVersion((await searchParams).version);
  return <div className={styles.page}>
    <header className={styles.hero}><Link className={styles.back} href="/estudios">← Todos los estudios</Link><p className={styles.eyebrow}>{plan.book} · Plan de {plan.days.length} días</p><h1>{plan.title}</h1><p>Lea, reflexione y continúe a su ritmo dentro de nuestra app.</p></header>
    <div className={styles.detail}><StudyPlanClient key={`${plan.id}-${day}`} plan={plan} day={day} version={version}>{plan.id==="juan"&&<JohnChapterQuestions key={day} chapter={day}/>}</StudyPlanClient></div>
  </div>;
}
