import AdminNav from "@/components/AdminNav";
export default function DevocionalesAdmin(){
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Contenido diario</p><h1>Devocionales</h1>
 <form className="adminForm"><label>Título<input/></label><label>Versículo<input/></label><label>Reflexión<textarea rows={6}/></label><label>Oración<textarea rows={4}/></label><button className="btn" type="button">Guardar al conectar acciones</button></form></section></div>;
}