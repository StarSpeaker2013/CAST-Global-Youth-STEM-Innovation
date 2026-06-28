/* ============================================================
   CAST Global Youth Summit - Interactive Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar Scroll Effect ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile Menu Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  /* ---------- Track Tabs ---------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.track-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        // re-trigger reveal for newly displayed cards
        panel.querySelectorAll('.reveal').forEach(el => {
          el.classList.remove('visible');
          requestAnimationFrame(() => el.classList.add('visible'));
        });
      }
    });
  });

  /* ---------- People Tabs (Judges/Sponsors/Results) — nesting-safe ---------- */
  document.querySelectorAll('.pt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.ptab;
      const panel = document.getElementById(target);
      if (!panel) return;

      // Activate only the buttons within the same tab bar
      const bar = btn.closest('.people-tabs');
      if (bar) bar.querySelectorAll('.pt-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle only sibling panels (those sharing the target panel's parent),
      // so nested tab groups don't interfere with each other.
      const parent = panel.parentElement;
      parent.querySelectorAll(':scope > .people-panel').forEach(p => p.classList.remove('active'));
      panel.classList.add('active');

      panel.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    });
  });

  /* ---------- Reveal on Scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Smooth Scroll Offset for Sticky Nav ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      // If the link is targeting a people-panel tab, activate it first
      const ptab = link.dataset.ptab;
      if (ptab) {
        const btn = document.querySelector(`.pt-btn[data-ptab="${ptab}"]`);
        if (btn) btn.click();
      }

      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();