import {NextResponse} from "next/server";
export async function GET(){
 return NextResponse.json({
  translation:"Reina-Valera Revisada 1960",
  abbreviation:"RVR60",
  language:"es",
  source:"Biblia.com · Logos Bible Software",
  books:66,
  chapters:1189,
  configured:Boolean(process.env.BIBLIA_API_KEY),
  features:["favorites","notes","last-reading","dark-mode","font-size","share","hebrew-greek-dictionary"]
 });
}
