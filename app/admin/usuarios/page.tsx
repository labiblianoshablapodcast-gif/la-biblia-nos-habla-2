import AdminNav from "@/components/AdminNav";
import {createAdminClient} from "@/lib/supabase/admin";
import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

const roles=[
 ["pastor","Pastor — acceso completo"],
 ["secretary","Secretaría — contenido y seguimiento"],
 ["media","Medios — fotos, eventos y predicaciones"],
 ["treasurer","Tesorería — donaciones"],
 ["member","Miembro — sin acceso al panel"]
];

async function pastorAccess(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user) return false;
 const {data}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 return data?.role==="pastor";
}

async function inviteUser(formData:FormData){
 "use server";
 if(!await pastorAccess()) return;
 const email=String(formData.get("email")||"").trim().toLowerCase();
 const fullName=String(formData.get("full_name")||"").trim();
 const role=String(formData.get("role")||"member");
 if(!email) return;
 const admin=createAdminClient();
 const {data,error}=await admin.auth.admin.inviteUserByEmail(email,{data:{full_name:fullName}});
 if(error||!data.user) return;
 await admin.from("profiles").upsert({id:data.user.id,full_name:fullName,email,role});
 revalidatePath("/admin/usuarios");
}

async function updateRole(formData:FormData){
 "use server";
 if(!await pastorAccess()) return;
 const id=String(formData.get("id")||"");
 const role=String(formData.get("role")||"member");
 if(!id) return;
 const admin=createAdminClient();
 await admin.from("profiles").update({role}).eq("id",id);
 revalidatePath("/admin/usuarios");
}

export default async function UsuariosAdmin(){
 const allowed=await pastorAccess();
 let profiles:any[]=[];
 if(allowed){
  const admin=createAdminClient();
  const {data}=await admin.from("profiles").select("*").order("created_at",{ascending:true});
  profiles=data??[];
 }
 return <div className="adminShell">
  <AdminNav/>
  <main className="adminMain">
   <p className="eyebrow">Equipo</p><h1>Usuarios y permisos</h1>
   {!allowed?<div className="notice"><strong>Acceso reservado al pastor.</strong><p>Solamente el rol Pastor puede invitar personas o cambiar permisos.</p></div>:<>
    <form action={inviteUser} className="adminForm">
     <h2>Invitar una persona</h2>
     <label>Nombre<input name="full_name" required/></label>
     <label>Correo electrónico<input name="email" type="email" required/></label>
     <label>Permiso<select name="role" defaultValue="media">{roles.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
     <button className="btn" type="submit">Enviar invitación</button>
     <small>La persona recibirá un correo seguro para crear su contraseña.</small>
    </form>
    <div className="adminUserGrid">
     {profiles.map(profile=><article key={profile.id}>
      <div><strong>{profile.full_name||"Sin nombre"}</strong><small>{profile.email||"Sin correo"}</small></div>
      <form action={updateRole}>
       <input type="hidden" name="id" value={profile.id}/>
       <select name="role" defaultValue={profile.role||"member"}>{roles.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select>
       <button className="btn" type="submit">Guardar permiso</button>
      </form>
     </article>)}
    </div>
   </>}
  </main>
 </div>;
}
