/* =====================================================
   りあ / Leer — Official Site
   content-render.js — content.json → HTML の共有レンダラ
   ---------------------------------------------------
   このファイルは 3 か所から読み込まれる:
     1. ブラウザ (public/content.js)      … 実行時に KV / content.json を描画
     2. ビルド (scripts/build-content.mjs) … index.html の静的フォールバックを生成
     3. Worker (src/worker.js)            … PUT されたJSONの検証
   同じ関数を使うことで「静的HTML = 実行時レンダリング結果」が保証される。
   ===================================================== */

/* ---------- SNSアイコン (LINKSカード用) ---------- */
export const LINK_ICONS = {
  x: {
    label: 'X (Twitter)',
    size: 22,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
  },
  youtube: {
    label: 'YouTube',
    size: 24,
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z'
  },
  instagram: {
    label: 'Instagram',
    size: 22,
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.72 3.72 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 3.99zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z'
  },
  tiktok: {
    label: 'TikTok',
    size: 22,
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z'
  }
};

/* ---------- エスケープ / サニタイズ ---------- */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ALLOWED_TAGS = new Set(['a', 'b', 'i', 'em', 'strong', 'span', 'br', 'small']);
const ALLOWED_ATTRS = new Set(['href', 'target', 'rel', 'class', 'title']);

/**
 * 許可タグ (a / strong / span / br など) のみを通すサニタイザ。
 * 入力が完全に安全なら「そのまま」返すので、既存HTMLとバイト一致する。
 * 危険な要素が1つでもあれば、タグを全部落としてテキストとして返す。
 */
export function sanitizeHtml(value) {
  const src = String(value ?? '');
  if (!/[<>]/.test(src)) return src;

  const tagRe = /<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^<>]*)?)\/?>/g;
  // タグとして解釈できない '<' が残る場合は不正とみなす
  if (src.replace(tagRe, '').includes('<')) return escapeHtml(stripTags(src));

  let match;
  while ((match = tagRe.exec(src)) !== null) {
    const tag = match[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return escapeHtml(stripTags(src));

    const attrs = match[2] || '';
    const attrRe = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*"([^"]*)"/g;
    if (attrs.replace(attrRe, '').trim() !== '') return escapeHtml(stripTags(src));

    let attr;
    while ((attr = attrRe.exec(attrs)) !== null) {
      const name = attr[1].toLowerCase();
      if (!ALLOWED_ATTRS.has(name)) return escapeHtml(stripTags(src));
      if (name === 'href' && !isSafeUrl(attr[2])) return escapeHtml(stripTags(src));
    }
  }
  return src;
}

function stripTags(value) {
  return String(value).replace(/<[^>]*>/g, '');
}

