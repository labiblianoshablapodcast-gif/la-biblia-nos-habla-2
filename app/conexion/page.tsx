import Image from 'next/image';
import ConnectionForm from '@/components/ConnectionForm';

export default function Conexion(){
  return <>
    <section className="connectionHero">
      <div className="connectionHeroInner">
        <div className="connectionHeroCopy">
          <h1>No tiene que caminar solo.</h1>
          <blockquote className="connectionVerse">
            <span aria-hidden="true">“</span>
            <div><strong>La oración eficaz del justo puede mucho.</strong><cite>Santiago 5:16</cite></div>
          </blockquote>
          <p>Cuéntenos cómo podemos ayudarle. Un miembro de nuestro equipo recibirá su solicitud y podrá darle seguimiento.</p>
          <span className="connectionResponseBadge"><i/> Su petición será recibida con privacidad y respeto</span>
        </div>
        <div className="connectionPrayerVisual" role="img" aria-label="Manos unidas en oración junto a una Biblia">
          <Image
            src="/images/manos-orando-conexion-v2.png"
            alt="Manos unidas en oración junto a una Biblia"
            fill
            priority
            sizes="(max-width: 700px) calc(100vw - 36px), 48vw"
          />
          <span className="connectionPrayerGlow" aria-hidden="true" />
          <div className="connectionPrayerCaption"><span aria-hidden="true">◇</span><strong>Oramos con usted</strong></div>
        </div>
      </div>
    </section>

    <section className="section connectionModernLayout connectionModernLayoutSimple">
      <div className="connectionIntro connectionIntroSimple">
        <h2>Envíe su petición</h2>
        <p className="lead">Complete el formulario y permítanos orar y ayudarle en este tiempo.</p>
        <div className="connectionPrivacy"><span>✓</span><div><strong>Privacidad</strong><p>Su información será tratada con respeto y solo será vista por personas autorizadas.</p></div></div>
      </div>
      <ConnectionForm/>
    </section>
  </>;
}
