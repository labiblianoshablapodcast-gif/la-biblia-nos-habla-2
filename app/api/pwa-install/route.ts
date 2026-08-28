import {NextResponse} from 'next/server';
import {createAdminClient} from '@/lib/supabase/admin';

function safeText(value:unknown,max=40){
  return typeof value==='string'?value.slice(0,max):'unknown';
}

export async function POST(request:Request){
  try{
    const body=await request.json();
    const installId=safeText(body?.installId,64);
    const platform=safeText(body?.platform,20);
    const source=safeText(body?.source,40);

    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(installId)){
      return NextResponse.json({ok:false,error:'invalid_install_id'},{status:400});
    }

    const allowedPlatform=['ios','android','desktop'].includes(platform)?platform:'unknown';
    const admin=createAdminClient();
    const {error}=await admin.from('pwa_installs').upsert({
      install_id:installId,
      platform:allowedPlatform,
      source,
      last_seen_at:new Date().toISOString()
    },{onConflict:'install_id',ignoreDuplicates:false});

    if(error)throw error;
    return NextResponse.json({ok:true});
  }catch(error){
    console.error('pwa-install',error);
    return NextResponse.json({ok:false},{status:500});
  }
}
