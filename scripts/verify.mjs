import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const html = fs.readFileSync('.next/server/app/index.html', 'utf8');
assert.match(html, /Fora da Tela/);
assert.equal((html.match(/aria-label="Conhecer /g) || []).length, 9, 'A página deve incluir nove projetos');
for (const asset of html.matchAll(/(?:src|href)="(\/(?:_next\/static|projects)\/[^"?]+)(?:\?[^" ]*)?"/g)) {
  const local = asset[1].startsWith('/_next/') ? '.next/' + asset[1].slice('/_next/'.length) : 'public' + asset[1];
  assert.ok(fs.existsSync(local), 'Recurso ausente: ' + local);
}
const scene = fs.readFileSync('public/earth-orbit.webp');
assert.equal(scene.toString('ascii', 0, 4), 'RIFF');
assert.equal(scene.toString('ascii', 8, 12), 'WEBP');
for (const name of ['stopou','ritimo','rotina','karoane','financas','doe','bruto']) {
  const data = fs.readFileSync(`public/projects/${name}.png`);
  assert.equal(data.subarray(1, 4).toString(), 'PNG');
}
for (const name of ['stopou','rotina','karoane','financas','doe','bruto']) {
  assert.ok(fs.statSync(`public/projects/${name}-preview.png`).size > 1000);
}
const layout = fs.readFileSync('app/layout.tsx', 'utf8');
const source = layout.match(/const themeScript = `([^`]+)`/)[1];
for (const saved of [null, 'dark', 'light']) {
  const root = { dataset: {}, style: {} };
  vm.runInNewContext(source, { document: { documentElement: root }, localStorage: { getItem: () => saved } });
  assert.equal(root.dataset.theme, saved || 'system');
  assert.equal(root.style.colorScheme, saved || 'light dark');
}
const example = fs.readFileSync('.env.example', 'utf8');
assert.ok(example.split(/\r?\n/).filter(Boolean).every(line => /^[A-Z_]+=$/.test(line)), 'O exemplo de ambiente deve estar vazio');
console.log('OK: página de produção, nove projetos, bundles, sete ícones, seis prévias, cenário WebP e preferências de tema.');
