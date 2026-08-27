// ASV is YouVersion Bible 12: https://www.bible.com/versions/12-asv-american-standard-version
export const ASV_BIBLE_ID = 12;
export const ASV_NAME = "American Standard Version (ASV)";

type AsvResult = {ok:true;content:string;reference:string;copyright:string}
  | {ok:false;status:number|null;reason:"unconfigured"|"denied"|"request_error"|"invalid_response"};

export async function fetchAsvPassage(code:string,chapter:number,request:typeof fetch=fetch):Promise<AsvResult> {
  const key=process.env.YOUVERSION_API_KEY;
  if(!key)return {ok:false,status:null,reason:"unconfigured"};
  if(!/^[A-Z0-9]{3}$/.test(code)||!Number.isInteger(chapter)||chapter<1||chapter>150)
    return {ok:false,status:400,reason:"invalid_response"};
  const get=(url:string)=>request(url,{
    headers:{"X-YVP-App-Key":key,Accept:"application/json"},
    signal:AbortSignal.timeout(10000),redirect:"error",next:{revalidate:3600},
  });
  try{
    const metadata=await get(`https://api.youversion.com/v1/bibles/${ASV_BIBLE_ID}`);
    if(!metadata.ok)return {ok:false,status:metadata.status,reason:[401,403].includes(metadata.status)?"denied":"request_error"};
    const bible=await metadata.json();
    if(bible?.id!==ASV_BIBLE_ID||bible?.abbreviation!=="ASV")return {ok:false,status:metadata.status,reason:"invalid_response"};
    const query=new URLSearchParams({format:"html",include_headings:"false",include_notes:"false"});
    const response=await get(`https://api.youversion.com/v1/bibles/${ASV_BIBLE_ID}/passages/${code}.${chapter}?${query}`);
    if(!response.ok)return {ok:false,status:response.status,reason:[401,403].includes(response.status)?"denied":"request_error"};
    const passage=await response.json();
    if(typeof passage?.content!=="string"||!passage.content.trim())return {ok:false,status:response.status,reason:"invalid_response"};
    return {ok:true,content:passage.content,reference:typeof passage.reference==="string"?passage.reference:`${code} ${chapter}`,copyright:typeof bible.copyright==="string"?bible.copyright:""};
  }catch{return {ok:false,status:null,reason:"request_error"};}
}
