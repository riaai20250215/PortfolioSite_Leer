import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'public/index.html',
  'public/workflow/index.html',
  'public/workflow/lumia/index.html',
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
assert.match(home, /href="#process">PROCESS/);
assert.match(home, /href="workflow\/lumia\/"/);

const archive = fs.readFileSync(path.join(root, 'public/workflow/index.html'), 'utf8');
assert.match(archive, /PROCESS ARCHIVE/);
assert.match(archive, /CREATIVE DNA/);
assert.match(archive, /作品別ワークフロー/);

const lumia = fs.readFileSync(path.join(root, 'public/workflow/lumia/index.html'), 'utf8');
for (const required of [
  'コンテスト要件',
  '@TapNow_AI @TapNow_JP #ルミアと始まりの海',
  '11の制作工程',
  'Googleフォーム提出文面',
  '本当に素敵な企画をありがとうございました',
  'NEEDS INTERVIEW',
]) {
  assert.ok(lumia.includes(required), `Lumia workflow is missing: ${required}`);
}

for (const asset of [
  'public/assets/workflow/lumia/cover.png',
  'public/assets/workflow/lumia/key-visual.png',
  'public/assets/workflow/lumia/fisheye-tests.png',
  'public/assets/workflow/lumia/window-alpha-checker.png',
  'public/assets/workflow/lumia/seedance-qa.png',
  'public/assets/workflow/lumia/remotion-qa.jpg',
  'public/assets/workflow/lumia/lumia-final-720p.mp4',
]) {
  assert.ok(fs.statSync(path.join(root, asset)).size > 50_000, `${asset} is unexpectedly small`);
}

console.log('Verified creator site, process archive, Lumia case study, and local assets.');
