/* ============================================================
   NAV — scroll state
   ============================================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   BURGER — mobile menu
   ============================================================ */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ============================================================
   COUNTER — animated numbers
   ============================================================ */
const counters = document.querySelectorAll('.stat__num[data-target]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target;
    };
    requestAnimationFrame(animate);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ============================================================
   FAQ — accordion
   ============================================================ */
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq__answer');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq__item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.faq__answer').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = '✓ ' + msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
}

/* ============================================================
   FORMS — success feedback
   ============================================================ */
function handleForm(formId, message) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast(message);
    form.reset();
  });
}

handleForm('contactForm',  '¡Recibido! Te contactamos en menos de 2 horas.');
handleForm('leadForm',     '¡Guía enviada! Revisa tu email.');


/* ============================================================
   SMOOTH SCROLL for in-page anchors
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   PARALLAX — hero orbs subtle depth on scroll
   ============================================================ */
const orb1 = document.querySelector('.hero__orb--1');
const orb2 = document.querySelector('.hero__orb--2');
const orb3 = document.querySelector('.hero__orb--3');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight * 1.2) {
    orb1.style.transform = `translate(${y * 0.06}px, ${y * 0.08}px)`;
    orb2.style.transform = `translate(${-y * 0.04}px, ${y * 0.05}px)`;
    orb3.style.transform = `translateX(-50%) translateY(${-y * 0.06}px)`;
  }
}, { passive: true });
