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

  // --- Seamless Hero Video Loop (double-buffer crossfade) ---
  // Fixes end-frame flash by crossfading between two stacked videos.
  const heroVideos = Array.from(document.querySelectorAll('.hero-bg-video')).filter(
    (el) => el instanceof HTMLVideoElement
  );

  if (heroVideos.length >= 2) {
    let active = heroVideos.find(v => v.classList.contains('is-active')) || heroVideos[0];
    let standby = heroVideos.find(v => v !== active) || heroVideos[1];
    let swapping = false;

    const makeStandbyReady = async () => {
      standby.loop = false;
      standby.muted = true;
      standby.playsInline = true;
      standby.preload = 'auto';
      try {
        standby.currentTime = 0;
      } catch (_) {}
      try {
        await standby.play();
      } catch (_) {
        // autoplay might be blocked in rare cases; ignore
      }
    };

    const swap = async () => {
      if (swapping) return;
      swapping = true;

      await makeStandbyReady();

      standby.classList.add('is-active');
      active.classList.remove('is-active');

      // After crossfade completes, pause old active to save CPU.
      setTimeout(() => {
        try {
          active.pause();
        } catch (_) {}

        const prevActive = active;
        active = standby;
        standby = prevActive;
        swapping = false;
      }, 420);
    };

    // Ensure active is playing
    try {
      active.play().catch(() => {});
    } catch (_) {}

    active.addEventListener('timeupdate', () => {
      if (swapping) return;
      if (!Number.isFinite(active.duration) || active.duration <= 0) return;
      // Trigger early enough to avoid any bad end frames.
      if (active.currentTime >= active.duration - 1.0) swap();
    });

    active.addEventListener('ended', () => {
      swap();
    });
  }

});
