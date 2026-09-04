import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync(new URL('../data/qeqchi-audio-manifest.json', import.meta.url)));
const books = JSON.parse(fs.readFileSync(new URL('../data/bible-books.json', import.meta.url))).filter(b => b.testament === 'Nuevo Testamento');

test('cada capítulo del Nuevo Testamento tiene el MP3 del libro y capítulo correctos', () => {
  assert.equal(Object.keys(manifest).length, 27);
  const paths = [];
  books.forEach((book, index) => {
    assert.equal(Object.keys(manifest[book.code]).length, book.chapters);
    for (let chapter = 1; chapter <= book.chapters; chapter++) {
      const path = manifest[book.code][chapter];
      assert.ok(path.startsWith(`/audio/qeqchi/KEKIBSN2DA/${book.code}/B${String(index + 1).padStart(2,'0')}___${String(chapter).padStart(2,'0')}_`));
      assert.ok(path.endsWith('_KEKIBSN2DA.mp3'));
      paths.push(path);
    }
  });
  assert.equal(paths.length, 260);
  assert.equal(new Set(paths).size, 260);
  assert.equal(manifest.GEN, undefined);
});
