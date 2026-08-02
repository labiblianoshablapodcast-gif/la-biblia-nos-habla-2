import Image from "next/image";
import Link from "next/link";

const albums=[
 {title:"Lanquín 2026",subtitle:"Inauguración del templo en Chicachuy",image:"/images/misiones/lanquin-templo-portada.png",href:"/misiones/lanquin-2026"},
 {title:"Cobán 2022",subtitle:"Evangelismo y fortalecimiento de iglesias",image:"/images/misiones/coban-equipo.jpeg",href:"/misiones/coban-2022"},
 {title:"Trayectoria Pastoral",subtitle:"Testimonio, llamado y cobertura ministerial",image:"/images/pastor/pastor-gilberto-rev-solorzano.webp",href:"/el-pastor"}
];

export default function Galeria(){
 return <>
  <section className="pageHero galleryHero">
   <p className="eyebrow">Memoria visual del ministerio</p>
   <h1>Galería</h1>
   <p>Fotografías organizadas por misiones, acontecimientos y etapas del ministerio.</p>
  </section>

  <section className="section">
   <div className="albumGrid">
    {albums.map(album=>(
      <Link className="albumCard" href={album.href} key={album.title}>
       <div className="albumImage"><Image src={album.image} alt={album.title} fill sizes="(max-width: 800px) 100vw, 33vw"/></div>
       <div className="albumCopy"><small>Álbum</small><h2>{album.title}</h2><p>{album.subtitle}</p><span>Abrir colección →</span></div>
      </Link>
    ))}
   </div>
  </section>
 </>;
}
