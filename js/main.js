// main.js — Enhanced UX per ui-ux-pro-max skill
// Covers: mobile menu, scroll reveal, navbar state, smooth scroll, reduced-motion

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Menu ──────────────────────────────────────── */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  /* ── Nav dropdown (Services submenu) ─────────────────── */
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const toggle = item.querySelector('.nav-link-dropdown');
    if (!toggle) return;

    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');

    // Click toggles on touch/keyboard; hover handled by CSS on pointer devices
    toggle.addEventListener('click', (e) => {
      const isTouch = matchMedia('(hover: none)').matches;
      if (isTouch) {
        e.preventDefault();
        const willOpen = !item.classList.contains('open');
        document.querySelectorAll('.has-dropdown.open').forEach(o => {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.nav-link-dropdown')?.setAttribute('aria-expanded', 'false'); }
        });
        item.classList.toggle('open', willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      }
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.has-dropdown.open').forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
        item.querySelector('.nav-link-dropdown')?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.has-dropdown.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector('.nav-link-dropdown')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ── Navbar scroll shadow ─────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
  }

  /* ── Scroll reveal — respects prefers-reduced-motion ──── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll(
      '.service-card, .step, .process-step-detailed, .industry-category, ' +
      '.value-card, .offering, .compare-card, .info-card, .story-grid > *'
    );

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = [...entry.target.parentElement.children];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 60}ms`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  }

  /* ── Smooth scroll for # links ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')) || 64;
          const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ── Active nav link highlight ───────────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

});

/* ── Calendly lazy load (contact page) ───────────────── */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
  const button = document.getElementById('loadCalendlyBtn');
  const placeholder = document.getElementById('calendlyPlaceholder');
  const container = document.getElementById('calendlyContainer');
  if (!button || !placeholder || !container) return;

  button.addEventListener('click', () => {
    const url = button.dataset.calendlyUrl;
    if (!url || container.dataset.loaded) return;
    container.dataset.loaded = 'true';
    placeholder.hidden = true;
    container.style.display = 'block';

    const mount = document.createElement('div');
    mount.className = 'calendly-inline-widget';
    mount.style.cssText = 'width:100%;height:650px';
    container.appendChild(mount);

    const initialize = () => window.Calendly?.initInlineWidget({ url, parentElement: mount });
    if (window.Calendly) {
      initialize();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = initialize;
    script.onerror = () => {
      container.style.display = 'none';
      placeholder.hidden = false;
      container.dataset.loaded = '';
    };
    document.head.appendChild(script);
  });
});
