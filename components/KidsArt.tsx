import styles from "@/app/kids/kids.module.css";

export function Lumi(){return <svg viewBox="0 0 100 115" role="img" aria-label="Lumi, nuestra linterna amiga"><path d="M31 26V18C31 0 69 0 69 18V26" fill="none" stroke="#173b50" strokeWidth="7"/><path d="M25 25H75L82 88H18Z" fill="#f7c552" stroke="#173b50" strokeWidth="5"/><path d="M34 38H66L70 74H30Z" fill="#fff2b2"/><circle cx="40" cy="56" r="4" fill="#173b50"/><circle cx="60" cy="56" r="4" fill="#173b50"/><path d="M43 67Q50 74 57 67" fill="none" stroke="#173b50" strokeWidth="3" strokeLinecap="round"/><path d="M16 89H84M24 99H76M19 57L7 47M80 57L93 44" fill="none" stroke="#173b50" strokeWidth="6" strokeLinecap="round"/></svg>;}

export function KidsIcon({kind}:{kind:string}){
 const icons:Record<string,string>={sheep:"🐑",castle:"🏰",boat:"⛵",shield:"🛡️",prayer:"🙏",crown:"👑",mountain:"⛰️",quiet:"🤫",heart:"💛",sun:"☀️"};
 return <span className={styles.quizIcon} aria-hidden="true">{icons[kind]||"⭐"}</span>;
}

const sceneLabels=[
 "Lumi da la bienvenida a Estudio Kids",
 "Goliat desafía al ejército de Israel",
 "David llega al campamento y escucha el desafío de Goliat",
 "David permanece confiado en Dios frente al desafío",
 "Saúl ofrece su armadura a David",
 "David escoge cinco piedras lisas junto al arroyo",
 "David enfrenta a Goliat confiando en Dios",
 "Israel celebra la victoria y Lumi recuerda la enseñanza"
];

const sceneVideos:Record<number,string>={
 0:"/images/62E92E00-C719-4053-AFBD-3215DB7861B8.MOV",
 1:"/images/copy_B09B02F1-6C2B-47C2-9EE2-E97BC915918C.MOV",
 2:"/images/copy_8490FBBC-1509-46EA-94FD-DE64B76A949C.MOV",
 3:"/images/copy_7C5D8DAC-3D9C-412A-9A80-4843340EA89A.MOV"
};

function IllustratedScene({scene}:{scene:number}){
 return <svg className={styles.art} viewBox="0 0 800 440" role="img" aria-label={sceneLabels[scene]}>
  <rect width="800" height="440" fill={scene===5?"#d9eef4":"#d9f0f0"}/><circle cx="667" cy="77" r="40" fill="#f7ca64"/>
  <g className={styles.cloud} fill="#fff" opacity=".85"><ellipse cx="150" cy="82" rx="79" ry="20"/><ellipse cx="124" cy="65" rx="34" ry="27"/><ellipse cx="169" cy="65" rx="36" ry="22"/><ellipse cx="447" cy="114" rx="63" ry="16"/></g>
  <path d="M0 251Q166 99 328 243Q532 133 800 229V440H0Z" fill="#a6c9aa"/><path d="M0 320Q178 217 390 309Q590 225 800 307V440H0Z" fill="#779c7d"/>
  {scene===5&&<><path d="M800 291Q620 319 506 440H263Q524 300 800 265Z" fill="#8ccee2"/>{[0,1,2,3,4].map(i=><ellipse key={i} cx={380+i*37} cy={386+(i%2)*15} rx="14" ry="10" fill="#e6ddc8" stroke="#697c78" strokeWidth="2"/>)}</>}
  {(scene===4||scene===6)&&<g transform="translate(600 162)"><path d="M-50 124L0 48L53 124Z" fill="#cda86e"/><path d="M-8 124V77L13 124Z" fill="#6a654e"/><g transform="translate(87 -32)"><circle cy="30" r="17" fill="#b8805d"/><path d="M-23 48H23L33 121H-33Z" fill="#768296"/><path d="M-16 119V153M16 119V153M-24 66L-43 105" stroke="#3c5263" strokeWidth="12" strokeLinecap="round"/><ellipse cx="30" cy="89" rx="20" ry="30" fill="#b69c69" stroke="#746d52" strokeWidth="4"/></g></g>}
  <g className={styles.david} transform={`translate(${scene===5?235:scene===7?480:310} 161)`}>
   <path d="M-30 160L-36 212M29 160L36 212" stroke="#ad7759" strokeWidth="19" strokeLinecap="round"/><path d="M-48 215H-19M20 215H50" stroke="#4f453c" strokeWidth="12" strokeLinecap="round"/>
   <path d="M-38 75Q0 54 38 75L52 172H-52Z" fill="#e4a14e" stroke="#8d643d" strokeWidth="3"/><path d="M-38 115H41" stroke="#775847" strokeWidth="9"/>
   <path d="M-37 81L-64 134M38 81L65 109" stroke="#c89069" strokeWidth="16" strokeLinecap="round"/><circle cy="38" r="36" fill="#d69b73"/>
   <path d="M-35 32Q-48 -12 6 -1Q47 0 38 38L23 18Q-6 26 -35 32" fill="#5f4336"/><circle cx="-12" cy="40" r="3.7" fill="#342e2b"/><circle cx="13" cy="40" r="3.7" fill="#342e2b"/><path d="M-10 55Q1 65 13 55" fill="none" stroke="#7c4439" strokeWidth="3" strokeLinecap="round"/>
   <path d="M69 207L80 24Q84 1 66 6" fill="none" stroke="#806243" strokeWidth="7" strokeLinecap="round"/><path d="M-25 124Q-43 141 -22 154Q-5 137 -25 124" fill="#8c6141"/>
  </g>
  {scene===7&&<g fill="#f5c65d">{[0,1,2,3,4].map(i=><path key={i} transform={`translate(${130+i*133} ${100+(i%2)*36})`} d="M0 -15L5 -5L16 -3L7 5L9 16L0 10L-9 16L-7 5L-16 -3L-5 -5Z"/>)}</g>}
  <g transform="translate(50 309) scale(.72)"><path d="M31 26V18C31 0 69 0 69 18V26" fill="none" stroke="#173b50" strokeWidth="7"/><path d="M25 25H75L82 88H18Z" fill="#f7c552" stroke="#173b50" strokeWidth="5"/><circle cx="40" cy="53" r="4" fill="#173b50"/><circle cx="60" cy="53" r="4" fill="#173b50"/><path d="M41 66Q50 77 59 66M16 89H84" fill="none" stroke="#173b50" strokeWidth="4" strokeLinecap="round"/></g>
 </svg>;
}

export default function KidsArt({scene=0}:{scene?:number}){
 const video=sceneVideos[scene];
 if(video)return <video className={styles.art} src={video} autoPlay controls loop playsInline preload="metadata" aria-label={sceneLabels[scene]}/>;
 return <IllustratedScene scene={Math.min(7,Math.max(4,scene))}/>;
}
