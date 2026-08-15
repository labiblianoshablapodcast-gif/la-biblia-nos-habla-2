import {NextResponse,type NextRequest} from "next/server";
import {createServerClient} from "@supabase/ssr";

const staffRoles=["pastor","secretary","treasurer","media"];

export async function middleware(request:NextRequest){
  let response=NextResponse.next({request});

  const supabase=createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies:{
        getAll(){return request.cookies.getAll();},
        setAll(cookiesToSet:any[]){
          cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));
          response=NextResponse.next({request});
          cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options));
        }
      }
    }
  );

  const {data:{user}}=await supabase.auth.getUser();

  if(request.nextUrl.pathname.startsWith("/admin")){
    if(!user){
      const url=request.nextUrl.clone();
      url.pathname="/login";
      url.searchParams.set("next",request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
    if(!profile||!staffRoles.includes(profile.role)){
      const url=request.nextUrl.clone();
      url.pathname="/";
      url.search="";
      return NextResponse.redirect(url);
    }
  }

  if(request.nextUrl.pathname==="/login"&&user){
    const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
    const url=request.nextUrl.clone();
    url.pathname=profile&&staffRoles.includes(profile.role)?"/admin":"/";
    url.search="";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config={matcher:["/admin/:path*","/login"]};
