import Image from "next/image";
import Link from "next/link";
import {notFound} from "next/navigation";
import MissionGallery from "@/components/MissionGallery";
import {missions} from "@/data/missions";
import {youtube} from "@/data/youtube";

const stories: Record<string,{intro:string;sections:{title:string;text:string}[]}> = {
  "coban-2022":{
    intro:"Cobán representó el comienzo de una etapa misionera marcada por el evangelismo personal, la confraternidad y el fortalecimiento de iglesias locales.",
    sections:[
      {title:"Los primeros pasos",text:"En julio de 2022, un equipo pequeño pero lleno de fe recorrió las calles, visitó congregaciones y compartió el mensaje de Jesucristo con personas de la comunidad."},
      {title:"Unidos en la obra",text:"La misión permitió estrechar lazos con pastores y líderes locales. Cada culto, conversación y comida compartida confirmó que el Reino de Dios se edifica trabajando juntos."},
      {title:"Una semilla para el futuro",text:"Aquel viaje sembró una visión que seguiría creciendo. Cuatro años después, esa misma carga misionera nos llevaría hasta las montañas de Lanquín."}
    ]
  },
  "lanquin-2026":{
    intro:"Lanquín fue el cumplimiento visible de años de oración, trabajo y esperanza: un viaje hasta Chicachuy para celebrar la inauguración de un templo dedicado al Señor.",
    sections:[
      {title:"Rumbo a Alta Verapaz",text:"El equipo recorrió carreteras, montañas y comunidades con una sola convicción: el Evangelio debe llegar hasta donde Dios abra una puerta."},
      {title:"Una comunidad que nos recibió con amor",text:"Familias, niños y líderes locales recibieron al equipo con alegría. Más allá de las diferencias de idioma y cultura, Cristo nos hizo una sola familia."},
      {title:"La inauguración del templo",text:"El corte de cinta marcó mucho más que la apertura de un edificio. Representó un lugar donde generaciones escucharán la Palabra, recibirán oración y encontrarán esperanza en Jesucristo."},
      {title:"Servicio, alimento y oración",text:"La misión incluyó cultos, ministración a familias, actividades con niños y alimentos compartidos con la comunidad. Cada acto de servicio anunció el amor de Cristo."}
    ]
  }
};

export function generateStaticParams(){
  return missions.map(mission=>({slug:mission.slug}));
}

export default async function MissionDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const mission=missions.find(item=>item.slug===slug);
  const story=stories[slug];
  if(!mission || !story) notFound();

  return <>
    <section className="missionDetailHero">
      <Image src={mission.cover} alt={`${mission.place} ${mission.year}`} fill priority sizes="100vw"/>
      <div className="missionsHeroOverlay"></div>
      <div className="missionsHeroContent">
        <p className="eyebrow">{mission.region}</p>
        <h1>{mission.place} {mission.year}</h1>
        <p>{mission.title}</p>
      </div>
    </section>

    <section className="section missionStory">
      <p className="lead">{story.intro}</p>
      <blockquote className="missionVerse">{mission.verse}</blockquote>

      <div className="storyGrid">
        {story.sections.map(section=>(
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section soft">
      <p className="eyebrow">Memoria visual</p>
      <h2>Galería de la misión</h2>
      <MissionGallery images={mission.images} title={`${mission.place} ${mission.year}`}/>
    </section>

    <section className="section dark missionFinalWord">
      <p className="eyebrow">Nuestro testimonio</p>
      <h2>Toda la gloria sea para Jesucristo.</h2>
      <p>Lo que comenzó con una carga en el corazón se convirtió en una historia que ahora podemos compartir con las futuras generaciones.</p>
      <Link className="btn" href="/misiones">Volver a todas las misiones</Link>
      <a className="btn secondary" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">Ver videos de misiones</a>
    </section>
  </>;
}
