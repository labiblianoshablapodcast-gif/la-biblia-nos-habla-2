import type {MetadataRoute} from "next";

export default function manifest():MetadataRoute.Manifest{
  return {
    name:"La Biblia Nos Habla",
    short_name:"La Biblia",
    description:"Biblia, predicaciones, misiones, discipulado y conexión pastoral.",
    start_url:"/",
    display:"standalone",
    background_color:"#071829",
    theme_color:"#071829",
    orientation:"portrait-primary",
    categories:["education","lifestyle","books"],
    icons:[
      {
        src:"/icons/icon-192.png",
        sizes:"192x192",
        type:"image/png"
      },
      {
        src:"/icons/icon-512.png",
        sizes:"512x512",
        type:"image/png"
      },
      {
        src:"/icons/icon-512.png",
        sizes:"512x512",
        type:"image/png",
        purpose:"maskable"
      }
    ],
    shortcuts:[
      {
        name:"Leer la Biblia",
        short_name:"Biblia",
        url:"/biblia",
        icons:[{src:"/icons/icon-192.png",sizes:"192x192"}]
      },
      {
        name:"Enviar petición",
        short_name:"Oración",
        url:"/conexion",
        icons:[{src:"/icons/icon-192.png",sizes:"192x192"}]
      },
      {
        name:"Ver predicaciones",
        short_name:"Predicaciones",
        url:"/predicaciones",
        icons:[{src:"/icons/icon-192.png",sizes:"192x192"}]
      }
    ]
  };
}
