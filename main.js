// ── Scroll reveal (IntersectionObserver) ─────────────────────────
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-item').forEach(el => {
    if (prefersReduced) {
      el.classList.add('is-visible');
    } else {
      observer.observe(el);
    }
  });
})();

// ── Mobile nav toggle ─────────────────────────────────────────────
(function () {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');
  const nav        = document.getElementById('site-nav');
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

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) closeMenu();
  });
})();

// ── Nav scroll state (add scrolled class for visual change) ───────
(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 24);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Keyboard navigation enhancement ──────────────────────────────
(function () {
  // Highlight active section in nav
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-tab[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'nav-tab--active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();

// ── Download click feedback ───────────────────────────────────────
(function () {
  document.querySelectorAll('.req-item').forEach(link => {
    link.addEventListener('click', function () {
      const arrow = this.querySelector('.req-arrow');
      if (!arrow) return;
      const orig = arrow.textContent;
      arrow.textContent = '✓';
      arrow.classList.add('req-arrow--done');
      setTimeout(() => {
        arrow.textContent = orig;
        arrow.classList.remove('req-arrow--done');
      }, 2500);
    });
  });
})();
