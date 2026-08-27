export type StudyProgress = {completed:number[]; notes:Record<string,string>};
export function emptyStudyProgress():StudyProgress{return {completed:[],notes:{}};}
export function studyStorageKey(id:string){return `lbnh-study-v1:${id}`;}
export function parseStudyProgress(raw:string|null,total:number):StudyProgress{
  try{
    const value=JSON.parse(raw||"null");
    if(!value||typeof value!=="object")return emptyStudyProgress();
    const completed:number[]=Array.isArray(value.completed)?Array.from(new Set<number>(value.completed.filter((day:unknown)=>typeof day==="number"&&Number.isInteger(day)&&day>=1&&day<=total))):[];
    const notes:Record<string,string>={};
    if(value.notes&&typeof value.notes==="object")for(let day=1;day<=total;day++){
      if(typeof value.notes[day]==="string")notes[String(day)]=value.notes[day].slice(0,10000);
    }
    return {completed:completed.sort((a,b)=>a-b),notes};
  }catch{return emptyStudyProgress();}
}
export function nextStudyDay(progress:StudyProgress,total:number){
  for(let day=1;day<=total;day++)if(!progress.completed.includes(day))return day;
  return total;
}
export function toggleStudyDay(progress:StudyProgress,day:number):StudyProgress{
  return {...progress,completed:progress.completed.includes(day)?progress.completed.filter(item=>item!==day):[...progress.completed,day].sort((a,b)=>a-b)};
}
