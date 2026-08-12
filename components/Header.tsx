import Link from "next/link";
import MobileHeader from "@/components/MobileHeader";

export default function Header(){
  return <header className="siteHeader">
    <Link className="siteLogo" href="/"><span>LB</span><div><strong>La Biblia Nos Habla</strong><small>Predicando la Palabra</small></div></Link>
    <nav className="desktopNav">
      <Link href="/">Inicio</Link><Link href="/biblia">Biblia</Link><Link href="/el-pastor">El Pastor</Link><Link href="/misiones">Misiones</Link><Link href="/iglesia">Iglesia</Link><Link href="/conexion">Oración</Link><Link className="navDonate" href="/donaciones">♡ Donar</Link>
    </nav><MobileHeader />
  </header>;
}
