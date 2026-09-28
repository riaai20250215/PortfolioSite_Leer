import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SECTIONS, validateContent} from '../public/content-render.js';
import {PAGES} from './pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'public/index.html',
  'public/works/index.html',
];

const resolveLocalReference = (page, reference) => {
  if (/^(?:https?:|mailto:|data:|#)/.test(reference)) return null;
  const clean = reference.split(/[?#]/)[0];
  if (!clean) return null;
  /* '/style.css' のようなルート相対は public/ から、それ以外はページの位置から引く */
  const candidate = clean.startsWith('/')
    ? path.join(root, 'public', clean)
    : path.resolve(path.dirname(path.join(root, page)), clean);
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

/* --- 公開サイトは検索対象。noindex が混ざっていないこと --- */
assert.doesNotMatch(home, /noindex/, 'Official site must stay indexable');

/* --- コンテンツJSON (管理画面から編集される正本) --- */
const content = JSON.parse(fs.readFileSync(path.join(root, 'public/content.json'), 'utf8'));
const contentErrors = validateContent(content);
assert.equal(contentErrors.join(' / '), '', 'content.json validation failed');

for (const asset of [content.profile.icon, ...content.works.map(work => work.image)]) {
  assert.ok(fs.existsSync(path.join(root, 'public', asset)), `content.json: missing asset ${asset}`);
}

/* --- 静的フォールバックが content.json と同じ内容を含んでいること --- */
const normalize = value => value.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ');
for (const { file, keys } of PAGES) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const normalized = normalize(html);
  for (const section of SECTIONS.filter(item => keys.includes(item.key))) {
    assert.ok(
      html.includes(`<!--content:${section.key}:start-->`) && html.includes(`<!--content:${section.key}:end-->`),
      `${file} is missing the ${section.key} content markers`
    );
    assert.ok(
      normalized.includes(normalize(section.render(content, '')).trim()),
      `${file} の ${section.key} が content.json と一致しません (npm run build を実行してください)`
    );
  }
  assert.match(html, /<script type="module" src="(?:\.\.\/)?content\.js"><\/script>/, `${file} must load content.js`);
}

/* --- 作品一覧ページ: トップから辿れること / 画像パスが1つ上を向いていること --- */
const worksPage = fs.readFileSync(path.join(root, 'public/works/index.html'), 'utf8');
assert.match(home, /href="works\/"/, 'index.html must link to the works archive page');
assert.doesNotMatch(worksPage, /noindex/, 'The works page must stay indexable');
assert.doesNotMatch(worksPage, /src="assets\//, 'works/index.html must reference assets with ../');

/* --- Worker / 管理APIの設定 --- */
const wrangler = fs.readFileSync(path.join(root, 'wrangler.jsonc'), 'utf8');
assert.match(wrangler, /"main": "src\/worker\.js"/, 'wrangler.jsonc must point at the worker');
assert.match(wrangler, /"binding": "SITE_CONTENT"/, 'wrangler.jsonc must bind the SITE_CONTENT KV namespace');
assert.ok(fs.existsSync(path.join(root, 'src/worker.js')), 'Missing src/worker.js');
// 管理画面の運用手順書 (DEPLOY-ADMIN.md) は非公開リポジトリ leer-creative-archive 側にある。
// このリポジトリは公開されているため、管理画面のURLと運用手順をここへ置かない。

console.log(
  `Verified public creator portfolio, local assets, and content.json ` +
  `(${content.news.length} news / ${content.works.length} works).`
);
