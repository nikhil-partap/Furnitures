/**
 * Ahuja's Atelier — Main JavaScript
 * Vanilla JS — No frameworks, no jQuery
 */

(function () {
  "use strict";

  /* ============================================
     DOM ELEMENTS
     ============================================ */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const navHamburger = document.getElementById("navHamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileClose = document.getElementById("mobileClose");
  const mobileLinks = document.querySelectorAll(".mobile-link");
  const pageLoader = document.getElementById("pageLoader");
  const heroHeadline = document.getElementById("heroHeadline");
  const scrollReveals = document.querySelectorAll(".scroll-reveal");
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  /* ============================================
     PAGE LOADER
     ============================================ */
  function initLoader() {
    // Use DOMContentLoaded instead of window.load.
    // window.load waits for ALL resources (images, iframes, fonts) before firing —
    // which can take 5-10 seconds. DOMContentLoaded fires as soon as the HTML is
    // parsed and the DOM is ready, giving a much faster perceived load.
    var hide = function () {
      pageLoader.classList.add("loaded");
      setTimeout(function () {
        heroHeadline.classList.add("blur-reveal--active");
      }, 200);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(hide, 100); // tiny delay for CSS paint
      });
    } else {
      // DOM already parsed (script deferred or page cached)
      setTimeout(hide, 100);
    }
  }

  /* ============================================
     HERO SLIDESHOW
     ============================================ */
  function initHeroSlideshow() {
    var slides = document.querySelectorAll(".hero-slide");
    var dots = document.querySelectorAll(".hero-dot");
    if (!slides.length) return;

    var current = 0;
    var total = slides.length;
    var intervalId = null;
    var INTERVAL = 5000;

    // Lazy-load a slide's background image from data-bg just before it shows
    function loadSlide(index) {
      var slide = slides[index];
      if (slide.dataset.bg && !slide.style.backgroundImage) {
        slide.style.backgroundImage = "url('" + slide.dataset.bg + "')";
      }
    }

    // Pre-load the next slide while the current one is showing
    function preloadNext(index) {
      var nextIndex = (index + 1) % total;
      loadSlide(nextIndex);
    }

    function goTo(index) {
      slides[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = (index + total) % total;
      loadSlide(current);
      slides[current].classList.add("active");
      dots[current].classList.add("active");
      // Pre-fetch the one after so it's ready when needed
      preloadNext(current);
    }

    function next() {
      goTo(current + 1);
    }

    function startAuto() {
      intervalId = setInterval(next, INTERVAL);
    }

    function stopAuto() {
      clearInterval(intervalId);
    }

    // Dot click navigation
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        stopAuto();
        goTo(i);
        startAuto();
      });
    });

    // Pause on hover
    var heroEl = document.getElementById("hero");
    if (heroEl) {
      heroEl.addEventListener("mouseenter", stopAuto);
      heroEl.addEventListener("mouseleave", startAuto);
    }

    // Pre-load slide 2 immediately after page load so it's ready at 5s
    preloadNext(0);
    startAuto();
  }

  /* ============================================
     NAVIGATION SCROLL EFFECT
     ============================================ */
  function initNavScroll() {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 100) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      },
      { passive: true },
    );
  }

  /* ============================================
     MOBILE MENU
     ============================================ */
  function initMobileMenu() {
    function openMenu() {
      mobileMenu.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeMenu() {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    }

    navHamburger.addEventListener("click", openMenu);
    mobileClose.addEventListener("click", closeMenu);

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  /* ============================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (href === "#") return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = navbar.offsetHeight;
          var targetPosition =
            target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      });
    });
  }

  /* ============================================
     SCROLL SPY (Active Nav Link)
     ============================================ */
  function initScrollSpy() {
    var sections = document.querySelectorAll("section[id]");

    window.addEventListener(
      "scroll",
      function () {
        var scrollPos = window.scrollY + window.innerHeight * 0.4;

        sections.forEach(function (section) {
          var sectionTop = section.offsetTop;
          var sectionHeight = section.offsetHeight;
          var sectionId = section.getAttribute("id");

          if (
            scrollPos >= sectionTop &&
            scrollPos < sectionTop + sectionHeight
          ) {
            navLinks.forEach(function (link) {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + sectionId) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { passive: true },
    );
  }

  /* ============================================
     SCROLL-TRIGGERED REVEALS
     ============================================ */
  function initScrollReveals() {
    var observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    scrollReveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================
     FORM VALIDATION
     ============================================ */
  function initFormValidation() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = [
        { id: "formName", errorId: "errorName" },
        { id: "formPhone", errorId: "errorPhone" },
        { id: "formCity", errorId: "errorCity" },
        { id: "formMessage", errorId: "errorMessage" },
      ];

      var isValid = true;

      fields.forEach(function (field) {
        var input = document.getElementById(field.id);
        var error = document.getElementById(field.errorId);
        if (!input || !error) return;

        if (!input.value.trim()) {
          error.classList.add("show");
          input.style.borderColor = "var(--color-aged-gold)";
          isValid = false;
        } else {
          error.classList.remove("show");
          input.style.borderColor = "";
        }
      });

      if (isValid) {
        contactForm.style.display = "none";
        formSuccess.classList.add("show");
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll(".form-input").forEach(function (input) {
      input.addEventListener("input", function () {
        this.style.borderColor = "";
        var error = this.parentElement.querySelector(".form-error");
        if (error) error.classList.remove("show");
      });
    });
  }

  /* ============================================
     HEADER ENTRANCE ANIMATION
     ============================================ */
  function initNavEntrance() {
    navbar.style.transform = "translateY(-100%)";
    navbar.style.transition =
      "transform 0.4s ease, background 0.3s ease, backdrop-filter 0.3s ease";
    setTimeout(function () {
      navbar.style.transform = "translateY(0)";
    }, 150);
  }

  /* ============================================
     NAV LINK HOVER EFFECT
     ============================================ */
  function initNavLinkHover() {
    navLinks.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        navLinks.forEach(function (l) {
          if (l !== link) l.style.opacity = "0.5";
        });
      });
      link.addEventListener("mouseleave", function () {
        navLinks.forEach(function (l) {
          l.style.opacity = "";
        });
      });
    });
  }

  /* ============================================
     INITIALIZATION
     ============================================ */
  function init() {
    initLoader();
    initHeroSlideshow();
    initNavScroll();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initScrollReveals();
    initFormValidation();
    initNavEntrance();
    initNavLinkHover();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
