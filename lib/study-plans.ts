export type StudyDay = {title:string; chapters:number[]; reflection:string; question:string};
export type StudyPlan = {id:string; book:string; title:string; description:string; days:StudyDay[]};

const johnTitles = [
  "Jesús, la Palabra de vida", "El primer milagro", "Nacer de nuevo", "Agua viva",
  "El Hijo que da vida", "Jesús, el Pan de vida", "Ríos de agua viva", "La luz del mundo",
  "Ojos abiertos por la fe", "El Buen Pastor", "La resurrección y la vida", "Servir y seguir a Jesús",
  "Amor que transforma", "El camino, la verdad y la vida", "Permanecer en Cristo",
  "La promesa del Espíritu Santo", "Jesús ora por los suyos", "El Rey ante Pilato",
  "La cruz y el amor consumado", "El Señor resucitado", "Sígueme"
];

// Guías originales de La Biblia Nos Habla; no reproducen planes de YouVersion.
export const studyPlans:StudyPlan[] = [
  {id:"juan", book:"Juan", title:"Conozca a Jesús", description:"Un capítulo al día para conocer a Jesús, con las preguntas del estudio de Juan.",
    days:johnTitles.map((title,index)=>({title,chapters:[index+1],reflection:"Lea el capítulo con calma. Observe lo que revela acerca de Jesús y responda las preguntas del estudio antes de continuar.",question:"¿Qué aprende de Jesús y cómo puede responder a su palabra hoy?"}))},
  {id:"romanos", book:"Romanos", title:"La gracia que transforma", description:"Recorra Romanos en ocho días: la fe, la gracia y una vida transformada por el evangelio.", days:[
    {title:"Todos necesitamos la gracia",chapters:[1,2],reflection:"Pablo presenta el evangelio y confronta tanto el pecado como la tendencia a juzgar a otros. La bondad de Dios nos invita al arrepentimiento, no a sentirnos superiores.",question:"¿Dónde necesita dejar de juzgar a otros y responder a la bondad de Dios?"},
    {title:"Justificados por la fe",chapters:[3,4],reflection:"Nadie puede presentarse ante Dios confiando en sus propios méritos. Abraham nos ayuda a comprender la fe: recibir la promesa de Dios y descansar en su fidelidad.",question:"¿En qué está poniendo su confianza para acercarse a Dios?"},
    {title:"Una vida nueva en Cristo",chapters:[5,6],reflection:"La paz con Dios nace de lo que Cristo hizo por nosotros. Su gracia no es una invitación a permanecer en el pecado, sino a vivir una vida nueva a su servicio.",question:"¿Qué hábito necesita rendir a Cristo para vivir en esa novedad de vida?"},
    {title:"La vida en el Espíritu",chapters:[7,8],reflection:"La lucha interior no tiene la última palabra. En Cristo encontramos libertad de condenación, la ayuda del Espíritu y una esperanza que permanece aun en medio del sufrimiento.",question:"¿Qué verdad de Romanos 8 necesita recordar en su situación actual?"},
    {title:"La misericordia y la respuesta de fe",chapters:[9,10],reflection:"El dolor de Pablo por su pueblo acompaña su reflexión sobre la misericordia de Dios. La respuesta al evangelio incluye creer, confesar a Cristo y anunciar las buenas noticias.",question:"¿Por quién puede orar y con quién puede compartir su esperanza en Cristo?"},
    {title:"Una vida ofrecida a Dios",chapters:[11,12],reflection:"La misericordia de Dios nos llama a la humildad y a la adoración. Ofrecer la vida a Dios se vuelve visible en el servicio, el amor sincero y la respuesta al mal con el bien.",question:"¿Cómo puede servir esta semana con los dones que ha recibido?"},
    {title:"Amar y recibir al hermano",chapters:[13,14],reflection:"El amor al prójimo orienta nuestras responsabilidades. En las diferencias de conciencia, Pablo nos llama a evitar el desprecio y a buscar aquello que edifica y promueve la paz.",question:"¿Qué diferencia puede manejar con más amor y menos juicio?"},
    {title:"Una iglesia que sirve unida",chapters:[15,16],reflection:"Cristo es nuestro ejemplo de servicio. Las oraciones, los viajes y los saludos finales muestran una comunidad donde muchas personas colaboran para extender el evangelio.",question:"¿A quién puede animar o apoyar para fortalecer la misión de su iglesia?"}
  ]},
  {id:"hebreos", book:"Hebreos", title:"Firmes en nuestra esperanza", description:"Siete días para contemplar a Cristo y perseverar en la fe, leyendo los trece capítulos de Hebreos.", days:[
    {title:"Dios nos ha hablado por el Hijo",chapters:[1,2],reflection:"Hebreos dirige nuestra atención a Jesús: el Hijo por quien Dios nos habla y quien compartió nuestra humanidad. Su grandeza y su cercanía nos invitan a escuchar con atención.",question:"¿Qué le ayuda a escuchar a Jesús en medio de las distracciones?"},
    {title:"Escuchar y entrar en su reposo",chapters:[3,4],reflection:"La advertencia contra un corazón endurecido va acompañada de una invitación a confiar. Podemos acercarnos al trono de la gracia porque Jesús conoce nuestra debilidad.",question:"¿En qué área necesita responder hoy a Dios con confianza y obediencia?"},
    {title:"Crecer y aferrarse a la esperanza",chapters:[5,6],reflection:"La vida de fe requiere crecimiento y perseverancia. La promesa de Dios sostiene nuestra esperanza como un ancla, mientras aprendemos a discernir y a servir con constancia.",question:"¿Qué práctica concreta le ayudará a madurar en su fe?"},
    {title:"Un sacerdote y un pacto mejores",chapters:[7,8],reflection:"El sacerdocio de Jesús permanece y su intercesión nos anima a acercarnos a Dios. El nuevo pacto apunta a una relación en la que su enseñanza alcanza el corazón.",question:"¿Cómo cambia su oración al recordar que Jesús intercede por usted?"},
    {title:"Acercarnos con plena confianza",chapters:[9,10],reflection:"El sacrificio de Cristo es suficiente. Por él podemos acercarnos a Dios y animarnos mutuamente a perseverar, al amor y a las buenas obras.",question:"¿A quién puede acompañar y animar para que no camine solo en la fe?"},
    {title:"Correr con los ojos en Jesús",chapters:[11,12],reflection:"Los testigos de la fe nos recuerdan que confiar en Dios no elimina toda dificultad. Nuestra carrera se sostiene al mirar a Jesús, aceptar su formación y buscar la paz.",question:"¿Qué peso necesita dejar para perseverar con los ojos puestos en Jesús?"},
    {title:"La fe en la vida cotidiana",chapters:[13],reflection:"La perseverancia se expresa en hospitalidad, generosidad, fidelidad y gratitud. La carta termina recordándonos que Dios nos capacita para hacer su voluntad por medio de Jesucristo.",question:"¿Qué acción de amor pondrá en práctica al terminar este plan?"}
  ]}
];

export function getStudyPlan(id:unknown){return studyPlans.find(plan=>plan.id===id);}
export function getStudyDay(plan:StudyPlan,day:number){return Number.isInteger(day)&&day>=1?plan.days[day-1]:undefined;}

export function studyDayUrl(plan:StudyPlan,day:number,version="rvr60"){
  return `/estudios/${plan.id}/${day}${version==="asv"||version==="qeqchi"?`?version=${version}`:""}`;
}
export function studyReadingUrl(plan:StudyPlan,day:number,chapter:number,version="rvr60"){
  const query=new URLSearchParams({plan:plan.id,day:String(day)});
  if(version==="asv"||version==="qeqchi")query.set("version",version);
  return `/biblia/${plan.id}/${chapter}?${query}`;
}
export function readingStudyContext(id:unknown,rawDay:unknown,book:string,chapter:number){
  const plan=getStudyPlan(id);
  const day=typeof rawDay==="string"&&/^\d+$/.test(rawDay)?Number(rawDay):0;
  const lesson=plan&&getStudyDay(plan,day);
  return plan&&lesson&&plan.id===book&&lesson.chapters.includes(chapter)?{plan,day,lesson}:null;
}
