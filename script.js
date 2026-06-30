/* ===================================================
   WeBolt Studio — script.js
   =================================================== */

/* ── Scroll-spy nav ───────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile burger ────────────────────────────────── */
(function initBurger() {
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!burger || !mobileMenu) return;

  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    burger.classList.add('open');
    mobileMenu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuOpen = false;
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  // Toggle on burger click/tap
  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  // Close when any nav link is tapped
  mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Close on outside tap/click
  document.addEventListener('click', function (e) {
    if (menuOpen && !mobileMenu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
})();

/* ── Active nav link ──────────────────────────────── */
(function highlightNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Scroll animations (IntersectionObserver) ─────── */
(function initFadeUp() {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
})();

/* ── Smooth scroll for anchor links ───────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const hash = a.getAttribute('href');
    if (!hash || hash === '#') return; // bare "#" — do nothing
    try {
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_) { /* invalid selector — let browser handle it */ }
  });
});

/* ── EmailJS v4 — initialize ──────────────────────── */
(function () {
  if (typeof emailjs === 'undefined') return;
  emailjs.init({ publicKey: "O7cCoB6ewCJtjaHJs" });
})();

/* ── Contact form submit handler ──────────────────── */
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn      = form.querySelector('[type="submit"]');
    var msg      = document.getElementById('form-message');
    var original = btn.textContent;

    // UI: loading state
    btn.disabled = true;
    btn.textContent = 'Pošiljam…';
    if (msg) { msg.textContent = ''; msg.className = 'form-message'; }

    // Collect fields: ime → name, email → email, sporocilo → message
    var templateParams = {
      name:    form.querySelector('[name="ime"]').value,
      email:   form.querySelector('[name="email"]').value,
      message: form.querySelector('[name="sporocilo"]').value,
    };

    emailjs.send("service_rtylrh4", "template_pzw563l", templateParams)
      .then(function () {
        // Success
        if (msg) {
          msg.textContent = '✓ Sporočilo poslano! Javimo se v 24 urah.';
          msg.className = 'form-message success';
        }
        btn.textContent = 'Poslano ✓';
        form.reset();
        setTimeout(function () {
          btn.disabled = false;
          btn.textContent = original;
        }, 5000);
      })
      .catch(function (err) {
        // Error
        console.error('EmailJS error:', err);
        if (msg) {
      