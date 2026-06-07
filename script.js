/* ============================================================
   CMS CONTENT — load from data/content.json
   ============================================================ */
const SERVICE_ICONS = [
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`
];

const PROCESS_ALIGNS = ['reveal-left','reveal-right','reveal-left','reveal-right'];

fetch('/data/content.json')
  .then(r => r.json())
  .then(d => {
    const set = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.textContent = val; };

    /* Hero */
    set('cms-hero-badge', d.hero?.badge);
    set('cms-hero-sub',   d.hero?.subtitulo);

    /* Stats */
    (d.estadisticas || []).forEach((s, i) => {
      const numEl = document.getElementById(`cms-stat-${i}-num`);
      if (numEl) { numEl.dataset.target = s.numero; }
      set(`cms-stat-${i}-suf`,   s.sufijo);
      set(`cms-stat-${i}-label`, s.etiqueta);
    });

    /* Services */
    const svcGrid = document.getElementById('cms-services');
    if (svcGrid && d.servicios?.length) {
      svcGrid.innerHTML = d.servicios.map((s, i) => `
        <div class="service-card ${i===0?'reveal-left':i===2||i===5?'reveal-right':'reveal-up'}">
          <div class="service-card__icon">${SERVICE_ICONS[i] || SERVICE_ICONS[0]}</div>
          <h3>${s.titulo}</h3>
          <p>${s.descripcion}</p>
          <ul>${(s.caracteristicas||[]).map(c=>`<li>${c}</li>`).join('')}</ul>
          ${s.destacado ? '<div class="service-card__badge">Más popular</div>' : ''}
        </div>`).join('');
    }

    /* CTA Banner */
    set('cms-cta-titulo', d.cta_banner?.titulo);
    set('cms-cta-desc',   d.cta_banner?.descripcion);
    set('cms-cta-boton',  d.cta_banner?.boton);

    /* Process */
    const procEl = document.getElementById('cms-process');
    if (procEl && d.proceso?.length) {
      const line = procEl.querySelector('.process__line');
      procEl.innerHTML = '';
      if (line) procEl.appendChild(line);
      d.proceso.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = `process__step ${PROCESS_ALIGNS[i] || 'reveal-up'}`;
        div.innerHTML = `
          <div class="process__num">${p.numero}</div>
          <div class="process__body">
            <h3>${p.titulo}</h3>
            <p>${p.descripcion}</p>
            <span class="process__time">${p.tiempo}</span>
          </div>`;
        procEl.appendChild(div);
      });
    }

    /* Testimonials */
    const testGrid = document.getElementById('cms-testimonials');
    if (testGrid && d.testimonios?.length) {
      testGrid.innerHTML = d.testimonios.map(t => `
        <div class="testimonial-card reveal-up">
          <div class="testimonial-card__stars">★★★★★</div>
          <p>"${t.texto}"</p>
          <div class="testimonial-card__author">
            <img src="${t.avatar}" alt="${t.nombre}" />
            <div><strong>${t.nombre}</strong><span>${t.cargo}</span></div>
          </div>
        </div>`).join('');
    }

    /* Pricing */
    if (d.precios?.planes) {
      const ids = ['cms-price-starter','cms-price-pro','cms-price-ultra'];
      const featIds = ['cms-feat-starter','cms-feat-pro','cms-feat-ultra'];
      d.precios.planes.forEach((plan, i) => {
        set(ids[i], plan.precio);
        const ul = document.getElementById(featIds[i]);
        if (ul) {
          ul.innerHTML =
            (plan.caracteristicas||[]).map(c=>`<li><span>✓</span> ${c}</li>`).join('') +
            (plan.no_incluye||[]).map(c=>`<li class="muted"><span>✗</span> ${c}</li>`).join('');
        }
      });
      set('cms-pricing-nota', d.precios.nota);
    }

    /* FAQ */
    const faqEl = document.getElementById('cms-faq');
    if (faqEl && d.faq?.length) {
      faqEl.innerHTML = d.faq.map(f => `
        <div class="faq__item reveal-up">
          <button class="faq__question">${f.pregunta} <span>+</span></button>
          <div class="faq__answer"><p>${f.respuesta}</p></div>
        </div>`).join('');
      /* re-init accordion */
      faqEl.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.parentElement;
          const answer = item.querySelector('.faq__answer');
          const isOpen = item.classList.contains('open');
          faqEl.querySelectorAll('.faq__item.open').forEach(o => {
            o.classList.remove('open');
            o.querySelector('.faq__answer').style.maxHeight = null;
          });
          if (!isOpen) { item.classList.add('open'); answer.style.maxHeight = answer.scrollHeight + 'px'; }
        });
      });
    }

    /* Equipo */
    const teamGrid = document.getElementById('cms-equipo');
    if (teamGrid && d.equipo?.length) {
      teamGrid.innerHTML = d.equipo.map(m => `
        <div class="team-card reveal-up">
          <img class="team-card__avatar" src="${m.avatar}" alt="${m.nombre}" />
          <div class="team-card__name">${m.nombre}</div>
          <div class="team-card__cargo">${m.cargo}</div>
          <p class="team-card__desc">${m.descripcion}</p>
        </div>`).join('');
    }

    /* Lead Magnet */
    set('cms-lead-titulo', d.lead_magnet?.titulo);
    set('cms-lead-desc',   d.lead_magnet?.descripcion);

    /* Contacto */
    set('cms-contacto-titulo',    d.contacto?.titulo);
    set('cms-contacto-gradiente', d.contacto?.titulo_gradiente);
    set('cms-contacto-desc',      d.contacto?.descripcion);
    set('cms-phone',              d.contacto?.telefono);
    set('cms-email',              d.contacto?.email);

    /* Footer */
    set('cms-footer-tagline', d.footer?.tagline);

    /* re-trigger reveal observer for newly rendered elements */
    document.querySelectorAll('.reveal-up:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible)')
      .forEach(el => revealObs.observe(el));
  })
  .catch(() => {});

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

/* ============================================================
   LEAD FORM — Brevo API
   ============================================================ */
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = leadForm.querySelector('input[type="email"]').value.trim();
    const btn   = leadForm.querySelector('button[type="submit"]');

    btn.disabled    = true;
    btn.textContent = 'Enviando...';

    try {
      // Llamas a tu función local de Netlify de forma segura
      const res = await fetch('/.netlify/functions/crearcontacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (res.ok || res.status === 204 || res.status === 201) {
        btn.textContent = '¡Enviado! Revisá tu email';
        btn.style.background = '#16a34a';
        btn.style.boxShadow = '0 0 30px rgba(22,163,74,.4)';
        leadForm.reset();
      } else {
        btn.textContent = 'Error, intentá de nuevo';
        btn.disabled = false;
      }
    } catch (error) {
      btn.textContent = 'Error, intentá de nuevo';
      btn.disabled = false;
    }
  });
}


/* ============================================================
   CONTACT FORM — AJAX submit, no redirect
   ============================================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        btn.textContent = '¡Enviado!';
        btn.style.background = '#16a34a';
        btn.style.boxShadow = '0 0 30px rgba(22,163,74,.4)';
        contactForm.reset();
      } else {
        btn.textContent = 'Error, intentá de nuevo';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Error, intentá de nuevo';
      btn.disabled = false;
    }
  });
}


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
