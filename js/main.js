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

  const footer = document.querySelector('footer');
  if (footer && !footer.querySelector('.footer-social')) {
    footer.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="tablas-creek-logo.png" alt="Tablas Creek" class="footer-logo-img">
            <p>Business Process Outsourcing Services<br>from Tablas Island, Philippines.</p>
            <div class="footer-contact"><a href="mailto:hello@tablascreek.com">hello@tablascreek.com</a><a href="tel:+6321234567">+63 (2) 1234 5678</a></div>
            <div class="footer-social" role="list" aria-label="Social media">
              <a href="#" aria-label="Tablas Creek on LinkedIn" role="listitem"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg></a>
              <a href="#" aria-label="Tablas Creek on Facebook" role="listitem"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.55c0-.92.26-1.55 1.58-1.55h1.68V3.14C16.47 3.1 15.44 3 14.24 3c-2.5 0-4.22 1.53-4.22 4.34v2.27H7.25v3.19h2.77V21h3.48z"/></svg></a>
            </div>
          </div>
          <div class="footer-links"><h4>Company</h4><a href="about.html">Our Story</a><a href="why-us.html">Why Choose Us</a><a href="culture.html">Our Culture</a><a href="process.html">How It Works</a></div>
          <div class="footer-links"><h4>Services</h4><a href="accounting.html">Accounting &amp; Finance</a><a href="engineering.html">Engineering &amp; Technical</a><a href="creative.html">Creative &amp; IT</a></div>
          <div class="footer-links"><h4>Industries</h4><a href="industries.html">All Industries</a><a href="industries-professional-financial.html">Professional &amp; Financial</a><a href="industries-engineering-utilities.html">Engineering &amp; Utilities</a><a href="industries-technology-media.html">Technology &amp; Media</a><a href="industries-healthcare-consumer.html">Healthcare &amp; Consumer</a></div>
          <div class="footer-links"><h4>Connect</h4><a href="contact.html">Contact Us</a><a href="careers.html">Careers</a></div>
        </div>
        <div class="footer-bottom"><p class="copyright">&copy; <span data-current-year>2026</span> Tablas Creek. All rights reserved.</p><div class="footer-legal"><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div><a href="#main" class="back-to-top">Back to top &uarr;</a></div>
      </div>`;
  }

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
