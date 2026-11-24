/**
 * Nova Link Consultoria — Main JavaScript
 * ════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Set current year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ─── NAVBAR ───────────────────────────────
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.navbar__link');

  // Scroll effect
  let lastScrollY = 0;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    if (scrollY > lastScrollY && scrollY > 300) {
      navbar.classList.add('navbar--hidden');
    } else {
      navbar.classList.remove('navbar--hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('navbar__nav--open');
    navToggle.classList.toggle('navbar__toggle--active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('navbar__nav--open');
      navToggle.classList.remove('navbar__toggle--active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    });
  });

  // ─── SMOOTH SCROLL ────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── ACTIVE LINK HIGHLIGHT ────────────────
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('navbar__link--active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('navbar__link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // ─── SCROLL ANIMATIONS ────────────────────
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animateElements.forEach((el, index) => {
    el.style.transitionDelay = `${index % 5 * 0.08}s`;
    observer.observe(el);
  });

  // ─── CONTACT FORM ─────────────────────────
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  function validateField(field, errorEl, message) {
    if (!field.value.trim()) {
      field.classList.add('form-input--error');
      errorEl.textContent = message;
      return false;
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('form-input--error');
      errorEl.textContent = 'Insira um e-mail válido.';
      return false;
    }
    field.classList.remove('form-input--error');
    errorEl.textContent = '';
    return true;
  }

  // Real-time validation
  ['nome', 'email', 'mensagem'].forEach(id => {
    const field = document.getElementById(id);
    const errorEl = document.getElementById(`${id}Error`);
    if (field && errorEl) {
      field.addEventListener('blur', () => {
        const messages = {
          nome: 'Por favor, insira seu nome.',
          email: 'Por favor, insira seu e-mail.',
          mensagem: 'Por favor, descreva seu projeto.'
        };
        validateField(field, errorEl, messages[id]);
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('form-input--error')) {
          field.classList.remove('form-input--error');
          errorEl.textContent = '';
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const mensagem = document.getElementById('mensagem');

    const isNameValid = validateField(nome, document.getElementById('nomeError'), 'Por favor, insira seu nome.');
    const isEmailValid = validateField(email, document.getElementById('emailError'), 'Por favor, insira seu e-mail.');
    const isMsgValid = validateField(mensagem, document.getElementById('mensagemError'), 'Por favor, descreva seu projeto.');

    if (!isNameValid || !isEmailValid || !isMsgValid) return;

    // Loading state
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
      form.reset();
      formSuccess.classList.add('form-success--visible');

      setTimeout(() => {
        formSuccess.classList.remove('form-success--visible');
      }, 5000);
    }, 1500);
  });

  // ─── SERVICE CARDS EXPAND ─────────────────
  const serviceCards = document.querySelectorAll('.servico-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function () {
      // On mobile, toggle the card expansion
      if (window.innerWidth <= 768) {
        this.classList.toggle('servico-card--expanded');
      }
    });
  });

  // ─── HERO CARDS FLOAT ANIMATION ───────────
  const heroCards = document.querySelectorAll('.hero__card');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateHeroCards() {
    heroCards.forEach((card, i) => {
      const factor = (i + 1) * 3;
      const x = mouseX * factor;
      const y = mouseY * factor;
      card.style.transform = `translate(${x}px, ${y}px)`;
    });
    requestAnimationFrame(animateHeroCards);
  }

  if (heroCards.length > 0 && window.innerWidth > 768) {
    animateHeroCards();
  }

  // ─── PROCESSO TIMELINE SCROLL PROGRESS ────
  const processoLine = document.querySelector('.processo__line');
  if (processoLine) {
    const processoSection = document.querySelector('.processo');

    window.addEventListener('scroll', () => {
      const rect = processoSection.getBoundingClientRect();
      const sectionHeight = processoSection.offsetHeight;
      const viewportHeight = window.innerHeight;

      if (rect.top < viewportHeight && rect.bottom > 0) {
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / (sectionHeight + viewportHeight)));
        processoLine.style.setProperty('--progress', progress);
      }
    }, { passive: true });
  }
});
