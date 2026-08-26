import Link from "next/link";
import styles from "./garfield.module.css";

export const metadata={
 title:"Iglesia Central Príncipe de Paz | Garfield, NJ",
 description:"Conozca la Iglesia Internacional Príncipe de Paz en 132 Palisade Ave, Garfield, New Jersey."
};

const mapsUrl="https://www.google.com/maps/search/?api=1&query=132+Palisade+Ave+Garfield+NJ";
const phone="+12017091364";
const schedule=[
 {day:"Martes",time:"7:00–9:00 PM",title:"Servicio"},
 {day:"Miércoles",time:"7:00–10:00 PM",title:"Servicio"},
 {day:"Viernes",time:"7:00–9:00 PM",title:"Servicio"},
 {day:"Domingo",time:"10:00 AM–3:00 PM",title:"Servicio principal"}
] as const;

export default function IglesiaCentralGarfield(){
 return <div className={styles.page}>
  <section className={styles.hero}>
   <div className={styles.heroShade}/>
   <div className={styles.heroCopy}>
    <p>Iglesia Internacional Príncipe de Paz</p>
    <h1>Una familia de fe en el corazón de <em>Garfield.</em></h1>
    <span>Iglesia Central · 132 Palisade Ave</span>
    <div className={styles.heroActions}>
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
   <span className={styles.leadershipMark}>PP</span>
   <div><p className={styles.eyebrow}>Liderazgo pastoral</p><h2>Rev. Rodolfo Solórzano<br/><em>y Pastora Masiel Solórzano</em></h2><p>Con fidelidad y amor pastoral sirven a la iglesia central, guiando a la congregación en la fe, la enseñanza bíblica y el servicio cristiano.</p></div>
  </section>

  <section className={styles.schedule}>
   <header><p className={styles.eyebrow}>Horarios semanales</p><h2>Hay un lugar para usted.</h2><p>Le esperamos para adorar juntos y recibir la Palabra de Dios.</p></header>
   <div>{schedule.map(item=><article key={item.day}><small>{item.day}</small><strong>{item.time}</strong><span>{item.title}</span></article>)}</div>
  </section>

  <section className={styles.visit}>
   <div className={styles.visitCopy}><p className={styles.eyebrow}>Planifique su visita</p><h2>Estamos en Garfield, New Jersey.</h2><address><small>Dirección</small><strong>132 Palisade Ave<br/>Garfield, NJ</strong></address><p>¿Tiene alguna pregunta antes de llegar? Puede comunicarse directamente con la iglesia.</p><div><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Ver ruta en Google Maps ↗</a><a href={`tel:${phone}`}>☎ (201) 709-1364</a></div></div>
   <div className={styles.mapCard}><span aria-hidden="true">⌖</span><small>Iglesia Central</small><strong>Príncipe de Paz</strong><p>132 Palisade Ave · Garfield, NJ</p></div>
  </section>

  <section className={styles.referral}><p>Una iglesia cerca de usted</p><h2>¿Conoce a alguien en el área de Garfield?</h2><span>Comparta esta página e invítele a encontrar una familia de fe en la Iglesia Príncipe de Paz.</span><div><a href={mapsUrl} target="_blank" rel="noopener noreferrer">Visitar la iglesia central</a><Link href="/iglesia">Conocer la iglesia de Filadelfia</Link></div></section>
 </div>;
}
