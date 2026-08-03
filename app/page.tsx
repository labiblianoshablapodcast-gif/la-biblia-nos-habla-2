import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import {youtube} from "@/data/youtube";
import InstallApp from "@/components/InstallApp";

const quickLinks = [
  {
    icon: "▤",
    title: "Leer la Biblia",
    text: "Acceda a los 66 libros y encuentre una palabra para hoy.",
    href: "/biblia",
    image: "/images/misiones/lanquin-paisaje-02.jpeg",
    imageAlt: "Biblia y recursos de estudio"
  },
  {
    icon: "◉",
    title: "Ver predicaciones",
    text: "Escuche mensajes que edifican y fortalecen su fe.",
    href: "/predicaciones",
    image: "/images/pastor/pastor-gilberto.webp",
    imageAlt: "Pastor Gilberto Maldonado compartiendo la Palabra"
  },
  {
    icon: "✦",
    title: "Pedir oración",
    text: "Comparta su necesidad con nuestro equipo pastoral.",
    href: "/conexion",
    image: "/images/pastor/servicio-y-adoracion.webp",
    imageAlt: "Servicio de oración y adoración"
  },
  {
    icon: "○",
    title: "Nuevos creyentes",
    text: "Si aceptó a Cristo, este es el siguiente paso para usted.",
    href: "/primeros-pasos",
    image: "/images/misiones/lanquin-inauguracion-01.jpeg",
    imageAlt: "Personas reunidas para recibir la Palabra"
  },
  {
    icon: "⌂",
    title: "Nuestra iglesia",
    text: "Conozca quiénes somos, horarios de servicios y ubicación.",
    href: "/iglesia",
    image: "/images/pastor/familia-de-la-fe.webp",
    imageAlt: "Familia de la fe reunida en la iglesia"
  },
  {
    icon: "◎",
    title: "Misiones",
    text: "Vea cómo llevamos el evangelio a diferentes lugares.",
    href: "/misiones",
    image: "/images/misiones/lanquin-templo-portada.png",
    imageAlt: "Misión e inauguración del templo en Lanquín"
  }
];

