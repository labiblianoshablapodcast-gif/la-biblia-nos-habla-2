import Image from "next/image";
import Link from "next/link";
import {church} from "@/data/church";
import {youtube} from "@/data/youtube";
import InstallApp from "@/components/InstallApp";

const quickLinks=[
  {icon:"📖",title:"Leer la Biblia",text:"Acceda a los 66 libros y encuentre una palabra para hoy.",href:"/biblia"},
  {icon:"🎙️",title:"Ver predicaciones",text:"Mensajes, estudios y enseñanzas para fortalecer su fe.",href:"/predicaciones"},
  {icon:"🙏",title:"Pedir oración",text:"Comparta su necesidad con nuestro equipo pastoral.",href:"/conexion"},
  {icon:"❤️",title:"Acepté a Cristo",text:"Comience sus primeros pasos en una nueva vida con Jesús.",href:"/primeros-pasos"},
  {icon:"⛪",title:"Visitar la iglesia",text:"Conozca nuestros horarios y cómo llegar.",href:"/iglesia"},
  {icon:"🌎",title:"Conocer las misiones",text:"Descubra lo que Dios ha hecho en Cobán y Lanquín.",href:"/misiones"}
];

export default function Home(){
  return <>
    <section className="visitorHero">
      <Image
        src="/images/pastor/pastor-gilberto.webp"
        alt="Pastor Gilberto Maldonado predicando"
        fill
        priority
        sizes="100vw"
      />
      <div className="visitorHeroOverlay"></div>
      <div className="visitorHeroContent">
        <p className="eyebrow">Bienvenido a La Biblia Nos Habla</p>
        <h1>Una palabra de esperanza para su vida.</h1>
        <p>
          Aquí encontrará la Biblia, predicaciones, devocionales, misiones y una
          iglesia donde será bienvenido.
        </p>
        <div className="visitorHeroActions">
          <Link className="btn" href="/biblia">📖 Leer la Biblia</Link>
          <a className="btn secondary" href={youtube.pastor.videos} target="_blank" rel="noopener noreferrer">▶ Ver el último mensaje</a>
          <Link className="btn secondary" href="/conexion">🙏 Necesito oración</Link>
        </div>
      </div>
    </section>

    <section className="section visitorQuickSection">
      <div className="sectionHeadingCentered">
        <p className="eyebrow">¿Qué está buscando?</p>
        <h2>Comience aquí</h2>
        <p>Seleccione una opción y encuentre rápidamente el recurso que necesita.</p>
      </div>

      <div className="visitorQuickGrid">
        {quickLinks.map(item=>(
          <Link className="visitorQuickCard" href={item.href} key={item.title}>
            <span>{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <strong>Abrir →</strong>
          </Link>
        ))}
      </div>
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
          Desde Philadelphia hasta las montañas de Guatemala, seguimos proclamando
          que Jesucristo salva, restaura y transforma vidas.
        </p>
        <div className="visitorHeroActions">
          <Link className="btn" href="/misiones">Ver las misiones</Link>
          <Link className="btn secondaryDark" href="/el-pastor">Conocer la trayectoria pastoral</Link>
        </div>
      </div>
    </section>

    <section className="section soft visitorChurch">
      <div>
        <p className="eyebrow">Iglesia Príncipe de Paz Philadelphia</p>
        <h2>Le esperamos esta semana</h2>
        <p className="lead">Venga como está. Será recibido con amor y respeto.</p>

        <div className="visitorSchedule">
          {church.schedule.map(item=>(
            <article key={item.day}>
              <small>{item.day}</small>
              <strong>{item.time}</strong>
              <span>{item.title}</span>
            </article>
          ))}
        </div>

        <div className="visitorHeroActions">
          <Link className="btn" href="/iglesia">Ver todos los detalles</Link>
          <a className="btn secondaryDark" href={church.mapsUrl} target="_blank" rel="noopener noreferrer">Cómo llegar</a>
        </div>
      </div>

      <aside className="visitorChurchCard">
        <span>📍</span>
        <h3>{church.address}</h3>
        <p>Philadelphia, Pennsylvania</p>
        <Link href="/eventos">Ver próximos eventos →</Link>
      </aside>
    </section>

    <section className="section visitorTestimony">
      <div>
        <p className="eyebrow">Rescatado con propósito</p>
        <h2>Ninguna vida está demasiado lejos para la gracia de Dios.</h2>
        <p className="lead">
          Conozca el testimonio del Pastor Gilberto Maldonado: una historia de
          redención, llamado y servicio para la gloria de Jesucristo.
        </p>
        <Link className="btn" href="/el-pastor">Leer el testimonio</Link>
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
      <InstallApp/>
    </section>

    <section className="section dark visitorClosing">
      <p className="eyebrow">Estamos para servirle</p>
      <h2>¿Necesita oración, consejería o desea aceptar a Cristo?</h2>
      <p>Puede comunicarse con nosotros de manera sencilla y confidencial.</p>
      <Link className="btn" href="/conexion">Abrir Centro de Conexión</Link>
    </section>
  </>;
}
