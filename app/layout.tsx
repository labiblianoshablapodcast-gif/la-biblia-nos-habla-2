import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import AppExperience from "@/components/AppExperience";
import type { Metadata } from "next";
import "./globals.css";
import "./button-refinement.css";
import "./controls-refinement.css";
import "./site-style-v12.css";
import "./app-experience.css";
import "./mobile-app-header.css";
import "./bible-reader-contrast.css";
import "./audio-player.css";
import "./mobile-hardening.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";
import GlobalPhotoViewer from "@/components/GlobalPhotoViewer";
import EmailConfirmationNotice from "@/components/EmailConfirmationNotice";
import { Analytics } from '@vercel/analytics/next';

export const viewport = {
  themeColor: "#071829",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: "La Biblia Nos Habla",
  description: "Plataforma ministerial de la Iglesia Príncipe de Paz Philadelphia",
  applicationName: "La Biblia Nos Habla",
  appleWebApp: {capable:true,statusBarStyle:"black-translucent",title:"La Biblia Nos Habla"},
  formatDetection: {telephone:true},
  icons: {
    icon: [
      {url:"/api/pwa-icon?size=192",sizes:"192x192",type:"image/png"},
      {url:"/api/pwa-icon?size=512",sizes:"512x512",type:"image/png"}
    ],
    apple: [{url:"/api/pwa-icon?size=180",sizes:"180x180",type:"image/png"}]
  }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body><AppExperience/><a className="skipLink" href="#contenido-principal">Saltar al contenido principal</a><Header/><EmailConfirmationNotice/><main id="contenido-principal">{children}</main><Footer/><MobileNav/><GlobalPhotoViewer/><RegisterServiceWorker/><Analytics/></body></html>;
}
