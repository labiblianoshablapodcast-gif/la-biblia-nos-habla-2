export default function Conexion(){
 return <><section className="pageHero"><p className="eyebrow">Estamos para servirle</p><h1>Centro de Conexión</h1><p>Salvación, bautismo, membresía, consejería, visitas y oportunidades para servir.</p></section>
 <section className="section"><form action="https://formsubmit.co/Labiblianoshablapodcast@gmail.com" method="POST">
 <input type="hidden" name="_subject" value="Nueva solicitud del Centro de Conexión"/>
 <label>Nombre<input name="Nombre" required/></label><label>Correo<input type="email" name="Correo" required/></label>
 <label>Solicitud<select name="Solicitud"><option>Aceptar a Cristo</option><option>Bautismo</option><option>Membresía</option><option>Consejería</option><option>Visita pastoral</option><option>Servir</option></select></label>
 <label>Mensaje<textarea name="Mensaje" rows={6} required/></label><button className="btn">Enviar solicitud</button></form></section></>;
}
