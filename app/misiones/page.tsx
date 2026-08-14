import Image from "next/image";
import Link from "next/link";
import {missions} from "@/data/missions";

export default function Misiones(){
 return <>
  <section className="missionsHero">
    <Image className="missionsWorldMap" src="/images/misiones/mapa-misionero-mundial-v2.png" alt="Mapa mundial misionero con énfasis en Guatemala, Puerto Rico y Estados Unidos" fill priority sizes="100vw"/>
    <div className="missionsHeroOverlay"></div>
    <div className="missionsHeroContent">
      <p className="eyebrow">Nuestro recorrido misionero</p>
      <h1>Llevando esperanza hasta las montañas.</h1>
      <p>Una historia de obediencia, servicio y fidelidad de Dios en Guatemala.</p>
      <Link className="btn" href="/misiones/lanquin-2026">Ver Lanquín 2026</Link>
    </div>
  </section>

  <section className="section">
    <p className="eyebrow">Guatemala · 2022–2026</p>
    <h2>Una historia que continúa</h2>
    <p className="lead">Cada fotografía representa una oración, un sacrificio y una vida alcanzada por el Evangelio.</p>

    <div className="missionTimeline">
      {missions.map((mission,index)=>(
        <article className="timelineMission" key={mission.slug}>
          <div className="timelineYear">{mission.year}</div>
          <div className="timelineLine"><span></span></div>
          <div className="timelineCard">
            <div className="timelineImage">
              <Image src={mission.cover} alt={`${mission.place} ${mission.year}`} fill sizes="(max-width: 900px) 100vw, 45vw"/>
            </div>
            <div className="timelineCopy">
              <small>{mission.region}</small>
              <h3>{mission.place} · {mission.year}</h3>
              <p>{mission.summary}</p>
              <blockquote>{mission.verse}</blockquote>
              <Link className="textLink" href={`/misiones/${mission.slug}`}>Ver misión completa →</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>

  <section className="section dark missionStats">
    <div><strong>2</strong><span>Viajes documentados</span></div>
    <div><strong>2</strong><span>Comunidades principales</span></div>
    <div><strong>1</strong><span>Templo inaugurado</span></div>
    <div><strong>∞</strong><span>Razones para dar gloria a Dios</span></div>
  </section>

  <section className="section missionClosing">
    <p className="eyebrow">La historia sigue</p>
    <h2>¿Dónde nos enviará Dios después?</h2>
    <p>Esta sección crecerá con cada nueva misión, conservando la memoria del ministerio para las futuras generaciones.</p>
  </section>
 </>;
}
