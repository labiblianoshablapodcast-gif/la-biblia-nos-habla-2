import type {MetadataRoute} from "next";
export default function manifest():MetadataRoute.Manifest{
 return {
  id:"/",
  name:"La Biblia Nos Habla",
  short_name:"Biblia Nos Habla",
  description:"Biblia, recursos, eventos y contenido ministerial de La Biblia Nos Habla.",
  start_url:"/",
  scope:"/",
  display:"standalone",
  orientation:"portrait-primary",
  background_color:"#071829",
  theme_color:"#071829",
  categories:["religion","education","lifestyle"],
  icons:[
   {src:"/icons/icon-192.png",sizes:"192x192",type:"image/png",purpose:"any"},
   {src:"/icons/icon-512.png",sizes:"512x512",type:"image/png",purpose:"any"},
   {src:"/icons/icon-512-maskable.png",sizes:"512x512",type:"image/png",purpose:"maskable"}
  ]
 };
}
