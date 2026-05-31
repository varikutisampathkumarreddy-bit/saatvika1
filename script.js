/* ============================================================
   VyomEx Medical Clinic — 3D Interactivity Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Page Loader ───
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 600);
  });
  // Fallback: hide loader after 3s even if load event already fired
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ─── Navigation ───
  initNavigation();

  // ─── Parallax ───
  initParallax();

  // ─── 3D Tilt Cards ───
  initTiltCards();

  // ─── Scroll Reveal ───
  initScrollReveal();

  // ─── 3D Carousel ───
  initCarousel();

  // ─── Appointment Form ───
  initForm();

  // ─── Counter Animation ───
  initCounters();
});

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile toggle
  function toggleMenu() {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    overlay.classList.toggle('visible');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  }

  toggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close menu on link click
  links.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      if (links.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Active link highlighting on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--clr-primary-light)';
      }
    });
  }, { passive: true });
}

/* ============================================================
   PARALLAX — Mouse Tracking
   ============================================================ */
function initParallax() {
  const parallaxContainer = document.getElementById('parallaxContainer');
  const scene = document.getElementById('hero3DScene');

  if (!parallaxContainer || !scene) return;

  const parallaxLayers = parallaxContainer.querySelectorAll('.parallax-layer');
  const sceneElements = scene.querySelectorAll('[data-speed]');

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateParallax() {
    // Smooth interpolation
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 0.03;
      const x = currentX * speed * 100;
      const y = currentY * speed * 100;
      layer.style.transform = `translate(${x}px, ${y}px)`;
    });

    sceneElements.forEach(el => {
      const speed = parseFloat(el.dataset.speed) || 0.03;
      const x = currentX * speed * 80;
      const y = currentY * speed * 80;
      // Preserve existing animations by adding translation
      el.style.marginLeft = `${x}px`;
      el.style.marginTop = `${y}px`;
    });

    requestAnimationFrame(animateParallax);
  }

  animateParallax();

  // Scroll parallax for hero
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroHeight = hero.offsetHeight;
    if (scrollY < heroHeight) {
      const progress = scrollY / heroHeight;
      parallaxContainer.style.transform = `translateY(${scrollY * 0.3}px)`;
      scene.style.transform = `translateY(${scrollY * 0.2}px)`;
      hero.querySelector('.hero__content').style.transform = `translateY(${scrollY * 0.15}px)`;
      hero.querySelector('.hero__content').style.opacity = 1 - progress * 0.8;
    }
  }, { passive: true });
}

/* ============================================================
   3D TILT CARDS — Mouse Tracking
   ============================================================ */
