// Server-side diagnostic only. Never return credentials, provider error bodies,
// or copyrighted passage content from these checks.
type Provider = "api-bible" | "youversion";
type Bible = {id?:string|number;abbreviation?:string;abbreviationLocal?:string;name?:string;title?:string};
type State = "unconfigured" | "available" | "not_in_catalog" | "denied" | "request_error" | "invalid_response" | "incomplete_catalog";
type Result = {
  provider:Provider;configured:boolean;state:State;
  catalogStatus:number|null;passageStatus:number|null;textReadable:boolean|null;
  bible?:{id:string;abbreviation:string;name:string};
};

export function isNkjv(bible:Bible):boolean {
  return [bible.abbreviation,bible.abbreviationLocal].some(value=>typeof value === "string" && value.trim().toUpperCase() === "NKJV")
    || [bible.name,bible.title].some(value=>typeof value === "string" && /^New King James Version(?:\s*\(NKJV\))?$/i.test(value.trim()));
}

export function youVersionCatalogUrl(language:"en"|"es",pageToken?:string):string {
  const query = new URLSearchParams({"language_ranges[]":language,all_available:"false",page_size:"99"});
  if (pageToken) query.set("page_token",pageToken);
  return `https://api.youversion.com/v1/bibles?${query}`;
}

export async function checkNkjvAccess(provider:Provider,key:string|undefined,request:typeof fetch=fetch):Promise<Result> {
  const result:Result = {provider,configured:!!key,state:"unconfigured",catalogStatus:null,passageStatus:null,textReadable:null};
  if (!key) return result;
  const headers:Record<string,string> = provider === "youversion"
    ? {"X-YVP-App-Key":key,Accept:"application/json"}
    : {"api-key":key,Accept:"application/json"};
  const get = (url:string)=>request(url,{
    headers,signal:AbortSignal.timeout(10000),redirect:"error",next:{revalidate:3600},
  });
  let nextPage:string|undefined;
  const seen = new Set<string>();
  let found:Bible|undefined;
  try {
    // Only query versions licensed to the existing app, never all_available=true.
    for (let page=0;page<10;page++) {
      const url = provider === "youversion" ? youVersionCatalogUrl("en",nextPage)
        : "https://rest.api.bible/v1/bibles?language=eng";
      const response = await get(url);
      result.catalogStatus=response.status;
      if (!response.ok) return {...result,state:response.status === 401 || response.status === 403 ? "denied" : "request_error"};
      const payload = await response.json();
      if (!Array.isArray(payload?.data)) return {...result,state:"invalid_response"};
      found = payload.data.find((bible:Bible|null)=>bible && (typeof bible.id === "string" || typeof bible.id === "number") && isNkjv(bible));
      if (found) break;
      nextPage = provider === "youversion" && typeof payload.next_page_token === "string" && payload.next_page_token
        ? payload.next_page_token : undefined;
      if (!nextPage) return {...result,state:"not_in_catalog",textReadable:false};
      if (seen.has(nextPage)) return {...result,state:"incomplete_catalog"};
      seen.add(nextPage);
    }
    if (!found) return {...result,state:"incomplete_catalog"};
    result.bible = {id:String(found.id),abbreviation:"NKJV",name:"New King James Version"};
    const id = encodeURIComponent(String(found.id));
    const passageUrl = provider === "youversion"
      ? `https://api.youversion.com/v1/bibles/${id}/passages/JHN.3.16?format=text&include_headings=false&include_notes=false`
      : `https://rest.api.bible/v1/bibles/${id}/verses/JHN.3.16?content-type=text&include-notes=false&include-titles=false`;
    const passage = await get(passageUrl);
    result.passageStatus = passage.status;
    if (!passage.ok) return {...result,state:passage.status === 401 || passage.status === 403 ? "denied" : "request_error",textReadable:false};
    const payload = await passage.json();
    const content = provider === "youversion" ? payload?.content : payload?.data?.content;
    if (typeof content !== "string" || !content.trim()) return {...result,state:"invalid_response"};
    return {...result,state:"available",textReadable:true};
  } catch {
    // No raw exception messages: they can include headers, URLs or provider data.
    return {...result,state:"request_error"};
  }
}
