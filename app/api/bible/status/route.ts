import {NextResponse} from "next/server";

export async function GET(){
 const connected=Boolean(process.env.RVR1960_API_URL && process.env.RVR1960_API_KEY);

 return NextResponse.json({
  translation:"Reina-Valera 1960",
  language:"es",
  license:"Authorized provider required",
  books:66,
  chapters:1189,
  connected,
  status:connected ? "ready" : "awaiting_authorized_provider"
 });
}
