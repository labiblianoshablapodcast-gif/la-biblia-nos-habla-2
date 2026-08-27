export type KidsAge="4-6"|"7-10";
export const kidsAge=(value:unknown):KidsAge=>value==="7-10"?"7-10":"4-6";
export const learnerSlot=(value:unknown)=>typeof value==="string"&&/^[1-3]$/.test(value)?Number(value):1;
export type KidsQuestion={prompt:string;options:{text:string;icon:string}[];answer:number;explanation:string};
export const kidsLesson={id:"david-y-goliat",title:"David y Goliat",subtitle:"Confiar en Dios",reference:"1 Samuel 17",scenes:[
  {title:"Un pastor que cuidaba",young:"David cuidaba las ovejas de su familia. Había aprendido a confiar en Dios mientras las protegía.",older:"David era un joven pastor. Al cuidar el rebaño había experimentado la ayuda de Dios, y recordaba esa fidelidad cuando llegaban nuevas dificultades."},
  {title:"Un desafío muy grande",young:"Goliat era un guerrero muy grande. El ejército tenía miedo. David escuchó su desafío.",older:"Goliat desafiaba al ejército de Israel, y los soldados estaban atemorizados. David vio algo más que el tamaño del guerrero: recordó quién era el Dios de Israel."},
  {title:"Lo que David conocía",young:"David no podía caminar bien con la armadura del rey. Tomó su cayado, su honda y cinco piedras lisas del arroyo.",older:"Saúl le ofreció su armadura, pero David no estaba acostumbrado a usarla. Escogió cinco piedras lisas y llevó su honda, confiando en Dios y usando lo que conocía."},
  {title:"La confianza de David",young:"David sabía que no estaba solo. Su confianza estaba en Dios, no en ser el más grande ni el más fuerte.",older:"David declaró que venía en el nombre del Señor. No puso su confianza en las armas ni en su propia fuerza, sino en el Dios que lo había ayudado antes."},
  {title:"Dios ayudó a David",young:"David usó su honda y venció a Goliat. Dios ayudó a David. El ejército dejó de tener miedo.",older:"David lanzó una piedra con su honda y venció a Goliat. La narración destaca que el Señor puede librar sin depender del tamaño ni del poder de las armas."},
  {title:"¿Y cuando tenemos miedo?",young:"Podemos hablar con Dios cuando tenemos miedo. También podemos pedir ayuda a un adulto que nos cuide. ¡No tenemos que enfrentar el peligro solos!",older:"Confiar en Dios no significa buscar peligros ni pelear con otras personas. Podemos orar, actuar con sabiduría y pedir ayuda a un adulto responsable cuando algo nos asusta."}
]};
export const kidsQuestions:Record<KidsAge,KidsQuestion[]>={
 "4-6":[
  {prompt:"¿Qué cuidaba David?",options:[{text:"Ovejas",icon:"sheep"},{text:"Un castillo",icon:"castle"},{text:"Un barco",icon:"boat"}],answer:0,explanation:"David era pastor y cuidaba las ovejas."},
  {prompt:"¿En quién confiaba David?",options:[{text:"En la armadura",icon:"shield"},{text:"En Dios",icon:"prayer"},{text:"En ser el más grande",icon:"crown"}],answer:1,explanation:"David confiaba en Dios, no en su tamaño ni en una armadura."},
  {prompt:"Si algo te da miedo, ¿qué puedes hacer?",options:[{text:"Ir al peligro solo",icon:"mountain"},{text:"Guardar silencio siempre",icon:"quiet"},{text:"Orar y pedir ayuda",icon:"heart"}],answer:2,explanation:"Puedes hablar con Dios y buscar a un adulto que te cuide."}
 ],
 "7-10":[
  {prompt:"¿Por qué David no usó la armadura de Saúl?",options:[{text:"Porque no estaba acostumbrado a ella",icon:"shield"},{text:"Porque quería impresionar al ejército",icon:"crown"},{text:"Porque Goliat se lo pidió",icon:"mountain"}],answer:0,explanation:"David probó la armadura, pero no estaba acostumbrado a caminar con ella (1 Samuel 17:38-40)."},
  {prompt:"¿En qué se basaba la confianza de David?",options:[{text:"En que nunca tendría dificultades",icon:"sun"},{text:"En el Señor que lo había ayudado antes",icon:"prayer"},{text:"En ser más fuerte que Goliat",icon:"crown"}],answer:1,explanation:"David recordó la ayuda de Dios y declaró que venía en el nombre del Señor (1 Samuel 17:37,45-47)."},
  {prompt:"¿Cómo aplicarías esta historia si alguien te amenaza?",options:[{text:"Lo enfrento a golpes para demostrar mi fe",icon:"shield"},{text:"No se lo cuento a nadie",icon:"quiet"},{text:"Oro, busco un lugar seguro y aviso a un adulto",icon:"heart"}],answer:2,explanation:"La fe no nos pide buscar peligro ni dañar a otros. Pedir protección y ayuda es una decisión sabia."}
 ]
};
export function gradeKidsQuiz(age:KidsAge,answers:unknown):number|null{
 if(!Array.isArray(answers)||answers.length!==3||answers.some(value=>!Number.isInteger(value)||value<0||value>2))return null;
 return kidsQuestions[age].reduce((score,question,index)=>score+(answers[index]===question.answer?1:0),0);
}
export function validKidsSubmission(value:unknown){
 if(!value||typeof value!=="object")return null;
 const body=value as Record<string,unknown>;
 if(body.lesson!==kidsLesson.id||(body.age!=="4-6"&&body.age!=="7-10")||!Number.isInteger(body.slot)||Number(body.slot)<1||Number(body.slot)>3||body.adultConsent!==true)return null;
 const score=gradeKidsQuiz(body.age,body.answers);
 return score===null?null:{lesson_id:kidsLesson.id,age_group:body.age,learner_slot:Number(body.slot),score,total:3,consent_version:"kids-v1"};
}
