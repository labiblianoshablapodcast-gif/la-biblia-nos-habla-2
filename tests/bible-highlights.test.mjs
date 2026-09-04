import test from 'node:test';
import assert from 'node:assert/strict';
import {mergeRanges,subtractRange,parseHighlights,textSegments} from '../lib/bible-highlights.ts';

test('merges overlapping/adjacent ranges without mutating saved data',()=>{
  const original=[{start:1,end:5},{start:8,end:10}];
  assert.deepEqual(mergeRanges([...original,{start:4,end:8}]),[{start:1,end:10}]);
  assert.equal(original[0].end,5);
});
test('removes only the selected phrase, splitting an existing highlight',()=>{
  assert.deepEqual(subtractRange([{start:0,end:20}],{start:5,end:12}),[{start:0,end:5},{start:12,end:20}]);
  assert.deepEqual(subtractRange([{start:0,end:5}],{start:0,end:5}),[]);
});
test('repeated words are distinguished by their exact offsets',()=>{
  const text='amor y amor';
  const parts=textSegments(text,{text,ranges:[{start:7,end:11}]});
  assert.equal(parts.filter(p=>p.marked).length,1);
  assert.equal(parts.find(p=>p.marked).start,7);
  assert.equal(parts.map(p=>p.text).join(''),text);
});
test('accents and Qeqchi punctuation survive persistence and rendering',()=>{
  const text='Jesús, q’eqchi’ y paz.';
  const restored=parseHighlights(JSON.stringify({1:{text,ranges:[{start:0,end:5},{start:7,end:14}]}}));
  assert.equal(textSegments(text,restored[1]).map(p=>p.text).join(''),text);
});
test('rejects corrupted data and filters unsafe ranges',()=>{
  assert.throws(()=>parseHighlights('{oops'));
  assert.throws(()=>parseHighlights('[]'));
  assert.deepEqual(parseHighlights(JSON.stringify({1:{text:'amor',ranges:[null,{start:-1,end:4},{start:0,end:99},{start:1.5,end:3},{start:0,end:4}]}}))[1].ranges,[{start:0,end:4}]);
});
test('does not apply stale offsets to changed verse text',()=>{
  assert.equal(textSegments('new text',{text:'old text',ranges:[{start:0,end:3}]}).some(p=>p.marked),false);
});
