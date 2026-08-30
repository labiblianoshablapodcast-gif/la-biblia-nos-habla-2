export type KidsAge="4-6"|"7-10";
export const kidsAge=(value:unknown):KidsAge=>value==="7-10"?"7-10":"4-6";
export const learnerSlot=(value:unknown)=>typeof value==="string"&&/^[1-3]$/.test(value)?Number(value):1;
export type KidsQuestion={prompt:string;options:{text:string;icon:string}[];answer:number;explanation:string};
export const kidsLesson={id:"david-y-goliat",title:"David y Goliat",subtitle:"Confiar en Dios",reference:"1 Samuel 17",scenes:[
 {title:"Lumi presenta la historia",young:"Hoy conoceremos a David, un joven que aprendió a confiar en Dios aun cuando enfrentó algo muy grande.",older:"Lumi nos presenta la historia de David y Goliat. David era joven, pero había aprendido que la verdadera confianza estaba en Dios."},
 {title:"Goliat desafía a Israel",young:"Goliat era un guerrero muy grande. Los soldados de Israel tenían miedo cuando escuchaban su desafío.",older:"Goliat salía a desafiar al ejército de Israel. Su tamaño y sus palabras llenaban de temor a los soldados."},
 {title:"David llega al campamento",young:"David llegó para llevar comida a sus hermanos y escuchó a Goliat.",older:"David llegó al campamento enviado por su padre para llevar provisiones a sus hermanos. Allí escuchó el desafío de Goliat."},
 {title:"David confía en Dios",young:"David recordó que Dios siempre lo había ayudado. Él sabía que no estaba solo.",older:"David recordó cómo Dios lo había ayudado antes y decidió confiar nuevamente en el Señor, no en su propia fuerza."},
 {title:"Saúl le ofrece su armadura",young:"El rey Saúl le prestó su armadura, pero David no estaba acostumbrado a usarla y se la quitó.",older:"Saúl vistió a David con su armadura. David intentó caminar con ella, pero como no estaba acostumbrado a usarla decidió quitársela."},
 {title:"Cinco piedras lisas",young:"David fue al arroyo, escogió cinco piedras lisas y las guardó en su bolsa de pastor.",older:"David tomó su cayado, escogió cinco piedras lisas del arroyo y las puso en su bolsa de pastor, tal como cuenta 1 Samuel 17:40."},
 {title:"David enfrenta a Goliat",young:"David fue hacia Goliat confiando en Dios. Dios ayudó a David a vencer.",older:"David declaró que venía en el nombre del Señor. Enfrentó a Goliat y Dios le dio la victoria, sin depender del tamaño ni del poder de una armadura."},
 {title:"Celebramos y aprendemos",young:"El pueblo celebró. Nosotros también aprendemos que podemos hablar con Dios cuando tenemos miedo y pedir ayuda a un adulto.",older:"La victoria recordó a Israel que el Señor era quien libraba. Confiar en Dios también significa actuar con sabiduría y pedir ayuda a un adulto responsable cuando enfrentamos peligro."}
]};
export const kidsQuestions:Record<KidsAge,KidsQuestion[]>={
 "4-6":[
  {prompt:"¿Qué escuchó David cuando llegó al campamento?",options:[{text:"El desafío de Goliat",icon:"shield"},{text:"Una canción",icon:"sun"},{text:"Un barco",icon:"boat"}],answer:0,explanation:"David escuchó a Goliat desafiar al ejército de Israel."},
  {prompt:"¿En quién confiaba David?",options:[{text:"En la armadura",icon:"shield"},{text:"En Dios",icon:"prayer"},{text:"En ser el más grande",icon:"crown"}],answer:1,explanation:"David confiaba en Dios, no en su tamaño ni en una armadura."},
  {prompt:"Si algo te da miedo, ¿qué puedes hacer?",options:[{text:"Ir al peligro solo",icon:"mountain"},{text:"Guardar silencio siempre",icon:"quiet"},{text:"Orar y pedir ayuda",icon:"heart"}],answer:2,explanation:"Puedes hablar con Dios y buscar a un adulto que te cuide."}
 ],
 "7-10":[
  {prompt:"¿Por qué David no usó la armadura de Saúl?",options:[{text:"Porque no estaba acostumbrado a ella",icon:"shield"},{text:"Porque quería impresionar al ejército",icon:"crown"},{text:"Porque Goliat se lo pidió",icon:"mountain"}],answer:0,explanation:"David probó la armadura, pero no estaba acostumbrado a caminar con ella (1 Samuel 17:38-40)."},
  {prompt:"¿En qué se basaba la confianza de David?",options:[{text:"En que nunca tendría dificultades",icon:"sun"},{text:"En el Señor que lo había ayudado antes",icon:"prayer"},{text:"En ser más fuerte que Goliat",icon:"crown"}],answer:1,explanation:"David recordó la ayuda de Dios y declaró que venía en el nombre del Señor (1 Samuel 17:37,45-47)."},
  {prompt:"¿Cómo aplicarías esta historia si alguien te amenaza?",options:[{text:"Lo enfrento a golpes para demostrar mi fe",icon:"shield"},{text:"No se lo cuento a nadie",icon:"quiet"},{text:"Oro, busco un lugar seguro y aviso a un adulto",icon:"heart"}],answer:2,explanation:"La fe no nos pide buscar peligro ni dañar a otros. Pedir protección y ayuda es una decisión sabia."}
 ]
};
export function gradeKidsQuiz(age:KidsAge,answers:unknown):number|null{if(!Array.isArray(answers)||answers.length!==3||answers.some(value=>!Number.isInteger(value)||value<0||value>2))return null;return kidsQuestions[age].reduce((score,question,index)=>score+(answers[index]===question.answer?1:0),0);}
export function validKidsSubmission(value:unknown){if(!value||typeof value!=="object")return null;const body=value as Record<string,unknown>;if(body.lesson!==kidsLesson.id||(body.age!=="4-6"&&body.age!=="7-10")||!Number.isInteger(body.slot)||Number(body.slot)<1||Number(body.slot)>3||body.adultConsent!==true)return null;const score=gradeKidsQuiz(body.age,body.answers);return score===null?null:{lesson_id:kidsLesson.id,age_group:body.age,learner_slot:Number(body.slot),score,total:3,consent_version:"kids-v1"};}
