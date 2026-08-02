import Image from "next/image";
import Link from "next/link";
import SectionCard from "@/components/SectionCard";
import {youtube} from "@/data/youtube";
import {church} from "@/data/church";
import InstallApp from "@/components/InstallApp";

export default function Home() {
  return <>
    <section className="premiumHero">
      <Image
        src="/images/pastor/pastor-gilberto.webp"
        alt="Pastor Gilberto Maldonado"
        fill
        priority
        sizes="100vw"
        className="premiumHeroImage"
      />
      <div className="premiumHeroOverlay"/>
      <div className="premiumHeroContent">
        <p className="eyebrow">La Biblia Nos Habla · Plataforma Ministerial</p>
        <h1>Predicando el Evangelio de Jesucristo al mundo.</h1>
        <p>
          Biblia, predicaciones, discipulado, misiones, oración y cuidado pastoral
          desde la Iglesia Príncipe de Paz en Philadelphia.
        </p>
        <div className="premiumHeroActions">
          <a className="btn" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">▶ Ver el último mensaje</a>
          <Link className="btn secondary" href="/biblia">📖 Leer la Biblia</Link>
          <Link className="btn secondary" href="/conexion">🙏 Necesito oración</Link>
        </div>
      </div>
      <div className="premiumHeroStats">
        <div><strong>66</strong><span>Libros de la Biblia</span></div>
        <div><strong>2</strong><span>Misiones documentadas</span></div>
        <div><strong>4</strong><span>Reuniones semanales</span></div>
      </div>
    </section>

    <section className="section quickAccessSection">
      <p className="eyebrow">Acceso rápido</p>
      <h2>Todo el ministerio en un solo lugar</h2>
      <div className="grid">
        <SectionCard icon="📖" title="Biblia completa" description="Los 66 libros, capítulos y búsqueda." href="/biblia"/>
        <SectionCard icon="🎙️" title="Predicaciones" description="Mensajes, podcast y estudios bíblicos." href="/predicaciones"/>
        <SectionCard icon="🌎" title="Misiones" description="Cobán 2022 y Lanquín 2026." href="/misiones"/>
        <SectionCard icon="👤" title="Trayectoria pastoral" description="Testimonio, llamado y servicio." href="/el-pastor"/>
        <SectionCard icon="⛪" title="La Iglesia" description="Horarios, dirección y contacto." href="/iglesia"/>
        <SectionCard icon="♥" title="Donaciones" description="Diezmos, ofrendas y apoyo misionero." href="/donaciones"/>
      </div>
    </section>

    <section className="section premiumStory">
      <div className="premiumStoryImage">
        <Image src="/images/pastor/pastor-gilberto-rev-solorzano.webp" alt="Trayectoria y cobertura ministerial" fill sizes="(max-width: 900px) 100vw, 50vw"/>
      </div>
      <div>
        <p className="eyebrow">Rescatado con propósito</p>
        <h2>Una historia de gracia, llamado y servicio</h2>
        <p className="lead">
          De la prisión al púlpito: el testimonio del Pastor Gilberto Maldonado
          proclama que ninguna vida está fuera del alcance de Jesucristo.
        </p>
        <div className="premiumStoryActions">
          <Link className="btn" href="/el-pastor">Conocer la trayectoria</Link>
          <Link className="btn secondaryDark" href="/mapa-ministerial">Ver mapa ministerial</Link>
        </div>
      </div>
    </section>

    <section className="section homeMissionFeature">
      <div className="homeMissionImage">
        <Image src="/images/misiones/lanquin-templo-portada.png" alt="Misión Lanquín 2026" fill sizes="(max-width: 900px) 100vw, 50vw"/>
      </div>
      <div>
        <p className="eyebrow">Misiones Guatemala</p>
        <h2>De Cobán a Lanquín</h2>
        <p className="lead">Evangelismo, fortalecimiento de iglesias e inauguración del templo en Chicachuy.</p>
        <div className="premiumStoryActions">
          <Link className="btn" href="/misiones">Explorar las misiones</Link>
          <Link className="btn secondaryDark" href="/galeria">Abrir galería</Link>
        </div>
      </div>
    </section>

    <section className="section premiumMediaSection">
      <div>
        <p className="eyebrow">Centro multimedia</p>
        <h2>Predicaciones, podcast y transmisiones</h2>
        <p className="lead">Conéctese con el contenido oficial del ministerio en YouTube y otras plataformas.</p>
        <div className="youtubeActions">
          <Link className="btn" href="/multimedia">Abrir multimedia</Link>
          <Link className="btn secondaryDark" href="/podcast">Escuchar podcast</Link>
        </div>
      </div>
      <div className="premiumMediaPanel">
        <span>▶</span>
        <strong>La Palabra sigue llegando</strong>
        <p>Mensajes para fortalecer la fe, formar discípulos y anunciar a Jesucristo.</p>
      </div>
    </section>

    <section className="section homeChurchFeature">
      <div>
        <p className="eyebrow">Iglesia Príncipe de Paz</p>
        <h2>Le esperamos esta semana</h2>
        <div className="homeScheduleList">
          {church.schedule.map(item=><div key={item.day}><strong>{item.day}</strong><span>{item.time} · {item.title}</span></div>)}
        </div>
        <div className="churchActions">
          <Link className="btn" href="/iglesia">Horarios y ubicación</Link>
          <Link className="btn secondaryDark" href="/eventos">Próximos eventos</Link>
        </div>
      </div>
      <div className="homeChurchAddress">
        <span>📍</span><strong>{church.address}</strong>
        <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar →</a>
      </div>
    </section>

    <section className="section soft">
      <InstallApp/>
    </section>

    <section className="section dark premiumClosing">
      <p className="eyebrow">Hay esperanza en Cristo</p>
      <h2>Ninguna vida está demasiado lejos para la gracia de Dios.</h2>
      <p className="lead">Estamos aquí para orar, acompañar y compartir la Palabra con usted.</p>
      <Link className="btn" href="/conexion">Conectarme con el ministerio</Link>
    </section>
  </>;
}
