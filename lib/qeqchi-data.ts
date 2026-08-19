import MAT from "@/data/qeqchi/MAT.json";
import MAR from "@/data/qeqchi/MAR.json";
import LUK from "@/data/qeqchi/LUK.json";
import JOH from "@/data/qeqchi/JOH.json";
import ACT from "@/data/qeqchi/ACT.json";
import ROM from "@/data/qeqchi/ROM.json";
import C1 from "@/data/qeqchi/1CO.json";
import C2 from "@/data/qeqchi/2CO.json";
import GAL from "@/data/qeqchi/GAL.json";
import EPH from "@/data/qeqchi/EPH.json";
import PHI from "@/data/qeqchi/PHI.json";
import COL from "@/data/qeqchi/COL.json";
import T1 from "@/data/qeqchi/1TH.json";
import T2 from "@/data/qeqchi/2TH.json";
import TI1 from "@/data/qeqchi/1TI.json";
import TI2 from "@/data/qeqchi/2TI.json";
import TIT from "@/data/qeqchi/TIT.json";
import PHM from "@/data/qeqchi/PHM.json";
import HEB from "@/data/qeqchi/HEB.json";
import JAM from "@/data/qeqchi/JAM.json";
import PE1 from "@/data/qeqchi/1PE.json";
import PE2 from "@/data/qeqchi/2PE.json";
import JO1 from "@/data/qeqchi/1JO.json";
import JO2 from "@/data/qeqchi/2JO.json";
import JO3 from "@/data/qeqchi/3JO.json";
import JUD from "@/data/qeqchi/JUD.json";
import REV from "@/data/qeqchi/REV.json";

type RawVerse=[number,string];
type RawBook=Record<string,RawVerse[]>;

const QEQCHI_DATA:Record<string,RawBook>={
  MAT,MAR,LUK,JOH,ACT,ROM,"1CO":C1,"2CO":C2,GAL,EPH,PHI,COL,
  "1TH":T1,"2TH":T2,"1TI":TI1,"2TI":TI2,TIT,PHM,HEB,JAM,
  "1PE":PE1,"2PE":PE2,"1JO":JO1,"2JO":JO2,"3JO":JO3,JUD,REV
};

const CODE_MAP:Record<string,string>={
  MRK:"MAR",JHN:"JOH",PHP:"PHI",JAS:"JAM",
  "1JN":"1JO","2JN":"2JO","3JN":"3JO"
};

export function getLocalQeqchiVerses(code:string,chapter:number){
  const sourceCode=CODE_MAP[code]??code;
  return QEQCHI_DATA[sourceCode]?.[String(chapter)]??[];
}
