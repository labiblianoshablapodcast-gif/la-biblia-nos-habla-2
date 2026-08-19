import AdminNav from "@/components/AdminNav";
import StatusUpdater from "@/components/StatusUpdater";
import {createClient} from "@/lib/supabase/server";

export default async function NuevosCreyentes(){
 const supabase=await createClient();
 const {data,error}=await supabase
   .from("new_believers")
   .select("*")
   .order("created_at",{ascending:false});

 if(error) console.error("No se pudieron cargar los nuevos creyentes",error);

 return <div className="adminShell">
  <AdminNav/>
  <section className="adminMain">
    <p className="eyebrow">Discipulado y seguimiento</p>
    <h1>Nuevos creyentes</h1>

    {error && <div className="notice" role="alert">
      <strong>No se pudieron cargar los registros.</strong>
      <p>Actualice la página. Si el problema continúa, revise el Estado Supabase del panel.</p>
    </div>}

    <div className="adminTable">
      {(data??[]).map(person=><article key={person.id}>
        <div className="requestHeader">
          <strong>{person.full_name || "Sin nombre"}</strong>
          <StatusUpdater
            table="new_believers"
            id={person.id}
            initialStatus={person.status || "Nuevo"}
          />
        </div>

        <div className="contactMeta">
          {person.email && <a href={`mailto:${person.email}`}>✉ {person.email}</a>}
          {person.phone && <a href={`tel:${person.phone}`}>☎ {person.phone}</a>}
          <span>{person.created_at ? new Date(person.created_at).toLocaleString("es-US") : ""}</span>
        </div>
      </article>)}

      {!data?.length && !error && <p>No hay nuevos creyentes registrados todavía.</p>}
    </div>
  </section>
 </div>;
}
