import test from 'node:test';
import assert from 'node:assert/strict';
import {readerVersion,versionQuery} from '../lib/bible-version.ts';

test('ASV remains selected in chapter, book and return links',()=>{
  for(const path of ['/biblia','/biblia/juan/3','/biblia/genesis/1']){
    assert.equal(`${path}${versionQuery(readerVersion('asv'))}`,`${path}?version=asv`);
  }
});
test('existing Spanish and Qeqchi URLs remain unchanged',()=>{
  assert.equal(versionQuery(readerVersion('rvr60')),'');
  assert.equal(versionQuery(readerVersion('qeqchi')),'?version=qeqchi');
});
test('old saved readings and unknown versions fall back to Spanish',()=>{
  assert.equal(readerVersion(undefined),'rvr60');
  assert.equal(readerVersion('nkjv'),'rvr60');
  assert.equal(readerVersion({}),'rvr60');
});
