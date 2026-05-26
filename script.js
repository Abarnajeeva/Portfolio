
const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const cursorGlow = document.querySelector('.cursor-glow');
const year = document.getElementById('year');
const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const statCounts = document.querySelectorAll('.stat-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.getElementById('projectModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalStack = document.getElementById('modalStack');

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') body.classList.add('light');

themeToggle?.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('portfolio-theme', body.classList.contains('light') ? 'light' : 'dark');
});

menuToggle?.addEventListener('click', () => {
  body.classList.toggle('menu-open');
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => body.classList.remove('menu-open'));
});

window.addEventListener('mousemove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.animate({
    left: `${event.clientX}px`,
    top: `${event.clientY}px`
  }, {
    duration: 350,
    fill: 'forwards',
    easing: 'ease-out'
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

reveals.forEach(item => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    let current = 0;
    const duration = 1400;
    const stepTime = Math.max(16, duration / Math.max(target, 1));
    const timer = setInterval(() => {
      current += Math.max(1, Math.ceil(target / 40));
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = target === 100 ? `${current}%` : `${current}+`;
    }, stepTime);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });

statCounts.forEach(counter => countObserver.observe(counter));

year.textContent = new Date().getFullYear();

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || filter === category;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

projectCards.forEach(card => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 10;
    const rotateX = (0.5 - y / rect.height) * 10;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

  card.addEventListener('click', () => {
    modalTitle.textContent = card.dataset.title || 'Project';
    modalDescription.textContent = card.dataset.description || '';
    modalStack.innerHTML = '';
    (card.dataset.stack || '').split(',').map(item => item.trim()).filter(Boolean).forEach(item => {
      const chip = document.createElement('span');
      chip.textContent = item;
      modalStack.appendChild(chip);
    });
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  });
});

function closeModal() {
  projectModal.classList.remove('is-open');
  projectModal.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
}

modalBackdrop?.addEventListener('click', closeModal);
modalClose?.addEventListener('click', closeModal);
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});
