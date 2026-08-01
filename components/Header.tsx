import Link from "next/link";

export default function Header() {
  return (
    <header className="siteHeader">
      <Link href="/" className="brand">
        <span className="mark">✦</span>
        <span><strong>La Biblia Nos Habla</strong><small>Iglesia Príncipe de Paz · Philadelphia</small></span>
      </Link>
      <nav>
        <Link href="/biblia">Biblia</Link>
        <Link href="/predicaciones">Predicaciones</Link>
        <Link href="/youtube">YouTube</Link>
        <Link href="/multimedia">Multimedia</Link>
        <Link href="/instalar">Instalar App</Link>
        <Link href="/primeros-pasos">Primeros pasos</Link>
        <Link href="/misiones">Misiones</Link>
        <Link href="/el-pastor">El Pastor</Link>
        <Link href="/conexion">Conéctese</Link>
        <Link href="/admin" className="adminLink">Administrar</Link>
      </nav>
    </header>
  );
}
