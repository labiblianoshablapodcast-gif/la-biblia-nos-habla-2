import Link from "next/link";

const places=[
 {place:"New Jersey",country:"Estados Unidos",icon:"🇺🇸",text:"Base familiar y ministerial; predicación, enseñanza y servicio pastoral."},
 {place:"Philadelphia",country:"Estados Unidos",icon:"🇺🇸",text:"Iglesia Príncipe de Paz Philadelphia y trabajo pastoral congregacional."},
 {place:"Cobán",country:"Guatemala · 2022",icon:"🇬🇹",text:"Evangelismo, confraternidad y fortalecimiento de iglesias."},
 {place:"Lanquín",country:"Guatemala · 2026",icon:"🇬🇹",text:"Viaje misionero e inauguración del templo en Chicachuy."},
 {place:"Chicachuy",country:"Alta Verapaz, Guatemala",icon:"🇬🇹",text:"Comunidad alcanzada mediante la predicación, la oración y el servicio."}
];

export default function MapaMinisterial(){
 return <>
  <section className="pageHero mapHero">
   <p className="eyebrow">Trayectoria geográfica</p>
   <h1>Mapa del ministerio</h1>
   <p>Lugares donde Dios ha permitido predicar, servir y fortalecer Su obra.</p>
  </section>

  <section className="section">
   <div className="ministryMap">
    <div className="mapRouteLine"/>
    {places.map((place,index)=>(
      <article className="mapStop" key={place.place}>
       <div className="mapMarker">{index+1}</div>
       <div>
        <span>{place.icon} {place.country}</span>
        <h2>{place.place}</h2>
        <p>{place.text}</p>
       </div>
      </article>
    ))}
   </div>
  </section>

  <section className="section dark mapCallout">
   <p className="eyebrow">La misión continúa</p>
   <h2>“Id por todo el mundo y predicad el evangelio.”</h2>
   <p>Marcos 16:15</p>
   <Link className="btn" href="/misiones">Ver historias misioneras</Link>
  </section>
 </>;
}
