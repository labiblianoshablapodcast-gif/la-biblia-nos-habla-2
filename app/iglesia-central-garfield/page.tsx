import Link from "next/link";
import styles from "./garfield.module.css";
import media from "./garfield-media.module.css";
import refine from "./garfield-refinement.module.css";
import ChurchGallery from "./ChurchGallery";

export const metadata={
 title:"Iglesia Central Príncipe de Paz | Garfield, NJ",
 description:"Conozca la Iglesia Internacional Príncipe de Paz en 132 Palisade Ave, Garfield, New Jersey."
};

const mapsUrl="https://www.google.com/maps/search/?api=1&query=132+Palisade+Ave+Garfield+NJ";
const phone="+12017091364";
const schedule=[
 {day:"Domingo",time:"10:00 AM",title:"Escuela Dominical · 11:15 AM Culto Evangelístico y Royal Rangers"},
 {day:"Lunes",time:"7:30 PM",title:"Discipulado"},
 {day:"Martes",time:"7:30 PM",title:"Estudio Bíblico y Oración"},
 {day:"Viernes",time:"7:30 PM",title:"Culto de Ministerios y Misioneritas"}
] as const;

const ministryHighlights=[
 {year:"2019",title:"Llamado al pastorado",text:"En mayo, la congregación eligió al entonces ministro certificado Rodolfo Solórzano. En junio comenzó su administración pastoral y el 7 de septiembre recibió el ungimiento oficial como pastor."},
 {year:"Formación",title:"Discipulado y liderazgo",text:"Se estableció la Academia de Discipulado, con cinco niveles de formación y tres graduaciones, preparando nuevos líderes para servir con una fe más sólida."},
 {year:"2023",title:"Crecimiento ministerial",text:"En julio recibió su credencial ministerial como reverendo. Ese mismo año comenzó la remodelación del templo para crear seis salones dedicados a la enseñanza de niños y jóvenes."},
 {year:"2024",title:"Una iglesia que da fruto",text:"En mayo, Príncipe de Paz se convirtió oficialmente en iglesia madre de una nueva congregación en la ciudad de Filadelfia."},
 {year:"Educación",title:"Formación bíblica",text:"La iglesia recibió el privilegio de servir como una extensión del Instituto Bíblico bajo el Departamento de Educación del Distrito Hispano del Este."},
 {year:"Misiones",title:"Servicio en Guatemala",text:"Dos viajes misioneros llevaron apoyo espiritual, social y económico a Santa Cruz y Lanquín, incluyendo ayuda al instituto bíblico, a la construcción de un templo y a la adquisición de una van."}
] as const;

const social={
 youtube:"https://youtube.com/@principedepazgarfieldnj?si=za5-Wi99nEq-Vz5T",
 facebook:"https://www.facebook.com/share/1M9LCypc57/?mibextid=wwXIfr"
} as const;

