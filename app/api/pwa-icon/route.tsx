import {ImageResponse} from "next/og";

export const runtime = "edge";

export async function GET(request:Request){
 const {searchParams}=new URL(request.url);
 const requested=Number(searchParams.get("size")||512);
 const size=[180,192,512].includes(requested)?requested:512;
 const pad=Math.round(size*0.07);
 const crossW=Math.round(size*0.055);
 const crossH=Math.round(size*0.19);
 const crossArmW=Math.round(size*0.19);
 const crossArmH=Math.round(size*0.045);
 const navy="#07275f";
 const deep="#031b43";
 const gold="#d9aa49";
 const ivory="#f4efe4";

 return new ImageResponse(
  <div style={{width:"100%",height:"100%",display:"flex",position:"relative",flexDirection:"column",alignItems:"center",justifyContent:"center",background:`linear-gradient(180deg, ${navy} 0%, ${deep} 100%)`,borderRadius:Math.round(size*0.16),overflow:"hidden",fontFamily:"serif"}}>
   <div style={{position:"absolute",top:pad,left:pad,right:pad,bottom:pad,border:`${Math.max(2,Math.round(size*0.008))}px solid ${gold}`,borderRadius:Math.round(size*0.13),opacity:0.75}} />
   <div style={{position:"absolute",top:Math.round(size*0.08),width:crossW,height:crossH,background:gold,borderRadius:Math.round(size*0.01),boxShadow:`0 0 ${Math.round(size*0.04)}px rgba(217,170,73,.65)`}} />
   <div style={{position:"absolute",top:Math.round(size*0.14),width:crossArmW,height:crossArmH,background:gold,borderRadius:Math.round(size*0.01),boxShadow:`0 0 ${Math.round(size*0.04)}px rgba(217,170,73,.45)`}} />
   <div style={{marginTop:Math.round(size*0.02),display:"flex",fontSize:Math.round(size*0.24),fontWeight:700,letterSpacing:Math.round(size*0.006),color:ivory,lineHeight:1,textShadow:`0 ${Math.round(size*0.008)}px ${Math.round(size*0.015)}px rgba(0,0,0,.55)`}}>
    <span style={{color:gold}}>L</span><span>BNH</span>
   </div>
   <div style={{display:"flex",width:Math.round(size*0.67),height:Math.round(size*0.20),marginTop:Math.round(size*0.015),position:"relative"}}>
    <div style={{position:"absolute",left:0,top:0,width:"51%",height:"87%",background:ivory,borderRadius:`${Math.round(size*0.025)}px ${Math.round(size*0.01)}px ${Math.round(size*0.04)}px ${Math.round(size*0.015)}px`,transform:"rotate(4deg)",borderBottom:`${Math.round(size*0.02)}px solid ${gold}`}} />
    <div style={{position:"absolute",right:0,top:0,width:"51%",height:"87%",background:ivory,borderRadius:`${Math.round(size*0.01)}px ${Math.round(size*0.025)}px ${Math.round(size*0.015)}px ${Math.round(size*0.04)}px`,transform:"rotate(-4deg)",borderBottom:`${Math.round(size*0.02)}px solid ${gold}`}} />
    <div style={{position:"absolute",left:"49.3%",top:0,width:Math.max(2,Math.round(size*0.01)),height:"92%",background:gold,borderRadius:99}} />
   </div>
   <div style={{display:"flex",fontSize:Math.round(size*0.075),fontWeight:700,letterSpacing:Math.round(size*0.014),color:ivory,lineHeight:1,marginTop:Math.round(size*0.005)}}>LA BIBLIA</div>
   <div style={{display:"flex",fontSize:Math.round(size*0.07),fontWeight:700,letterSpacing:Math.round(size*0.012),color:gold,lineHeight:1,marginTop:Math.round(size*0.018)}}>NOS HABLA</div>
   <div style={{display:"flex",fontSize:Math.round(size*0.055),fontWeight:700,letterSpacing:Math.round(size*0.008),color:gold,lineHeight:1,marginTop:Math.round(size*0.012)}}>2.0</div>
  </div>,
  {width:size,height:size}
 );
}
