import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {validKidsSubmission} from '../lib/kids.ts';
const require=createRequire(import.meta.url),ts=require('typescript');
const source=readFileSync(new URL('../app/api/kids/progreso/route.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function harness({user={id:'parent-a'},ready=true}={}){
 const calls=[];
 const query={select(){return this;},eq(...args){calls.push(['eq',...args]);return this;},order(){return Promise.resolve({data:[],error:null});},delete(){calls.push(['delete']);return this;},upsert(value,options){calls.push(['upsert',value,options]);return Promise.resolve({error:null});},then(resolve){return Promise.resolve({error:null}).then(resolve);}};
 const client={auth:{getUser:async()=>({data:{user},error:null})},rpc:async()=>({data:ready,error:null}),from:table=>{calls.push(['table',table]);return query;}};
 const out={};
 const imports=name=>name==='next/server'?{NextResponse:{json:(body,options={})=>({body,status:options.status||200,headers:options.headers})}}:name==='@/lib/kids'?{validKidsSubmission}:{createClient:async()=>client};
 new Function('require','exports','process',js)(imports,out,{env:{NEXT_PUBLIC_SUPABASE_URL:'test',NEXT_PUBLIC_SUPABASE_ANON_KEY:'test'}});
 return {api:out,calls};
}
const payload={lesson:'david-y-goliat',age:'4-6',slot:1,answers:[0,1,2],adultConsent:true};
function request(method,body,origin='https://our-app.test'){
 return new Request('https://our-app.test/api/kids/progreso',{method,headers:{origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
}
test('unauthenticated reads and writes are rejected before touching rows',async()=>{
 for(const method of ['GET','POST','DELETE']){
  const {api,calls}=harness({user:null});
  const result=await api[method](request(method,method==='POST'?payload:undefined));
  assert.equal(result.status,401);assert.equal(calls.length,0);
 }
});
test('POST derives owner and grade server-side, not from submitted fields',async()=>{
 const {api,calls}=harness();
 const result=await api.POST(request('POST',{...payload,parent_id:'parent-b',score:100}));
 assert.equal(result.status,200);assert.equal(result.body.score,3);
 const saved=calls.find(call=>call[0]==='upsert')[1];
 assert.equal(saved.parent_id,'parent-a');assert.equal(saved.score,3);assert.equal(saved.answers,undefined);
});
test('GET and DELETE are explicitly scoped to authenticated owner',async()=>{
 for(const method of ['GET','DELETE']){
  const {api,calls}=harness();await api[method](request(method));
  assert.ok(calls.some(call=>call[0]==='eq'&&call[1]==='parent_id'&&call[2]==='parent-a'));
 }
});
test('cross-origin writes and malformed submissions never touch the database',async()=>{
 for(const method of ['POST','DELETE']){
  const {api,calls}=harness();const result=await api[method](request(method,method==='POST'?payload:undefined,'https://other.test'));
  assert.equal(result.status,403);assert.equal(calls.length,0);
 }
 const {api,calls}=harness();assert.equal((await api.POST(request('POST',{...payload,adultConsent:false}))).status,400);assert.equal(calls.length,0);
});
test('setup missing fails closed and public readiness reveals only a boolean',async()=>{
 const {api,calls}=harness({ready:false});
 const status=await api.GET(new Request('https://our-app.test/api/kids/progreso?estado=1'));
 assert.deepEqual(status.body,{ready:false});assert.equal(status.headers['Cache-Control'],'private, no-store');
 assert.equal((await api.POST(request('POST',payload))).status,503);assert.equal(calls.length,0);
});
