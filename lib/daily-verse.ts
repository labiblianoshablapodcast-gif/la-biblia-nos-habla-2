import {books, getChapter} from "@/lib/bible";

type DailyReference = {
  code:string;
  chapter:number;
  verse:number;
  fallback:string;
};

export type DailyVerse = {
  text:string;
  reference:string;
  href:string;
  dateLabel:string;
  translation:"RVR60" | "RVR1909";
};

const DAILY_REFERENCES:DailyReference[]=[
  {code:"PSA",chapter:46,verse:1,fallback:"Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones."},
  {code:"PRO",chapter:3,verse:5,fallback:"Fíate de Jehová de todo tu corazón, y no estribes en tu prudencia."},
  {code:"ISA",chapter:40,verse:31,fallback:"Los que esperan a Jehová tendrán nuevas fuerzas; levantarán las alas como águilas."},
  {code:"ISA",chapter:41,verse:10,fallback:"No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo."},
  {code:"JER",chapter:29,verse:11,fallback:"Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz."},
  {code:"LAM",chapter:3,verse:23,fallback:"Nuevas son cada mañana; grande es tu fidelidad."},
  {code:"MAT",chapter:5,verse:14,fallback:"Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder."},
  {code:"MAT",chapter:11,verse:28,fallback:"Venid a mí todos los que estáis trabajados y cargados, que yo os haré descansar."},
  {code:"JHN",chapter:8,verse:12,fallback:"Yo soy la luz del mundo: el que me sigue no andará en tinieblas, mas tendrá la lumbre de la vida."},
  {code:"JHN",chapter:14,verse:6,fallback:"Yo soy el camino, y la verdad, y la vida: nadie viene al Padre, sino por mí."},
  {code:"ROM",chapter:8,verse:28,fallback:"A los que a Dios aman, todas las cosas les ayudan a bien."},
  {code:"ROM",chapter:12,verse:12,fallback:"Gozosos en la esperanza; sufridos en la tribulación; constantes en la oración."},
  {code:"PHP",chapter:4,verse:6,fallback:"Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración."},
  {code:"PHP",chapter:4,verse:13,fallback:"Todo lo puedo en Cristo que me fortalece."},
  {code:"HEB",chapter:11,verse:1,fallback:"Es pues la fe la sustancia de las cosas que se esperan, la demostración de las cosas que no se ven."},
  {code:"JAS",chapter:1,verse:5,fallback:"Si alguno de vosotros tiene falta de sabiduría, demándela a Dios, el cual da a todos abundantemente."},
  {code:"1PE",chapter:5,verse:7,fallback:"Echando toda vuestra solicitud en él, porque él tiene cuidado de vosotros."},
  {code:"1JN",chapter:4,verse:7,fallback:"Amémonos unos a otros; porque el amor es de Dios."},
  {code:"REV",chapter:21,verse:4,fallback:"Y limpiará Dios toda lágrima de los ojos de ellos; y la muerte no será más."}
];

function newYorkDate(now:Date){
  const parts=new Intl.DateTimeFormat("en-CA",{
    timeZone:"America/New_York",
    year:"numeric",
    month:"2-digit",
    day:"2-digit"
  }).formatToParts(now);
  const values=Object.fromEntries(parts.map(part=>[part.type,part.value]));
  return {
    year:Number(values.year),
    month:Number(values.month),
    day:Number(values.day)
  };
}

function capitalize(text:string){
  return text.charAt(0).toUpperCase()+text.slice(1);
}

export async function getDailyVerse(now=new Date()):Promise<DailyVerse>{
  const localDate=newYorkDate(now);
  const dayNumber=Math.floor(Date.UTC(localDate.year,localDate.month-1,localDate.day)/86_400_000);
  const reference=DAILY_REFERENCES[((dayNumber%DAILY_REFERENCES.length)+DAILY_REFERENCES.length)%DAILY_REFERENCES.length];
  const book=books.find(item=>item.code===reference.code);
  const chapter=await getChapter(reference.code,reference.chapter);
  const verse=chapter?.verses.find(item=>item.number===reference.verse);

  const dateLabel=capitalize(new Intl.DateTimeFormat("es-US",{
    timeZone:"America/New_York",
    weekday:"long",
    day:"numeric",
    month:"long"
  }).format(now));

  return {
    text:verse?.text ?? reference.fallback,
    reference:`${book?.name ?? reference.code} ${reference.chapter}:${reference.verse}`,
    href:`/biblia/${book?.slug ?? "salmos"}/${reference.chapter}`,
    dateLabel,
    translation:verse ? "RVR60" : "RVR1909"
  };
}
