/* りあ / Leer — CREATIVE PROCESS */

(() => {
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let time = 0;

  const makeStars = () => {
    const count = Math.min(180, Math.floor((width * height) / 8500));
    stars = Array.from({length: count}, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.15 + .25,
      phase: Math.random() * Math.PI * 2,
      speed: .3 + Math.random(),
      aqua: document.body.classList.contains('lumia-case-body') && Math.random() < .48,
      sparkle: Math.random() < .09
    }));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  };

  const drawSparkle = (x, y, size, alpha, color) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * .15, -size * .15, size, 0);
    ctx.quadraticCurveTo(size * .15, size * .15, 0, size);
    ctx.quadraticCurveTo(-size * .15, size * .15, -size, 0);
    ctx.quadraticCurveTo(-size * .15, -size * .15, 0, -size);
    ctx.fill();
    ctx.restore();
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    time += .016;
    for (const star of stars) {
      const alpha = reduced ? .55 : .3 + .55 * Math.abs(Math.sin(star.phase + time * star.speed));
      const color = star.aqua ? '#73f2e3' : '#e7c87a';
      if (star.sparkle) {
        drawSparkle(star.x, star.y, star.radius * 4, alpha * .75, color);
      } else {
        ctx.globalAlpha = alpha * .65;
        ctx.fillStyle = star.aqua ? '#9bf8ef' : '#cfd8ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!reduced) requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

(() => {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 32);
  window.addEventListener('scroll', update, {passive: true});
  update();
})();

(() => {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();

(() => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }, {threshold: .1, rootMargin: '0px 0px -5%'});
  targets.forEach(target => observer.observe(target));
})();
