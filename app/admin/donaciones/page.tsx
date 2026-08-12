import AdminNav from "@/components/AdminNav";
import {createClient} from "@/lib/supabase/server";

const money=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});

export default async function DonacionesAdmin(){
 const supabase=await createClient();
 const {data,error}=await supabase.from("paypal_donations").select("*").order("donated_at",{ascending:false});
 const donations=data??[];
 const total=donations.filter(item=>item.payment_status==="Completed").reduce((sum,item)=>sum+Number(item.gross_amount||0),0);

 return <div className="adminShell adminShellPro">
  <AdminNav/>
  <main className="adminMain adminDashboard">
   <p className="eyebrow">Registro privado</p>
   <h1>Donaciones de PayPal</h1>
   <p>Información recibida y verificada directamente por PayPal.</p>

   <section className="donationAdminStats">
    <article><small>Total recibido</small><strong>{money.format(total)}</strong></article>
    <article><small>Donaciones</small><strong>{donations.length}</strong></article>
   </section>

   {error&&<div className="notice"><strong>Falta activar el registro de donaciones.</strong><p>Ejecute el archivo <code>supabase-12-3-paypal-donations.sql</code> en Supabase.</p></div>}

   <div className="donationAdminTable" role="table" aria-label="Donaciones recibidas">
    <div className="donationAdminRow donationAdminHeader" role="row">
     <span>Donante</span><span>Cantidad</span><span>Fecha y hora</span><span>Estado</span><span>Transacción</span>
    </div>
    {donations.map(item=><article className="donationAdminRow" role="row" key={item.id}>
     <span><strong>{item.donor_name||"Nombre no proporcionado"}</strong>{item.payer_email&&<small>{item.payer_email}</small>}</span>
     <span><strong>{new Intl.NumberFormat("en-US",{style:"currency",currency:item.currency||"USD"}).format(Number(item.gross_amount||0))}</strong></span>
     <span>{item.donated_at?new Date(item.donated_at).toLocaleString("es-US",{dateStyle:"medium",timeStyle:"short",timeZone:"America/New_York"}):"—"}</span>
     <span><mark className={item.payment_status==="Completed"?"statusComplete":"statusOther"}>{item.payment_status||"Desconocido"}</mark></span>
     <span><code>{item.transaction_id}</code></span>
    </article>)}
    {!donations.length&&!error&&<p className="emptyDonations">Todavía no hay donaciones registradas.</p>}
   </div>
  </main>
 </div>;
}
