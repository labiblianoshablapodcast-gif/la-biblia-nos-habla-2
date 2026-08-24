import B01 from "@/data/qeqchi/GEN.json";
import B02 from "@/data/qeqchi/EXO.json";
import B03 from "@/data/qeqchi/LEV.json";
import B04 from "@/data/qeqchi/NUM.json";
import B05 from "@/data/qeqchi/DEU.json";
import B06 from "@/data/qeqchi/JOS.json";
import B07 from "@/data/qeqchi/JDG.json";
import B08 from "@/data/qeqchi/RUT.json";
import B09 from "@/data/qeqchi/1SA.json";
import B10 from "@/data/qeqchi/2SA.json";
import B11 from "@/data/qeqchi/1KI.json";
import B12 from "@/data/qeqchi/2KI.json";
import B13 from "@/data/qeqchi/1CH.json";
import B14 from "@/data/qeqchi/2CH.json";
import B15 from "@/data/qeqchi/EZR.json";
import B16 from "@/data/qeqchi/NEH.json";
import B17 from "@/data/qeqchi/EST.json";
import B18 from "@/data/qeqchi/JOB.json";
import B19 from "@/data/qeqchi/PSA.json";
import B20 from "@/data/qeqchi/PRO.json";
import B21 from "@/data/qeqchi/ECC.json";
import B22 from "@/data/qeqchi/SNG.json";
import B23 from "@/data/qeqchi/ISA.json";
import B24 from "@/data/qeqchi/JER.json";
import B25 from "@/data/qeqchi/LAM.json";
import B26 from "@/data/qeqchi/EZK.json";
import B27 from "@/data/qeqchi/DAN.json";
import B28 from "@/data/qeqchi/HOS.json";
import B29 from "@/data/qeqchi/JOL.json";
import B30 from "@/data/qeqchi/AMO.json";
import B31 from "@/data/qeqchi/OBA.json";
import B32 from "@/data/qeqchi/JON.json";
import B33 from "@/data/qeqchi/MIC.json";
import B34 from "@/data/qeqchi/NAM.json";
import B35 from "@/data/qeqchi/HAB.json";
import B36 from "@/data/qeqchi/ZEP.json";
import B37 from "@/data/qeqchi/HAG.json";
import B38 from "@/data/qeqchi/ZEC.json";
import B39 from "@/data/qeqchi/MAL.json";
import B40 from "@/data/qeqchi/MAT.json";
import B41 from "@/data/qeqchi/MRK.json";
import B42 from "@/data/qeqchi/LUK.json";
import B43 from "@/data/qeqchi/JHN.json";
import B44 from "@/data/qeqchi/ACT.json";
import B45 from "@/data/qeqchi/ROM.json";
import B46 from "@/data/qeqchi/1CO.json";
import B47 from "@/data/qeqchi/2CO.json";
import B48 from "@/data/qeqchi/GAL.json";
import B49 from "@/data/qeqchi/EPH.json";
import B50 from "@/data/qeqchi/PHP.json";
import B51 from "@/data/qeqchi/COL.json";
import B52 from "@/data/qeqchi/1TH.json";
import B53 from "@/data/qeqchi/2TH.json";
import B54 from "@/data/qeqchi/1TI.json";
import B55 from "@/data/qeqchi/2TI.json";
import B56 from "@/data/qeqchi/TIT.json";
import B57 from "@/data/qeqchi/PHM.json";
import B58 from "@/data/qeqchi/HEB.json";
import B59 from "@/data/qeqchi/JAS.json";
import B60 from "@/data/qeqchi/1PE.json";
import B61 from "@/data/qeqchi/2PE.json";
import B62 from "@/data/qeqchi/1JN.json";
import B63 from "@/data/qeqchi/2JN.json";
import B64 from "@/data/qeqchi/3JN.json";
import B65 from "@/data/qeqchi/JUD.json";
import B66 from "@/data/qeqchi/REV.json";

type RawVerse=(number|string)[];
type RawBook=Record<string,RawVerse[]>;

const QEQCHI_DATA:Record<string,RawBook>={
  "GEN":B01,
  "EXO":B02,
  "LEV":B03,
  "NUM":B04,
  "DEU":B05,
  "JOS":B06,
  "JDG":B07,
  "RUT":B08,
  "1SA":B09,
  "2SA":B10,
  "1KI":B11,
  "2KI":B12,
  "1CH":B13,
  "2CH":B14,
  "EZR":B15,
  "NEH":B16,
  "EST":B17,
  "JOB":B18,
  "PSA":B19,
  "PRO":B20,
  "ECC":B21,
  "SNG":B22,
  "ISA":B23,
  "JER":B24,
  "LAM":B25,
  "EZK":B26,
  "DAN":B27,
  "HOS":B28,
  "JOL":B29,
  "AMO":B30,
  "OBA":B31,
  "JON":B32,
  "MIC":B33,
  "NAM":B34,
  "HAB":B35,
  "ZEP":B36,
  "HAG":B37,
  "ZEC":B38,
  "MAL":B39,
  "MAT":B40,
  "MRK":B41,
  "LUK":B42,
  "JHN":B43,
  "ACT":B44,
  "ROM":B45,
  "1CO":B46,
  "2CO":B47,
  "GAL":B48,
  "EPH":B49,
  "PHP":B50,
  "COL":B51,
  "1TH":B52,
  "2TH":B53,
  "1TI":B54,
  "2TI":B55,
  "TIT":B56,
  "PHM":B57,
  "HEB":B58,
  "JAS":B59,
  "1PE":B60,
  "2PE":B61,
  "1JN":B62,
  "2JN":B63,
  "3JN":B64,
  "JUD":B65,
  "REV":B66
};

export function getLocalQeqchiVerses(code:string,chapter:number){
  return QEQCHI_DATA[code]?.[String(chapter)]??[];
}

export function hasLocalQeqchiBook(code:string){
  return Boolean(QEQCHI_DATA[code]);
}
