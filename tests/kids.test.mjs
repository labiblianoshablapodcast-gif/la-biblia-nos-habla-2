import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {kidsAge,learnerSlot,kidsLesson,kidsQuestions,gradeKidsQuiz,validKidsSubmission} from '../lib/kids.ts';
const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('two age groups have distinct questions and six readable scenes',()=>{
 assert.equal(kidsAge('7-10'),'7-10');assert.equal(kidsAge('anything'),'4-6');
 assert.equal(learnerSlot('3'),3);assert.equal(learnerSlot('999'),1);
 assert.equal(kidsLesson.scenes.length,6);
 assert.ok(kidsLesson.scenes.every(scene=>scene.young&&scene.older&&scene.title));
 assert.notDeepEqual(kidsQuestions['4-6'],kidsQuestions['7-10']);
});
test('quiz grading is deterministic and rejects incomplete or forged answers',()=>{
 for(const age of ['4-6','7-10']){
  assert.equal(gradeKidsQuiz(age,[0,1,2]),3);assert.equal(gradeKidsQuiz(age,[1,1,1]),1);
  for(const invalid of [null,{},[],[-1,1,2],[0,1,3],['0',1,2],[0,1,2,0],[NaN,1,2]])assert.equal(gradeKidsQuiz(age,invalid),null);
 }
});
test('server derives score and permits only minimal, consented data',()=>{
 const good={lesson:'david-y-goliat',age:'4-6',slot:1,answers:[0,1,2],adultConsent:true,score:99,parent_id:'forged',name:'ignored'};
 const result=validKidsSubmission(good);
 assert.equal(result.score,3);assert.equal(result.parent_id,undefined);assert.equal(result.name,undefined);assert.equal(result.answers,undefined);
 for(const update of [{adultConsent:false},{age:'adult'},{slot:0},{slot:4},{slot:'1'},{lesson:'other'},{answers:[0]}])assert.equal(validKidsSubmission({...good,...update}),null);
});
test('private route authenticates, scopes ownership, checks origin and avoids caching',()=>{
 const route=file('app/api/kids/progreso/route.ts');
 assert.ok(route.includes('client.auth.getUser()'));
 assert.ok(route.includes('.eq("parent_id",user.id)'));
 assert.ok(route.includes('parent_id:user.id'));
 assert.ok(route.includes('"Cache-Control":"private, no-store"'));
 assert.equal((route.match(/request.headers.get\("origin"\)/g)||[]).length,2);
 assert.ok(!route.includes('createAdminClient'));
 assert.ok(!route.includes('console.log'));
});
test('migration denies anonymous grants and scopes all CRUD policies to owner',()=>{
 const sql=file('ACTIVAR_ESTUDIO_KIDS.sql');
 assert.ok(sql.includes('enable row level security'));
 assert.ok(sql.includes('force row level security'));
 assert.ok(sql.includes('revoke all on public.kids_progress from public,anon,authenticated'));
 for(const action of ['select','insert','update','delete'])assert.ok(sql.includes(`for ${action} to authenticated`));
 assert.equal((sql.match(/auth.uid\(\)\) = parent_id/g)||[]).length,5);
 assert.ok(!sql.includes('grant all'));
 assert.ok(!sql.includes('alter table public.profiles'));
});
test('worksheets are two real PDFs with separate payloads',()=>{
 const sheets=JSON.parse(file('data/kids-sheets.json'));
 for(const age of ['4-6','7-10'])assert.ok(Buffer.from(sheets[age],'base64').subarray(0,8).toString().startsWith('%PDF-'));
 assert.notEqual(sheets['4-6'],sheets['7-10']);
 assert.ok(file('app/api/kids/hoja/route.ts').includes('application/pdf'));
});
test('no external media, no microphone, reduced motion and setup gate are present',()=>{
 const lesson=file('components/KidsLesson.tsx'),parents=file('components/KidsParents.tsx');
 assert.ok(!lesson.includes('youtube.com'));assert.ok(!lesson.includes('getUserMedia'));assert.ok(!lesson.includes('<iframe'));
 assert.ok(file('app/kids/kids.module.css').includes('prefers-reduced-motion:reduce'));
 assert.ok(parents.includes('if(!ready)return'));
 assert.ok(parents.includes('No se ha guardado ningún resultado'));
 assert.ok(lesson.includes('adultConsent:consent'));
});
