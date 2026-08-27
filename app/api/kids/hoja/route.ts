import sheets from "@/data/kids-sheets.json";
export async function GET(request:Request){
 const age=new URL(request.url).searchParams.get("edad");
 if(age!=="4-6"&&age!=="7-10")return new Response("Grupo de edad inválido",{status:400});
 return new Response(Buffer.from(sheets[age],"base64"),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="david-y-goliat-${age}.pdf"`,"Cache-Control":"public, max-age=86400","X-Content-Type-Options":"nosniff"}});
}
