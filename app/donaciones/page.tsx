import Link from "next/link";
import Image from "next/image";

const campaigns=[
 {title:"Diezmos y ofrendas",description:"Apoye la obra local y las necesidades regulares de la congregación."},
 {title:"Misiones",description:"Contribuya con viajes misioneros, evangelismo y apoyo a comunidades."},
 {title:"Biblias y discipulado",description:"Ayude a proveer Biblias y materiales para nuevos creyentes."}
];

export default function Donaciones(){
 const donationUrl=process.env.NEXT_PUBLIC_DONATION_URL;
 return <>
  <section className="pageHero donationsHero">
   <Image src="/images/misiones/coban-2022/coban-2022-36.jpg" alt="Miembros de la iglesia sirviendo y acompañando a una persona necesitada" fill priority sizes="100vw" />
   <div className="donationsHeroOverlay" />
   <div className="donationsHeroContent">
    <p className="eyebrow">Generosidad con propósito</p>
    <h1>Diezmos, ofrendas y donaciones</h1>
    <p>Cada contribución ayuda a sostener la obra local, el discipulado y las misiones.</p>
   </div>
  </section>

  <section className="section">
   <p className="eyebrow">Áreas de apoyo</p>
   <h2>Siembre en la obra del Señor</h2>
   <div className="donationCampaignGrid">
    {campaigns.map(item=><article className="donationCampaignCard" key={item.title}>
      <span>♥</span><h3>{item.title}</h3><p>{item.description}</p>
    </article>)}
   </div>

   <div className="donationCheckoutCard">
    <div>
     <p className="eyebrow">Donación segura</p>
     <h2>{donationUrl ? "Seleccione el método de pago" : "Conexión de pagos preparada"}</h2>
     <p>{donationUrl ? "Será dirigido al proveedor seguro de la iglesia." : "Conectaremos el enlace oficial del banco, Stripe, Tithe.ly, Pushpay u otro proveedor autorizado."}</p>
    </div>
    {donationUrl
      ? <a className="btn" href={donationUrl} target="_blank" rel="noopener noreferrer">Donar ahora</a>
      : <Link className="btn" href="/conexion">Solicitar información para donar</Link>}
   </div>

   <section className="paypalQrSection" aria-labelledby="paypal-qr-title">
    <div className="paypalQrCopy">
     <p className="eyebrow">Donación por PayPal</p>
     <h2 id="paypal-qr-title">Escanee para apoyar la obra</h2>
     <p>Abra la cámara de su teléfono, enfoque el código QR y siga las instrucciones seguras de PayPal para elegir el monto de su ofrenda.</p>
     <div className="paypalQrSteps">
      <span><strong>1</strong> Abra la cámara</span>
      <span><strong>2</strong> Escanee el código</span>
      <span><strong>3</strong> Complete su donación</span>
     </div>
     <small>PayPal procesa la donación fuera de esta página. La iglesia no almacena información de tarjetas ni cuentas bancarias.</small>
    </div>
    <a className="paypalQrImage" href="/images/paypal-donaciones-iglesia.png" target="_blank" rel="noopener noreferrer" aria-label="Abrir el código QR de PayPal en tamaño completo">
     <Image src="/images/paypal-donaciones-iglesia.png" alt="Código QR de PayPal para ofrendas y donaciones de la Iglesia Príncipe de Paz Philadelphia" width={1056} height={1500} sizes="(max-width: 800px) 92vw, 430px" />
    </a>
   </section>

   <div className="notice"><strong>Transparencia y seguridad</strong><p>La página no almacena números de tarjetas. Los pagos se procesarán mediante un proveedor autorizado.</p></div>
   {!donationUrl && <div className="donationSetupHelp">
    <p className="eyebrow">Para activar donaciones directas</p>
    <h2>Solicite un enlace oficial para recibir donaciones</h2>
    <p>La tarjeta bancaria no contiene los datos necesarios para recibir depósitos. Pida al banco el número de cuenta y de ruta, o cree un enlace de pago para la iglesia con un proveedor autorizado. Cuando tenga el enlace, podrá conectarse al botón “Donar ahora” sin publicar información privada.</p>
   </div>}
  </section>
 </>;
}
