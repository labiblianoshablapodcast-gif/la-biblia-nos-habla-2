import Link from "next/link";

const SOURCE_URL="https://scriptureearth.org/00spa.php?idx=264&iso_code=kek&language=Kekch%C3%AD";

export default function QeqchiOldTestamentPage(){
  return <main style={{background:"#051827",color:"#fff",minHeight:"100vh",padding:"24px 16px 110px"}}>
    <section style={{maxWidth:1100,margin:"0 auto"}}>
      <p style={{margin:"0 0 8px",color:"#e0aa37",fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",fontSize:12}}>Antiguo Testamento · Q’eqchi’</p>
      <h1 style={{margin:"0 0 12px",fontSize:"clamp(2.2rem,8vw,4rem)",lineHeight:.95}}>Leer en Q’eqchi’</h1>
      <p style={{margin:"0 0 18px",color:"rgba(255,255,255,.78)",lineHeight:1.6}}>Puede leer el Antiguo Testamento desde la fuente de Scripture Earth sin salir de esta sección de la app. El texto permanece alojado por la fuente original.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}}>
        <Link href="/biblia" style={{display:"inline-flex",padding:"11px 16px",borderRadius:999,background:"#d7aa4b",color:"#071829",fontWeight:800}}>← Volver a Biblia</Link>
        <a href={SOURCE_URL} target="_blank" rel="noreferrer" style={{display:"inline-flex",padding:"11px 16px",borderRadius:999,border:"1px solid #d7aa4b",color:"#fff",fontWeight:800}}>Abrir fuente original ↗</a>
      </div>
      <div style={{border:"1px solid rgba(215,170,75,.45)",borderRadius:18,overflow:"hidden",background:"#fff",minHeight:"72vh"}}>
        <iframe
          src={SOURCE_URL}
          title="Antiguo Testamento Q’eqchi’ en Scripture Earth"
          style={{display:"block",width:"100%",height:"72vh",border:0,background:"#fff"}}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p style={{margin:"14px 2px 0",color:"rgba(255,255,255,.58)",fontSize:12,lineHeight:1.55}}>Fuente: Scripture Earth · idioma kek. Si el visor integrado no carga por restricciones de la fuente, use “Abrir fuente original”.</p>
    </section>
  </main>;
}
