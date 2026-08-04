import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'public/index.html',
];

const resolveLocalReference = (page, reference) => {
  if (/^(?:https?:|mailto:|data:|#)/.test(reference)) return null;
  const clean = reference.split(/[?#]/)[0];
  const candidate = path.resolve(path.dirname(path.join(root, page)), clean);
  return clean.endsWith('/') ? path.join(candidate, 'index.html') : candidate;
};

for (const page of pages) {
  const absolute = path.join(root, page);
  const html = fs.readFileSync(absolute, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = resolveLocalReference(page, match[1]);
    if (!target) continue;
    assert.ok(fs.existsSync(target), `${page}: missing local reference ${match[1]}`);
  }
}

const home = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
assert.doesNotMatch(home, /href="#process">PROCESS/);
assert.doesNotMatch(home, /workflow\//);
assert.ok(!fs.existsSync(path.join(root, 'public/workflow')), 'Official site must not include the internal workflow archive');
assert.ok(!fs.existsSync(path.join(root, 'public/assets/workflow')), 'Official site must not include internal workflow assets');

console.log('Verified public creator portfolio and local assets.');
