import Link from "next/link";

export default function MobileNav(){
  return <nav className="mobileBottomNav" aria-label="Navegación móvil">
    <Link href="/"><span>⌂</span><small>Inicio</small></Link>
    <Link href="/biblia"><span>📖</span><small>Biblia</small></Link>
    <Link href="/el-pastor"><span>✦</span><small>El Pastor</small></Link>
    <Link href="/misiones"><span>◉</span><small>Misiones</small></Link>
    <Link href="/conexion"><span>🙏</span><small>Oración</small></Link>
  </nav>;
}
