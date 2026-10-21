/* りあ / Leer — Official Site (PRISM NIGHT) */

/* ---------- 星空キャンバス ---------- */
(() => {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  }

  function makeStars() {
    const count = Math.min(160, Math.floor((w * h) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      // 1割ほどを金色の「✦」型スパークルに
      sparkle: Math.random() < 0.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.9,
      gold: Math.random() < 0.45
    }));
  }

  function drawSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#e7c87a';
    ctx.beginPath();
    // 4方向に尖る星型 (アイコンの✦に合わせる)
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.16, -size * 0.16, size, 0);
    ctx.quadraticCurveTo(size * 0.16, size * 0.16, 0, size);
    ctx.quadraticCurveTo(-size * 0.16, size * 0.16, -size, 0);
    ctx.quadraticCurveTo(-size * 0.16, -size * 0.16, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  let t = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    t += 0.016;
    for (const s of stars) {
      const tw = reduced ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(s.phase + t * s.speed));
      if (s.sparkle) {
        drawSparkle(s.x, s.y, s.r * 4.2, tw * 0.9);
      } else {
        ctx.globalAlpha = tw * 0.8;
        ctx.fillStyle = s.gold ? '#e7c87a' : '#cfd8ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
})();

/* ---------- ヘッダー: スクロールですりガラス化 ---------- */
(() => {
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- モバイルナビ ---------- */
(() => {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
})();

/* ---------- スクロールリビール ---------- */
/* content.js が再描画したあとにも呼べるよう window に公開する */
(() => {
  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  const observe = (root = document) => {
    root.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
  };
  window.leerObserveReveals = observe;
  observe();
})();

/* ---------- 作品の横スライド (4枚を超えたシリーズ) ---------- */
/* content.js が WORKS を描き直しても効くよう、クリックとスクロールは document で拾う */
(() => {
  const update = slider => {
    const nav = slider.parentElement?.querySelector('.works-slider-nav');
    if (!nav) return;
    const max = slider.scrollWidth - slider.clientWidth - 2;
    nav.querySelector('[data-slider-dir="-1"]').disabled = slider.scrollLeft <= 2;
    nav.querySelector('[data-slider-dir="1"]').disabled = slider.scrollLeft >= max;
  };
  const updateAll = () => document.querySelectorAll('.works-slider').forEach(update);
  window.leerUpdateSliders = updateAll;

  /* X の投稿の大きさ合わせ。埋め込みは data-post-width の幅で組まれる。3つを同じ倍率で、列の幅と、
     カードの右に並べるとき (--fit-height: 1) はカードの高さに収まるまで縮める (2026-10-21 りあ指示「カードの位置・縦幅に合わせて横並びに」)。
     data-clip-bottom の投稿は、組んだ幅での下からその高さを隠す (AoKi さんの受賞の報告の引用)。
     data-keep-footer があれば、2つ目の埋め込みの下からその高さ (日付・いいね・返信の欄) だけを、すぐ下に出す */
  const fitWorkPosts = box => {
    if (!box) return;
    const posts = [...box.querySelectorAll('.work-post')];
    const sizes = posts.map(p => {
      const [frame, footFrame] = p.querySelectorAll('iframe');
      if (!frame || !(frame.offsetHeight > 0)) return null;
      const keep = Number(p.dataset.keepFooter) || 0;
      const foot = keep && footFrame && footFrame.offsetHeight > keep ? keep : 0;
      return { top: Math.max(1, frame.offsetHeight - (Number(p.dataset.clipBottom) || 0)), foot, shift: foot ? footFrame.offsetHeight - keep : 0 };
    });
    if (!sizes.some(Boolean)) return;
    const width = Number(box.dataset.postWidth) || 280;
    const cs = getComputedStyle(box);
    const col = parseFloat(cs.gridTemplateColumns) || box.clientWidth;
    const fitH = cs.getPropertyValue('--fit-height').trim() === '1' ? box.clientHeight : Infinity;
    if (!(col > 0) || !(fitH > 0)) return;
    const scale = Math.min(1, col / width, fitH / Math.max(...sizes.filter(Boolean).map(z => z.top + z.foot)));
    posts.forEach((p, i) => {
      const z = sizes[i];
      if (!z) return;
      const [part, footPart] = p.querySelectorAll('.work-post-part');
      p.style.setProperty('--post-w', `${width}px`);
      p.style.setProperty('--post-s', scale.toFixed(4));
      p.style.setProperty('--foot-shift', String(z.shift));
      p.style.width = `${width * scale}px`;
      part.style.height = `${z.top * scale}px`;
      if (footPart) footPart.style.height = `${z.foot * scale}px`;
      p.style.height = `${(z.top + z.foot) * scale + (p.dataset.clipBottom && !z.foot ? 1 : 0)}px`;
      p.classList.toggle('has-foot', z.foot > 0);
      p.classList.add('is-fit');
    });
  };
  /* 投稿の高さ (画像が読めると伸びる) と、列・カードの大きさが変わったら合わせ直す */
  const postSizes = 'ResizeObserver' in window
    ? new ResizeObserver(entries => new Set(entries.map(en => en.target.closest('.work-posts'))).forEach(fitWorkPosts))
    : null;

  /* X の投稿の埋め込み (作品の .twitter-tweet)。content.js が中身を決めたあとに呼ぶ。widgets.js は1回だけ読み込む */
  window.leerLoadPosts = () => {
    const boxes = document.querySelectorAll('.work-posts');
    boxes.forEach(box => postSizes?.observe(box));
    if (!document.querySelector('blockquote.twitter-tweet')) { boxes.forEach(fitWorkPosts); return; }
    if (window.twttr?.widgets) { window.twttr.widgets.load(); return; }
    if (document.getElementById('x-widgets')) return;
    /* widgets.js より先に ready の受け口を置く (X の公式の読み込み方)。描けた投稿から大きさを合わせる */
    const tw = window.twttr = window.twttr || {};
    tw._e = tw._e || [];
    tw.ready = tw.ready || (f => tw._e.push(f));
    tw.ready(t => t.events.bind('rendered', e => {
      postSizes?.observe(e.target);
      fitWorkPosts(e.target.closest?.('.work-posts'));
    }));
    const s = document.createElement('script');
    s.id = 'x-widgets'; s.async = true; s.charset = 'utf-8';
    s.src = 'https://platform.twitter.com/widgets.js';
    document.head.append(s);
  };
  /* NEWS の「もっと見る」(再描画されても効くよう document で委譲) */
  document.addEventListener('click', e => {
    const more = e.target.closest('.news-more-btn');
    if (!more) return;
    const list = more.closest('.news-list');
    const open = list.classList.toggle('is-open');
    more.setAttribute('aria-expanded', String(open));
    if (!open) list.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-slider-dir]');
    if (!btn) return;
    const slider = btn.closest('.works-slider-wrap')?.querySelector('.works-slider');
    if (!slider) return;
    /* 1枚ぶん (カード幅 + 隙間) ずつ送る */
    const card = slider.querySelector('.work-card');
    const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
    const step = card ? card.getBoundingClientRect().width + gap : slider.clientWidth;
    slider.scrollBy({ left: Number(btn.dataset.sliderDir) * step });
  });
  document.addEventListener(
    'scroll',
    e => {
      if (e.target instanceof Element && e.target.classList.contains('works-slider')) update(e.target);
    },
    true
  );
  window.addEventListener('resize', updateAll);
  updateAll();
})();

/* ---------- ナビのアクティブ表示 ---------- */
(() => {
  /* 同一ページ内のアンカー (#news 等) だけを見る。
     作品一覧ページのナビは '../#news' のような別ページ参照なので対象外 */
  const links = [...document.querySelectorAll('.site-nav a')]
    .filter(a => (a.getAttribute('href') || '').startsWith('#'));
  const sections = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const io = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          links.forEach(a =>
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
          );
        }
      }
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => io.observe(s));
})();