export default function IglesiaCentralGarfield(){
 return <div className={styles.page}>
  <section className={`${styles.hero} ${refine.hero}`}>
   <div className={`${styles.heroShade} ${refine.heroShade}`}/>
   <div className={`${styles.heroCopy} ${refine.heroCopy}`}>
    <p>Iglesia Internacional Príncipe de Paz</p>
    <h1>Una familia de fe en el corazón de <em>Garfield.</em></h1>
    <span>Iglesia Central · 132 Palisade Ave</span>
    <div className={`${styles.heroActions} ${refine.heroActions}`}>
     <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar <b aria-hidden="true">↗</b></a>
     <a href={`tel:${phone}`}>Llamar: (201) 709-1364</a>
    </div>
   </div>
  </section>

  <section className={styles.welcome}>
   <div><p className={styles.eyebrow}>Bienvenidos a la sede central</p><h2>Un lugar para toda la familia.</h2></div>
   <div><p>La Iglesia Internacional Príncipe de Paz en Garfield es una congregación donde puede adorar a Dios, crecer en la Palabra y encontrar una familia espiritual que le reciba con amor.</p><p>Si vive en Garfield o sus alrededores, queremos invitarle a visitarnos y conocer lo que Dios está haciendo en esta comunidad.</p></div>
  </section>

  <section className={styles.leadership}>
   <span className={media.leadershipLogo} role="img" aria-label="Logo de Iglesia Cristiana Príncipe de Paz"/>
   <div><p className={styles.eyebrow}>Liderazgo pastoral</p><h2>Rev. Rodolfo Solórzano<br/><em>y Pastora Masiel Solórzano</em></h2><p>Con fidelidad y amor pastoral sirven a la iglesia central, guiando a la congregación en la fe, la enseñanza bíblica y el servicio cristiano.</p></div>
  </section>

  <section className={refine.ministryStory}>
   <header className={refine.storyHeader}>
    <div><p className={styles.eyebrow}>Trayectoria y logros ministeriales</p><h2>Una historia de llamado, formación y servicio.</h2></div>
    <p>Desde 2019, el ministerio del Rev. Rodolfo Solórzano ha acompañado el crecimiento espiritual de Príncipe de Paz, la preparación de nuevos líderes y una obra que hoy alcanza más allá de Garfield.</p>
   </header>
   <div className={refine.storyLayout}>
    <figure className={refine.storyPortrait}><figcaption><small>Sirviendo desde 2019</small><strong>Rev. Rodolfo Solórzano</strong></figcaption></figure>
    <div className={refine.timeline}>{ministryHighlights.map(item=><article key={`${item.year}-${item.title}`}><small>{item.year}</small><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
   </div>
   <details className={refine.fullStory}>
    <summary><span>Leer la historia completa</span><b aria-hidden="true">＋</b></summary>
    <div className={refine.storyBody}>
     <p>En mayo de 2019, bajo la dirección del Espíritu Santo, la congregación Príncipe de Paz eligió al entonces ministro certificado Rodolfo Solórzano como pastor. A partir de junio de ese año, la iglesia quedó bajo su administración junto a la Junta de Diáconos y los síndicos. El 7 de septiembre de 2019 se celebró su ungimiento oficial como pastor de la congregación.</p>
     <p>Durante su pastorado, la iglesia comenzó a celebrar servicios al aire libre para acercarse a la comunidad. También nació la Academia de Discipulado, donde los hermanos reciben preparación para desarrollar un liderazgo bíblico y sólido. La academia ha celebrado tres graduaciones de sus cinco niveles de formación.</p>
     <p>En julio de 2023, el pastor Solórzano avanzó en su trayectoria ministerial al recibir la credencial de reverendo. Ante el crecimiento de la iglesia, impulsó la remodelación y construcción de las instalaciones para habilitar seis salones en los que niños y jóvenes pudieran recibir enseñanza cristiana.</p>
     <p>En mayo de 2024, Príncipe de Paz se convirtió oficialmente en iglesia madre de una nueva congregación en Filadelfia. Asimismo, el Departamento de Educación del Distrito Hispano del Este concedió a la iglesia el privilegio de servir como una extensión del Instituto Bíblico.</p>
     <p>La visión misionera también ha llevado a la congregación a realizar dos viajes a Guatemala bajo el liderazgo del reverendo. Allí se brindó apoyo para la reestructuración del instituto bíblico en Santa Cruz, la construcción de un templo en Lanquín, distintas iniciativas de ayuda social y económica, y la adquisición de una van para el instituto. Cada logro refleja el esfuerzo de una iglesia que continúa buscando la dirección de Dios y sirviendo a los demás.</p>
    </div>
   </details>
  </section>

  <section className={refine.schedule}>
   <header><p className={styles.eyebrow}>Horarios semanales</p><h2>Hay un lugar para usted.</h2><p>Le esperamos para adorar juntos y recibir la Palabra de Dios.</p></header>
   <div className={refine.schedulePanel}>{schedule.map(item=><article key={item.day}><small>{item.day}</small><div><strong>{item.time}</strong><span>{item.title}</span></div></article>)}</div>
  </section>

  <section className={styles.visit}>
   <div className={styles.visitCopy}><p className={styles.eyebrow}>Planifique su visita</p><h2>Estamos en Garfield, New Jersey.</h2><address><small>Dirección</small><strong>132 Palisade Ave<br/>Garfield, NJ</strong></address><p>¿Tiene alguna pregunta antes de llegar? Puede comunicarse directamente con la iglesia.</p><div><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Ver ruta en Google Maps ↗</a><a href={`tel:${phone}`}>☎ (201) 709-1364</a></div></div>
   <a className={`${styles.mapCard} ${refine.churchCard}`} href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver la Iglesia Central Príncipe de Paz en Google Maps"><span className={refine.churchCardCaption}><small>Iglesia Central</small><strong>Príncipe de Paz</strong><b>132 Palisade Ave · Garfield, NJ&nbsp; ↗</b></span></a>
  </section>

  <section className={media.life}>
   <header><p className={styles.eyebrow}>Nuestra familia de fe</p><h2>Una iglesia viva para todas las generaciones.</h2><p>Conozca nuestros espacios, la adoración congregacional, la predicación de la Palabra y el ministerio dedicado a los niños.</p></header>
   <ChurchGallery/>
  </section>

  <section className={media.social}>
   <span className={media.socialLogo} role="img" aria-label="Logo de Iglesia Cristiana Príncipe de Paz"/>
   <div><p className={styles.eyebrow}>Conéctese con la iglesia central</p><h2>Vea los servicios y siga nuestras actividades.</h2><p>Encuentre predicaciones, transmisiones y momentos de la vida congregacional en nuestros canales oficiales.</p><div className={media.socialActions}><a className={`${media.youtube} ${refine.socialButton}`} href={social.youtube} target="_blank" rel="noopener noreferrer"><svg className={refine.socialIcon} viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#ff0033"/><path d="M22.8 15.1 12.9 9.6c-.7-.4-1.6.1-1.6.9v11c0 .8.9 1.3 1.6.9l9.9-5.5c.7-.4.7-1.4 0-1.8Z" fill="#fff"/></svg><span><small>YouTube</small><strong>Ver canal oficial</strong></span><b aria-hidden="true">↗</b></a><a className={`${media.facebook} ${refine.socialButton}`} href={social.facebook} target="_blank" rel="noopener noreferrer"><svg className={refine.socialIcon} viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="#1877f2"/><path d="M18.2 27v-9h3l.5-3.5h-3.5v-2.2c0-1 .3-1.7 1.8-1.7h1.9V7.5c-.3 0-1.5-.1-2.8-.1-2.8 0-4.7 1.7-4.7 4.8v2.3h-3.1V18h3.1v9h3.8Z" fill="#fff"/></svg><span><small>Facebook</small><strong>Seguir la página</strong></span><b aria-hidden="true">↗</b></a></div></div>
  </section>

  <section className={styles.referral}><p>Una iglesia cerca de usted</p><h2>¿Conoce a alguien en el área de Garfield?</h2><span>Comparta esta página e invítele a encontrar una familia de fe en la Iglesia Príncipe de Paz.</span><div><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Visitar la iglesia central</a><Link href="/iglesia">Conocer la iglesia de Filadelfia</Link></div></section>
 </div>;
}
