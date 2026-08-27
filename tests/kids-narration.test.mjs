import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {kidsQuestions,kidsLesson,gradeKidsQuiz} from '../lib/kids.ts';
import {kidsQuestionScenes,questionNarration,createKidsNarrator} from '../lib/kids-narration.ts';
const file=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
function fixture(){
 const utterances=[],states=[];let errors=0,cancels=0;
 const engine={cancel(){cancels++;utterances.at(-1)?.onerror?.();},speak(utterance){utterances.push(utterance);}};
 const narrator=createKidsNarrator(engine,text=>({text}),value=>states.push(value),()=>errors++);
 return {narrator,utterances,states,engine,get errors(){return errors;},get cancels(){return cancels;}};
}
test('each age-specific question links to the relevant scene, with unchanged answers',()=>{
 assert.deepEqual(kidsQuestionScenes['4-6'],[0,3,5]);
 assert.deepEqual(kidsQuestionScenes['7-10'],[2,3,5]);
 for(const age of ['4-6','7-10']){
  assert.equal(kidsQuestions[age].length,kidsQuestionScenes[age].length);
  for(const scene of kidsQuestionScenes[age])assert.ok(kidsLesson.scenes[scene].young&&kidsLesson.scenes[scene].older);
  assert.equal(gradeKidsQuiz(age,[0,1,2]),3);
 }
});
test('question audio says its number and all labeled options, but not the answer explanation',()=>{
 for(const age of ['4-6','7-10'])for(const [index,question] of kidsQuestions[age].entries()){
  const text=questionNarration(question,index);
  assert.ok(text.startsWith(`Pregunta ${index+1}. ${question.prompt}`));
  question.options.forEach((option,i)=>assert.ok(text.includes(`Opción ${String.fromCharCode(65+i)}: ${option.text}.`)));
  assert.ok(!text.includes(question.explanation));
 }
});
test('starting another audio cancels the old one; late events cannot clear the new highlight',()=>{
 const f=fixture();f.narrator.toggle('q1','one',.8);const first=f.utterances[0];
 assert.equal(first.lang,'es');assert.equal(first.rate,.8);assert.equal(f.states.at(-1),'q1');
 f.narrator.toggle('context2','two',.9);const second=f.utterances[1];
 first.onend();first.onerror();assert.equal(f.states.at(-1),'context2');assert.equal(f.errors,0);
 assert.equal(second.rate,.9);second.onend();assert.equal(f.states.at(-1),null);assert.equal(f.cancels,2);
});
test('same button toggles off and explicit stop invalidates pending callbacks',()=>{
 const f=fixture();f.narrator.toggle('q1','one',.8);f.narrator.toggle('q1','one',.8);
 assert.equal(f.utterances.length,1);assert.equal(f.states.at(-1),null);assert.equal(f.errors,0);
 f.narrator.toggle('q2','two',.9);f.narrator.stop();f.utterances[1].onend();f.utterances[1].onerror();
 assert.equal(f.states.at(-1),null);assert.equal(f.errors,0);
});
test('a playback error resets the current highlight and permits retry',()=>{
 const f=fixture();f.narrator.toggle('q1','one',.8);f.utterances[0].onerror();
 assert.equal(f.states.at(-1),null);assert.equal(f.errors,1);
 f.narrator.toggle('q1','one',.8);assert.equal(f.utterances.length,2);assert.equal(f.states.at(-1),'q1');
});
test('synchronous speech engine errors produce the readable fallback',()=>{
 const f=fixture();f.engine.speak=()=>{throw Error('device unavailable');};
 f.narrator.toggle('q1','one',.8);assert.equal(f.states.at(-1),null);assert.equal(f.errors,1);
});
test('quiz controls are inside their fieldsets and identify question, scene and active state',()=>{
 const component=file('components/KidsLesson.tsx');
 assert.ok(component.includes('aria-describedby={`kids-related-${index}`}'));
 assert.ok(component.includes('aria-pressed={activeAudio===questionKey}'));
 assert.ok(component.includes('aria-pressed={activeAudio===storyKey}'));
 assert.ok(component.includes('questionNarration(question,index)'));
 assert.ok(component.includes('styles.questionPlaying'));
 assert.ok(component.includes('live=false;narrator.current?.stop()'));
 assert.ok(component.includes('useEffect(()=>{narrator.current?.stop();},[scene])'));
 assert.ok(component.includes('Ver escenas automáticamente'));
 assert.ok(component.includes('La lectura en voz no está disponible'));
});
