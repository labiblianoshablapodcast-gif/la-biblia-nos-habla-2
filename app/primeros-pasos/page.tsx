export default function PrimerosPasos(){
 return <><section className="pageHero"><p className="eyebrow">Nuevos creyentes</p><h1>Primeros Pasos con Jesús</h1><p>Un camino sencillo para conocer a Cristo y estudiar el Evangelio de Juan.</p></section>
 <section className="section"><h2>Evangelio de Juan</h2><div className="cardList">{Array.from({length:21},(_,i)=><article className="contentCard" key={i}><small>Lección {i+1}</small><h3>Juan {i+1}</h3><p>Lectura, preguntas, aplicación y progreso personal.</p></article>)}</div></section></>;
}
