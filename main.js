// ── PDF stack parallax (Firefox fallback — scroll-driven CSS not supported) ──
(function () {
  if (CSS.supports('animation-timeline', 'scroll()')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pages = document.querySelectorAll('.pdf-page');
  if (!pages.length) return;

  // Mirror the CSS keyframe values: [rotate(deg), tx(px), ty(px), maxDrift(px)]
  const config = {
    '1': { r: -1.5, tx: 0,  ty: 0,  drift: 35 },
    '2': { r:  2.8, tx: 8,  ty: 8,  drift: 52 },
    '3': { r: -4,   tx: -6, ty: 16, drift: 66 },
  };

  const hero = document.querySelector('.hero');

  function tick() {
    const scrollY   = window.scrollY;
    const heroH     = hero ? hero.offsetHeight : window.innerHeight;
    const progress  = Math.min(scrollY / (heroH * 0.9), 1);

    pages.forEach(page => {
      const c = config[page.dataset.depth];
      if (!c) return;
      const driftedY = c.ty - c.drift * progress;
      page.style.transform = `rotate(${c.r}deg) translate(${c.tx}px, ${driftedY}px)`;
    });
  }

  window.addEventListener('scroll', tick, { passive: true });
})();

// ── Entrance animations ────────────────────────────────────────────
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.hero .animate-in').forEach(el => {
    requestAnimationFrame(() => el.classList.add('visible'));
  });

  document.querySelectorAll(':not(.hero) > .animate-in').forEach(el => observer.observe(el));
}

// ── Mobile nav toggle ──────────────────────────────────────────────
(function () {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  });

  // Close when any menu link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close when Escape is pressed
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();

// ── Carousel ───────────────────────────────────────────────────────
(function () {
  const track    = document.getElementById('carousel-track');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const dots     = document.querySelectorAll('.carousel-dot');
  const caption  = document.getElementById('carousel-caption');
  const slides   = track.querySelectorAll('.carousel-slide');
  const labels   = ['Home', 'Merge PDFs', 'Viewer with sidebar', 'Freeform mode', 'Remove pages'];
  const total    = slides.length;
  let current    = 0;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.setAttribute('aria-selected', i === current ? 'true' : 'false'));
    caption.textContent = labels[current];
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.index, 10)));
  });

  // Keyboard: left/right arrows when carousel is focused
  document.querySelector('.carousel').addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // Touch swipe
  let touchStartX = null;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    touchStartX = null;
  });
})();
