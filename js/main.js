/* ============================================
   ELAF SHARIAH ADVISORY — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Sticky Nav Shadow ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // --- Mobile Hamburger Menu ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // --- Accordion ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isActive = item.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });

      // Open clicked item (if it wasn't active)
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // --- Form Handling ---
  const FORMS_EMAIL = 'shayanfaiq34@gmail.com';

  function sendMailto(subject, body) {
    const mailto = `mailto:${FORMS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  function handleContactForm(form) {
    const name = form.querySelector('[name="name"]')?.value || '';
    const title = form.querySelector('[name="title"]')?.value || '';
    const company = form.querySelector('[name="company"]')?.value || '';
    const regionSelect = form.querySelector('[name="region"]');
    const region = regionSelect && regionSelect.options[regionSelect.selectedIndex]?.text || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const inquirySelect = form.querySelector('[name="inquiry"]');
    const inquiry = inquirySelect && inquirySelect.options[inquirySelect.selectedIndex]?.text || '';
    const brief = form.querySelector('[name="brief"]')?.value || '';

    const subject = 'New Executive Consultation Request';
    const body = [
      'A new executive consultation request has been submitted from the website.',
      '',
      `Full Name: ${name}`,
      `Corporate Title: ${title}`,
      `Company: ${company}`,
      `Region: ${region}`,
      `Email: ${email}`,
      `Nature of Inquiry: ${inquiry}`,
      '',
      'Project Brief:',
      brief
    ].join('\n');

    sendMailto(subject, body);
  }

  function handleAskAdvisorForm(form) {
    const name = form.querySelector('[name="name"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const categorySelect = form.querySelector('[name="category"]');
    const category = categorySelect && categorySelect.options[categorySelect.selectedIndex]?.text || '';
    const question = form.querySelector('[name="question"]')?.value || '';

    const subject = 'New Ask the Advisor Question';
    const body = [
      'A new question has been submitted via Ask the Advisor.',
      '',
      `Full Name: ${name}`,
      `Email: ${email}`,
      `Category: ${category}`,
      '',
      'Question:',
      question
    ].join('\n');

    sendMailto(subject, body);
  }

  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#E53935';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      const formType = form.dataset.form;
      if (formType === 'contact') {
        handleContactForm(form);
      } else if (formType === 'ask-advisor') {
        handleAskAdvisorForm(form);
      }

      // Show success message
      const successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('show');
        form.reset();

        // Hide after 5 seconds
        setTimeout(() => {
          successEl.classList.remove('show');
        }, 5000);
      }
    });

    // Clear error styling on input
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  });

  // --- Newsletter Form ---
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value.trim()) {
        input.value = '';
        input.placeholder = 'Subscribed! Thank you.';
        setTimeout(() => {
          input.placeholder = 'Enter your email address';
        }, 3000);
      }
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
