// Extract editorial headings only. Never imports BSB verse text into the ASV reader.
// Usage: node scripts/import-english-section-headings.mjs /path/to/bsb_usfm.zip
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export function extractHeadings(usfm) {
  let chapter=0;
  let pending=[];
  const chapters={};
  for(const line of usfm.split(/\r?\n/)) {
    const chapterMatch=line.match(/^\\c (\d+)\s*$/);
    if(chapterMatch) {
      if(pending.length)throw new Error('Unattached section heading before chapter boundary');
      chapter=Number(chapterMatch[1]);
      continue;
    }
    const heading=line.match(/^\\s[12] (.+)$/);
    if(heading) {
      const title=heading[1].trim().replace(/\s+/g,' ');
      if(!title || /[\\<>]/.test(title) || title.length>160)throw new Error('Invalid heading markup');
      pending.push(title);
      continue;
    }
    const verse=line.match(/\\v (\d+)(?=\s)/);
    // A speaker/poetry heading can split an existing verse (notably Song of
    // Songs 6:13). Omit it rather than move it to the next verse/chapter.
    if(!verse && pending.length && /^\\(?:p\w*|q\d*|li\d*)\s+\S/.test(line)) {
      pending=[];
      continue;
    }
    if(verse && pending.length) {
      if(!chapter)throw new Error('Heading without a chapter');
      const number=Number(verse[1]);
      chapters[chapter]??={};
      if(chapters[chapter][number])throw new Error('Duplicate section reference');
      chapters[chapter][number]=pending.join(' — ');
      pending=[];
    }
  }
  if(pending.length)throw new Error('Unattached section heading at end of book');
  return chapters;
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  const archive=process.argv[2];
  if(!archive)throw new Error('Pass the downloaded official BSB USFM zip');
  const canonicalBooks=JSON.parse(readFileSync(new URL('../data/bible-books.json',import.meta.url),'utf8'));
  const books={};
  for(const {code,chapters} of canonicalBooks) {
    const usfm=execFileSync('unzip',['-p',archive,`bsb_usfm/${code}.usfm`],{encoding:'utf8',maxBuffer:2_000_000});
    if(!usfm.startsWith(`\\id ${code} `))throw new Error(`Wrong source book: ${code}`);
    const entries=extractHeadings(usfm);
    if(!Object.keys(entries).length)throw new Error(`Missing headings: ${code}`);
    for(const [chapter,headings] of Object.entries(entries)) {
      if(Number(chapter)<1 || Number(chapter)>chapters)throw new Error(`Invalid chapter: ${code} ${chapter}`);
      for(const verse of Object.keys(headings))if(Number(verse)<1)throw new Error('Invalid verse');
    }
    books[code]=entries;
  }
  const data={
    source:'Berean Standard Bible editorial section headings (s1 and s2 only)',
    download:'https://bereanbible.com/bsb_usfm.zip',
    license:'Public domain (CC0)',
    licenseUrl:'https://berean.bible/terms.htm',
    sourceSha256:createHash('sha256').update(readFileSync(archive)).digest('hex'),
    note:'Editorial reading aids only; not part of the ASV text. No verse text is included. Mid-verse headings are omitted rather than moved.',
    books,
  };
  process.stdout.write(JSON.stringify(data,null,2)+'\n');
}
