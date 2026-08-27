import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchAsvPassage} from '../lib/youversion-asv.ts';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status});
async function withKey(run){
  const before=process.env.YOUVERSION_API_KEY;
  process.env.YOUVERSION_API_KEY='TEST-KEY';
  try{return await run();}finally{if(before===undefined)delete process.env.YOUVERSION_API_KEY;else process.env.YOUVERSION_API_KEY=before;}
}
test('only returns ASV text after confirming version identity',()=>withKey(async()=>{
  let calls=0;
  const result=await fetchAsvPassage('GEN',1,async(url,options)=>{
    calls++;assert.equal(options.headers['X-YVP-App-Key'],'TEST-KEY');
    assert.equal(options.redirect,'error');
    return calls===1 ? json({id:12,abbreviation:'ASV',copyright:'Public Domain'}) : json({content:'<p>Test ASV text</p>',reference:'Genesis 1'});
  });
  assert.equal(result.ok,true);assert.equal(result.reference,'Genesis 1');assert.equal(calls,2);
}));
test('does not substitute KJV or another translation',()=>withKey(async()=>{
  let calls=0;
  const result=await fetchAsvPassage('GEN',1,async()=>{calls++;return json({id:1,abbreviation:'KJV'})});
  assert.equal(result.ok,false);assert.equal(result.reason,'invalid_response');assert.equal(calls,1);
}));
test('permission failure stops with no retries',()=>withKey(async()=>{
  let calls=0;
  const result=await fetchAsvPassage('GEN',1,async()=>{calls++;return json({},403)});
  assert.equal(result.reason,'denied');assert.equal(result.status,403);assert.equal(calls,1);
}));
test('refuses invalid passage identifiers before making a request',()=>withKey(async()=>{
  const result=await fetchAsvPassage('../secret',1,()=>{throw Error('must not fetch')});
  assert.equal(result.reason,'invalid_response');
}));
test('does not expose exceptions or secrets',()=>withKey(async()=>{
  const result=await fetchAsvPassage('GEN',1,()=>{throw Error('TEST-KEY')});
  assert.equal(result.reason,'request_error');assert.equal(JSON.stringify(result).includes('TEST-KEY'),false);
}));