function initTiltCards() {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const aboutCard = document.getElementById('aboutTiltCard');

  // Combine all elements that should tilt
  const allTiltCards = [...tiltElements];
  if (aboutCard) allTiltCards.push(aboutCard);

  allTiltCards.forEach(card => {
    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('mouseenter', activateTilt);
  });

  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(${1200}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

    // Dynamic glow effect — move a radial highlight
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    card.style.background = `
      radial-gradient(circle at ${percentX}% ${percentY}%, hsla(217, 91%, 60%, 0.12), transparent 50%),
      hsla(222, 40%, 15%, 0.6)
    `;
  }

  function activateTilt(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.1s ease-out';
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s ease';
    card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.background = '';
  }
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add delay based on transition-delay in style attribute
        const delay = entry.target.style.transitionDelay || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================================
   3D CAROUSEL
   ============================================================ */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const cards = track.querySelectorAll('.carousel-3d__card');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dots = document.querySelectorAll('.carousel-3d__dot');

  const totalCards = cards.length;
  let currentIndex = 0;
  const angleStep = 360 / totalCards;
  // Calculate radius based on card width for proper spacing
  const radius = 380;

  function updateCarousel(animate = true) {
    if (animate) {
      track.style.transition = 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      track.style.transition = 'none';
    }

    const rotation = -currentIndex * angleStep;
    track.style.transform = `rotateY(${rotation}deg)`;

    // Position cards in 3D ring
    cards.forEach((card, i) => {
      const cardAngle = i * angleStep;
      card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`;

      // Active card glow
      if (i === currentIndex) {
        card.classList.add('active');
        card.style.opacity = '1';
      } else {
        card.classList.remove('active');
        card.style.opacity = '0.4';
      }
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function goTo(index) {
    currentIndex = ((index % totalCards) + totalCards) % totalCards;
    updateCarousel();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
    });
  });

  // Auto-rotate
  let autoRotateTimer = setInterval(next, 5000);

  // Pause on hover
  const carouselContainer = document.getElementById('carousel3D');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoRotateTimer));
  carouselContainer.addEventListener('mouseleave', () => {
    autoRotateTimer = setInterval(next, 5000);
  });

  // Touch/swipe support
  let touchStartX = 0;
  carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoRotateTimer);
  }, { passive: true });

  carouselContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    autoRotateTimer = setInterval(next, 5000);
  }, { passive: true });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Initial setup
  updateCarousel(false);
}

/* ============================================================
   FORM
   ============================================================ */
function initForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Floating label and 3D form tilt
  const formEl = form;
  formEl.addEventListener('mousemove', (e) => {
    const rect = formEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    formEl.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  formEl.addEventListener('mouseleave', () => {
    formEl.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    formEl.style.transform = 'perspective(1200px) rotateX(0) rotateY(0)';
  });

  formEl.addEventListener('mouseenter', () => {
    formEl.style.transition = 'transform 0.1s ease-out';
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn--primary');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Sending request...';

    const scriptURL = 'https://script.google.com/macros/s/AKfycbz-Rykfc5KgaJz2JBM009-Lcm0pjMUKK9EJjAnrhFEuNRhhcMmz82KjzCJn_eyc4xbh/exec';

    // Construct request data
    const formData = new FormData(form);

    fetch(scriptURL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors' // Highly recommended for Google Apps Script to prevent CORS redirect blocks
    })
    .then(response => {
      btn.innerHTML = '<span>✅</span> Appointment Requested!';
      btn.style.background = 'linear-gradient(135deg, hsl(145, 70%, 45%), hsl(168, 80%, 45%))';
      btn.style.boxShadow = '0 4px 15px hsla(145, 70%, 45%, 0.4)';

      // Celebration animation
      createConfetti(btn);

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.boxShadow = '';
        form.reset();
      }, 4000);
    })
    .catch(error => {
      console.error('Error!', error.message);
      btn.innerHTML = '<span>❌</span> Submission Error';
      btn.style.background = 'linear-gradient(135deg, hsl(0, 70%, 45%), hsl(10, 80%, 45%))';
      btn.style.boxShadow = '0 4px 15px hsla(0, 70%, 45%, 0.4)';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.boxShadow = '';
      }, 4000);
    });
  });
}

/* ============================================================
   CONFETTI — After form submission
   ============================================================ */
function createConfetti(element) {
  const rect = element.getBoundingClientRect();
  const colors = ['#4D8EFF', '#33D6A6', '#9B6DFF', '#FF6B8A', '#FFD93D'];

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${rect.left + rect.width / 2}px;
      top: ${rect.top}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
    `;
    document.body.appendChild(confetti);

    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 200 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 200;
    const rotation = Math.random() * 720 - 360;

    confetti.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${vx}px, ${vy + 400}px) rotate(${rotation}deg)`, opacity: 0 }
    ], {
      duration: 1200 + Math.random() * 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }).onfinish = () => confetti.remove();
  }
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const statNumbers = document.querySelectorAll('.hero__stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
  const text = element.textContent;
  const match = text.match(/(\d+)/);
  if (!match) return;

  const target = parseInt(match[1]);
  const suffix = text.replace(match[1], '');
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = text;
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   SMOOTH SCROLL — Offset for fixed nav
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.offsetTop - navHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
