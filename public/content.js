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

let previewParentOrigin='',previewContent=null,previewReceived=false;
const renderedSections=new Map();
const previewMode=new URLSearchParams(location.search).has('preview')&&window.parent!==window;

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
    const normalized=normalize(markup),previous=renderedSections.get(section.key)??normalize(target.innerHTML);
    renderedSections.set(section.key,normalized);
    if(normalized===previous)continue;
    target.innerHTML = markup;
    changed = true;
  }

  if (changed) {
    if (typeof window.leerObserveReveals === 'function') window.leerObserveReveals();
    if (typeof window.leerSetEnDict === 'function') window.leerSetEnDict(buildEnDict(content));
    if (typeof window.leerApplyLang === 'function') window.leerApplyLang();
  }
  if(previewParentOrigin){previewContent=content;decoratePreview();}
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
      if(previewReceived)return;
      if (applyContent(data)) return;
    } catch (error) {
      /* 取得できなくても静的HTMLがあるので致命的ではない */
      console.debug(`[leer] ${url} を利用できませんでした:`, error?.message ?? error);
    }
  }
}

/* ---------- 管理画面からのライブプレビュー ---------- */
window.addEventListener('message',event=>{
 if(!previewMode||event.source!==window.parent||!PREVIEW_ORIGINS.some(re=>re.test(event.origin)))return;
 const m=event.data;if(!m)return;
 if(m.type==='leer:preview'&&m.content){
  previewReceived=true;previewParentOrigin=event.origin;
  if(applyContent(m.content))window.parent.postMessage({type:'leer:preview-applied'},previewParentOrigin);
 }
 if(m.type==='leer:focus'&&previewParentOrigin){
  const section={news:'news',works:'works',profile:'profile',timeline:'profile',links:'links',contact:'links'}[m.kind];
  if(!section)return;
  const target=m.id?[...document.querySelectorAll('[data-leer-kind]')].find(el=>el.dataset.leerKind===m.kind&&el.dataset.leerId===m.id):document.getElementById(section);
  (target||document.getElementById(section))?.scrollIntoView({behavior:'smooth',block:'center'});
 }
});
function decoratePreview(){
 if(!document.getElementById('leer-editor-style')){
  const style=document.createElement('style');style.id='leer-editor-style';style.textContent=`[data-leer-kind]{cursor:pointer;outline-offset:6px;transition:outline-color .15s}[data-leer-kind]:hover,[data-leer-kind]:focus-visible{outline:1px dashed #e7c87a}[data-leer-kind] a{cursor:pointer}`;document.head.append(style);
 }
 const c=previewContent;
 const tag=(el,kind,item,index)=>{if(!el)return;el.dataset.leerKind=kind;el.dataset.leerId=item?.id||'';el.dataset.leerIndex=String(index);el.tabIndex=0;el.title='クリックして編集';};
 for(const [kind,selector,list] of [['news','.news-item',c.news],['timeline','.timeline-item',c.profile.timeline],['links','.link-card',c.links.items]]){
  const visible=list.map((item,index)=>({item,index})).filter(({item})=>!item.hidden);
  document.querySelectorAll(selector).forEach((el,i)=>{const row=visible[i];if(row)tag(el,kind,row.item,row.index)});
 }
 /* 作品はシリーズごとに並ぶので DOM 順 ≠ 配列順。カードが持つ id で引く */
 document.querySelectorAll('.work-card').forEach(el=>{const i=c.works.findIndex(w=>w.id===el.dataset.work);if(i>=0)tag(el,'works',c.works[i],i)});
 tag(document.querySelector('.profile-card'),'profile',null,0);
 tag(document.querySelector('.contact-note'),'contact',null,0);
}
function pick(event){
 if(!previewParentOrigin)return;
 if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
 if(event.target.closest('summary'))return;  /* 説明文の開閉は本来の動作に任せる */
 const el=event.target.closest('[data-leer-kind]');if(!el)return;
 event.preventDefault();event.stopImmediatePropagation();
 window.parent.postMessage({type:'leer:select',kind:el.dataset.leerKind,id:el.dataset.leerId,index:Number(el.dataset.leerIndex)},previewParentOrigin);
}
document.addEventListener('click',pick,true);document.addEventListener('keydown',pick,true);

window.leerApplyContent = applyContent;

load();
