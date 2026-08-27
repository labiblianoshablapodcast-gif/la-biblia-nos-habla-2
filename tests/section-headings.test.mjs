import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {withSectionHeadings} from '../lib/section-headings.ts';
import {extractHeadings} from '../scripts/import-english-section-headings.mjs';

const data=JSON.parse(readFileSync(new URL('../data/english-section-headings.json',import.meta.url),'utf8'));
const books=JSON.parse(readFileSync(new URL('../data/bible-books.json',import.meta.url),'utf8'));

test('headings cover all 66 books and 1,189 chapters with valid plain-text titles',()=>{
  assert.equal(Object.keys(data.books).length,66);
  let chapters=0;
  for(const book of books) {
    const entries=data.books[book.code];
    assert.equal(Object.keys(entries).length,book.chapters,book.code);
    for(let chapter=1;chapter<=book.chapters;chapter++) {
      assert.ok(entries[chapter],`${book.code} ${chapter}`);
      for(const [number,title] of Object.entries(entries[chapter])) {
        assert.match(number,/^[1-9]\d*$/);
        assert.ok(title.length>1 && title.length<=180);
        assert.doesNotMatch(title,/[\\<>]|LBHN_|VERSE_END|Subtítulo/);
      }
      chapters++;
    }
  }
  assert.equal(chapters,1189);
});

test('verified sections are attached to the correct starting verse',()=>{
  assert.deepEqual(data.books.GAL[2],{'1':'The Council at Jerusalem','11':'Paul Confronts Cephas'});
  assert.deepEqual(data.books.JHN[3],{'1':'Jesus and Nicodemus','22':'John’s Testimony about Jesus'});
  assert.equal(data.books.GEN[1][3],'The First Day');
  assert.equal(data.books.GEN[1][24],'The Sixth Day');
  assert.equal(data.books.PSA[119][1],'Your Word Is a Lamp to My Feet');
});

test('adding headings leaves ASV words, verse numbering, and original data unchanged',()=>{
  const input=Object.freeze([
    Object.freeze({number:1,text:'In the beginning God created the heavens and the earth.'}),
    Object.freeze({number:2,text:'And the earth was waste and void;'}),
    Object.freeze({number:3,text:'And God said, Let there be light: and there was light.'}),
  ]);
  const output=withSectionHeadings(input,data.books.GEN[1]);
  assert.deepEqual(output.map(({number,text})=>({number,text})),input);
  assert.equal(output[0].heading,'The Creation');
  assert.equal(output[1].heading,undefined);
  assert.equal(output[2].heading,'The First Day');
  assert.equal(input[0].heading,undefined);
});

test('missing verses, missing metadata and existing headings are handled safely',()=>{
  const input=[{number:1,text:'Original ASV words',heading:'Existing title'}];
  assert.deepEqual(withSectionHeadings(input,{'1':'Replacement','2':'Absent verse'}),input);
  assert.deepEqual(withSectionHeadings(input),input);
  assert.deepEqual(withSectionHeadings([],data.books.GEN[1]),[]);
});

test('USFM importer keeps only section titles, not notes, superscriptions or Scripture',()=>{
  const usfm=String.raw`\id GEN
\c 1
\s1 The Creation
\r (John 1:1)
\d Not an editorial section
\p \v 1 Scripture text. \f + A note.\f*
\s2 The First Day
\p \v 3 More Scripture.
\c 2
\s1 The Seventh Day
\p \v 1 Scripture.`;
  assert.deepEqual(extractHeadings(usfm),{'1':{'1':'The Creation','3':'The First Day'},'2':{'1':'The Seventh Day'}});
});

test('mid-verse speaker headings never move to another verse or chapter',()=>{
  const usfm=String.raw`\c 6
\q1 \v 13 Come back.
\s2 The Bridegroom
\q1 Why do you look at the Shulammite,
\c 7
\s1 Admiration by the Bridegroom
\q1 \v 1 How beautiful...`;
  assert.deepEqual(extractHeadings(usfm),{'7':{'1':'Admiration by the Bridegroom'}});
});

test('source and permission are recorded separately from ASV Scripture',()=>{
  assert.equal(data.license,'Public domain (CC0)');
  assert.match(data.sourceSha256,/^[a-f0-9]{64}$/);
  assert.equal(data.licenseUrl,'https://berean.bible/terms.htm');
  assert.match(data.note,/not part of the ASV text/);
});

test('reader labels and attribution distinguish English headings from Scripture',()=>{
  const reader=readFileSync(new URL('../components/BibleReaderTools.tsx',import.meta.url),'utf8');
  const page=readFileSync(new URL('../app/biblia/[book]/[chapter]/page.tsx',import.meta.url),'utf8');
  assert.ok(reader.includes('translationKey==="asv"?"Section heading":"Subtítulo editorial"'));
  assert.ok(page.includes('not part of the ASV text'));
  const asv=readFileSync(new URL('../lib/asv-chapter.ts',import.meta.url),'utf8');
  assert.ok(asv.includes('withSectionHeadings(parseYouVersionVerses(result.content)'));
  assert.ok(asv.includes('fetchAsvPassage(code,chapter)'));
});
