import Link from 'next/link';
const content:Record<string,{title:string;message:string}>={
'Aceptar a Cristo':{title:'¡Gloria a Dios por su decisión!',message:'Hemos recibido su solicitud. Muy pronto un pastor se pondrá en contacto con usted. Mientras tanto, comience a conocer a Jesús por medio del Evangelio de Juan.'},
'Bautismo':{title:'Hemos recibido su solicitud de bautismo',message:'Un pastor o líder se comunicará con usted para explicarle el significado bíblico del bautismo y los próximos pasos.'},
'Membresía':{title:'Gracias por querer ser parte de la congregación',message:'Nos comunicaremos con usted para orientarle acerca de la membresía y la vida de nuestra iglesia.'},
'Consejería':{title:'Su solicitud fue recibida',message:'La trataremos con respeto y discreción. Una persona autorizada se comunicará con usted.'},
'Visita pastoral':{title:'Solicitud de visita recibida',message:'Nos comunicaremos con usted para coordinar el lugar y el mejor horario.'},
'Servir':{title:'Gracias por su deseo de servir',message:'Un líder se comunicará para conocer sus dones e intereses ministeriales.'}};
export default async function Gracias({searchParams}:{searchParams:Promise<{tipo?:string}>}){const {tipo='Aceptar a Cristo'}=await searchParams;const selected=content[tipo]??{title:'¡Gracias por comunicarse!',message:'Hemos recibido su solicitud y nos comunicaremos con usted.'};return <><section className='pageHero thankHero'><p className='eyebrow'>Solicitud recibida</p><h1>{selected.title}</h1><p>{selected.message}</p></section><section className='section'><p className='eyebrow'>Continúe creciendo</p><h2>Recursos para comenzar hoy</h2><div className='grid'>
<Link className='sectionCard' href='/primeros-pasos'><span>🌱</span><h3>Primeros Pasos con Jesús</h3><p>Conozca los fundamentos de la vida cristiana.</p></Link>
<Link className='sectionCard' href='/primeros-pasos'><span>📖</span><h3>Evangelio de Juan</h3><p>Lea y estudie capítulo por capítulo.</p></Link>
<Link className='sectionCard' href='/primeros-pasos#orar'><span>🙏</span><h3>Cómo orar</h3><p>Aprenda a hablar con Dios con sencillez y fe.</p></Link>
<Link className='sectionCard' href='/primeros-pasos#leer'><span>📚</span><h3>Cómo leer la Biblia</h3><p>Una guía sencilla para entender la Palabra.</p></Link>
<Link className='sectionCard' href='/'><span>⛪</span><h3>Encuentre una iglesia</h3><p>Conozca nuestros horarios y dirección.</p></Link>
<Link className='sectionCard' href='/conexion'><span>💬</span><h3>Necesito más ayuda</h3><p>Envíe otra solicitud o pida consejería.</p></Link></div></section></>;}
