import Link from "next/link";
import KidsParents from "@/components/KidsParents";
import styles from "../kids.module.css";
export const metadata={title:"Espacio para padres | Estudio Kids",robots:{index:false,follow:false}};
export default function KidsParentsPage(){return <div className={styles.page}><header className={styles.hero}><div><Link className={styles.lightLink} href="/kids">← Estudio Kids</Link><p className={styles.eyebrow}>Acompañamos su aprendizaje</p><h1>Espacio para padres</h1></div></header><div className={styles.parents}><KidsParents/></div></div>;}
