import Link from "next/link";
import KidsLesson from "@/components/KidsLesson";
import {kidsAge,learnerSlot} from "@/lib/kids";
import styles from "../kids.module.css";
export const metadata={title:"David y Goliat | Estudio Kids"};
export default async function KidsStoryPage({searchParams}:{searchParams:Promise<{edad?:string;perfil?:string}>}){
 const query=await searchParams,age=kidsAge(query.edad),slot=learnerSlot(query.perfil);
 return <div className={styles.page}><header className={styles.hero}><div><Link className={styles.lightLink} href="/kids">← Estudio Kids</Link><p className={styles.eyebrow}>1 Samuel 17 · {age} años</p><h1>David y Goliat</h1><p>Confiar en Dios</p></div></header><div className={styles.lessonContainer}><nav className={styles.ageSwitcher} aria-label="Grupo de edad"><Link aria-current={age==="4-6"?"page":undefined} href={`/kids/david-y-goliat?edad=4-6&perfil=${slot}`}>4–6 años</Link><Link aria-current={age==="7-10"?"page":undefined} href={`/kids/david-y-goliat?edad=7-10&perfil=${slot}`}>7–10 años</Link></nav><KidsLesson key={`${age}-${slot}`} age={age} slot={slot}/></div></div>;
}
