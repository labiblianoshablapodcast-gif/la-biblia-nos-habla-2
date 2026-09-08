import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('../data/rvr60-audio-manifest.json', import.meta.url)));
const books = JSON.parse(fs.readFileSync(new URL('../data/bible-books.json', import.meta.url)));

test('Spanish audio covers every chapter of all 66 books without duplicates', () => {
  assert.equal(Object.keys(manifest).length, 66);
  const names = [];
  for (const book of books) {
    assert.equal(Object.keys(manifest[book.code]).length, book.chapters, book.code);
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      const name = manifest[book.code][chapter];
      assert.match(name, /^[a-z0-9]+_\d{2,3}\.mp3$/);
      assert.equal(Number(name.match(/_(\d+)\.mp3$/)[1]), chapter);
      names.push(name);
    }
  }
  assert.equal(names.length, 1189);
  assert.equal(new Set(names).size, 1189);
});
