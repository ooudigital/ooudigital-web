document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------
     Mobile menu toggle
  ------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* -------------------------------------------------
     Fade-in on scroll
  ------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => fadeObserver.observe(el));
  } else {
    fadeEls.forEach((el) => el.classList.add('visible'));
  }

  /* -------------------------------------------------
     Active nav link + side dot on scroll
  ------------------------------------------------- */
  const sections = document.querySelectorAll('main .section');
  const navLinks = document.querySelectorAll('.nav-link');
  const dots = document.querySelectorAll('.dot');

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
    dots.forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.section === id);
    });
  };

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* -------------------------------------------------
     Contact form via Formspree (AJAX)
  ------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = '';
      status.className = 'form-status';

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          status.textContent = '¡Gracias! Tu mensaje fue enviado correctamente.';
          status.classList.add('success');
          form.reset();
        } else {
          status.textContent = 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
          status.classList.add('error');
        }
      } catch (err) {
        status.textContent = 'Error de conexión. Inténtalo de nuevo más tarde.';
        status.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }

});
