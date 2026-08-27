import test from 'node:test';
import assert from 'node:assert/strict';
import {checkNkjvAccess,isNkjv,youVersionCatalogUrl} from '../lib/nkjv-access.ts';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status});
const nkjv={id:114,abbreviation:'NKJV',title:'New King James Version'};

test('does not confuse KJV, KJV1900 or another New King version with NKJV',()=>{
  assert.equal(isNkjv(nkjv),true);
  assert.equal(isNkjv({abbreviation:'KJV',name:'King James Version'}),false);
  assert.equal(isNkjv({abbreviation:'KJV1900'}),false);
  assert.equal(isNkjv({name:'New King James Version commentary'}),false);
});
test('uses bracket notation and the licensed-only YouVersion catalog',()=>{
  const url=new URL(youVersionCatalogUrl('en','next token'));
  assert.equal(url.searchParams.get('language_ranges[]'),'en');
  assert.equal(url.searchParams.has('language_ranges'),false);
  assert.equal(url.searchParams.get('all_available'),'false');
  assert.equal(url.searchParams.get('page_token'),'next token');
});
test('does not call upstream without a configured key',async()=>{
  const result=await checkNkjvAccess('api-bible',undefined,()=>{throw Error('must not fetch')});
  assert.equal(result.state,'unconfigured');assert.equal(result.textReadable,null);
});
test('YouVersion verifies text after pagination and never returns content or key',async()=>{
  const calls=[];
  const result=await checkNkjvAccess('youversion','TEST-PRIVATE',async(url,options)=>{
    calls.push(url);
    assert.equal(options.headers['X-YVP-App-Key'],'TEST-PRIVATE');
    assert.equal(options.next.revalidate,3600);
    if(calls.length===1)return json({data:[],next_page_token:'p2'});
    if(calls.length===2)return json({data:[nkjv]});
    return json({content:'TEST-PASSAGE'});
  });
  assert.equal(result.state,'available');assert.equal(result.textReadable,true);
  assert.equal(calls.length,3);assert.match(calls[1],/page_token=p2/);
  assert.equal(JSON.stringify(result).includes('TEST-'),false);
});
test('API.Bible verifies its nested passage format',async()=>{
  const urls=[];
  const result=await checkNkjvAccess('api-bible','key',async url=>{
    urls.push(url);return urls.length===1 ? json({data:[{id:'nkjv-id',abbreviation:'NKJV'}]}) : json({data:{content:'TEST'}});
  });
  assert.equal(result.state,'available');assert.match(urls[0],/language=eng/);
  assert.match(urls[1],/nkjv-id\/verses\/JHN.3.16/);
});
test('catalog denial stops immediately without retries or passage probes',async()=>{
  let calls=0;
  const result=await checkNkjvAccess('api-bible','key',async()=>{calls++;return json({error:'private info'},403)});
  assert.equal(result.state,'denied');assert.equal(result.textReadable,null);assert.equal(calls,1);
  assert.equal(JSON.stringify(result).includes('private'),false);
});
test('being listed does not guarantee passage permission',async()=>{
  let calls=0;
  const result=await checkNkjvAccess('youversion','key',async()=>++calls===1 ? json({data:[nkjv]}) : json({},403));
  assert.equal(result.state,'denied');assert.equal(result.textReadable,false);assert.equal(result.passageStatus,403);
});
test('empty authorized catalog is distinct from errors',async()=>{
  assert.equal((await checkNkjvAccess('api-bible','key',async()=>json({data:[]}))).state,'not_in_catalog');
  assert.equal((await checkNkjvAccess('api-bible','key',async()=>json({},422))).state,'request_error');
  assert.equal((await checkNkjvAccess('api-bible','key',async()=>json({}))).state,'invalid_response');
});
test('invalid passage payload cannot report available',async()=>{
  let calls=0;
  const result=await checkNkjvAccess('youversion','key',async()=>++calls===1 ? json({data:[nkjv]}) : json({content:''}));
  assert.equal(result.state,'invalid_response');assert.equal(result.textReadable,null);
});
test('network errors are sanitized and never expose credential values',async()=>{
  const result=await checkNkjvAccess('api-bible','secret',async()=>{throw Error('secret')});
  assert.equal(result.state,'request_error');assert.equal(JSON.stringify(result).includes('secret'),false);
});
test('pagination loop reports incomplete, not missing permission',async()=>{
  const result=await checkNkjvAccess('youversion','key',async()=>json({data:[],next_page_token:'same'}));
  assert.equal(result.state,'incomplete_catalog');assert.equal(result.textReadable,null);
});
