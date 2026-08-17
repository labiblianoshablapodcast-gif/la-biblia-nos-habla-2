import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import ManagedGallery from "@/components/ManagedGallery";
import galleryStyles from "./gallery.module.css";

const albums=[
 {title:"Lanquín 2026",subtitle:"Inauguración del templo en Chicachuy",image:"/images/misiones/lanquin-2026-grupo-misionero.jpg",href:"/misiones/lanquin-2026"},
 {title:"Cobán 2022",subtitle:"Evangelismo y fortalecimiento de iglesias",image:"/images/misiones/coban-2022/coban-2022-02.jpg",href:"/misiones/coban-2022"},
 {title:"Nuestros Pastores",subtitle:"Matrimonio, familia, llamado y servicio ministerial",image:"/images/pastor-y-yudelka-hero-v2.png",href:"/el-pastor"}
];

export default async function Galeria(){
 const supabase=await createClient();
 const {data}=await supabase.from("gallery_items").select("*").eq("published",true).order("sort_order").order("created_at",{ascending:false});
 return <>
  <section className={galleryStyles.hero}>
   <div className={galleryStyles.heroInner}>
    <div className={galleryStyles.heroCopy}>
     <p className="eyebrow">Memoria visual del ministerio</p>
     <h1>Galería</h1>
     <p>Fotografías organizadas por misiones, acontecimientos y etapas del ministerio.</p>
     <div className={galleryStyles.heroDetail}><span>✦</span><strong>Fe, familia y misión en cada imagen</strong></div>
    </div>
    <div className={galleryStyles.mosaic} aria-label="Momentos del ministerio">
     <figure className={galleryStyles.mosaicMain}><img src="/images/misiones/lanquin-2026-grupo-misionero.jpg" alt="Equipo misionero en Lanquín"/></figure>
     <figure className={galleryStyles.mosaicTop}><img src="/images/iglesia-principe-de-paz-congregacion.jpeg" alt="Congregación de la iglesia"/></figure>
     <figure className={galleryStyles.mosaicBottom}><img src="/images/pastor-y-yudelka-hero-v2.png" alt="Pastores Gilberto y Yudelka Maldonado"/></figure>
     <div className={galleryStyles.mosaicBadge}><b>3</b><span>colecciones<br/>destacadas</span></div>
    </div>
   </div>
  </section>

  <section className="section">
   <div className="albumGrid">
    {albums.map(album=><Link className="albumCard" href={album.href} key={album.title}>
     <div className="albumImage"><img src={album.image} alt={album.title}/></div>
     <div className="albumCopy"><small>Álbum</small><h2>{album.title}</h2><p>{album.subtitle}</p><span>Abrir colección →</span></div>
    </Link>)}
   </div>
  </section>

  <section className="section soft">
   <p className="eyebrow">Fotos recientes</p>
   <h2>Momentos de nuestra iglesia</h2>
   <ManagedGallery photos={data??[]}/>
   {!data?.length&&<div className="notice"><strong>Próximamente añadiremos nuevas fotografías.</strong></div>}
  </section>
 </>;
}
