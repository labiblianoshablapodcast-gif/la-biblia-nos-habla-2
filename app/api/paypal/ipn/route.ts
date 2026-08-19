import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

export const runtime="nodejs";

function safeDonationDate(value:string|null){
 if(!value) return new Date().toISOString();
 const parsed=new Date(value);
 return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export async function POST(request:Request){
 const rawBody=await request.text();

 let verification:Response;
 try{
  verification=await fetch("https://ipnpb.paypal.com/cgi-bin/webscr",{
   method:"POST",
   headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"LaBibliaNosHabla-PayPal-IPN/1.0"},
   body:`cmd=_notify-validate&${rawBody}`
  });
 }catch(error){
  console.error("No se pudo verificar la notificación de PayPal",error);
  return NextResponse.json({received:false},{status:502});
 }

 if((await verification.text()).trim()!=="VERIFIED"){
  return NextResponse.json({received:false},{status:400});
 }

 const values=new URLSearchParams(rawBody);
 const transactionId=values.get("txn_id");
 const numericAmount=Number(values.get("mc_gross"));
 const numericFee=values.get("mc_fee") ? Number(values.get("mc_fee")) : null;

 if(!transactionId||!Number.isFinite(numericAmount)||numericAmount<=0){
  return NextResponse.json({received:false},{status:400});
 }

 if(numericFee!==null&&!Number.isFinite(numericFee)){
  return NextResponse.json({received:false},{status:400});
 }

 const expectedReceiver=process.env.PAYPAL_RECEIVER_EMAIL?.trim().toLowerCase();
 const actualReceiver=(values.get("receiver_email")||values.get("business")||"").trim().toLowerCase();
 if(expectedReceiver&&actualReceiver!==expectedReceiver){
  console.error("Notificación de PayPal destinada a otro receptor");
  return NextResponse.json({received:false},{status:400});
 }

 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!serviceKey){
  console.error("Falta la configuración privada para registrar donaciones");
  return NextResponse.json({received:false},{status:500});
 }

 const supabase=createClient(url,serviceKey,{auth:{persistSession:false}});
 const donorName=[values.get("first_name"),values.get("last_name")].filter(Boolean).join(" ")||null;
 const {error}=await supabase.from("paypal_donations").upsert({
  transaction_id:transactionId,
  donor_name:donorName,
  payer_email:values.get("payer_email"),
  gross_amount:numericAmount,
  fee_amount:numericFee,
  currency:values.get("mc_currency")||"USD",
  payment_status:values.get("payment_status")||"Unknown",
  donated_at:safeDonationDate(values.get("payment_date")),
  raw_event:Object.fromEntries(values.entries())
 },{onConflict:"transaction_id"});

 if(error){
  console.error("No se pudo registrar la donación de PayPal",error);
  return NextResponse.json({received:false},{status:500});
 }

 return NextResponse.json({received:true});
}
