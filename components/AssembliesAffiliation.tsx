import styles from "./AssembliesAffiliation.module.css";
import {agLogoColor} from "@/data/ag-logos";

export default function AssembliesAffiliation(){
 return <section className={styles.affiliation} aria-label="Afiliación con las Asambleas de Dios">
  <a className={styles.logoLink} href="https://ag.org/es-ES" target="_blank" rel="noopener noreferrer" aria-label="Visitar el sitio oficial de las Asambleas de Dios">
   <img src={agLogoColor} alt="Asambleas de Dios" width="1400" height="436"/>
  </a>
  <div className={styles.copy}>
   <p>Identidad Pentecostal</p>
   <h2>Parte de las Asambleas de Dios.</h2>
   <span>Unidos en la misión de evangelizar, adorar, formar discípulos y servir a nuestra comunidad con compasión.</span>
  </div>
 </section>;
}
