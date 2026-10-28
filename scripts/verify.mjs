import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('.next/server/app/index.html','utf8');
assert.match(html,/fora da tela/i);
assert.equal((html.match(/aria-label="Conhecer /g)||[]).length,9);
for(const asset of html.matchAll(/(?:src|href)="(\/(?:_next\/static|projects)\/[^"?]+)(?:\?[^" ]*)?"/g)){
  const local=asset[1].startsWith('/_next/')?'.next/'+asset[1].slice('/_next/'.length):'public'+asset[1];
  assert.ok(fs.existsSync(local),'Missing asset: '+local);
}
const slugs=['stopou','ritimo','rotina','karoane','financas','doe','bruto'];
for(const slug of slugs){
  const icon=fs.readFileSync('public/projects/'+slug+'.png');
  assert.equal(icon.subarray(1,4).toString(),'PNG');
  for(const n of ['01','02']){
    const file='public/projects/'+slug+'/screen-'+n+(slug==='rotina'||(slug==='financas'&&n==='02')?'.webp':'.png');
    assert.ok(fs.existsSync(file),file);
    const content=fs.readFileSync(file);
    assert.ok(content.length>1000,file+' should contain an image');
    if(file.endsWith('.webp')){assert.equal(content.toString('ascii',0,4),'RIFF');assert.equal(content.toString('ascii',8,12),'WEBP');}
    else assert.equal(content.subarray(1,4).toString(),'PNG');
  }
}
const layout=fs.readFileSync('app/layout.tsx','utf8');
const backtick=String.fromCharCode(96);
const themeSource=layout.split('const themeScript = '+backtick)[1].split(backtick)[0];
assert.ok(themeSource);
for(const saved of [null,'dark','light']){
  const root={dataset:{},style:{}};
  vm.runInNewContext(themeSource,{document:{documentElement:root},localStorage:{getItem:()=>saved}});
  assert.equal(root.dataset.theme,saved||'system');
  assert.equal(root.style.colorScheme,saved||'light dark');
}
assert.ok(fs.readFileSync('components/liquid-glass-scene.tsx','utf8').includes('webgl'));
assert.ok(fs.readFileSync('lib/projects.ts','utf8').includes('https://www.linkedin.com/in/palomagl'));
console.log('OK: 9 projects, 7 icons, 14 screenshots, theme, glass renderer and LinkedIn.');
