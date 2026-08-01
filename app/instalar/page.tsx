import InstallApp from "@/components/InstallApp";

export default function Instalar(){
  return <>
    <section className="pageHero">
      <p className="eyebrow">Aplicación móvil</p>
      <h1>Instale La Biblia Nos Habla</h1>
      <p>Una sola aplicación compatible con iPhone, Samsung y otros teléfonos Android.</p>
    </section>

    <section className="section">
      <InstallApp/>

      <div className="mobileInstallGrid">
        <article className="mobileInstallCard">
          <span></span>
          <h2>iPhone y iPad</h2>
          <p>Abra el sitio en Safari, pulse Compartir y seleccione “Añadir a pantalla de inicio”.</p>
        </article>

        <article className="mobileInstallCard">
          <span>🤖</span>
          <h2>Samsung y Android</h2>
          <p>Abra el sitio en Chrome o Samsung Internet y pulse “Instalar aplicación” o “Añadir a pantalla de inicio”.</p>
        </article>
      </div>

      <div className="notice">
        <strong>No necesita dos aplicaciones diferentes.</strong>
        <p>
          Esta versión usa tecnología PWA: el mismo sitio se instala y adapta automáticamente
          a iPhone, Samsung, tabletas y computadoras.
        </p>
      </div>
    </section>
  </>;
}