/* ---------- 言語切り替え (JP / EN) ---------- */
/* 英語文の大半は public/content.json 由来。
   下の content:en ブロックは `npm run build` が content.json から自動生成する。
   実行時に KV から新しいコンテンツを取得できた場合は content.js が上書きする。 */
(() => {
  const EN = {
    't-news': 'News',
    't-works': 'Works',
    't-profile': 'Profile',
    't-links': 'Links',
    /* 作品カードの説明文アコーディオン (content.json 由来ではないので手書き) */
    't-more': 'Read more',
    't-less': 'Close',
    /* NEWS の「もっと見る」(同上) */
    't-news-more': 'Show more',
    't-news-less': 'Show less',
    /* 作品一覧ページへの導線 (同上) */
    't-works-more': 'See the rest<span aria-hidden="true"> \u2192</span>',
    't-works-all': 'View all works<span aria-hidden="true"> \u2192</span>',
    't-works-all-title': 'All Works',
    't-works-all-lead': 'Every work, grouped by series.',
    't-works-back': '\u2190 Back to home',
    /* content:en:start */
    "news-arena-peak": "\"TALK BACK\" (TEAM ARS) won the Arena Peak Japan Award and a Finalist Award at the AI film hackathon ARENA PEAK ASIA. <a href=\"https://x.com/ria_aicreator/status/2111806895304671305\" target=\"_blank\" rel=\"noopener\">Announcement</a>",
    "news-ai-creators": "Listed as a registered creator on \"AI Creators\", a platform connecting companies with AI creators. <a href=\"https://en.ai-creators.tech/creators/leer/\" target=\"_blank\" rel=\"noopener\">Profile page</a>",
    "news-midnight-mart": "\"MIDNIGHT MART\", a Penny's House special, won the <strong>Horror Category Excellence Award</strong> at Super 30s Creation Cup 2026 (SousakuAI × Wan 3.0). <a href=\"https://x.com/sousakuai/status/2098399365194990061\" target=\"_blank\" rel=\"noopener\">Results post</a>",
    "news-archives-2026": "Featured in \"AI CREATORS FILE 2026\", the creator directory in \"AI Video Production Archives 2026\" (edited by VIDEO SALON, released August 27, 2026). <a href=\"https://x.com/videosalon/status/2092756024331760118\" target=\"_blank\" rel=\"noopener\">Announcement post</a>",
    "news-lumia": "Submitted \"Lumia\", a 30-second short MV, to the official TapNow project \"Lumia and the Ocean of Beginnings\". <a href=\"https://x.com/ria_aicreator/status/2084414571994095778\" target=\"_blank\" rel=\"noopener\">View post</a>",
    "news-1": "Official website launched.",
    "news-2": "\"Mayonaka no Jibun Kaigi\" (Midnight Meeting with Myself) won the <strong>Best MV Award</strong> at SousakuAI Agent Creation Cup 2026 Vol.2. <a href=\"https://x.com/ria_aicreator/status/2083169721801932825\" target=\"_blank\" rel=\"noopener\">Announcement post</a>",
    "news-pinyo": "Featured on \"Pinyokio\" as a partner creator of AiHUB Inc. <a href=\"https://pinyo.jp/\" target=\"_blank\" rel=\"noopener\">pinyo.jp</a>",
    "news-3": "Launched the official site for the original anime project \"Post Anima\". <a href=\"https://post-anima.official-leer.workers.dev/\" target=\"_blank\" rel=\"noopener\">Visit the site</a>",
    "news-4": "\"Naimononedari\" won the <strong>Best Visual Award</strong> at SousakuAI Agent Creation Cup 2026 Vol.1. <a href=\"https://x.com/ria_aicreator/status/2055273706545696859\" target=\"_blank\" rel=\"noopener\">Announcement post</a>",
    "news-5": "The short anime \"Ningen (Kari), Hajimemasu.\" passed the first-round selection at WAIFF.",
    "news-6": "Submitted the anime teaser \"Koe no Rashinban\" to PocketANIME World Competition.",
    "w-talkback-badge": "Arena Peak Japan Award / Finalist",
    "w-talkback-meta": "2026 — AI FILM HACKATHON / TEAM ARS",
    "w-talkback-desc": "Theme: \"Wadakamari\" (lingering resentment). Won the Arena Peak Japan Award and a Finalist Award at ARENA PEAK ASIA, a 32-hour AI film hackathon by TapNow × CreatorLabo × KlingAI held simultaneously in Shanghai, Tokyo and Seoul. TEAM ARS — Aoki¹⁰⁴ (Chief Director / Team Leader), Ria (Concept &amp; Screenplay), Sentaku (Sound Director). My first hackathon; I mainly handled the screenplay and video generation.",
    "lnk-post": "View post →",
    "w2-badge": "Top 50 Nominees",
    "w2-desc": "A world where feelings spilled from human hearts turn into monsters. Wounded couriers keep searching for the souls' addresses — not to erase the feelings, but to return them. A postal-fantasy anime project covering worldbuilding, story, characters, and a full first episode. Selected among the Top 50 nominees at COLOTEK.",
    "lnk-site": "Official site →",
    "w5-badge": "WAIFF First-round Selected",
    "w5-meta": "2026 — SHORT ANIME (approx. 10 min)",
    "w5-desc": "Rin, a humanoid girl, can derive the \"optimal answer\" more calmly than anyone. But does that answer truly reach anyone's heart? A human drama / sci-fi short about a girl who keeps growing as one existence. Produced over about a month.",
    "lnk-yt": "Watch on YouTube →",
    "w-midnight-mart-badge": "Horror Category Excellence Award",
    "w-midnight-mart-meta": "2026 — HORROR SHORT (2 min)",
    "w-midnight-mart-desc": "A late-night supermarket: shelves fully stocked, machines humming, and not a single customer. At the register stand two clerks with exactly the same face. Found-footage horror told through the recording left on Gav's phone. A non-canon special of Penny's House — two minutes, no dialogue, no music. Winner of the Horror Category Excellence Award at Super 30s Creation Cup 2026 (SousakuAI × Wan 3.0).",
    "lnk-tiktok": "Watch on TikTok →",
    "w-one-small-moment-badge": "Independent Work",
    "w-one-small-moment-meta": "2026 — VERTICAL MUSIC VIDEO (1 min 18 sec)",
    "w-one-small-moment-desc": "From a sunlit poolside to the same pool at night: Penny, Stella and Gav pass the song between them across five fisheye one-take clips, cut together into a 1-minute-18-second vertical MV. Built on the music and fisheye one-shot MV design by mankyu (@manaimovie), re-cast with the three of Penny's House. The title comes from the hook — \"One small moment, but it hit that way\".",
    "w-platform-badge": "Independent Work",
    "w-platform-meta": "2026 — VERTICAL MUSIC VIDEO (48 sec)",
    "w-platform-desc": "From the stairs of an elevated station after the last train, down an alley, to the front door of home. Penny, Stella and Gav in platform shoes sing their way through a 48-second one-take fisheye vertical MV. Original city-pop / nu-disco song and lyrics. PLATFORM: the shoes, the station, and the place we speak from.",
    "w-celebration-badge": "SousakuAI CPP Collab",
    "w-celebration-meta": "2026 — VERTICAL MUSIC VIDEO (53 sec)",
    "w-celebration-desc": "A vertical MV celebrating SousakuAI's 1st anniversary. Penny, Stella and Gav welcome guest character Umi-chan with a cake and a surprise, in 53 seconds. Produced on commission from SousakuAI as part of its Creator Partner Program (CPP). Generated with Seedance 2.5 on the SousakuAI platform.",
    "w-snowflake-badge": "Independent Work",
    "w-snowflake-meta": "2026 — MUSIC VIDEO (1 min 35 sec)",
    "w-snowflake-desc": "\"Snowflake\" is English slang for someone fragile and easily hurt — and also the name of a crystal of which no two are alike. NiL doesn't argue back; she keeps falling as a precise hexagon until the whole city is buried in white overnight. A 1-minute-35-second MV of quiet defiance against the labels others pin on you, told through lyric motion where every syllable drifts in on its own. After the four songs of anger, a new chapter begins.",
    "w-seiron-allergy-badge": "Independent Work",
    "w-seiron-allergy-meta": "2026 — MUSIC VIDEO (2 min 41 sec)",
    "w-seiron-allergy-desc": "An independently produced 2-minute-41-second music video set in an examination room. When \"it's for your own good\" is handed over, her body rejects it before her words can. A quiet revolt against the gentle violence of lectures and well-meant advice — the fourth song by NiL, who never raises her voice and answers with a cough instead.",
    "w1-badge": "Best MV Award",
    "w1-desc": "2 a.m. — unable to sleep, a one-person \"meeting\" convenes inside her head. The chair, the clerk, and the one on trial are all the same girl. A 2'39\" hyperpop MV that reimagines sleepless thought-loops through bureaucratic motifs: minutes, sticky notes, and votes. Winner of the Best MV Award at SousakuAI Agent Creation Cup 2026 Vol.2.",
    "w-kamisama-badge": "Zopia AI Video Contest Entry",
    "w-kamisama-meta": "2026 — MUSIC VIDEO (1 min)",
    "w-kamisama-desc": "She filed a complaint with God about the bugs in her life, and the answer came back: \"That's by design.\" So NiL clicks her tongue and tears down heaven's bureau. A one-minute dark-pop MV in a sacred-yet-clerical world of white, red, black and gold, scattered with forms, red stamps and a broken halo. NiL's second song, following \"Naimononedari\".",
    "w3-badge": "Best Visual Award",
    "w3-desc": "NiL, a colorless white-haired girl, wraps herself in fragments of the world's colors — other people's lives — only to lose them, until she finally embraces \"the freedom of becoming nothing\". A 3-minute-41-second MV. Winner of the Best Visual Award at SousakuAI Agent Creation Cup 2026 Vol.1.",
    "w-lyric-gum-badge": "Original",
    "w-lyric-gum-meta": "2026 — LYRIC MOTION",
    "w-lyric-gum-desc": "A 3D lyric-motion video for \"Gum\". Music by Suno, typography with JIZURA by 852wa, visuals built in Three.js.",
    "w-lyric-kurage-badge": "Original",
    "w-lyric-kurage-meta": "2026 — LYRIC MOTION",
    "w-lyric-kurage-desc": "A 3D lyric-motion video for \"Jellyfish\". Music by Suno, typography with JIZURA by 852wa, visuals built in Three.js.",
    "w-lyric-muffler-badge": "Original",
    "w-lyric-muffler-meta": "2026 — LYRIC MOTION",
    "w-lyric-muffler-desc": "A 3D lyric-motion video for \"Muffler\". Music by Suno, typography with JIZURA by 852wa, visuals built in Three.js.",
    "w-lyric-rousoku-badge": "Original",
    "w-lyric-rousoku-meta": "2026 — LYRIC MOTION",
    "w-lyric-rousoku-desc": "A 3D lyric-motion video for \"Candle\". Music by Suno, typography with JIZURA by 852wa, visuals built in Three.js.",
    "w-trick-or-rewind-badge": "TapNow Project Entry",
    "w-trick-or-rewind-meta": "2026 — MUSIC VIDEO (90 sec)",
    "w-trick-or-rewind-desc": "An entry for \"PATCHWORK DEAD\", a TapNow collaboration with Keigo Matsumaru. The townsfolk lose arms and eyeballs all too easily — so what if, played in reverse, their scattered parts snapped back together and started to dance? A Halloween dance MV built by generating collapses first and rewinding them, set to an original song full of reversed words and palindromes.",
    "w-lumia-badge": "TapNow Project Entry",
    "w-lumia-desc": "An entry for the official TapNow project \"Lumia and the Ocean of Beginnings\". A 30-second short MV depicting Lumia and her companions' world, set to the song \"Lumia\" — exactly 30 seconds packed with the characters' charm.",
    "w4-badge": "Seedance 2.0 × Lovart Entry",
    "w4-desc": "A short anime that translates a part of my own life into fantasy. Three staff-bearers trace the whereabouts of a lost starry sky. Submitted to the Seedance 2.0 × Lovart contest.",
    "w6-badge": "Independent Work",
    "w6-desc": "An independent AI-produced music video. Two people pass each other across a neon heart, while \"the words you gave me\" keep glowing through the night.",
    "w7-desc": "My first serious work with generative video AI — an anime teaser submitted to PocketANIME World Competition. This is where my journey as an AI creator truly began.",
    "series-featured-title": "Featured Works",
    "series-featured-desc": "An award-winning hackathon film, and original anime works built from the ground up — worldbuilding, story, characters and film.",
    "series-pennys-house-title": "Penny's House Series",
    "series-pennys-house-desc": "A 3DCG series about Penny, Stella and Gav sharing a house.<br>Vertical music videos and shorts, released under the BLANK ROOM label.",
    "series-nil-title": "NiL Series",
    "series-nil-desc": "A music-video series sung by the original character NiL. After four songs that turned four kinds of anger — at what is missing, at fate, at herself, at gentle violence — into quiet defiance, a new chapter begins with \"Snowflake\".",
    "series-nil-note": "Every NiL video is in the \"NiL\" playlist",
    "series-lyric-motion-title": "Lyric Motion MV Series",
    "series-lyric-motion-desc": "3D lyric-motion videos for short, catchy songs — extruded letters and paper textures moving to every word.",
    "t-works-other": "Other Works",
    "prof-bio": "I create stories, films, and characters with AI as my creative partner, under the theme of \"moving people's hearts\". I love manga and anime, and encountering generative AI brought me back to creating. I aim for works that linger in your heart and become a small turning point.",
    "prof-affil": "<span class=\"affil-label\">AFFILIATION</span>Partner creator of AiHUB Inc. — featured on \"<a href=\"https://pinyo.jp/\" target=\"_blank\" rel=\"noopener\">Pinyokio</a>\" / registered creator on \"<a href=\"https://en.ai-creators.tech/creators/leer/\" target=\"_blank\" rel=\"noopener\">AI Creators</a>\"",
    "tl1-p": "Submitted an anime teaser to PocketANIME World Competition — my first serious work with generative video AI.",
    "tl2-p": "Passed the first-round selection at WAIFF (World AI Film Festival) with a 10-minute short anime produced over about a month.",
    "tl3-p": "Won the Best Visual Award at SousakuAI Agent Creation Cup 2026 Vol.1.",
    "tl4-p": "Launched an original anime project — worldbuilding, characters, a first episode, and an official site. Selected among the Top 50 nominees at COLOTEK.",
    "tl5-p": "Won the Best MV Award at SousakuAI Agent Creation Cup 2026 Vol.2 — the most competitive category.",
    "tl6-p": "Won the Horror Category Excellence Award at Super 30s Creation Cup 2026 (SousakuAI × Wan 3.0) — a first attempt at 3DCG found-footage horror, made as a Penny's House special.",
    "tl-talkback-p": "\"TALK BACK\" by TEAM ARS won the Arena Peak Japan Award and a Finalist Award at the AI film hackathon ARENA PEAK ASIA (TapNow × CreatorLabo × KlingAI). My first hackathon — I handled the screenplay and video generation.",
    "contact": "For work inquiries and collaborations, feel free to DM me on X.",
    /* content:en:end */
  };

  const btnJa = document.getElementById('langJa');
  const btnEn = document.getElementById('langEn');
  if (!btnJa || !btnEn) return;

  let current = 'ja';

  function setLang(lang) {
    // content.js の再描画で要素が入れ替わるため、毎回引き直す
    [...document.querySelectorAll('[data-i18n]')].forEach(el => {
      const key = el.dataset.i18n;
      if (lang === 'en') {
        if (el.dataset.ja === undefined) el.dataset.ja = el.innerHTML;
        if (EN[key]) el.innerHTML = EN[key];
      } else if (el.dataset.ja !== undefined) {
        el.innerHTML = el.dataset.ja;
      }
    });
    current = lang === 'en' ? 'en' : 'ja';
    document.documentElement.lang = current;
    btnJa.classList.toggle('active', current !== 'en');
    btnEn.classList.toggle('active', current === 'en');
    try { localStorage.setItem('leer-lang', current); } catch (e) {}
  }

  btnJa.addEventListener('click', () => setLang('ja'));
  btnEn.addEventListener('click', () => setLang('en'));

  // content.js から呼ぶためのフック
  window.leerSetEnDict = extra => { Object.assign(EN, extra || {}); };
  window.leerApplyLang = () => setLang(current);
  window.leerCurrentLang = () => current;

  let saved = null;
  try { saved = localStorage.getItem('leer-lang'); } catch (e) {}
  if (saved === 'en') setLang('en');
})();