export default function Home() {
  return (
    <>
      <section className="homeFinalHero">
        <Image
          src="/images/pastor/pastor-gilberto.webp"
          alt="Pastor Gilberto Maldonado"
          fill
          priority
          sizes="100vw"
          className="homeFinalHeroImage"
        />
        <div className="homeFinalHeroShade" />
        <div className="homeFinalHeroContent">
          <p className="eyebrow">Bienvenido a La Biblia Nos Habla</p>
          <h1>Una palabra de esperanza para su vida.</h1>
          <p className="homeFinalHeroLead">
            Aquí encontrará la Biblia, predicaciones, devocionales, misiones y
            una iglesia donde será bienvenido.
          </p>
          <div className="homeFinalActions">
            <Link className="homeFinalButton primary" href="/biblia">
              <span aria-hidden="true">▤</span> Leer la Biblia
            </Link>
            <a
              className="homeFinalButton outline"
              href={youtube.pastor.videos}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span aria-hidden="true">▶</span> Ver el último mensaje
            </a>
            <Link className="homeFinalButton outline" href="/conexion">
              <span aria-hidden="true">✦</span> Necesito oración
            </Link>
          </div>
        </div>
      </section>

      <section className="homeFinalQuick" aria-labelledby="inicio-rapido">
        <h2 id="inicio-rapido" className="srOnly">Accesos principales</h2>
        <div className="homeFinalQuickGrid">
          {quickLinks.map((item) => (
            <Link className="homeFinalQuickCard" href={item.href} key={item.title}>
              <div className="homeFinalQuickImage">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 700px) 100vw, (max-width: 1100px) 33vw, 17vw"
                />
              </div>
              <div className="homeFinalQuickCopy">
                <h3>
                  <span aria-hidden="true">{item.icon}</span>
                  {item.title}
                </h3>
                <p>{item.text}</p>
                <strong aria-hidden="true">→</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeFinalChurch section" aria-labelledby="iglesia-principe-paz">
        <div className="homeFinalChurchPhoto">
          <Image
            src="/images/pastor/servicio-y-adoracion.webp"
            alt="Servicio de adoración en la Iglesia Príncipe de Paz"
            fill
            sizes="(max-width: 900px) 100vw, 32vw"
          />
        </div>

        <div className="homeFinalChurchSchedule">
          <div className="homeFinalChurchTitle">
            <span className="homeFinalChurchMark" aria-hidden="true">⌂</span>
            <div>
              <p className="eyebrow">Iglesia</p>
              <h2 id="iglesia-principe-paz">Príncipe de Paz</h2>
              <p>Philadelphia, Pennsylvania</p>
            </div>
          </div>

          <div className="homeFinalScheduleLabel">Horario de servicios</div>
          <div className="homeFinalScheduleGrid">
            {church.schedule.map((item) => (
              <article key={`${item.day}-${item.time}`}>
                <span aria-hidden="true">◫</span>
                <div>
                  <small>{item.day}</small>
                  <strong>{item.time}</strong>
                  <p>{item.title}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="homeFinalContact">
          <div className="homeFinalContactItem">
            <span aria-hidden="true">●</span>
            <div>
              <small>Dirección</small>
              <strong>{church.address}</strong>
              <a href={church.mapsUrl} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
              </a>
            </div>
          </div>

          <div className="homeFinalContactItem">
            <span aria-hidden="true">✉</span>
            <div>
              <small>Correo electrónico</small>
              <a href={`mailto:${church.email}`}>{church.email}</a>
            </div>
          </div>

          <div className="homeFinalContactLinks">
            <Link href="/iglesia">Más información</Link>
            <Link href="/eventos">Próximos eventos</Link>
          </div>
        </aside>
      </section>

      <section className="section visitorMessage">
        <div className="visitorMessageImage">
          <Image
            src="/images/misiones/lanquin-templo-portada.png"
            alt="Misión Lanquín 2026"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="eyebrow">La obra continúa</p>
          <h2>Predicando, formando discípulos y sirviendo a las comunidades.</h2>
          <p className="lead">
            Desde Philadelphia hasta las montañas de Guatemala, seguimos
            proclamando que Jesucristo salva, restaura y transforma vidas.
          </p>
          <div className="homeFinalActions darkActions">
            <Link className="homeFinalButton primary" href="/misiones">
              Ver las misiones
            </Link>
            <Link className="homeFinalButton darkOutline" href="/el-pastor">
              Conozca a sus Pastores
            </Link>
          </div>
        </div>
      </section>

      <section className="section visitorTestimony">
        <div>
          <p className="eyebrow">Rescatado con propósito</p>
          <h2>Ninguna vida está demasiado lejos para la gracia de Dios.</h2>
          <p className="lead">
            Conozca el testimonio del Pastor Gilberto Maldonado: una historia de
            redención, llamado y servicio para la gloria de Jesucristo.
          </p>
          <Link className="homeFinalButton primary" href="/el-pastor">
            Conozca a sus Pastores
          </Link>
        </div>
        <div className="visitorTestimonyImage">
          <Image
            src="/images/pastor/pastor-gilberto-rev-solorzano.webp"
            alt="Pastor Gilberto Maldonado y Rev. Rodolfo Solórzano"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="section soft">
        <InstallApp />
      </section>

      <section className="section dark visitorClosing">
        <p className="eyebrow">Estamos para servirle</p>
        <h2>¿Necesita oración, consejería o desea aceptar a Cristo?</h2>
        <p>Puede comunicarse con nosotros de manera sencilla y confidencial.</p>
        <Link className="homeFinalButton primary" href="/conexion">
          Abrir Centro de Conexión
        </Link>
      </section>
    </>
  );
}
