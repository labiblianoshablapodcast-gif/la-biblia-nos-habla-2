import Link from "next/link";
import QeqchiScriptureVideos from "@/components/QeqchiScriptureVideos";

export default function QeqchiVideosPage(){
  return <main style={{background:"#051827",color:"#fff",minHeight:"100vh",padding:"24px 16px 110px"}}>
    <section style={{maxWidth:1100,margin:"0 auto"}}>
      <p style={{margin:"0 0 8px",color:"#e0aa37",fontWeight:800,letterSpacing:1.2,textTransform:"uppercase",fontSize:12}}>Recursos bíblicos · Q’eqchi’</p>
      <h1 style={{margin:"0 0 12px",fontSize:"clamp(2.2rem,8vw,4rem)",lineHeight:.95}}>Videos Q’eqchi’</h1>
      <p style={{margin:"0 0 18px",color:"rgba(255,255,255,.78)",lineHeight:1.6}}>Vea recursos bíblicos en Q’eqchi’ sin salir de La Biblia Nos Habla. Seleccione un video y reprodúzcalo directamente aquí.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:18}}>
        <Link href="/biblia" style={{display:"inline-flex",padding:"11px 16px",borderRadius:999,background:"#d7aa4b",color:"#071829",fontWeight:800}}>← Volver a Biblia</Link>
        <Link href="/biblia/qeqchi-at" style={{display:"inline-flex",padding:"11px 16px",borderRadius:999,border:"1px solid #d7aa4b",color:"#fff",fontWeight:800}}>📖 Biblia Q’eqchi’</Link>
      </div>
      <QeqchiScriptureVideos />
      <p style={{margin:"18px 2px 0",color:"rgba(255,255,255,.58)",fontSize:12,lineHeight:1.55}}>Fuente de los recursos multimedia: Scripture Earth · idioma kek · índice 264. Los archivos permanecen alojados por Scripture Earth.</p>
    </section>
  </main>;
}