export function isSafeUrl(value) {
  return /^(?:https?:\/\/|mailto:|\/|#|\.{0,2}\/|[\w.-]+\/)/i.test(String(value ?? '').trim());
}

/* ---------- 小道具 ---------- */
const visible = list => (Array.isArray(list) ? list : []).filter(item => item && item.hidden !== true);
const i18nAttr = key => (key ? ` data-i18n="${escapeHtml(key)}"` : '');
const indentBlock = (lines, indent) => lines.map(line => (line ? indent + line : line)).join('\n');

/* ---------- NEWS ---------- */
/* 先頭の NEWS_SHOWN 件だけ出し、残りは「もっと見る」で開く (2026-10-20 りあ指示「最大5行だけ表示し、残りは展開する形に」)。
   開閉は script.js が .news-list に is-open を付け外しする */
export const NEWS_SHOWN = 5;
export function renderNews(content, indent = '      ') {
  const items = visible(content?.news);
  const blocks = items.map((item, i) => {
    const cat = item.award ? 'news-cat award' : 'news-cat';
    const key = item.bodyEn ? item.id : '';
    return [
      `<li class="news-item${i >= NEWS_SHOWN ? ' is-extra' : ''} reveal">`,
      `  <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.dateLabel || item.date)}</time>`,
      `  <span class="${cat}">${escapeHtml(item.category)}</span>`,
      `  <p${i18nAttr(key)}>${sanitizeHtml(item.bodyJa)}</p>`,
      '</li>'
    ].join('\n');
  });
  if (items.length > NEWS_SHOWN) {
    blocks.push([
      '<li class="news-more-row">',
      '  <button class="news-more-btn" type="button" aria-expanded="false">',
      `    <span class="news-more-open"><span data-i18n="t-news-more">もっと見る</span>（${items.length - NEWS_SHOWN}）</span>`,
      '    <span class="news-more-close" data-i18n="t-news-less">閉じる</span>',
      '  </button>',
      '</li>'
    ].join('\n'));
  }
  return indentBlock(blocks.join('\n').split('\n'), indent);
}

/* ---------- WORKS: バッジ ----------
   work.badgeType = 'award' (受賞: 金のきらめき + トロフィー) / 'honor' (ノミネート・選出) / 'default' (参加・自主制作)。
   未指定なら、バッジ文が 🏆 で始まるときだけ award とみなす (管理画面から 🏆 付きで入れても光る)。 */
const BADGE_TYPES = new Set(['award', 'honor', 'default']);
const TROPHY_ICON =
  '<svg class="work-badge-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M7 2h10v2h4v4a5 5 0 0 1-4.2 4.94A6 6 0 0 1 13 16.9V19h3v2H8v-2h3v-2.1a6 6 0 0 1-3.8-4.06A5 5 0 0 1 3 8V4h4V2zm0 4H5v2a3 3 0 0 0 2 2.83V6zm10 0v4.83A3 3 0 0 0 19 8V6h-2z"></path></svg>';
export function badgeText(work) {
  return String(work?.badgeJa ?? '').replace(/^🏆\s*/u, '').trim();
}
export function badgeType(work) {
  const explicit = String(work?.badgeType ?? '').trim();
  if (BADGE_TYPES.has(explicit)) return explicit;
  return /^🏆/u.test(String(work?.badgeJa ?? '')) ? 'award' : 'default';
}
function renderBadge(work) {
  const text = badgeText(work);
  if (!text) return [];
  const type = badgeType(work);
  const key = work.badgeEn ? `${work.id}-badge` : '';
  if (type === 'award') {
    /* 英訳は内側の span だけ差し替える (外側にアイコンを残すため) */
    return [`    <span class="work-badge award">${TROPHY_ICON}<span${i18nAttr(key)}>${escapeHtml(text)}</span></span>`];
  }
  return [`    <span class="work-badge ${type}"${i18nAttr(key)}>${escapeHtml(text)}</span>`];
}

/* ---------- WORKS ---------- */
/* 作品カード1枚。シリーズでまとめる場合も、まとめない場合も同じ関数を使う
   assetPrefix: 下の階層のページ (/works/) から呼ぶときに画像パスへ足す前置き ('../') */
function renderWorkCard(work, level = 3, { assetPrefix = '' } = {}) {
  const lines = [
    `<article class="work-card reveal" data-work="${escapeHtml(work.id)}">`,
    '  <div class="work-thumb">',
    `    <img src="${escapeHtml(assetPrefix + work.image)}" alt="${escapeHtml(work.imageAlt)}" loading="lazy">`,
    ...renderBadge(work),
    '  </div>',
    '  <div class="work-body">',
    `    <p class="work-meta"${i18nAttr(work.metaEn ? `${work.id}-meta` : '')}>${escapeHtml(work.metaJa)}</p>`,
    `    <h${level} class="work-title">${escapeHtml(work.title)}</h${level}>`
  ];
  /* 説明文は既定で閉じたアコーディオン (details/summary)。JSなしで開閉でき、
     閉じている間はカードの高さが揃う。開閉ラベルの出し分けは style.css 側。 */
  if (work.descJa) {
    lines.push(
      '    <details class="work-details">',
      '      <summary class="work-toggle">',
      '        <span class="work-toggle-open" data-i18n="t-more">詳細を見る</span>',
      '        <span class="work-toggle-close" data-i18n="t-less">閉じる</span>',
      '      </summary>',
      `      <p class="work-desc"${i18nAttr(work.descEn ? `${work.id}-desc` : '')}>${sanitizeHtml(work.descJa)}</p>`,
      '    </details>'
    );
  }
  for (const link of visible(work.links)) {
    const key = link.labelEn ? link.labelKey || '' : '';
    lines.push(
      `    <a class="work-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener"${i18nAttr(key)}>${escapeHtml(link.labelJa)}</a>`
    );
  }
  lines.push('  </div>', '</article>');
  return lines.join('\n');
}

/* 作品に添える X の投稿 (work.posts = [{ href, label, clipBottom }])。代表作の1段目で、カードの右に3つを横に並べる
   (2026-10-21 りあ指示「右側に私たち3人の X の投稿が見える状態で」、同日「カードの位置・縦幅に合わせて横並びに。少し小さく表示してもいい」)。
   blockquote.twitter-tweet を置き、script.js が X の widgets.js で埋め込みに変えてから、カードの高さに収まるように縮める。
   埋め込みは POST_WIDTH の幅で組む (data-width)。clipBottom は、その幅で組んだ埋め込みの下から隠す高さ (px)。
   X の埋め込みには引用した投稿を隠す設定が無い (data-conversation・data-cards では消えない) ので、
   AoKi さんの受賞の報告に引用されている「10/18 最高の32時間だった」とその下を隠すのに使う。
   keepFooter：埋め込みでは日付・いいね・返信の欄が引用より下にあり、clipBottom で一緒に消える。keepFooter を書くと、同じ投稿をもう1つ埋め込み、
   その下から keepFooter の高さ (日付の欄) だけを写真のすぐ下に出す (2026-10-21 りあ指示「AoKi さんの投稿だけ返信を読むがない。同じように表示して」)。
   読み込めなくても投稿へのリンクとして残る */
const POST_HREF = /^https:\/\/(?:x|twitter)\.com\/[A-Za-z0-9_]+\/status\/\d+$/;
const POST_WIDTH = 280;
function renderWorkPosts(work) {
  const posts = visible(work?.posts).filter(post => POST_HREF.test(String(post.href ?? '')));
  if (!posts.length) return '';
  return [
    `<div class="work-posts reveal" data-post-width="${POST_WIDTH}">`,
    ...posts.map(post => {
      const clip = Number.isInteger(post.clipBottom) && post.clipBottom > 0 ? post.clipBottom : 0;
      const foot = clip && Number.isInteger(post.keepFooter) && post.keepFooter > 0 && post.keepFooter < clip ? post.keepFooter : 0;
      const quote = `<blockquote class="twitter-tweet" data-theme="dark" data-dnt="true" data-lang="ja" data-width="${POST_WIDTH}"><a href="${escapeHtml(post.href)}">${escapeHtml(post.label || post.href)}</a></blockquote>`;
      return [
        `  <div class="work-post"${clip ? ` data-clip-bottom="${clip}"` : ''}${foot ? ` data-keep-footer="${foot}"` : ''}>`,
        `    <div class="work-post-part"><div class="work-post-inner">${quote}</div></div>`,
        ...(foot ? [`    <div class="work-post-part work-post-foot"><div class="work-post-inner">${quote}</div></div>`] : []),
        '  </div>'
      ].join('\n');
    }),
    '</div>'
  ].join('\n');
}

/* ---------- WORKS: シリーズ ----------
   content.series = [{ id, kicker, titleJa, titleEn, descJa, descEn, orientation, links:[{icon,name,handle,href}] }]
   各作品の work.series にシリーズの id を入れると、そのシリーズの見出しの下にまとまる。
   series が無い作品 (または存在しない id) は最後の「その他の作品」に入る。
   orientation: 'vertical' のシリーズはサムネイルを 9:16 で並べる (縦型動画用)。 */
const OTHER_SERIES = { id: 'other', kicker: 'OTHER WORKS', titleJa: 'その他の作品', titleEn: 'Other Works', links: [] };
const seriesKey = value => String(value ?? '').trim();

/** 表示する作品をシリーズごとに分ける */
export function groupWorks(content) {
  const works = visible(content?.works);
  const series = visible(content?.series);
  const groups = series
    .map(item => ({ series: item, works: works.filter(work => seriesKey(work.series) === item.id) }))
    .filter(group => group.works.length > 0);
  const known = new Set(series.map(item => item.id));
  const rest = works.filter(work => !known.has(seriesKey(work.series)));
  return { groups, rest };
}

function renderSeriesLinks(series) {
  const links = visible(series.links);
  if (!links.length && !series.linksNoteJa) return [];
  const label = series.linksLabel || `${series.titleJa}の公式アカウント`;
  const lines = [`    <nav class="series-links" aria-label="${escapeHtml(label)}">`];
  /* linksNoteJa / linksNoteEn / linksNoteHref: アカウントのボタンの上に添える一文 (例: 再生リストへの案内) */
  if (series.linksNoteJa) {
    const key = series.linksNoteEn ? `series-${series.id}-note` : '';
    const text = `<span${i18nAttr(key)}>${sanitizeHtml(series.linksNoteJa)}</span>`;
    lines.push(
      series.linksNoteHref
        ? `      <a class="series-links-note" href="${escapeHtml(series.linksNoteHref)}" target="_blank" rel="noopener">${text}<span aria-hidden="true"> →</span></a>`
        : `      <p class="series-links-note">${text}</p>`
    );
  }
  for (const link of links) {
    const icon = LINK_ICONS[link.icon] || LINK_ICONS.x;
    lines.push(
      `      <a class="series-link" href="${escapeHtml(link.href)}" target="_blank" rel="noopener">`,
      `        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="${icon.path}"></path></svg>`,
      `        <span class="series-link-name">${escapeHtml(link.name || icon.label)}</span>`
    );
    if (link.handle) lines.push(`        <span class="series-link-id">${escapeHtml(link.handle)}</span>`);
    lines.push('      </a>');
  }
  lines.push('    </nav>');
  return lines;
}

function renderSeriesBlock(series, works, other = false, { limit = 0, assetPrefix = '' } = {}) {
  /* orientation: vertical → 9:16 サムネ + ブロック全体を細く / columns: 2 → 2列 / lead: true → 1枚目を上の段の真ん中に1枚だけ置く */
  const vertical = series.orientation === 'vertical';
  /* トップページは1行 (4枚) の表示域のまま。あふれたシリーズは横にスライドして残りを見せる */
  const slider = limit > 0 && works.length > limit;
  const gridClass = ['works-grid', vertical ? 'vertical' : '', series.columns === 2 ? 'cols-2' : '', series.lead === true && !slider ? 'lead-first' : '',
    series.lead === true && !slider && renderWorkPosts(works[0]) ? 'lead-posts' : '', slider ? 'works-slider' : '']
    .filter(Boolean)
    .join(' ');
  const titleKey = other ? 't-works-other' : series.titleEn ? `series-${series.id}-title` : '';
  const descKey = series.descEn ? `series-${series.id}-desc` : '';
  const lines = [
    `<div class="works-series${other ? ' works-series-other' : ''}${vertical ? ' works-series-narrow' : ''}${series.id === 'lyric-motion' ? ' works-series--stacked-links' : ''} reveal" id="series-${escapeHtml(series.id)}">`,
    '  <div class="series-head">',
    '    <div class="series-heading">'
  ];
  if (series.kicker) lines.push(`      <p class="series-kicker">${escapeHtml(series.kicker)}</p>`);
  lines.push(`      <h3 class="series-title"${i18nAttr(titleKey)}>${escapeHtml(series.titleJa)}</h3>`);
  if (series.descJa) lines.push(`      <p class="series-desc"${i18nAttr(descKey)}>${sanitizeHtml(series.descJa)}</p>`);
  lines.push('    </div>', ...renderSeriesLinks(series), '  </div>');
  /* lead のシリーズで1枚目に posts があれば、1枚目のカードの右 (同じ段) に投稿を置く */
  const leadPosts = series.lead === true && !slider ? renderWorkPosts(works[0]) : '';
  const cards = indentBlock(works.map((work, i) => renderWorkCard(work, 4, { assetPrefix }) + (i === 0 && leadPosts ? '\n\n' + leadPosts : '')).join('\n\n').split('\n'), slider ? '      ' : '    ');
  if (slider) {
    /* 送りボタンは script.js がクリックを拾う (再描画されても効くよう document で委譲) */
    lines.push(
      '  <div class="works-slider-wrap">',
      `    <div class="${gridClass}" tabindex="0">`,
      cards,
      '    </div>',
      '    <div class="works-slider-nav">',
      '      <button class="works-slider-btn" type="button" data-slider-dir="-1" aria-label="前の作品"><span aria-hidden="true">‹</span></button>',
      '      <button class="works-slider-btn" type="button" data-slider-dir="1" aria-label="次の作品"><span aria-hidden="true">›</span></button>',
      '    </div>',
      '  </div>'
    );
  } else {
    lines.push(`  <div class="${gridClass}">`, cards, '  </div>');
  }
  lines.push('</div>');
  return lines.join('\n');
}

/* トップページの WORKS。1シリーズの表示域は SERIES_LIMIT 枚 (1行) で、
   それを超えたシリーズは横スライドで残りを見せる。全作品の一覧は /works/。 */
export const SERIES_LIMIT = 5;  /* 2026-10-21 に 4→5（作品の節の幅を広げたので。りあ指示「最初に表示される動画が5個くらいに」） */
const WORKS_PAGE_HREF = 'works/';

export function renderWorks(content, indent = '      ') {
  const { groups, rest } = groupWorks(content);
  const options = { limit: SERIES_LIMIT };
  const blocks = groups.map(group => renderSeriesBlock(group.series, group.works, false, options));
  if (rest.length) {
    if (groups.length) {
      blocks.push(renderSeriesBlock(OTHER_SERIES, rest, true, options));
    } else {
      /* シリーズ未設定のときは、これまで通りカードだけを並べる */
      blocks.push(['<div class="works-grid">', indentBlock(rest.map(work => renderWorkCard(work)).join('\n\n').split('\n'), '  '), '</div>'].join('\n'));
    }
  }
  blocks.push(
    [
      '<p class="works-all-link reveal">',
      `  <a class="works-more-link" href="${WORKS_PAGE_HREF}" data-i18n="t-works-all">すべての作品を見る<span aria-hidden="true"> →</span></a>`,
      '</p>'
    ].join('\n')
  );
  return indentBlock(blocks.join('\n\n').split('\n'), indent);
}

/* 一覧ページ (/works/) の WORKS。枚数の上限なしで全作品を並べる。
   1つ下の階層なので、画像パスには '../' を足す。 */
export function renderAllWorks(content, indent = '      ') {
  const { groups, rest } = groupWorks(content);
  const options = { assetPrefix: '../' };
  const blocks = groups.map(group => renderSeriesBlock(group.series, group.works, false, options));
  if (rest.length) blocks.push(renderSeriesBlock(OTHER_SERIES, rest, true, options));
  return indentBlock(blocks.join('\n\n').split('\n'), indent);
}

/* ---------- PROFILE (カード) ---------- */
export function renderProfileCard(content, indent = '      ') {
  const p = content?.profile ?? {};
  const lines = [
    '<div class="profile-icon">',
    `  <img src="${escapeHtml(p.icon)}" alt="${escapeHtml(p.iconAlt)}">`,
    '</div>',
    '<div class="profile-text">',
    `  <h3 class="profile-name">${escapeHtml(p.name)} <span>${escapeHtml(p.nameSuffix)}</span></h3>`,
    `  <p class="profile-role">${escapeHtml(p.role)}</p>`,
    `  <p${i18nAttr(p.bioEn ? 'prof-bio' : '')}>${sanitizeHtml(p.bioJa)}</p>`,
    `  <p class="profile-affil"${i18nAttr(p.affiliationEn ? 'prof-affil' : '')}>${sanitizeHtml(p.affiliationJa)}</p>`,
    '</div>'
  ];
  return indentBlock(lines, indent);
}

/* ---------- PROFILE (タイムライン) ---------- */
export function renderTimeline(content, indent = '      ') {
  const blocks = visible(content?.profile?.timeline).map(item => {
    const cls = item.award ? 'timeline-item award' : 'timeline-item';
    return [
      `<div class="${cls}">`,
      `  <time>${escapeHtml(item.date)}</time>`,
      '  <div>',
      `    <h4>${escapeHtml(item.title)}</h4>`,
      `    <p${i18nAttr(item.bodyEn ? `${item.id}-p` : '')}>${sanitizeHtml(item.bodyJa)}</p>`,
      '  </div>',
      '</div>'
    ].join('\n');
  });
  return indentBlock(blocks.join('\n').split('\n'), indent);
}

/* ---------- LINKS ---------- */
export function renderLinks(content, indent = '      ') {
  const blocks = visible(content?.links?.items).map(item => {
    const icon = LINK_ICONS[item.icon] || LINK_ICONS.x;
    return [
      `<a class="link-card" href="${escapeHtml(item.href)}" target="_blank" rel="noopener">`,
      `  <svg viewBox="0 0 24 24" width="${icon.size}" height="${icon.size}" fill="currentColor"><path d="${icon.path}"></path></svg>`,
      `  <span class="link-name">${escapeHtml(item.name)}</span>`,
      `  <span class="link-id">${escapeHtml(item.handle)}</span>`,
      '</a>'
    ].join('\n');
  });
  const hidden = (content?.links?.items ?? []).filter(item => item && item.hidden === true);
  if (hidden.length) {
    blocks.push(`<!-- 非表示中のリンク (管理画面で hidden=true): ${hidden.map(i => i.name).join(' / ')} -->`);
  }
  return indentBlock(blocks.join('\n').split('\n'), indent);
}

/* ---------- LINKS: コンタクト文 ---------- */
export function renderContact(content) {
  return sanitizeHtml(content?.links?.contactJa);
}

/* ---------- data-i18n → 英語文 の辞書を組み立てる ---------- */
export function buildEnDict(content) {
  const dict = {};
  const set = (key, value) => {
    if (key && value) dict[key] = sanitizeHtml(value);
  };
  for (const item of visible(content?.news)) set(item.id, item.bodyEn);
  for (const work of visible(content?.works)) {
    set(`${work.id}-badge`, String(work.badgeEn ?? '').replace(/^🏆\s*/u, ''));
    set(`${work.id}-meta`, work.metaEn);
    set(`${work.id}-desc`, work.descEn);
    for (const link of visible(work.links)) set(link.labelKey, link.labelEn);
  }
  for (const item of visible(content?.series)) {
    set(`series-${item.id}-title`, item.titleEn);
    set(`series-${item.id}-desc`, item.descEn);
    set(`series-${item.id}-note`, item.linksNoteEn);
  }
  const grouped = groupWorks(content);
  if (grouped.groups.length && grouped.rest.length) set('t-works-other', OTHER_SERIES.titleEn);
  set('prof-bio', content?.profile?.bioEn);
  set('prof-affil', content?.profile?.affiliationEn);
  for (const item of visible(content?.profile?.timeline)) set(`${item.id}-p`, item.bodyEn);
  set('contact', content?.links?.contactEn);
  return dict;
}

/* ---------- 描画対象セクションの定義 ---------- */
/* key: index.html のマーカー名 / selector: ブラウザ側のコンテナ */
export const SECTIONS = [
  { key: 'news', selector: '.news-list', render: renderNews, indent: '      ' },
  { key: 'works', selector: '.works-body', render: renderWorks, indent: '      ' },
  /* 作品一覧ページ (public/works/index.html) だけが持つコンテナ。
     トップページには .works-all-body が無いので、この節は素通りする。 */
  { key: 'works-all', selector: '.works-all-body', render: renderAllWorks, indent: '      ' },
  { key: 'profile', selector: '.profile-card', render: renderProfileCard, indent: '      ' },
  { key: 'timeline', selector: '.timeline', render: renderTimeline, indent: '      ' },
  { key: 'links', selector: '.links-grid', render: renderLinks, indent: '      ' },
  { key: 'contact', selector: '.contact-note', render: renderContact, indent: '' }
];

/* ---------- バリデーション (Worker の PUT / ビルド時に使う) ---------- */
export function validateContent(content) {
  const errors = [];
  const req = (cond, message) => { if (!cond) errors.push(message); };

  req(content && typeof content === 'object' && !Array.isArray(content), 'content はオブジェクトである必要があります');
  if (errors.length) return errors;

  req(Array.isArray(content.news), 'news は配列である必要があります');
  req(Array.isArray(content.works), 'works は配列である必要があります');
  req(content.profile && typeof content.profile === 'object', 'profile が必要です');
  req(content.links && typeof content.links === 'object', 'links が必要です');
  if (errors.length) return errors;

  req(Array.isArray(content.profile.timeline), 'profile.timeline は配列である必要があります');
  req(Array.isArray(content.links.items), 'links.items は配列である必要があります');
  if (errors.length) return errors;

  const seen = new Set();
  content.news.forEach((item, i) => {
    req(item && typeof item.id === 'string' && item.id.trim() !== '', `news[${i}]: id が必要です`);
    if (item && item.id) {
      req(!seen.has(`news:${item.id}`), `news[${i}]: id が重複しています (${item.id})`);
      seen.add(`news:${item.id}`);
    }
    req(item && typeof item.bodyJa === 'string' && item.bodyJa.trim() !== '', `news[${i}]: bodyJa が必要です`);
    req(item && typeof item.date === 'string' && item.date.trim() !== '', `news[${i}]: date が必要です`);
  });

  content.works.forEach((work, i) => {
    req(work && typeof work.id === 'string' && work.id.trim() !== '', `works[${i}]: id が必要です`);
    if (work && work.id) {
      req(!seen.has(`works:${work.id}`), `works[${i}]: id が重複しています (${work.id})`);
      seen.add(`works:${work.id}`);
    }
    req(work && typeof work.title === 'string' && work.title.trim() !== '', `works[${i}]: title が必要です`);
    req(work && typeof work.image === 'string' && work.image.trim() !== '', `works[${i}]: image が必要です`);
    req(work?.series === undefined || work?.series === null || typeof work.series === 'string', `works[${i}]: series は文字列 (シリーズの id) である必要があります`);
    req(work?.badgeType === undefined || work?.badgeType === '' || BADGE_TYPES.has(work.badgeType), `works[${i}]: badgeType は award / honor / default のいずれか`);
    req(work?.links === undefined || Array.isArray(work.links), `works[${i}]: links は配列である必要があります`);
    (Array.isArray(work?.links) ? work.links : []).forEach((link, j) => {
      req(link && isSafeUrl(link.href), `works[${i}].links[${j}]: href が不正です`);
    });
  });

  if (content.series !== undefined) {
    req(Array.isArray(content.series), 'series は配列である必要があります');
    (Array.isArray(content.series) ? content.series : []).forEach((item, i) => {
      req(item && typeof item.id === 'string' && item.id.trim() !== '', `series[${i}]: id が必要です`);
      if (item && item.id) {
        req(!seen.has(`series:${item.id}`), `series[${i}]: id が重複しています (${item.id})`);
        req(item.id !== OTHER_SERIES.id, `series[${i}]: id "${OTHER_SERIES.id}" は予約語です`);
        seen.add(`series:${item.id}`);
      }
      req(item && typeof item.titleJa === 'string' && item.titleJa.trim() !== '', `series[${i}]: titleJa が必要です`);
      req(!item?.orientation || item.orientation === 'vertical' || item.orientation === 'landscape', `series[${i}]: orientation は vertical / landscape のいずれか`);
      req(item?.columns === undefined || item.columns === 2 || item.columns === 3, `series[${i}]: columns は 2 / 3 のいずれか`);
      req(item?.links === undefined || Array.isArray(item.links), `series[${i}]: links は配列である必要があります`);
      (Array.isArray(item?.links) ? item.links : []).forEach((link, j) => {
        req(link && isSafeUrl(link.href), `series[${i}].links[${j}]: href が不正です`);
        req(link && LINK_ICONS[link?.icon] !== undefined, `series[${i}].links[${j}]: icon は ${Object.keys(LINK_ICONS).join(' / ')} のいずれか`);
      });
    });
  }

  content.profile.timeline.forEach((item, i) => {
    req(item && typeof item.id === 'string' && item.id.trim() !== '', `timeline[${i}]: id が必要です`);
    req(item && typeof item.title === 'string' && item.title.trim() !== '', `timeline[${i}]: title が必要です`);
  });

  content.links.items.forEach((item, i) => {
    req(item && isSafeUrl(item.href), `links.items[${i}]: href が不正です`);
    req(item && typeof item.name === 'string' && item.name.trim() !== '', `links.items[${i}]: name が必要です`);
    req(item && LINK_ICONS[item?.icon] !== undefined, `links.items[${i}]: icon は ${Object.keys(LINK_ICONS).join(' / ')} のいずれか`);
  });

  req(visible(content.news).length > 0 || content.news.length === 0, 'news の検証に失敗しました');
  req(visible(content.works).length > 0, 'works は最低1件、表示状態のものが必要です');

  return errors;
}
