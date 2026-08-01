import AdminNav from "@/components/AdminNav";
export default function PredicacionesAdmin(){
 return <div className="adminShell"><AdminNav/><section className="adminMain"><p className="eyebrow">Biblioteca ministerial</p><h1>Predicaciones</h1>
 <form className="adminForm"><label>Título<input name="title"/></label><label>Texto bíblico<input name="scripture"/></label><label>Descripción<textarea rows={5}/></label><label>Enlace de YouTube<input type="url"/></label><button className="btn" type="button">Guardar al conectar acciones</button></form></section></div>;
}