/* ============================================================
   DEPICTA WEB SERVICES — Main JS
============================================================ */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Mobile navigation toggle
  // ----------------------------------------------------------
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // ----------------------------------------------------------
  // Nav scroll shadow
  // ----------------------------------------------------------
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('nav--scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // ----------------------------------------------------------
  // Contact modal
  // ----------------------------------------------------------
  const modal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalForm = document.getElementById('modalForm');
  const modalSuccess = document.getElementById('modalFormSuccess');
  const modalSuccessClose = document.getElementById('modalSuccessClose');

  function openModal(plan) {
    if (!modal) return;
    // Pre-select plan if provided
    if (plan) {
      var planRadio = modal.querySelector('input[name="plan"][value="' + plan + '"]');
      if (planRadio) planRadio.checked = true;
    } else {
      var undecided = modal.querySelector('input[name="plan"][value="Undecided"]');
      if (undecided) undecided.checked = true;
    }
    modal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(function () { modal.classList.add('modal--visible'); }, 10);
    var first = modal.querySelector('input:not([type=hidden]):not([tabindex="-1"])');
    if (first) first.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('modal--visible');
    setTimeout(function () {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      // Reset form state for next open
      if (modalForm && modalSuccess) {
        modalForm.hidden = false;
        modalForm.reset();
        modalSuccess.hidden = true;
        var btn = modalForm.querySelector('.contact-form__submit');
        if (btn) { btn.disabled = false; btn.textContent = 'Send My Details'; }
      }
    }, 280);
  }

  document.querySelectorAll('.js-open-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openModal(btn.dataset.plan || null);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (modalSuccessClose) modalSuccessClose.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });

  // Modal form submission
  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = modalForm.querySelector('.contact-form__submit');
      btn.disabled = true;
      btn.textContent = 'Sending…';
      var data = new FormData(modalForm);
      fetch('/', { method: 'POST', body: data })
        .then(function () {
          modalForm.hidden = true;
          if (modalSuccess) {
            modalSuccess.hidden = false;
            modalSuccess.querySelector('h3').focus();
          }
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Send My Details';
          alert('Something went wrong. Please email us directly at info@depictawebservices.com');
        });
    });
  }

  // ----------------------------------------------------------
  // Hero entrance — staggered load animation
  // ----------------------------------------------------------
  const heroEls = document.querySelectorAll('.hero__left > *, .hero__right > *');
  heroEls.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    el.style.transitionDelay = (i * 90) + 'ms';
  });

  window.addEventListener('load', function () {
    heroEls.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  });

  // ----------------------------------------------------------
  // Steps — propagate left to right on scroll
  // ----------------------------------------------------------
  const steps = document.querySelectorAll('.step');
  steps.forEach(function (el, i) {
    el.classList.add('step--hidden');
    el.style.transitionDelay = (i * 160) + 'ms';
  });

  if ('IntersectionObserver' in window && steps.length) {
    const stepsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          steps.forEach(function (step) {
            step.classList.add('step--visible');
          });
          stepsObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    stepsObserver.observe(document.querySelector('.steps'));
  } else {
    steps.forEach(function (el) { el.classList.add('step--visible'); });
  }

  // ----------------------------------------------------------
  // CTA section — fade up on scroll (intentional conversion moment)
  // ----------------------------------------------------------
  const ctaEls = document.querySelectorAll('.cta-section__inner > *');
  ctaEls.forEach(function (el, i) {
    el.classList.add('fade-up');
    el.style.transitionDelay = (i * 100) + 'ms';
  });

  if ('IntersectionObserver' in window && ctaEls.length) {
    const ctaObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          ctaEls.forEach(function (el) { el.classList.add('fade-up--visible'); });
          ctaObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    ctaObserver.observe(document.querySelector('.cta-section'));
  } else {
    ctaEls.forEach(function (el) { el.classList.add('fade-up--visible'); });
  }

})();
