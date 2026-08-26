import styles from "./AssembliesAffiliation.module.css";
import {agLogoColor} from "@/data/ag-logos";

export default function AssembliesAffiliation(){
 return <section className={styles.affiliation} aria-label="Afiliación con las Asambleas de Dios">
  <a className={styles.logoLink} href="https://ag.org/es-ES" target="_blank" rel="noopener noreferrer" aria-label="Visitar el sitio oficial de las Asambleas de Dios">
   <img src={agLogoColor} alt="AD — Asambleas de Dios" width="520" height="289"/>
  </a>
 </section>;
}
