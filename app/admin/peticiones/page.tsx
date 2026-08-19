import AdminNav from "@/components/AdminNav";
import StatusUpdater from "@/components/StatusUpdater";
import {createClient} from "@/lib/supabase/server";

export default async function Peticiones(){
 const supabase=await createClient();
 const {data,error}=await supabase
   .from("prayer_requests")
   .select("*")
   .order("created_at",{ascending:false});

 if(error) console.error("No se pudieron cargar las peticiones",error);

 return <div className="adminShell">
  <AdminNav/>
  <section className="adminMain">
    <p className="eyebrow">Seguimiento pastoral</p>
    <h1>Peticiones y solicitudes</h1>

    {error && <div className="notice" role="alert">
      <strong>No se pudieron cargar los registros.</strong>
      <p>Actualice la página. Si el problema continúa, revise el Estado Supabase del panel.</p>
    </div>}

    <div className="adminTable">
      {(data??[]).map(item=><article key={item.id}>
        <div className="requestHeader">
          <div>
            <strong>{item.name || "Sin nombre"}</strong>
            <small>{item.request_type || "Solicitud"}</small>
          </div>
          <StatusUpdater
            table="prayer_requests"
            id={item.id}
            initialStatus={item.status || "Nuevo"}
          />
        </div>

        <p>{item.request}</p>

        <div className="contactMeta">
          {item.email && <a href={`mailto:${item.email}`}>✉ {item.email}</a>}
          {item.phone && <a href={`tel:${item.phone}`}>☎ {item.phone}</a>}
          <span>{item.created_at ? new Date(item.created_at).toLocaleString("es-US") : ""}</span>
        </div>
      </article>)}

      {!data?.length && !error && <p>No hay solicitudes guardadas todavía.</p>}
    </div>
  </section>
 </div>;
}
