/* =====================================================
   りあ / Leer — Official Site
   content.js — 実行時にコンテンツを取得して差分だけ描き直す
   ---------------------------------------------------
   ・index.html には content.json から生成した静的HTMLが必ず入っている。
     このスクリプトが失敗しても、ページの内容は最初から表示されている。
   ・取得順:  GET /api/content (Cloudflare KV)  →  content.json (同梱の静的ファイル)
   ・取得できた内容が静的HTMLと同じなら、DOMには一切触らない。
   ===================================================== */
import { SECTIONS, buildEnDict, validateContent } from './content-render.js';

const API_ENDPOINT = '/api/content';
const STATIC_ENDPOINT = 'content.json';

/* 管理画面 (leer-creative-archive) からのプレビュー用 postMessage を受け付けるオリジン */
const PREVIEW_ORIGINS = [
  /^https:\/\/leer-creative-archive\.[a-z0-9-]+\.workers\.dev$/i,
  /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/i
];

const normalize = html =>
  String(html ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** content を DOM に反映する。変化がないセクションには触らない。 */
export function applyContent(content) {
  const problems = validateContent(content);
  if (problems.length) {
    console.warn('[leer] content の検証に失敗したため静的HTMLを維持します:', problems);
    return false;
  }

  let changed = false;
  for (const section of SECTIONS) {
    const target = document.querySelector(section.selector);
    if (!target) continue;
    let markup;
    try {
      markup = section.render(content, '');
    } catch (error) {
      console.warn(`[leer] ${section.key} の描画に失敗しました`, error);
      continue;
    }
    if (normalize(markup) === normalize(target.innerHTML)) continue;
    target.innerHTML = markup;
    changed = true;
  }

  if (changed) {
    if (typeof window.leerObserveReveals === 'function') window.leerObserveReveals();
    if (typeof window.leerSetEnDict === 'function') window.leerSetEnDict(buildEnDict(content));
    if (typeof window.leerApplyLang === 'function') window.leerApplyLang();
  }
  return true;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store', headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const text = await response.text();
  return JSON.parse(text); // HTML が返ってきた場合はここで例外 → 次の候補へ
}

async function load() {
  for (const url of [API_ENDPOINT, STATIC_ENDPOINT]) {
    try {
      const data = await fetchJson(url);
      if (applyContent(data)) return;
    } catch (error) {
      /* 取得できなくても静的HTMLがあるので致命的ではない */
      console.debug(`[leer] ${url} を利用できませんでした:`, error?.message ?? error);
    }
  }
}

/* ---------- 管理画面からのライブプレビュー ---------- */
window.addEventListener('message', event => {
  const payload = event.data;
  if (!payload || payload.type !== 'leer:preview' || !payload.content) return;
  if (event.source !== window.parent || window.parent === window) return;
  if (!PREVIEW_ORIGINS.some(re => re.test(event.origin))) return;
  applyContent(payload.content);
});

window.leerApplyContent = applyContent;

load();
