import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import MobileNav from "@/components/MobileNav";
import type { Metadata } from "next";
import "./globals.css";
import "./button-refinement.css";
import "./controls-refinement.css";
import "./site-style-v12.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

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
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "La Biblia Nos Habla"
  },
  formatDetection: {
    telephone: true
  },
  icons: {
    icon: [
      {url: "/icons/icon-192.png", sizes: "192x192", type: "image/png"},
      {url: "/icons/icon-512.png", sizes: "512x512", type: "image/png"}
    ],
    apple: [
      {url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png"}
    ]
  }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="es"><body><ServiceWorkerRegistration/><Header/><main>{children}</main><Footer/><RegisterServiceWorker/>
        <MobileNav/>
      </body></html>;
}
