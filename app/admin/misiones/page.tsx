import AdminNav from "@/components/AdminNav";
export default function MisionesAdmin(){
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Trabajo misionero</p><h1>Misiones</h1>
 <form className="adminForm"><label>Título<input/></label><label>Ubicación<input/></label><label>Fecha<input type="date"/></label><label>Descripción<textarea rows={6}/></label><button className="btn" type="button">Guardar al conectar acciones</button></form></section></div>;
}