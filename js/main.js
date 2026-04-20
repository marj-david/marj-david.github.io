(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', tick, { passive: true });
  tick();

  // Active nav link
  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  document.querySelectorAll('.nav-link').forEach(link => {
    try {
      const lp = new URL(link.href).pathname.replace(/\\/g, '/').toLowerCase();
      if (path === lp || (path.endsWith('/') && lp === path.slice(0, -1)) || path === lp + 'index.html') {
        link.classList.add('active');
      }
    } catch (e) { }
  });
})();

const Lightbox = (() => {
  let lb, img, caption;

  function open(src, cap) {
    if (!lb) return;
    img.src = '';
    img.src = src;
    caption.textContent = cap || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!lb) return;
    lb.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (img) img.src = ''; }, 350);
  }

  function init() {
    lb = document.getElementById('lightbox');
    img = document.getElementById('lb-img');
    caption = document.getElementById('lb-caption');
    if (!lb) return;

    lb.querySelector('.lb-backdrop')?.addEventListener('click', close);
    lb.querySelector('.lb-close')?.addEventListener('click', close);
    document.addEventListener('keydown', e => e.key === 'Escape' && close());

    document.querySelector('.profile-photo')?.addEventListener('click', function () {
      open(this.dataset.fullSrc || this.src, this.alt + ' — Full Resolution');
    });

    document.querySelectorAll('.gallery-item[data-lb]').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.src || item.querySelector('img')?.src || '';
        if (src) open(src, item.dataset.cap || '');
      });
    });
  }

  return { init, open, close };
})();

(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('visible');
      io.unobserve(target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => io.observe(el));
})();

document.addEventListener('DOMContentLoaded', Lightbox.init);
