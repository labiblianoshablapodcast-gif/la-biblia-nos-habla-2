import test from 'node:test';
import assert from 'node:assert/strict';
import {parseYouVersionVerses} from '../lib/youversion-verses.ts';

const verse=(n,text)=>`<span class="yv-v" v="${n}"></span><span class="yv-vlbl">${n}</span>${text}`;
test('parses verified live ASV markup without duplicate verse labels',()=>{
  const html='<div><div class="p">'+verse(1,'In the beginning God created the heavens and the earth. ')+verse(2,'And the earth was waste and void; and darkness was upon the face of the deep.')+'</div></div>';
  const result=parseYouVersionVerses(html);
  assert.equal(result.length,2);
  assert.deepEqual(result[0],{number:1,text:'In the beginning God created the heavens and the earth.'});
  assert.equal(result[1].text.startsWith('And the earth'),true);
});
test('preserves added words, hyphenation, punctuation and decoded entities',()=>{
  const result=parseYouVersionVerses(verse(1,'fruit-<span class="add">trees</span> &amp; God&#39;s <span class="add">word</span>.'));
  assert.equal(result[0].text,"fruit-trees & God's word.");
});
test('supports poetry line breaks and flexible attribute ordering',()=>{
  const html="<div class='q'><span v='1' class='yv-v'></span><span class='yv-vlbl'>1</span>The LORD<br/>is my shepherd.</div>";
  assert.deepEqual(parseYouVersionVerses(html),[{number:1,text:'The LORD is my shepherd.'}]);
});
test('fails closed for malformed, duplicated or missing verse markers',()=>{
  assert.deepEqual(parseYouVersionVerses('<p>unstructured chapter</p>'),[]);
  assert.deepEqual(parseYouVersionVerses(verse(1,'One')+verse(1,'Duplicate')),[]);
  assert.deepEqual(parseYouVersionVerses(verse(1,'One')+verse(3,'Gap')),[]);
  assert.deepEqual(parseYouVersionVerses(verse(1,'')),[]);
});
test('does not include provider scripts in the displayed verse',()=>{
  assert.equal(parseYouVersionVerses(verse(1,'Word<script>alert(1)</script>'))[0].text,'Word');
});
test('supports the longest chapter without losing verses',()=>{
  const result=parseYouVersionVerses(Array.from({length:176},(_,i)=>verse(i+1,`Text ${i+1}.`)).join(''));
  assert.equal(result.length,176);assert.deepEqual(result[175],{number:176,text:'Text 176.'});
});
