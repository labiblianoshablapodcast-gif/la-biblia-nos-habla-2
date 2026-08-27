import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const postcss=createRequire(require.resolve('next/package.json'))('postcss');
const css=postcss.parse(readFileSync(new URL('../app/biblia/biblia.module.css',import.meta.url),'utf8'));
const page=readFileSync(new URL('../app/biblia/page.tsx',import.meta.url),'utf8');

// Check the module's responsive declarations, not a substitute for visual QA.
function declarations(selector,width,standalone=false) {
  const result={};
  css.walkRules(rule=>{
    if(!rule.selectors.includes(selector))return;
    for(let parent=rule.parent;parent;parent=parent.parent) {
      if(parent.type!=='atrule' || parent.name!=='media')continue;
      const max=parent.params.match(/max-width\s*:\s*(\d+)px/);
      if(max && width>Number(max[1]))return;
      if(parent.params.includes('display-mode') && !standalone)return;
    }
    rule.walkDecls(decl=>{result[decl.prop]=decl.value;});
  });
  return result;
}

test('mobile browser and installed app use a compact hero without tall overrides',()=>{
  for(const width of [320,375,390,430,600])for(const standalone of [false,true]) {
    assert.equal(declarations('.hero',width,standalone)['min-height'],'360px');
    assert.equal(declarations('.heroCopy',width,standalone)['min-height'],'360px');
    assert.equal(declarations('.heroImage',width,standalone)['min-height'],'0');
  }
  assert.doesNotMatch(page,/import .*mobile-hero-refinement/);
});

test('no decorative line crosses the photograph in any layout',()=>{
  for(const width of [320,430,600,900,1280])for(const standalone of [false,true]) {
    const details=declarations('.heroDetails',width,standalone);
    assert.equal(details.border,'0');
    assert.equal(details['border-top'],undefined);
    assert.equal(details['padding-top'],'0');
  }
});

test('three equal-width version buttons keep accessible touch targets',()=>{
  const grid=declarations('.versionSwitcher',390,true);
  assert.equal(grid.display,'grid');
  assert.equal(grid['grid-template-columns'],'repeat(3,minmax(0,1fr))');
  assert.equal(declarations('.versionButton',390,true)['min-height'],'52px');
  assert.equal(declarations('.versionButton',390,true).margin,'0');
  const nav=page.match(/<nav className=\{styles.versionSwitcher\}[\s\S]*?<\/nav>/)?.[0];
  assert.ok(nav);
  assert.equal((nav.match(/<Link /g)||[]).length,3);
  for(const label of ['RVR1960','Q’eqchi’','ASV'])assert.ok(nav.includes(`>${label}</Link>`));
  for(const href of ['/biblia','/biblia?version=qeqchi','/biblia?version=asv'])assert.ok(nav.includes(`href="${href}"`));
  assert.equal((nav.match(/aria-current=/g)||[]).length,3);
  assert.equal((nav.match(/aria-label=/g)||[]).length,4);
  assert.doesNotMatch(nav,/"btn |toolbar/);
});

test('photo, statistics and desktop composition stay intact without repetitive copy',()=>{
  assert.ok(page.includes('/images/biblia-abierta-portada.png'));
  assert.ok(page.includes('<strong>66</strong> libros'));
  assert.ok(page.includes('<strong>1,189</strong> capítulos'));
  assert.doesNotMatch(page,/Los 66 libros, 1,189 capítulos/);
  assert.equal(declarations('.hero',1280)['min-height'],'430px');
  assert.equal(declarations('.hero',1280)['grid-template-columns'],'1.02fr .98fr');
});
