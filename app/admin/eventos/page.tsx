import AdminNav from "@/components/AdminNav";
export default function EventosAdmin(){
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Calendario</p><h1>Eventos</h1>
 <form className="adminForm"><label>Título<input/></label><label>Fecha y hora<input type="datetime-local"/></label><label>Lugar<input/></label><label>Descripción<textarea rows={5}/></label><button className="btn" type="button">Guardar al conectar acciones</button></form></section></div>;
}