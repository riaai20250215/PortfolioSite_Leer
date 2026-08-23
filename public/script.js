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

/* ---------- ナビのアクティブ表示 ---------- */
(() => {
  const links = [...document.querySelectorAll('.site-nav a')];
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
    /* content:en:start */
    "news-lumia": "Submitted \"Lumia\", a 30-second short MV, to the official TapNow project \"Lumia and the Ocean of Beginnings\". <a href=\"https://x.com/ria_aicreator/status/2084414571994095778\" target=\"_blank\" rel=\"noopener\">View post</a>",
    "news-1": "Official website launched.",
    "news-2": "\"Mayonaka no Jibun Kaigi\" (Midnight Meeting with Myself) won the <strong>Best MV Award</strong> at SousakuAI Agent Creation Cup 2026 Vol.2. <a href=\"https://x.com/ria_aicreator/status/2083169721801932825\" target=\"_blank\" rel=\"noopener\">Announcement post</a>",
    "news-pinyo": "Featured on \"Pinyokio\" as a partner creator of AiHUB Inc. <a href=\"https://pinyo.jp/\" target=\"_blank\" rel=\"noopener\">pinyo.jp</a>",
    "news-3": "Launched the official site for the original anime project \"Post Anima\". <a href=\"https://post-anima.official-leer.workers.dev/\" target=\"_blank\" rel=\"noopener\">Visit the site</a>",
    "news-4": "\"Naimononedari\" won the <strong>Best Visual Award</strong> at SousakuAI Agent Creation Cup 2026 Vol.1. <a href=\"https://x.com/ria_aicreator/status/2055273706545696859\" target=\"_blank\" rel=\"noopener\">Announcement post</a>",
    "news-5": "The short anime \"Ningen (Kari), Hajimemasu.\" passed the first-round selection at WAIFF.",
    "news-6": "Submitted the anime teaser \"Koe no Rashinban\" to PocketANIME World Competition.",
    "w-seiron-allergy-badge": "Independent Work",
    "w-seiron-allergy-meta": "2026 — MUSIC VIDEO (2 min 41 sec)",
    "w-seiron-allergy-desc": "An independently produced 2-minute-41-second music video set in an examination room. When \"it's for your own good\" is handed over, her body rejects it before her words can. A quiet revolt against the gentle violence of lectures and well-meant advice — the fourth song by NiL, who never raises her voice and answers with a cough instead.",
    "lnk-yt": "Watch on YouTube →",
    "lnk-post": "View post →",
    "w-lumia-badge": "TapNow Project Entry",
    "w-lumia-desc": "An entry for the official TapNow project \"Lumia and the Ocean of Beginnings\". A 30-second short MV depicting Lumia and her companions' world, set to the song \"Lumia\" — exactly 30 seconds packed with the characters' charm.",
    "w1-badge": "🏆 Best MV Award",
    "w1-desc": "2 a.m. — unable to sleep, a one-person \"meeting\" convenes inside her head. The chair, the clerk, and the one on trial are all the same girl. A 2'34\" hyperpop MV that reimagines sleepless thought-loops through bureaucratic motifs: minutes, sticky notes, and votes. Winner of the Best MV Award at SousakuAI Agent Creation Cup 2026 Vol.2.",
    "w2-badge": "Top 50 Nominees",
    "w2-desc": "A world where feelings spilled from human hearts turn into monsters. Wounded couriers keep searching for the souls' addresses — not to erase the feelings, but to return them. A postal-fantasy anime project covering worldbuilding, story, characters, and a full first episode. Selected among the Top 50 nominees at COLOTEK.",
    "lnk-site": "Official site →",
    "w3-badge": "🏆 Best Visual Award",
    "w3-desc": "Nil, a colorless white-haired girl, wraps herself in fragments of the world's colors — other people's lives — only to lose them, until she finally embraces \"the freedom of becoming nothing\". A 2-minute MV. Winner of the Best Visual Award at SousakuAI Agent Creation Cup 2026 Vol.1.",
    "w4-badge": "Seedance 2.0 × Lovart Entry",
    "w4-desc": "A short anime that translates a part of my own life into fantasy. Three staff-bearers trace the whereabouts of a lost starry sky. Submitted to the Seedance 2.0 × Lovart contest.",
    "w5-badge": "WAIFF First-round Selected",
    "w5-meta": "2026 — SHORT ANIME (approx. 10 min)",
    "w5-desc": "Rin, a humanoid girl, can derive the \"optimal answer\" more calmly than anyone. But does that answer truly reach anyone's heart? A human drama / sci-fi short about a girl who keeps growing as one existence. Produced over about a month.",
    "w6-badge": "Independent Work",
    "w6-desc": "An independent AI-produced music video. Two people pass each other across a neon heart, while \"the words you gave me\" keep glowing through the night.",
    "w7-desc": "My first serious work with generative video AI — an anime teaser submitted to PocketANIME World Competition. This is where my journey as an AI creator truly began.",
    "prof-bio": "I create stories, films, and characters with AI as my creative partner, under the theme of \"moving people's hearts\". I love manga and anime, and encountering generative AI brought me back to creating. I aim for works that linger in your heart and become a small turning point.",
    "prof-affil": "<span class=\"affil-label\">AFFILIATION</span>Partner creator of AiHUB Inc. — featured on \"<a href=\"https://pinyo.jp/\" target=\"_blank\" rel=\"noopener\">Pinyokio</a>\"",
    "tl1-p": "Submitted an anime teaser to PocketANIME World Competition — my first serious work with generative video AI.",
    "tl2-p": "Passed the first-round selection at WAIFF (World AI Film Festival) with a 10-minute short anime produced over about a month.",
    "tl3-p": "Won the Best Visual Award at SousakuAI Agent Creation Cup 2026 Vol.1.",
    "tl4-p": "Launched an original anime project — worldbuilding, characters, a first episode, and an official site. Selected among the Top 50 nominees at COLOTEK.",
    "tl5-p": "Won the Best MV Award at SousakuAI Agent Creation Cup 2026 Vol.2 — the most competitive category.",
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
