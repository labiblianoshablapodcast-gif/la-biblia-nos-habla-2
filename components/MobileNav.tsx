import Link from "next/link";

export default function MobileNav(){
  return <nav className="mobileBottomNav" aria-label="Navegación móvil">
    <Link href="/"><span>⌂</span><small>Inicio</small></Link>
    <Link href="/biblia"><span>📖</span><small>Biblia</small></Link>
    <Link href="/galeria"><span>▣</span><small>Galería</small></Link>
    <Link href="/conexion"><span>♢</span><small>Peticiones</small></Link>
    <Link href="/donaciones"><span>♡</span><small>Donar</small></Link>
  </nav>;
}
