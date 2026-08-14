import Image from 'next/image';
import ConnectionForm from '@/components/ConnectionForm';

const supportPaths = [
  {icon:'✦', title:'Comenzar con Cristo', text:'Dé su primer paso de fe acompañado por nuestro equipo pastoral.'},
  {icon:'♡', title:'Oración y consejería', text:'Comparta su necesidad en un espacio respetuoso y confidencial.'},
  {icon:'○', title:'Bautismo y membresía', text:'Conozca los próximos pasos para crecer y formar parte de la iglesia.'},
  {icon:'→', title:'Visitas y servicio', text:'Solicite una visita o descubra cómo usar sus dones para servir.'}
];

export default function Conexion(){
  return <>
    <section className="connectionHero">
      <div className="connectionHeroInner">
        <div className="connectionHeroCopy">
          <p className="eyebrow">Estamos para servirle</p>
          <h1>Un lugar para dar su próximo paso.</h1>
          <p>Salvación, oración, bautismo, membresía y acompañamiento pastoral, todo en un solo lugar.</p>
          <span className="connectionResponseBadge"><i/> Su solicitud será atendida con privacidad y cuidado</span>
        </div>
        <figure className="connectionPrayerVisual">
          <Image
            src="/images/iglesia-servicio-de-oracion.jpeg"
            alt="Congregación de Iglesia Príncipe de Paz reunida en oración"
            fill
            priority
            sizes="(max-width: 700px) calc(100vw - 36px), 390px"
          />
          <span className="connectionPrayerGlow" aria-hidden="true" />
          <figcaption>
            <span className="connectionPrayerIcon" aria-hidden="true">♢</span>
            <span><strong>Oramos con usted</strong><small>Su petición importa y será tratada con cuidado.</small></span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section className="section connectionModernLayout">
      <div className="connectionIntro">
        <p className="eyebrow">Acompañamiento pastoral</p>
        <h2>No tiene que caminar solo.</h2>
        <p className="lead">Cuéntenos cómo podemos ayudarle. Un miembro autorizado de nuestro equipo recibirá su solicitud y podrá darle seguimiento.</p>
        <div className="connectionSupportGrid">
          {supportPaths.map(item=><article key={item.title}>
            <span>{item.icon}</span><div><h3>{item.title}</h3><p>{item.text}</p></div>
          </article>)}
        </div>
        <div className="connectionPrivacy"><span>✓</span><div><strong>Privacidad pastoral</strong><p>Su información será tratada con respeto y solo será vista por personas autorizadas.</p></div></div>
      </div>
      <ConnectionForm/>
    </section>

    <section className="connectionStepsSection">
      <div className="connectionStepsInner">
        <div><p className="eyebrow">Así le acompañamos</p><h2>Un proceso sencillo y humano</h2></div>
        <ol>
          <li><span>01</span><div><strong>Cuéntenos</strong><p>Seleccione su necesidad y envíe el formulario.</p></div></li>
          <li><span>02</span><div><strong>Oramos</strong><p>Nuestro equipo recibe su solicitud con discreción.</p></div></li>
          <li><span>03</span><div><strong>Le acompañamos</strong><p>Nos comunicaremos para ayudarle en su próximo paso.</p></div></li>
        </ol>
      </div>
    </section>
  </>;
}
