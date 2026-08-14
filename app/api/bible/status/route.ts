import {NextResponse} from "next/server";
export async function GET(){
 return NextResponse.json({
  translation:"Reina-Valera 1909",
  language:"es",
  license:"Public Domain",
  source:"eBible.org",
  books:66,
  chapters:1189,
  features:["favorites","notes","last-reading","dark-mode","font-size","share"],
  futureTranslation:"RVR1960 authorized"
 });
}
