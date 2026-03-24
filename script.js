/* ============================================
   AOS INIT
   ============================================ */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

AOS.init({
  duration: reducedMotion ? 0 : 620,
  easing: 'ease-out-cubic',
  once: true,
  offset: 70,
  disable: reducedMotion,
});

/* ============================================
   SCROLL PROGRESS
   ============================================ */
const progressBar = document.getElementById('scrollProgress');

function updateProgress() {
  const doc = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${doc > 0 ? window.scrollY / doc : 0})`;
}

/* ============================================
   NAVBAR
   ============================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateProgress();
}, { passive: true });

navbar.classList.toggle('scrolled', window.scrollY > 20);
updateProgress();

/* Active section via IntersectionObserver */
function buildObserver() {
  const m = Math.round(window.innerHeight * 0.35);
  return new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach((l) => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: `-${m}px 0px -${m}px 0px`, threshold: 0 });
}

let observer = buildObserver();
sections.forEach((s) => observer.observe(s));

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    observer.disconnect();
    observer = buildObserver();
    sections.forEach((s) => observer.observe(s));
  }, 200);
}, { passive: true });

/* ============================================
   SMOOTH SCROLL — navbar offset fix
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight, behavior: 'smooth' });
  });
});

/* ============================================
   MOBILE NAV
   ============================================ */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
});

navLinks.forEach((l) => l.addEventListener('click', () => {
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}));

/* ============================================
   PROJECT CARD TILT
   ============================================ */
if (!reducedMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -5;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
const form     = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const feedback  = document.getElementById('formFeedback');

const fields = {
  name:    { el: document.getElementById('name'),    err: document.getElementById('nameError') },
  email:   { el: document.getElementById('email'),   err: document.getElementById('emailError') },
  phone:   { el: document.getElementById('phone'),   err: document.getElementById('phoneError') },
  message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
};

function validate(key) {
  const { el, err } = fields[key];
  const v = el.value.trim();
  let msg = '';

  if (key === 'name') {
    if (!v) msg = 'Name is required.';
    else if (v.length < 2) msg = 'At least 2 characters.';
  }
  if (key === 'email') {
    if (!v) msg = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email.';
  }
  if (key === 'phone' && v) {
    if (!/^[+\d\s\-().]{7,20}$/.test(v)) msg = 'Enter a valid phone number.';
  }
  if (key === 'message') {
    if (!v) msg = 'Message is required.';
    else if (v.length < 10) msg = 'At least 10 characters.';
  }

  err.textContent = msg;
  el.classList.toggle('error', !!msg);
  el.classList.toggle('valid', !msg && !!v);
  return !msg;
}

Object.keys(fields).forEach((k) => {
  fields[k].el.addEventListener('blur',  () => validate(k));
  fields[k].el.addEventListener('input', () => {
    if (fields[k].el.classList.contains('error') || fields[k].el.classList.contains('valid')) validate(k);
  });
});

let feedbackTimer;
function showFeedback(msg, type) {
  feedback.textContent = msg;
  feedback.className   = `form-feedback ${type} visible`;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => feedback.classList.remove('visible'), 6000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.classList.remove('visible');

  const valid = ['name','email','phone','message'].map(validate).every(Boolean);
  if (!valid) {
    form.classList.add('form--shake');
    form.addEventListener('animationend', () => form.classList.remove('form--shake'), { once: true });
    return;
  }

  submitBtn.classList.add('loading');
  try {
    const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    if (res.ok) {
      form.reset();
      Object.keys(fields).forEach((k) => fields[k].el.classList.remove('error','valid'));
      showFeedback("Message sent! I'll get back to you soon.", 'success');
    } else {
      const json = await res.json().catch(() => ({}));
      showFeedback(json.errors?.map((e) => e.message).join(', ') || 'Something went wrong. Please try again.', 'error');
    }
  } catch {
    showFeedback('Network error. Please check your connection.', 'error');
  } finally {
    submitBtn.classList.remove('loading');
  }
});

/* ============================================
   FOOTER YEAR
   ============================================ */
document.getElementById('year').textContent = new Date().getFullYear();
