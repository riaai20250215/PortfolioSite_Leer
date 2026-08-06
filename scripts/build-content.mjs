#!/usr/bin/env node
/* =====================================================
   content.json → public/index.html / public/script.js の静的部分を生成
   ---------------------------------------------------
   使い方:
     node scripts/build-content.mjs          … 生成して書き込む
     node scripts/build-content.mjs --check  … 差分があれば異常終了 (npm test 用)

   これは「JSONが取れなくても必ず表示される」ためのフォールバック生成。
   index.html に埋まっている静的HTMLは、実行時レンダラ (public/content.js) と
   同じ関数で生成されるので、両者の見た目は必ず一致する。
   ===================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTIONS, buildEnDict, validateContent } from '../public/content-render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

const contentPath = path.join(root, 'public/content.json');
const htmlPath = path.join(root, 'public/index.html');
const scriptPath = path.join(root, 'public/script.js');

const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const errors = validateContent(content);
if (errors.length) {
  console.error('content.json の検証に失敗しました:');
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}

/* ---------- index.html ---------- */
let html = fs.readFileSync(htmlPath, 'utf8');
for (const section of SECTIONS) {
  const start = `<!--content:${section.key}:start-->`;
  const end = `<!--content:${section.key}:end-->`;
  const re = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!re.test(html)) {
    console.error(`index.html にマーカー ${start} … ${end} が見つかりません`);
    process.exit(1);
  }
  const body = section.render(content, section.indent);
  const replacement = section.indent
    ? `${start}\n${body}\n${section.indent}${end}`
    : `${start}${body}${end}`;
  html = html.replace(re, () => replacement);
}

/* ---------- script.js の英語辞書 ---------- */
let script = fs.readFileSync(scriptPath, 'utf8');
const enStart = '/* content:en:start */';
const enEnd = '/* content:en:end */';
const enRe = new RegExp(`${escapeRe(enStart)}[\\s\\S]*?${escapeRe(enEnd)}`);
if (!enRe.test(script)) {
  console.error(`script.js にマーカー ${enStart} … ${enEnd} が見つかりません`);
  process.exit(1);
}
const dict = buildEnDict(content);
const dictLines = Object.entries(dict).map(([key, value]) => `    ${JSON.stringify(key)}: ${JSON.stringify(value)},`);
script = script.replace(enRe, () => `${enStart}\n${dictLines.join('\n')}\n    ${enEnd}`);

/* ---------- 書き込み / 差分チェック ---------- */
const targets = [
  { file: htmlPath, next: html },
  { file: scriptPath, next: script }
];

let dirty = false;
for (const target of targets) {
  const current = fs.readFileSync(target.file, 'utf8');
  if (current === target.next) continue;
  dirty = true;
  if (!check) fs.writeFileSync(target.file, target.next);
  console[check ? 'error' : 'log'](
    `${check ? '差分あり' : '更新'}: ${path.relative(root, target.file)}`
  );
}

if (check && dirty) {
  console.error('public/content.json と静的HTMLがずれています。`npm run build` を実行してください。');
  process.exit(1);
}
if (!dirty) console.log(check ? '静的フォールバックは content.json と一致しています。' : '変更はありません。');

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
