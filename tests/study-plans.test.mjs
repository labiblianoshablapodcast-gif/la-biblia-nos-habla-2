import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {studyPlans,getStudyPlan,getStudyDay,readingStudyContext,studyReadingUrl,studyDayUrl} from '../lib/study-plans.ts';
import {emptyStudyProgress,parseStudyProgress,nextStudyDay,toggleStudyDay,studyStorageKey} from '../lib/study-progress.ts';

test('plans cover every chapter exactly once, with original guidance',()=>{
  for(const [id,total,days] of [['juan',21,21],['romanos',16,8],['hebreos',13,7]]){
    const plan=getStudyPlan(id);
    assert.equal(plan.days.length,days);
    assert.deepEqual(plan.days.flatMap(day=>day.chapters),Array.from({length:total},(_,i)=>i+1));
    assert.ok(plan.days.every(day=>day.title&&day.reflection&&day.question));
  }
});
test('all reading and return URLs stay internal and retain the selected version',()=>{
  for(const plan of studyPlans)for(let day=1;day<=plan.days.length;day++)for(const version of ['rvr60','qeqchi','asv']){
    const back=new URL(studyDayUrl(plan,day,version),'https://our-app.test');
    assert.equal(back.origin,'https://our-app.test');
    for(const chapter of plan.days[day-1].chapters){
      const url=new URL(studyReadingUrl(plan,day,chapter,version),'https://our-app.test');
      assert.equal(url.origin,back.origin);
      assert.equal(url.searchParams.get('version')||'rvr60',version);
      assert.equal(back.searchParams.get('version')||'rvr60',version);
      assert.equal(readingStudyContext(url.searchParams.get('plan'),url.searchParams.get('day'),plan.id,chapter)?.day,day);
    }
  }
});
test('forged or unrelated study contexts do not become links or redirects',()=>{
  for(const args of [['https://evil.test','1','juan',1],['juan','0','juan',1],['juan','22','juan',21],['juan','1','romanos',1],['hebreos','1','hebreos',3],['juan',['1'],'juan',1]])assert.equal(readingStudyContext(...args),null);
  for(const day of [0,-1,22,1.5,NaN])assert.equal(getStudyDay(getStudyPlan('juan'),day),undefined);
});
test('completion and notes round-trip, unmarking is reversible, plans are isolated',()=>{
  let saved=emptyStudyProgress();
  saved=toggleStudyDay(saved,1);
  saved={...saved,notes:{1:'Prueba de reflexión'}};
  const restored=parseStudyProgress(JSON.stringify(saved),8);
  assert.deepEqual(restored,saved);
  assert.equal(nextStudyDay(restored,8),2);
  assert.equal(nextStudyDay(toggleStudyDay(restored,1),8),1);
  assert.equal(new Set(studyPlans.map(plan=>studyStorageKey(plan.id))).size,3);
  assert.equal(nextStudyDay({completed:[1,2],notes:{}},2),2);
});
test('corrupt, duplicate and out-of-range progress is safely normalized',()=>{
  for(const raw of [null,'bad','null','[]'])assert.deepEqual(parseStudyProgress(raw,7),emptyStudyProgress());
  assert.deepEqual(parseStudyProgress(JSON.stringify({completed:[3,1,3,'2',null,-1,0,8,1.5],notes:{1:'ok',2:42,8:'bad','__proto__':'bad'}}),7),{completed:[1,3],notes:{1:'ok'}});
  assert.equal(parseStudyProgress(JSON.stringify({notes:{1:'a'.repeat(20000)}}),7).notes[1].length,10000);
});
test('Bible is reading-only and studies preserve existing John storage and questions',()=>{
  const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
  const home=file('app/biblia/page.tsx'),reader=file('app/biblia/[book]/[chapter]/page.tsx');
  assert.ok(!home.includes('styles.studyPlan'));
  assert.ok(!reader.includes('JohnChapterQuestions'));
  assert.ok(!reader.includes('stepbible.org'));
  assert.ok(!reader.includes('Abrir fuente original'));
  assert.ok(reader.includes('<StudyReadingNav'));
  assert.ok(file('app/estudios/[plan]/[day]/page.tsx').includes('<JohnChapterQuestions'));
  assert.ok(file('components/JohnChapterQuestions.tsx').includes('`john-study-${chapter}`'));
  assert.ok(file('components/JohnChapterQuestions.tsx').includes('/estudios/juan/'));
  assert.ok(file('components/Header.tsx').includes('href="/estudios"'));
  assert.ok(file('components/MobileHeader.tsx').includes('["Estudios bíblicos","/estudios"]'));
});
