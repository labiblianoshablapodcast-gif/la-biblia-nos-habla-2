import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import ManagedGallery from "@/components/ManagedGallery";

const albums=[
 {title:"Lanquín 2026",subtitle:"Inauguración del templo en Chicachuy",image:"/images/misiones/lanquin-2026-grupo-misionero.jpg",href:"/misiones/lanquin-2026"},
 {title:"Cobán 2022",subtitle:"Evangelismo y fortalecimiento de iglesias",image:"/images/misiones/coban-2022/coban-2022-02.jpg",href:"/misiones/coban-2022"},
 {title:"Nuestros Pastores",subtitle:"Llamado, testimonio y servicio pastoral",image:"/images/pastor-gilberto-cutout.png",href:"/el-pastor",featured:true}
];

export default async function Galeria(){
 const supabase=await createClient();
 const {data}=await supabase.from("gallery_items").select("*").eq("published",true).order("sort_order").order("created_at",{ascending:false});
 return <>
  <section className="pageHero galleryHero">
   <p className="eyebrow">Memoria visual del ministerio</p>
   <h1>Galería</h1>
   <p>Fotografías organizadas por misiones, acontecimientos y etapas del ministerio.</p>
  </section>

  <section className="section">
   <div className="albumGrid">
    {albums.map(album=><Link className={`albumCard ${"featured" in album&&album.featured?"pastorsAlbumCard":""}`} href={album.href} key={album.title}>
     <div className={`albumImage ${"featured" in album&&album.featured?"pastorsAlbumImage":""}`}><img src={album.image} alt={album.title}/></div>
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
