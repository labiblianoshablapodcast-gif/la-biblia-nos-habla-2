import Link from "next/link";
import MobileHeader from "@/components/MobileHeader";
import AppInstallButton from "@/components/AppInstallButton";

export default function Header(){
  return <header className="siteHeader">
    <Link className="siteLogo" href="/" aria-label="La Biblia Nos Habla — Inicio"><span>LB</span><div><strong>La Biblia Nos Habla</strong><small>Predicando la Palabra</small></div></Link>
    <nav className="desktopNav" aria-label="Navegación principal">
      <Link href="/">Inicio</Link><Link href="/biblia">Biblia</Link><Link href="/estudios">Estudios</Link><Link href="/el-pastor">El Pastor</Link><Link href="/misiones">Misiones</Link><Link href="/iglesia">Iglesia</Link><Link href="/iglesia-central-garfield">Garfield</Link><Link href="/eventos">Eventos</Link><Link href="/galeria">Galería</Link><Link href="/conexion">Oración</Link><Link className="navDonate" href="/donaciones">♡ Donar</Link>
    </nav>
    <MobileHeader />
    <AppInstallButton />
  </header>;
}