/* ---------- ライトボックス (ニルの系譜) ---------- */
(() => {
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const close = document.getElementById('lightboxClose');
  if (!box) return;

  document.querySelectorAll('.lineage-item').forEach(fig => {
    fig.addEventListener('click', () => {
      const src = fig.querySelector('img').src;
      const b = fig.querySelector('figcaption b')?.textContent ?? '';
      const s = fig.querySelector('figcaption span')?.textContent ?? '';
      img.src = src;
      img.alt = fig.querySelector('img').alt;
      caption.textContent = `${b} — ${s}`;
      box.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  const hide = () => {
    box.hidden = true;
    document.body.style.overflow = '';
  };
  close.addEventListener('click', hide);
  box.addEventListener('click', e => { if (e.target === box) hide(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) hide(); });
})();

/* ---------- ヒーローのキービジュアル切り替え ---------- */
(() => {
  const bg = document.getElementById('heroBg');
  if (!bg) return;
  const slides = [...bg.querySelectorAll('.hero-slide')];
  const credit = document.getElementById('heroCredit');
  if (slides.length < 2) return;

  // 動きを減らす設定なら1枚目のまま固定する
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const INTERVAL = 7000;
  let index = 0;
  let timer = null;

  // 2枚目以降は初期表示の邪魔をしないよう、読み込み完了後に取りに行く
  const preload = () => {
    slides.slice(1).forEach(slide => {
      const src = slide.dataset.bg;
      if (!src || slide.style.backgroundImage) return;
      const img = new Image();
      img.onload = () => { slide.style.backgroundImage = `url('${src}')`; };
      img.src = src;
    });
  };
  if (document.readyState === 'complete') preload();
  else window.addEventListener('load', preload, { once: true });

  const show = i => {
    slides[index].classList.remove('is-active');
    index = i;
    slides[index].classList.add('is-active');
    const text = slides[index].dataset.credit;
    if (credit && text) credit.textContent = text;
  };

  const next = () => {
    // まだ読み込めていない画は飛ばす
    for (let step = 1; step <= slides.length; step++) {
      const i = (index + step) % slides.length;
      if (slides[i].style.backgroundImage) { show(i); return; }
    }
  };

  const start = () => { if (!timer) timer = setInterval(next, INTERVAL); };
  const stop = () => { clearInterval(timer); timer = null; };

  // 裏のタブで回し続けない
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });
  start();
})();
