export function getYouTubeId(url:string){
  try{
    const parsed=new URL(url);
    if(parsed.hostname==="youtu.be"){
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if(parsed.hostname.includes("youtube.com")){
      if(parsed.pathname.startsWith("/shorts/")){
        return parsed.pathname.split("/")[2] || null;
      }
      if(parsed.pathname.startsWith("/embed/")){
        return parsed.pathname.split("/")[2] || null;
      }
      return parsed.searchParams.get("v");
    }
  }catch{
    return null;
  }
  return null;
}

export function getYouTubeThumbnail(url:string){
  const id=getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
