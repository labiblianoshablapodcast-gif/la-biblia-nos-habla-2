import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

export const runtime="nodejs";

export async function POST(request:Request){
 const rawBody=await request.text();
 const verification=await fetch("https://ipnpb.paypal.com/cgi-bin/webscr",{
  method:"POST",
  headers:{"Content-Type":"application/x-www-form-urlencoded","User-Agent":"LaBibliaNosHabla-PayPal-IPN/1.0"},
  body:`cmd=_notify-validate&${rawBody}`
 });
 if((await verification.text()).trim()!=="VERIFIED") return NextResponse.json({received:false},{status:400});

 const values=new URLSearchParams(rawBody);
 const transactionId=values.get("txn_id");
 const amount=values.get("mc_gross");
 if(!transactionId||!amount) return NextResponse.json({received:false},{status:400});

 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!serviceKey) return NextResponse.json({received:false},{status:500});
 const supabase=createClient(url,serviceKey,{auth:{persistSession:false}});
 const donorName=[values.get("first_name"),values.get("last_name")].filter(Boolean).join(" ")||null;
 const donatedAt=values.get("payment_date")?new Date(values.get("payment_date")!).toISOString():new Date().toISOString();
 const {error}=await supabase.from("paypal_donations").upsert({
  transaction_id:transactionId,
  donor_name:donorName,
  payer_email:values.get("payer_email"),
  gross_amount:Number(amount),
  fee_amount:values.get("mc_fee")?Number(values.get("mc_fee")):null,
  currency:values.get("mc_currency")||"USD",
  payment_status:values.get("payment_status")||"Unknown",
  donated_at:donatedAt,
  raw_event:Object.fromEntries(values.entries())
 },{onConflict:"transaction_id"});
 if(error) return NextResponse.json({received:false},{status:500});
 return NextResponse.json({received:true});
}
