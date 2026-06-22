/* Theme scripts entry point. */
(function () {
  var GRAFFIT_MOBILE_MAX_WIDTH = 1024;

  function isMobileViewport() {
    return (window.innerWidth || document.documentElement.clientWidth || 1440) <= GRAFFIT_MOBILE_MAX_WIDTH;
  }

  function prefersReducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function initCriticalCssFallback() {
    if (window.__graffitCssFallbackChecked) {
      return;
    }

    window.__graffitCssFallbackChecked = true;

    var expectedMarker = '2026-05-15-v1';
    var rootStyle = window.getComputedStyle(document.documentElement);
    var marker = (rootStyle.getPropertyValue('--graffit-css-ready') || '').trim();

    if (marker.indexOf(expectedMarker) !== -1) {
      return;
    }

    var primaryLink = document.getElementById('graffit-main-css');

    if (!primaryLink) {
      return;
    }

    var href = primaryLink.getAttribute('href') || '';

    if (!href) {
      return;
    }

    var retryToken = String(Date.now());
    var cleanHref = href.split('?')[0];
    var themeRoot = cleanHref.split('/assets/css/')[0];
    var fallbackCandidates = [
      cleanHref + '?retry=' + retryToken,
      themeRoot + '/assets/css/main.css?retry=' + retryToken
    ];

    fallbackCandidates.forEach(function (candidateHref, index) {
      var fallback = document.createElement('link');
      fallback.rel = 'stylesheet';
      fallback.href = candidateHref;
      fallback.media = 'all';
      fallback.setAttribute('data-graffit-css-fallback', String(index + 1));
      document.head.appendChild(fallback);
    });

    if (window.console && typeof window.console.warn === 'function') {
      window.console.warn('GraffiT: primary CSS appears incomplete, fallback stylesheet requested.');
    }
  }

  function initScrollPerformanceConfig() {
    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    if (typeof window.ScrollTrigger.config === 'function') {
      window.ScrollTrigger.config({
        ignoreMobileResize: true
      });
    }
  }

  function initLenis() {
    if (typeof window.Lenis !== 'function') {
      return null;
    }

    if (window.innerWidth <= 1024) {
      return null;
    }

    var isProductsPage = !!document.querySelector('.site-main--products');

    var lenis = new window.Lenis({
      /* На /products/ два pin+scrub — коротший duration, менше «гуми» з Lenis поверх scrub. */
      duration: isProductsPage ? 0.55 : 0.75,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1
    });

    function raf(time) {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');

        if (!href || href === '#') {
          return;
        }

        var target = document.querySelector(href);

        if (!target) {
          return;
        }

        event.preventDefault();
        lenis.scrollTo(target, { offset: -96 });
      });
    });

    lenis.on('scroll', function () {
      if (window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function') {
        window.ScrollTrigger.update();
      }
    });

    /* Pin + scrub мають знати про Lenis, інакше в кінці діапазону — стрибок скролу й артефакти фону. */
    if (window.gsap && window.ScrollTrigger) {
      if (typeof window.gsap.registerPlugin === 'function') {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }

      if (typeof window.ScrollTrigger.scrollerProxy === 'function') {
        window.ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop: function (value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true });
            }

            return typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY || 0;
          },
          getBoundingClientRect: function () {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight
            };
          },
          scrollHeight: function () {
            return Math.max(
              document.body ? document.body.scrollHeight : 0,
              document.documentElement.scrollHeight
            );
          },
          /* Фіксований pin: умова body.style.transform давала змішаний режим і ривки з Lenis. */
          pinType: 'fixed'
        });
      }
    }

    window.__graffitLenis = lenis;
    if (window.gsap && window.gsap.ticker && typeof window.gsap.ticker.add === 'function') {
      window.gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });

      if (typeof window.gsap.ticker.lagSmoothing === 'function') {
        window.gsap.ticker.lagSmoothing(0);
      }
    } else {
      window.requestAnimationFrame(raf);
    }

    return lenis;
  }

  function initHeaderScrollBlur() {
    var header = document.querySelector('.site-header');

    if (!header) {
      return;
    }

    var scrolledClass = 'site-header--scrolled';

    function headerScrollThreshold() {
      if (window.innerWidth <= 1024) {
        return 32;
      }

      var servicesHero = document.querySelector('.site-main--services .services-hero');

      if (servicesHero) {
        var heroHeight = servicesHero.offsetHeight || 0;

        if (heroHeight > 0) {
          return Math.max(32, Math.round(heroHeight * 0.72));
        }
      }

      return 32;
    }

    function scrollY() {
      var lenis = window.__graffitLenis;

      if (lenis && typeof lenis.scroll === 'number') {
        return lenis.scroll;
      }

      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    var headerTicking = false;
    var headerThreshold = headerScrollThreshold();
    var headerScrolled = null;

    function applySync() {
      headerTicking = false;

      var nextScrolled = scrollY() > headerThreshold;

      if (nextScrolled === headerScrolled) {
        return;
      }

      headerScrolled = nextScrolled;
      header.classList.toggle(scrolledClass, nextScrolled);
    }

    function sync() {
      if (headerTicking) {
        return;
      }

      headerTicking = true;
      window.requestAnimationFrame(applySync);
    }

    function syncAfterResize() {
      headerThreshold = headerScrollThreshold();
      sync();
    }

    var lenis = window.__graffitLenis;

    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', sync);
    }

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', syncAfterResize, { passive: true });
    sync();
  }

  function initBenefitsScroller() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-benefits-scroller').forEach(function (section) {
      var viewport = section.querySelector('.services-benefits__viewport');
      var stage = section.querySelector('.js-benefits-stage');
      var track = section.querySelector('.js-benefits-track');
      var lineFill = section.querySelector('.js-benefits-line-fill');
      var items = Array.prototype.slice.call(section.querySelectorAll('.js-benefit-item'));

      if (!viewport || !stage || !track || items.length === 0) {
        return;
      }

      function setActiveState(progress) {
        var activeIndex = Math.round(progress * (items.length - 1));

        items.forEach(function (item, index) {
          item.classList.toggle('is-active', index <= activeIndex);
        });

        if (lineFill) {
          lineFill.style.transform = 'scaleX(' + (0.14 + progress * 0.86) + ')';
        }
      }

      setActiveState(0);

      var isServicesPageBenefits = !!section.closest('.site-main--services');

      window.gsap.to(track, {
        x: function () {
          return -(track.scrollWidth - stage.clientWidth);
        },
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            if (isServicesPageBenefits) {
              return 'clamp(+=' + servicesBenefitsPinDistance(track, stage) + ')';
            }

            return 'clamp(+=' + graffitCappedHorizontalPinDistance(section, track, stage, 1.2) + ')';
          },
          /* Pin section (opaque bg), not viewport — avoids black gaps in pin-spacer. */
          pin: section,
          scrub: 0.85,
          anticipatePin: 0,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            setActiveState(self.progress);
          }
        }
      });
    });

    window.ScrollTrigger.refresh();
  }

  function initBenefitsMobileScroll() {
    if (window.innerWidth > 1024) {
      return;
    }

    document.querySelectorAll('.js-benefits-scroller').forEach(function (section) {
      if (section.getAttribute('data-benefits-mobile-scroll') === '1') {
        return;
      }

      var stage = section.querySelector('.js-benefits-stage');
      var lineFill = section.querySelector('.js-benefits-line-fill');
      var items = Array.prototype.slice.call(section.querySelectorAll('.js-benefit-item'));

      if (!stage || items.length === 0) {
        return;
      }

      section.setAttribute('data-benefits-mobile-scroll', '1');

      function syncFromScroll() {
        var maxScroll = stage.scrollWidth - stage.clientWidth;
        var progress = maxScroll > 0 ? stage.scrollLeft / maxScroll : 0;
        var activeIndex = Math.round(progress * (items.length - 1));

        items.forEach(function (item, index) {
          item.classList.toggle('is-active', index <= activeIndex);
        });

        if (lineFill) {
          lineFill.style.transform = 'scaleX(' + (0.14 + progress * 0.86) + ')';
        }
      }

      stage.addEventListener('scroll', syncFromScroll, { passive: true });
      window.requestAnimationFrame(syncFromScroll);
    });
  }

  function scrollToPosition(top) {
    var lenis = window.__graffitLenis;

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(top);
      return;
    }

    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  }

  function initHomeShowcaseParallax() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-home-showcase').forEach(function (section) {
      var media = section.querySelector('.js-home-showcase-media');
      var figureImage = section.querySelector('.home-showcase__figure-image');

      if (!media) {
        return;
      }

      window.gsap.fromTo(media, {
        yPercent: -2
      }, {
        yPercent: 2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      if (!figureImage) {
        return;
      }

      window.gsap.fromTo(figureImage, {
        yPercent: -4,
        scale: 0.982
      }, {
        yPercent: 4,
        scale: 1.018,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.7,
          invalidateOnRefresh: true
        }
      });
    });
  }

  function graffitCappedHorizontalPinDistance(section, track, stage, viewportMultiplier) {
    var overflow = Math.max(track.scrollWidth - stage.clientWidth, 0);

    if (overflow <= 0) {
      return 0;
    }

    var ratio = typeof viewportMultiplier === 'number' ? viewportMultiplier : 1.35;
    var cap = Math.round(window.innerHeight * ratio);

    if (section && section.offsetHeight > 0) {
      cap = Math.min(cap, Math.max(Math.round(section.offsetHeight * 1.15), Math.round(window.innerHeight * 0.9)));
    }

    return Math.min(overflow, cap);
  }

  function servicesBenefitsPinDistance(track, stage) {
    var overflow = Math.max(track.scrollWidth - stage.clientWidth, 0);

    if (overflow <= 0) {
      return 0;
    }

    var w = window.innerWidth || 1440;
    var extra = Math.round((140 / 1440) * w);
    extra = Math.min(Math.max(extra, 96), 200);

    var distance = overflow + extra;

    /* >1920: більше вертикального скролу на той самий горизонтальний хід — повільніша анімація. */
    if (w > 1920) {
      var factor = 1.45 + Math.min((w - 1920) / 3840, 0.35);
      distance = Math.round(distance * factor);
    }

    return distance;
  }

  function productsHorizontalPinDistance(track, stage) {
    var overflow = Math.max(track.scrollWidth - stage.clientWidth, 0);

    if (overflow <= 0) {
      return 0;
    }

    var w = window.innerWidth || 1440;
    var extra = Math.round((72 / 1440) * w);
    extra = Math.min(Math.max(extra, 48), 96);

    return overflow + extra;
  }

  /* /products/: без зайвого «докруту» після останньої картки — тільки реальний overflow. */
  function productsPageHorizontalPinDistance(track, stage) {
    return Math.max(track.scrollWidth - stage.clientWidth, 0);
  }

  function productsPageStageInLockBand(stage, lockOffset) {
    if (!stage) {
      return false;
    }

    var stageRect = stage.getBoundingClientRect();

    return stageRect.top <= lockOffset && stageRect.bottom > lockOffset;
  }


  function isProductsPageMain() {
    return !!document.querySelector('.site-main--products');
  }

  /*
   * /products/: один повний refresh наприкінці (після всіх init).
   * Частковий refresh окремих тригерів + refresh між init ламав pin каталогу.
   */
  function finalizeProductsPageScrollTriggers() {
    if (!isProductsPageMain() || window.innerWidth <= 1024 || !window.ScrollTrigger) {
      return;
    }

    if (typeof window.ScrollTrigger.sort === 'function') {
      window.ScrollTrigger.sort();
    }

    if (typeof window.ScrollTrigger.refresh === 'function') {
      window.ScrollTrigger.refresh();
    }
  }

  function refreshScrollTriggersUnlessProductsPage() {
    if (isProductsPageMain()) {
      return;
    }

    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      window.ScrollTrigger.refresh();
    }
  }

  function initProjectsScroller() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-projects-scroller').forEach(function (section) {
      if (section.id === 'products-projects' || section.classList.contains('js-products-page-projects')) {
        return;
      }

      var viewport = section.querySelector('.services-projects__viewport');
      var container = section.querySelector('.services-projects__container');
      var stage = section.querySelector('.js-projects-stage');
      var track = section.querySelector('.js-projects-track');
      var prevButton = section.querySelector('.js-projects-prev');
      var nextButton = section.querySelector('.js-projects-next');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.project-case-card'));

      if (cards.length === 0) {
        cards = Array.prototype.slice.call(section.querySelectorAll('.mediahub-capability-card'));
      }

      var isHomeProjects =
        section.id === 'services-projects' && !!section.closest('.site-main--home');
      var isMediahubProjects = section.id === 'mediahub-capabilities';
      var isServicesProjectsPage =
        section.id === 'services-projects' && !!section.closest('.site-main--services');
      var isPinnedProjectsPage = isServicesProjectsPage;
      var projectsStartOffset = isPinnedProjectsPage || isHomeProjects ? 72 : isMediahubProjects ? 72 : 100;
      var projectsPinUsesContainer =
        isHomeProjects || isMediahubProjects || isPinnedProjectsPage;

      if (
        !viewport ||
        !stage ||
        !track ||
        cards.length === 0 ||
        (projectsPinUsesContainer && !container)
      ) {
        return;
      }

      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      if (!isHomeProjects && typeof ResizeObserver === 'function') {
        var projectsResizeTimer;

        function scheduleProjectsScrollTriggerRefresh() {
          window.clearTimeout(projectsResizeTimer);
          projectsResizeTimer = window.setTimeout(function () {
            if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
              window.ScrollTrigger.refresh();
            }
          }, 100);
        }

        var projectsResizeObserver = new ResizeObserver(scheduleProjectsScrollTriggerRefresh);
        projectsResizeObserver.observe(track);
      }

      var tween = window.gsap.to(track, {
        x: function () {
          return -(track.scrollWidth - stage.clientWidth);
        },
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          /* Головна: scrub/pin лише коли .services-projects__container упирається у верх вікна. */
          trigger: projectsPinUsesContainer ? container : section,
          start: 'top top+=' + projectsStartOffset,
          end: function () {
            var overflow = Math.max(track.scrollWidth - stage.clientWidth, 0);

            /* Mediahub/home/services: повний overflow щоб швидкість = 1px вертикального → 1px горизонтального. */
            if (isHomeProjects || isServicesProjectsPage || isMediahubProjects) {
              return 'clamp(+=' + overflow + ')';
            }

            return 'clamp(+=' + graffitCappedHorizontalPinDistance(section, track, stage) + ')';
          },
          /*
           * Головна: pin на всю секцію — фон, __bg і ::before рухаються одним шаром з контентом
           * (раніше pin тільки на viewport + translateY на .__container зсував текст відносно фону).
           */
          pin: (isHomeProjects || isMediahubProjects || isServicesProjectsPage) ? section : viewport,
          /* scrub: 1 — плавна інтерполяція з Lenis; scrub: true без числа дає ривки. */
          scrub: 1,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onToggle: function () {
            document.documentElement.classList.remove('is-projects-pinned');
          },
          onUpdate: function (self) {
            currentIndex = Math.round(self.progress * getMaxIndex());
          }
        }
      });

      function updateButtons() {
        if (prevButton) {
          prevButton.disabled = currentIndex <= 0;
        }

        if (nextButton) {
          nextButton.disabled = currentIndex >= getMaxIndex();
        }
      }

      function scrollToIndex(index) {
        var clampedIndex = Math.max(0, Math.min(index, getMaxIndex()));
        var trigger = tween.scrollTrigger;

        if (!trigger) {
          return;
        }

        var progress = getMaxIndex() === 0 ? 0 : clampedIndex / getMaxIndex();
        var targetScroll = trigger.start + (trigger.end - trigger.start) * progress;

        currentIndex = clampedIndex;
        updateButtons();
        scrollToPosition(targetScroll);
      }

      updateButtons();

      if (prevButton) {
        prevButton.addEventListener('click', function () {
          scrollToIndex(currentIndex - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', function () {
          scrollToIndex(currentIndex + 1);
        });
      }
    });

    refreshScrollTriggersUnlessProductsPage();
  }

  function killProductsPageCatalogScroll() {
    if (window.ScrollTrigger && typeof window.ScrollTrigger.getById === 'function') {
      var catalogTrigger = window.ScrollTrigger.getById('products-catalog-pin');

      if (catalogTrigger) {
        catalogTrigger.kill(true);
      }
    }

    var main = document.querySelector('.site-main--products');
    var section = main ? main.querySelector('.js-products-catalog-scroller') : null;

    if (!main) {
      return;
    }

    main.removeAttribute('data-products-horizontal-scroll-init');
    document.documentElement.classList.remove('is-products-catalog-wheel-locked');

    if (!section) {
      return;
    }

    var track = section.querySelector('.js-products-catalog-track');

    if (track && window.gsap) {
      window.gsap.set(track, { x: 0, clearProps: 'transform' });
    } else if (track) {
      track.style.transform = '';
    }
  }

  /* /products/ desktop: каталог — ScrollTrigger (initProductsCatalogScroller), не wheel-lock. */
  function initProductsPageHorizontalScroll() {
    if (window.innerWidth <= 1024) {
      killProductsPageCatalogScroll();
      return;
    }

    var main = document.querySelector('.site-main--products');

    if (!main) {
      return;
    }

    main.removeAttribute('data-products-horizontal-scroll-init');
    document.documentElement.classList.remove('is-products-catalog-wheel-locked');

    var section = main.querySelector('.js-products-catalog-scroller');

    if (!section) {
      return;
    }

    var track = section.querySelector('.js-products-catalog-track');

    if (track) {
      track.style.transform = '';
    }
  }

  function killProductsPageProjectsScroll() {
    if (window.ScrollTrigger && typeof window.ScrollTrigger.getById === 'function') {
      var projectsTrigger = window.ScrollTrigger.getById('products-projects-pin');

      if (projectsTrigger) {
        projectsTrigger.kill(true);
      }
    }

    var section = document.querySelector(
      '.site-main--products #products-projects.js-products-page-projects'
    );

    if (!section) {
      return;
    }

    section.removeAttribute('data-products-page-projects-init');
    section.classList.remove('is-products-page-projects-native-scroll');
    document.documentElement.classList.remove('is-products-projects-wheel-locked');

    var track = section.querySelector('.js-products-page-projects-track');

    if (track && window.gsap) {
      window.gsap.set(track, { x: 0, clearProps: 'transform' });
    } else if (track) {
      track.style.transform = '';
    }
  }

  /**
   * /products/#products-projects — той самий wheel-lock, що й каталог, без ScrollTrigger pin-spacer.
   * initProjectsScroller цей блок не чіпає.
   */
  function initProductsPageProjectsScroll() {
    if (window.innerWidth <= 1024) {
      killProductsPageProjectsScroll();
      return;
    }

    var section = document.querySelector(
      '.site-main--products #products-projects.js-products-page-projects'
    );

    if (!section || section.getAttribute('data-products-page-projects-init') === '1') {
      return;
    }

    var stage = section.querySelector('.js-products-page-projects-stage');
    var track = section.querySelector('.js-products-page-projects-track');
    var prevButton = section.querySelector('.js-products-page-projects-prev');
    var nextButton = section.querySelector('.js-products-page-projects-next');
    var cards = Array.prototype.slice.call(
      section.querySelectorAll('.js-products-page-projects-track .project-case-card')
    );

    if (!stage || !track || cards.length === 0) {
      return;
    }

    killProductsPageProjectsScroll();

    section.setAttribute('data-products-page-projects-init', '1');
    section.classList.remove('is-products-page-projects-native-scroll');
    stage.scrollLeft = 0;

    if (window.gsap) {
      window.gsap.set(track, { x: 0, clearProps: 'transform' });
    } else {
      track.style.transform = '';
    }

    var projectsIndex = 0;
    var projectsProgress = 0;
    var projectsTargetProgress = 0;
    var projectsMaxDistance = 0;
    var isProjectsLocked = false;
    var lockScrollTop = 0;
    var lastScrollTop = getCurrentScrollTop();
    var animationFrame = 0;
    var lockOffset = 246;
    var pendingReleaseDirection = 0;

    function getProjectsMaxIndex() {
      return Math.max(cards.length - 1, 0);
    }

    function updateProjectsButtons() {
      if (prevButton) {
        prevButton.disabled = projectsIndex <= 0;
      }

      if (nextButton) {
        nextButton.disabled = projectsIndex >= getProjectsMaxIndex();
      }
    }

    function getCurrentScrollTop() {
      var lenis = window.__graffitLenis;

      if (lenis && typeof lenis.scroll === 'number') {
        return lenis.scroll;
      }

      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function scrollImmediately(top) {
      var targetTop = Math.max(0, Math.round(top));
      var lenis = window.__graffitLenis;

      if (lenis && typeof lenis.scrollTo === 'function') {
        lenis.scrollTo(targetTop, { immediate: true });
      }

      window.scrollTo(0, targetTop);

      if (window.ScrollTrigger && typeof window.ScrollTrigger.update === 'function') {
        window.ScrollTrigger.update();
      }
    }

    function measureProjects() {
      projectsMaxDistance = productsPageHorizontalPinDistance(track, stage);
      projectsProgress = Math.max(0, Math.min(projectsProgress, 1));
      projectsTargetProgress = Math.max(0, Math.min(projectsTargetProgress, 1));
    }

    function renderProjects() {
      var x = -Math.round(projectsMaxDistance * projectsProgress);
      var maxIndex = getProjectsMaxIndex();
      var rawIndex = projectsProgress * maxIndex;

      track.style.transform = 'translate3d(' + x + 'px, 0, 0)';
      projectsIndex = projectsProgress >= 0.998 ? maxIndex : Math.round(rawIndex);
      updateProjectsButtons();
    }

    function settleProjectsAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      if (!pendingReleaseDirection) {
        return;
      }

      if (
        (pendingReleaseDirection > 0 && projectsProgress >= 0.998) ||
        (pendingReleaseDirection < 0 && projectsProgress <= 0.002)
      ) {
        pendingReleaseDirection = 0;
        unlockProjects();
      }
    }

    function animateProjectsToTarget() {
      if (animationFrame) {
        return;
      }

      function tick() {
        var diff = projectsTargetProgress - projectsProgress;

        if (Math.abs(diff) < 0.0012) {
          projectsProgress = projectsTargetProgress;
          renderProjects();
          settleProjectsAnimation();
          return;
        }

        projectsProgress += diff * 0.16;
        renderProjects();

        if (isProjectsLocked && Math.abs(getCurrentScrollTop() - lockScrollTop) > 1) {
          scrollImmediately(lockScrollTop);
        }

        animationFrame = window.requestAnimationFrame(tick);
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    function getProjectsLockTop() {
      return getCurrentScrollTop();
    }

    function stopLenis() {
      if (window.__graffitLenis && typeof window.__graffitLenis.stop === 'function') {
        window.__graffitLenis.stop();
      }
    }

    function startLenis() {
      if (window.__graffitLenis && typeof window.__graffitLenis.start === 'function') {
        window.__graffitLenis.start();
      }
    }

    function lockProjects() {
      if (isProjectsLocked || projectsMaxDistance <= 0) {
        return;
      }

      lockScrollTop = getProjectsLockTop();
      isProjectsLocked = true;
      document.documentElement.classList.add('is-products-projects-wheel-locked');
      stopLenis();
      scrollImmediately(lockScrollTop);
    }

    function unlockProjects() {
      if (!isProjectsLocked) {
        return;
      }

      isProjectsLocked = false;
      document.documentElement.classList.remove('is-products-projects-wheel-locked');
      startLenis();
      lastScrollTop = getCurrentScrollTop();
    }

    function shouldLockForDirection(direction) {
      if (projectsMaxDistance <= 0) {
        return false;
      }

      var stageRect = stage.getBoundingClientRect();

      if (direction > 0) {
        // Scrolling DOWN: stage.top decreases → lock when it enters lock band from below
        return stageRect.top <= lockOffset && stageRect.bottom > lockOffset && projectsTargetProgress < 0.998;
      }

      // Scrolling UP: stage.top increases (section re-entering from above).
      // Only lock once stage.top has risen back UP to lockOffset — same visual position
      // as the DOWN entry. Allow a 150px catch window above lockOffset.
      var upBuffer = 150;
      return stageRect.top >= lockOffset && stageRect.top <= lockOffset + upBuffer && projectsTargetProgress > 0.002;
    }

    function syncProjectsProgressFromViewport() {
      if (isProjectsLocked || projectsMaxDistance <= 0) {
        return;
      }

      var stageRect = stage.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      var changed = false;

      if (stageRect.bottom <= 0) {
        if (projectsProgress !== 1 || projectsTargetProgress !== 1) {
          projectsProgress = 1;
          projectsTargetProgress = 1;
          changed = true;
        }
      } else if (stageRect.top >= viewportHeight) {
        if (projectsProgress !== 0 || projectsTargetProgress !== 0) {
          projectsProgress = 0;
          projectsTargetProgress = 0;
          changed = true;
        }
      }

      if (changed) {
        renderProjects();
      }
    }

    function normalizeWheelDelta(event) {
      var delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

      if (event.deltaMode === 1) {
        delta *= 18;
      } else if (event.deltaMode === 2) {
        delta *= window.innerHeight;
      }

      return delta;
    }

    function consumeWheel(delta) {
      var scaledDelta = delta * 0.72;
      var maxWheelStep = Math.max(projectsMaxDistance * 0.16, 120);
      var clampedDelta = Math.max(-maxWheelStep, Math.min(scaledDelta, maxWheelStep));
      var nextDistance = projectsTargetProgress * projectsMaxDistance + clampedDelta;
      var direction = clampedDelta >= 0 ? 1 : -1;

      projectsTargetProgress = Math.max(0, Math.min(nextDistance / projectsMaxDistance, 1));
      pendingReleaseDirection = 0;

      if (direction > 0 && projectsTargetProgress >= 0.998) {
        pendingReleaseDirection = 1;
      } else if (direction < 0 && projectsTargetProgress <= 0.002) {
        pendingReleaseDirection = -1;
      }

      if (
        pendingReleaseDirection &&
        Math.abs(projectsTargetProgress - projectsProgress) < 0.004
      ) {
        projectsProgress = projectsTargetProgress;
        renderProjects();
        settleProjectsAnimation();
        return;
      }

      animateProjectsToTarget();
    }

    function onProjectsWheel(event) {
      if (window.innerWidth <= 1024) {
        unlockProjects();
        return;
      }

      measureProjects();
      syncProjectsProgressFromViewport();

      if (projectsMaxDistance <= 0) {
        unlockProjects();
        return;
      }

      var delta = normalizeWheelDelta(event);
      var direction = delta >= 0 ? 1 : -1;

      if (!isProjectsLocked && shouldLockForDirection(direction)) {
        lockProjects();
      }

      if (!isProjectsLocked) {
        return;
      }

      if (
        ((direction > 0 && projectsTargetProgress >= 0.998) ||
          (direction < 0 && projectsTargetProgress <= 0.002)) &&
        Math.abs(projectsTargetProgress - projectsProgress) < 0.004
      ) {
        unlockProjects();
        return;
      }

      event.preventDefault();
      consumeWheel(delta);
    }

    function onProjectsScroll() {
      if (window.innerWidth <= 1024 || isProjectsLocked) {
        lastScrollTop = getCurrentScrollTop();
        return;
      }

      measureProjects();
      syncProjectsProgressFromViewport();

      var currentTop = getCurrentScrollTop();
      var direction = currentTop >= lastScrollTop ? 1 : -1;

      lastScrollTop = currentTop;

      if (shouldLockForDirection(direction)) {
        lockProjects();
      }
    }

    function scrollProjectsToIndex(index) {
      var clampedIndex = Math.max(0, Math.min(index, getProjectsMaxIndex()));
      var targetProgress = getProjectsMaxIndex() === 0 ? 0 : clampedIndex / getProjectsMaxIndex();

      projectsTargetProgress = targetProgress;
      pendingReleaseDirection = 0;
      animateProjectsToTarget();
    }

    measureProjects();
    projectsTargetProgress = projectsProgress;
    renderProjects();
    updateProjectsButtons();

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        scrollProjectsToIndex(projectsIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        scrollProjectsToIndex(projectsIndex + 1);
      });
    }

    function scheduleProjectsRemeasure() {
      window.requestAnimationFrame(function () {
        if (window.innerWidth <= 1024) {
          unlockProjects();
          projectsProgress = 0;
          projectsTargetProgress = 0;
          pendingReleaseDirection = 0;
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          track.style.transform = '';
          projectsIndex = 0;
          updateProjectsButtons();
          return;
        }

        measureProjects();
        renderProjects();

        if (productsPageHorizontalPinDistance(track, stage) > 0) {
          return;
        }

        Array.prototype.slice.call(track.querySelectorAll('img')).forEach(function (img) {
          if (!img.complete) {
            img.addEventListener('load', scheduleProjectsRemeasure, { once: true });
          }
        });
      });
    }

    window.addEventListener('wheel', onProjectsWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onProjectsScroll, { passive: true });
    window.addEventListener('resize', scheduleProjectsRemeasure, { passive: true });

    scheduleProjectsRemeasure();
  }

  function initProductsPageProjectsMobileCarousel() {
    if (window.innerWidth > 1024) {
      return;
    }

    var section = document.querySelector(
      '.site-main--products #products-projects.js-products-page-projects'
    );

    if (!section || section.getAttribute('data-products-page-projects-mobile') === '1') {
      return;
    }

    var stage = section.querySelector('.js-products-page-projects-stage');
    var prevButton = section.querySelector('.js-products-page-projects-prev');
    var nextButton = section.querySelector('.js-products-page-projects-next');
    var cards = Array.prototype.slice.call(
      section.querySelectorAll('.js-products-page-projects-track .project-case-card')
    );

    if (!stage || cards.length === 0) {
      return;
    }

    section.setAttribute('data-products-page-projects-mobile', '1');

    function getMaxIndex() {
      return Math.max(cards.length - 1, 0);
    }

    function nearestIndex() {
      var sl = stage.scrollLeft;
      var best = 0;
      var bestDist = Infinity;

      for (var i = 0; i < cards.length; i++) {
        var dist = Math.abs(cards[i].offsetLeft - sl);

        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }

      return best;
    }

    function updateButtons() {
      var idx = nearestIndex();

      if (prevButton) {
        prevButton.disabled = idx <= 0;
      }

      if (nextButton) {
        nextButton.disabled = idx >= getMaxIndex();
      }
    }

    function scrollToIndex(index) {
      var clamped = Math.max(0, Math.min(index, getMaxIndex()));
      var card = cards[clamped];

      if (!card) {
        return;
      }

      stage.scrollTo({
        left: card.offsetLeft,
        behavior: 'smooth'
      });

      window.setTimeout(updateButtons, 400);
    }

    stage.addEventListener('scroll', updateButtons, { passive: true });
    window.requestAnimationFrame(updateButtons);

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        scrollToIndex(nearestIndex() - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        scrollToIndex(nearestIndex() + 1);
      });
    }
  }

  function initProjectsMobileCarousel() {
    if (window.innerWidth > 1024) {
      return;
    }

    document.querySelectorAll('.js-projects-scroller').forEach(function (section) {
      if (
        section.id === 'products-projects' ||
        section.classList.contains('js-products-page-projects')
      ) {
        return;
      }

      if (section.getAttribute('data-projects-mobile-carousel') === '1') {
        return;
      }

      var stage = section.querySelector('.js-projects-stage');
      var prevButton = section.querySelector('.js-projects-prev');
      var nextButton = section.querySelector('.js-projects-next');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.project-case-card'));

      if (cards.length === 0) {
        cards = Array.prototype.slice.call(section.querySelectorAll('.mediahub-capability-card'));
      }

      if (!stage || cards.length === 0) {
        return;
      }

      section.setAttribute('data-projects-mobile-carousel', '1');
      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      function nearestIndex() {
        var sl = stage.scrollLeft;
        var best = 0;
        var bestDist = Infinity;

        for (var i = 0; i < cards.length; i++) {
          var d = Math.abs(cards[i].offsetLeft - sl);

          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        }

        return best;
      }

      function updateButtons() {
        var idx = nearestIndex();
        currentIndex = idx;

        if (prevButton) {
          prevButton.disabled = idx <= 0;
        }

        if (nextButton) {
          nextButton.disabled = idx >= getMaxIndex();
        }
      }

      function scrollToIndex(index) {
        var clamped = Math.max(0, Math.min(index, getMaxIndex()));
        var card = cards[clamped];

        if (!card) {
          return;
        }

        currentIndex = clamped;

        stage.scrollTo({
          left: card.offsetLeft,
          behavior: 'smooth'
        });

        window.setTimeout(updateButtons, 400);
      }

      stage.addEventListener('scroll', updateButtons, { passive: true });
      window.requestAnimationFrame(updateButtons);

      var touchStartX = 0;
      var touchStartY = 0;
      var touchStartTime = 0;
      var touchStartIndex = 0;
      var touchAxis = '';

      function resetTouchPaging() {
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;
        touchStartIndex = currentIndex;
        touchAxis = '';
      }

      function onTouchStart(event) {
        if (!event.touches || event.touches.length !== 1) {
          resetTouchPaging();
          return;
        }

        var touch = event.touches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        touchStartIndex = nearestIndex();
        currentIndex = touchStartIndex;
        touchAxis = '';
      }

      function onTouchMove(event) {
        if (!event.touches || event.touches.length !== 1 || touchStartTime === 0) {
          return;
        }

        var touch = event.touches[0];
        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        var absX = Math.abs(dx);
        var absY = Math.abs(dy);

        if (!touchAxis && (absX > 8 || absY > 8)) {
          touchAxis = absX > absY * 1.15 ? 'x' : 'y';
        }

        if (touchAxis === 'x' && event.cancelable) {
          event.preventDefault();
        }
      }

      function onTouchEnd(event) {
        if (!touchStartTime) {
          return;
        }

        var touch = event.changedTouches && event.changedTouches[0];

        if (!touch) {
          resetTouchPaging();
          return;
        }

        var dx = touch.clientX - touchStartX;
        var dy = touch.clientY - touchStartY;
        var absX = Math.abs(dx);
        var absY = Math.abs(dy);
        var elapsed = Math.max(Date.now() - touchStartTime, 1);
        var velocity = absX / elapsed;
        var threshold = Math.min(Math.max(stage.clientWidth * 0.16, 44), 96);

        if (touchAxis === 'x' || absX > absY * 1.15) {
          if (absX >= threshold || velocity > 0.35) {
            scrollToIndex(touchStartIndex + (dx < 0 ? 1 : -1));
          } else {
            scrollToIndex(touchStartIndex);
          }
        }

        resetTouchPaging();
      }

      stage.addEventListener('touchstart', onTouchStart, { passive: true });
      stage.addEventListener('touchmove', onTouchMove, { passive: false });
      stage.addEventListener('touchend', onTouchEnd, { passive: true });
      stage.addEventListener('touchcancel', resetTouchPaging, { passive: true });

      if (prevButton) {
        prevButton.addEventListener('click', function () {
          scrollToIndex(nearestIndex() - 1);
        });
      }

      if (nextButton) {
        nextButton.addEventListener('click', function () {
          scrollToIndex(nearestIndex() + 1);
        });
      }
    });
  }

  function initProductsCatalogScroller() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-products-catalog-scroller').forEach(function (section) {
      if (section.getAttribute('data-products-catalog-pin-init') === '1') {
        return;
      }

      var isProductsPage = !!section.closest('.site-main--products');
      var viewport = section.querySelector('.products-catalog__viewport');
      var stage = section.querySelector('.js-products-catalog-stage');
      var track = section.querySelector('.js-products-catalog-track');
      var prevButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-prev'));
      var nextButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-next'));
      var cards = Array.prototype.slice.call(section.querySelectorAll('.product-catalog-card'));

      if (!viewport || !stage || !track || cards.length === 0) {
        return;
      }

      section.setAttribute('data-products-catalog-pin-init', '1');

      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      function setActiveCard(index) {
        cards.forEach(function (card, cardIndex) {
          card.classList.toggle('is-active', cardIndex === index);
        });
      }

      function getPinDistance() {
        return Math.max(track.scrollWidth - stage.clientWidth, 0);
      }

      /*
       * trigger must be the outer section (never a child of the pinned element):
       * when GSAP pins viewport (position:fixed), any child trigger moves with it,
       * breaking start/end scroll position calculations.
       */
      var scrollTriggerConfig = {
        trigger: section,
        start: 'top top',
        end: function () {
          return 'clamp(+=' + getPinDistance() + ')';
        },
        pin: viewport,
        scrub: isProductsPage ? 0.85 : 1,
        anticipatePin: 0,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: isProductsPage ? -2 : 0,
        onUpdate: function (self) {
          currentIndex = Math.round(self.progress * getMaxIndex());
          setActiveCard(currentIndex);
          updateButtons();
        }
      };

      if (isProductsPage) {
        scrollTriggerConfig.id = 'products-catalog-pin';
      }

      var tween = window.gsap.to(track, {
        x: function () {
          return -getPinDistance();
        },
        ease: 'none',
        scrollTrigger: scrollTriggerConfig
      });

      function updateButtons() {
        prevButtons.forEach(function (button) {
          button.disabled = currentIndex <= 0;
        });

        nextButtons.forEach(function (button) {
          button.disabled = currentIndex >= getMaxIndex();
        });
      }

      function scrollToIndex(index) {
        var clampedIndex = Math.max(0, Math.min(index, getMaxIndex()));
        var trigger = tween.scrollTrigger;

        if (!trigger) {
          return;
        }

        var progress = getMaxIndex() === 0 ? 0 : clampedIndex / getMaxIndex();
        var targetScroll = trigger.start + (trigger.end - trigger.start) * progress;

        currentIndex = clampedIndex;
        setActiveCard(currentIndex);
        updateButtons();
        scrollToPosition(targetScroll);
      }

      setActiveCard(currentIndex);
      updateButtons();

      prevButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          scrollToIndex(currentIndex - 1);
        });
      });

      nextButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          scrollToIndex(currentIndex + 1);
        });
      });
    });

    refreshScrollTriggersUnlessProductsPage();
  }

  function initProductsCatalogMobileCarousel() {
    if (window.innerWidth > 1024) {
      return;
    }

    document.querySelectorAll('.js-products-catalog-scroller').forEach(function (section) {
      if (section.getAttribute('data-products-catalog-mobile-carousel') === '1') {
        return;
      }

      var stage = section.querySelector('.js-products-catalog-stage');
      var prevButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-prev'));
      var nextButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-next'));
      var cards = Array.prototype.slice.call(section.querySelectorAll('.product-catalog-card'));

      if (!stage || cards.length === 0) {
        return;
      }

      section.setAttribute('data-products-catalog-mobile-carousel', '1');

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      function nearestIndex() {
        var sl = stage.scrollLeft;
        var best = 0;
        var bestDist = Infinity;

        for (var i = 0; i < cards.length; i++) {
          var distance = Math.abs(cards[i].offsetLeft - sl);

          if (distance < bestDist) {
            bestDist = distance;
            best = i;
          }
        }

        return best;
      }

      function updateButtons() {
        var idx = nearestIndex();

        cards.forEach(function (card, cardIndex) {
          card.classList.toggle('is-active', cardIndex === idx);
        });

        prevButtons.forEach(function (button) {
          button.disabled = idx <= 0;
        });

        nextButtons.forEach(function (button) {
          button.disabled = idx >= getMaxIndex();
        });
      }

      function scrollToIndex(index) {
        var clampedIndex = Math.max(0, Math.min(index, getMaxIndex()));
        var card = cards[clampedIndex];

        if (!card) {
          return;
        }

        stage.scrollTo({
          left: card.offsetLeft,
          behavior: 'smooth'
        });

        window.setTimeout(updateButtons, 400);
      }

      stage.addEventListener('scroll', updateButtons, { passive: true });
      window.requestAnimationFrame(updateButtons);

      prevButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          scrollToIndex(nearestIndex() - 1);
        });
      });

      nextButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          scrollToIndex(nearestIndex() + 1);
        });
      });
    });
  }

  function enforceClientsPinnedViewportWidth(viewport) {
    if (!viewport || window.innerWidth <= 1024) {
      return;
    }

    // GSAP pin can freeze the viewport at content width (~1360px) on ultrawide screens.
    viewport.style.setProperty('width', '100%', 'important');
    viewport.style.setProperty('max-width', '100vw', 'important');
    viewport.style.setProperty('left', '0', 'important');
    viewport.style.setProperty('right', '0', 'important');
  }

  function isMobileClientsLayout() {
    return (window.innerWidth || document.documentElement.clientWidth || 1440) <= 1024;
  }

  function resetHomeFilmHandoffState() {
    var flow = document.querySelector('.home-chaos-about-flow');
    var wing = document.querySelector('.js-home-film-bottom-wing');

    if (flow) {
      flow.classList.remove('is-film-wedge-active');
    }

    if (wing) {
      wing.style.opacity = '0';
      wing.style.visibility = 'hidden';
      wing.style.removeProperty('top');
      wing.style.removeProperty('height');
    }
  }

  function resetClientsScrollerMobileState(section) {
    var viewport = section.querySelector('.services-clients__viewport');
    var stage = section.querySelector('.js-clients-stage');
    var track = section.querySelector('.js-clients-track');
    var cards = Array.prototype.slice.call(section.querySelectorAll('.trust-card'));
    var pinFlow = section.closest('.home-chaos-about-flow');
    var spacer = section.querySelector('.pin-spacer');

    if (!spacer && viewport && viewport.parentElement && viewport.parentElement.classList.contains('pin-spacer')) {
      spacer = viewport.parentElement;
    }

    if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function') {
      window.ScrollTrigger.getAll().forEach(function (trigger) {
        if (
          trigger.trigger === section
          || trigger.pin === viewport
          || trigger.pin === pinFlow
          || trigger.trigger === viewport
        ) {
          trigger.kill(true);
        }
      });
    }

    section.removeAttribute('data-clients-scroller-init');
    section.removeAttribute('data-about-clients-stacked-init');
    section.classList.remove('is-about-clients-stacked');
    section.classList.remove('is-clients-top-fade');

    if (pinFlow) {
      pinFlow.removeAttribute('data-about-hero-clients-pinned');
    }

    if (stage) {
      stage.style.removeProperty('--about-clients-stage-height');
      stage.style.removeProperty('--clients-top-fade');
    }

    [section, pinFlow, spacer, viewport, stage, track].concat(cards).forEach(function (node) {
      if (!node) {
        return;
      }

      [
        'translate',
        'rotate',
        'scale',
        'transform',
        'width',
        'height',
        'min-height',
        'max-height',
        'padding-top',
        'padding-bottom',
        'margin-top',
        'margin-bottom',
        'top',
        'left',
        'right',
        'bottom',
        'inset',
        'opacity',
        'visibility',
        'will-change'
      ].forEach(function (property) {
        node.style.removeProperty(property);
      });
    });

    if (section.id === 'home-about') {
      resetHomeFilmHandoffState();
    }
  }

  function initClientsScroller() {
    if (isMobileClientsLayout()) {
      document.querySelectorAll('.js-clients-scroller').forEach(resetClientsScrollerMobileState);

      if (
        window.ScrollTrigger &&
        typeof window.ScrollTrigger.getAll === 'function' &&
        window.ScrollTrigger.getAll().length > 0 &&
        typeof window.ScrollTrigger.refresh === 'function'
      ) {
        window.ScrollTrigger.refresh();
      }

      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    function initClientsStackedCardsSection(clientsSection) {
      var viewport;
      var stage;
      var track;
      var cards;
      var timeline;
      var nodes;
      var spacer;
      var stackedTriggerId;
      var pinFlow;
      var pinTarget;

      if (!clientsSection) {
        return;
      }

      pinFlow = clientsSection.closest('.js-about-hero-clients-flow');
      stackedTriggerId = clientsSection.id + '-stacked';
      clientsSection.classList.remove('is-about-clients-stacked-desktop');
      clientsSection.classList.remove('is-clients-top-fade');

      if (isMobileClientsLayout()) {
        resetClientsScrollerMobileState(clientsSection);
        return;
      }

      if (window.ScrollTrigger && typeof window.ScrollTrigger.getById === 'function') {
        var existingStackedTrigger = window.ScrollTrigger.getById(stackedTriggerId);

        if (existingStackedTrigger) {
          existingStackedTrigger.kill(true);
        }
      }

      viewport = clientsSection.querySelector('.services-clients__viewport');
      stage = clientsSection.querySelector('.js-clients-stage');
      track = clientsSection.querySelector('.js-clients-track');
      cards = Array.prototype.slice.call(clientsSection.querySelectorAll('.trust-card'));
      pinTarget = pinFlow || viewport;

      if (!viewport || !stage || !track || cards.length < 2) {
        clientsSection.removeAttribute('data-about-clients-stacked-init');

        if (pinFlow) {
          pinFlow.removeAttribute('data-about-hero-clients-pinned');
        }

        clientsSection.classList.remove('is-about-clients-stacked');
        return;
      }

      if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function') {
        window.ScrollTrigger.getAll().forEach(function (trigger) {
          if (
            trigger.trigger === clientsSection
            || trigger.pin === viewport
            || trigger.pin === pinFlow
            || trigger.trigger === viewport
          ) {
            trigger.kill(true);
          }
        });
      }

      clientsSection.removeAttribute('data-clients-scroller-init');
      window.gsap.set(cards, { clearProps: 'transform,opacity,visibility,willChange' });
      clientsSection.removeAttribute('data-about-clients-stacked-init');
      clientsSection.classList.remove('is-about-clients-stacked');
      clientsSection.setAttribute('data-about-clients-stacked-init', '1');
      clientsSection.classList.add('is-about-clients-stacked');
      nodes = [
        clientsSection.querySelector('.services-clients__viewport'),
        clientsSection.querySelector('.js-clients-stage'),
        clientsSection.querySelector('.js-clients-track')
      ];

      nodes.forEach(function (node) {
        if (!node) {
          return;
        }

        [
          'translate',
          'rotate',
          'scale',
          'transform',
          'opacity',
          'visibility',
          'will-change'
        ].forEach(function (property) {
          node.style.removeProperty(property);
        });
      });

      function aboutClientsCardCascadeStep() {
        var referenceCard = cards[0];

        if (!referenceCard) {
          return 36;
        }

        var referenceTitle = referenceCard.querySelector('.trust-card__title');

        if (!referenceTitle) {
          return 36;
        }

        return Math.max(28, referenceTitle.offsetHeight + 8);
      }

      function syncAboutClientsStackedLayout() {
        if (!stage || !track || !cards.length) {
          return;
        }

        stage.style.removeProperty('height');
        stage.style.removeProperty('--about-clients-stage-height');

        cards.forEach(function (card) {
          card.style.removeProperty('margin-top');
        });
      }

      syncAboutClientsStackedLayout();

      function aboutClientsTimelineDuration() {
        if (cards.length < 2) {
          return 1;
        }

        return ((cards.length - 2) * 0.42) + 1.35;
      }

      function aboutClientsPinDistance() {
        var w = window.innerWidth || 1440;
        var scrollStep = w <= 1024
          ? Math.round(window.innerHeight * 0.62)
          : Math.round(window.innerHeight * 0.42);

        return Math.round(aboutClientsTimelineDuration() * scrollStep);
      }

      timeline = window.gsap.timeline({
        scrollTrigger: {
          id: stackedTriggerId,
          trigger: clientsSection,
          start: 'center center',
          end: function () {
            return 'clamp(+=' + aboutClientsPinDistance() + ')';
          },
          pin: pinTarget,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: function () {
            enforceClientsPinnedViewportWidth(viewport);
            syncAboutClientsStackedLayout();
          },
          onToggle: function (self) {
            if (pinFlow) {
              pinFlow.toggleAttribute('data-about-hero-clients-pinned', self.isActive);
            }

            if (self.isActive) {
              enforceClientsPinnedViewportWidth(viewport);
            }
          }
        }
      });

      cards.forEach(function (card, index) {
        if (index === 0) {
          return;
        }

        timeline.to(card, {
          y: function () {
            return -(card.offsetTop - cards[0].offsetTop) + (aboutClientsCardCascadeStep() * index);
          },
          ease: 'none',
          duration: 1.35
        }, (index - 1) * 0.42);
      });
    }

    function initAboutClientsStackedCards() {
      initClientsStackedCardsSection(document.getElementById('about-clients'));
    }

    initAboutClientsStackedCards();

    if (!window.__graffitAboutClientsStackResize) {
      window.__graffitAboutClientsStackResize = true;
      window.addEventListener('resize', function () {
        window.clearTimeout(window.__graffitAboutClientsStackResizeTimer);
        window.__graffitAboutClientsStackResizeTimer = window.setTimeout(function () {
          initAboutClientsStackedCards();

          if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        }, 120);
      }, { passive: true });
    }

    document.querySelectorAll('.js-clients-scroller').forEach(function (section) {
      // Product MediaHub page: allow only the dedicated #mediahub-clients section
      // to use the standard clients pin flow; skip any stale/extra client sections.
      if (section.closest('.site-main--product-mediahub') && section.id !== 'mediahub-clients') {
        section.classList.remove('js-clients-scroller');
        section.classList.remove('is-clients-top-fade');
        return;
      }

      if (section.getAttribute('data-clients-scroller-init') === '1') {
        return;
      }

      var viewport = section.querySelector('.services-clients__viewport');
      var stage = section.querySelector('.js-clients-stage');
      var track = section.querySelector('.js-clients-track');
      var shouldHideHeader = section.id === 'about-clients';
      var shouldForceZeroBottomPadding = false;

      if (!viewport || !stage || !track) {
        return;
      }

      section.setAttribute('data-clients-scroller-init', '1');
      section.classList.remove('is-clients-top-fade');

      if (section.id === 'about-clients') {
        return;
      }

      function enforceViewportBottomPadding() {
        if (!shouldForceZeroBottomPadding || !viewport) {
          return;
        }

        viewport.style.setProperty('padding-bottom', '0px');
      }

      function clientsTrackScrollDistance() {
        var overflow = track.scrollHeight - stage.clientHeight;
        if (overflow <= 0) {
          return 0;
        }
        // Full track travel so the last card can reach the stage; small extra so it sits
        // above the bottom fade mask instead of ending the pin while still clipped.
        var w = window.innerWidth || 1440;
        var extra = Math.round((200 / 1440) * w);

        if (section.id === 'home-about' || section.id === 'services-clients' || section.id === 'mediahub-clients') {
          extra = Math.round((56 / 1440) * w);
          extra = Math.min(Math.max(extra, 40), 72);
        } else {
          extra = Math.min(Math.max(extra, 120), 280);
        }

        return overflow + extra;
      }

      function clientsPinScrollDistance() {
        return clientsTrackScrollDistance();
      }

      function clientsScrollTriggerStart() {
        if (section.id === 'home-about' || section.id === 'services-clients' || section.id === 'mediahub-clients') {
          return 'center center';
        }

        return 'top top';
      }

      function clientsTopFadeStartPx() {
        var w = window.innerWidth || 1440;
        var offset = Math.round((24 / 1440) * w);
        return Math.min(Math.max(offset, 20), 30);
      }

      function clientsTopFadeRamp() {
        var w = window.innerWidth || 1440;

        if (section.id === 'home-about' || section.id === 'services-clients' || section.id === 'mediahub-clients') {
          return {
            start: 0,
            span: Math.round((280 / 1440) * w),
          };
        }

        return {
          start: clientsTopFadeStartPx(),
          span: 0,
        };
      }

      function updateClientsTopFade(progress) {
        var distance = clientsTrackScrollDistance() * progress;
        var ramp = clientsTopFadeRamp();

        if ((section.id === 'home-about' || section.id === 'services-clients' || section.id === 'mediahub-clients') && stage) {
          var linear = ramp.span > 0
            ? Math.min(1, Math.max(0, (distance - ramp.start) / ramp.span))
            : 0;
          // Починається одразу зі скролу, але наростає м’яко (без різкого зрізу).
          var amount = 1 - Math.pow(1 - linear, 2.2);

          stage.style.setProperty('--clients-top-fade', amount.toFixed(3));
          section.classList.toggle('is-clients-top-fade', amount > 0.02);
          return;
        }

        section.classList.toggle('is-clients-top-fade', distance > ramp.start);
      }

      function setHomeFilmHandoff(active) {
        var flow = document.querySelector('.home-chaos-about-flow');

        if (!flow) {
          return;
        }

        flow.classList.toggle('is-film-wedge-active', !!active);
      }

      window.gsap.to(track, {
        y: function () {
          return -clientsTrackScrollDistance();
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          /* home-about/services-clients/mediahub-clients start when the bow-tie viewport is centered in the screen. */
          start: clientsScrollTriggerStart,
          end: function () {
            // Clamp pin distance to the document scroll bounds so the spacer
            // cannot create a blank tail after the footer on short pages.
            return 'clamp(+=' + clientsPinScrollDistance() + ')';
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: section.id === 'home-about' ? 0 : 1,
          refreshPriority: section.id === 'mediahub-clients' ? -5 : 0,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            updateClientsTopFade(self.progress);

            if (section.id === 'home-about' && typeof window.syncHomeFilmWedge === 'function') {
              window.syncHomeFilmWedge();
            }
          },
          onToggle: function (self) {
            var header;

            if (self.isActive) {
              enforceClientsPinnedViewportWidth(viewport);

              if (section.id === 'home-about') {
                setHomeFilmHandoff(true);

                if (typeof window.syncHomeFilmWedge === 'function') {
                  window.syncHomeFilmWedge();
                }
              }
            }

            if (!self.isActive && self.progress <= 0.001) {
              section.classList.remove('is-clients-top-fade');

              if ((section.id === 'home-about' || section.id === 'services-clients' || section.id === 'mediahub-clients') && stage) {
                stage.style.setProperty('--clients-top-fade', '0');
              }
            }

            if (!shouldHideHeader) {
              return;
            }

            header = document.querySelector('.site-header');

            if (header) {
              header.classList.toggle('is-hidden-by-pin', self.isActive);
            }

            enforceViewportBottomPadding();
          },
          onRefresh: function () {
            enforceViewportBottomPadding();
            enforceClientsPinnedViewportWidth(viewport);
          }
        }
      });

      enforceViewportBottomPadding();
      enforceClientsPinnedViewportWidth(viewport);

      if (typeof ResizeObserver === 'function') {
        var clientsResizeTimer;

        var clientsResizeObserver = new ResizeObserver(function () {
          window.clearTimeout(clientsResizeTimer);
          clientsResizeTimer = window.setTimeout(function () {
            if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
              window.ScrollTrigger.refresh();
            }
          }, 120);
        });

        clientsResizeObserver.observe(track);
      }
    });

    window.ScrollTrigger.refresh();
  }

  if (!window.__graffitClientsScrollerResize) {
    window.__graffitClientsScrollerResize = true;
    window.addEventListener('resize', function () {
      window.clearTimeout(window.__graffitClientsScrollerResizeTimer);
      window.__graffitClientsScrollerResizeTimer = window.setTimeout(function () {
        initClientsScroller();

        if (
          window.ScrollTrigger &&
          typeof window.ScrollTrigger.refresh === 'function' &&
          (
            !isMobileViewport() ||
            typeof window.ScrollTrigger.getAll !== 'function' ||
            window.ScrollTrigger.getAll().length > 0
          )
        ) {
          window.ScrollTrigger.refresh();
        }
      }, 120);
    }, { passive: true });
  }

  function resetMediahubClientsLegacyState() {
    var section = document.getElementById('mediahub-clients');

    if (!section) {
      return;
    }

    // Cleanup legacy experimental motion hook if it appears from stale JS.
    section.classList.remove('js-mediahub-clients-motion');
    section.removeAttribute('data-mediahub-clients-motion-init');
    section.style.removeProperty('--mediahub-clients-lock-span');

    if (window.innerWidth > 1024) {
      return;
    }

    var viewport = section.querySelector('.services-clients__viewport');
    var stage = section.querySelector('.js-clients-stage');
    var track = section.querySelector('.js-clients-track');
    var spacer = section.querySelector('.pin-spacer');

    [viewport, stage, track].forEach(function (node) {
      if (!node) {
        return;
      }

      node.style.removeProperty('translate');
      node.style.removeProperty('rotate');
      node.style.removeProperty('scale');
      node.style.removeProperty('transform');
      node.style.removeProperty('opacity');
      node.style.removeProperty('visibility');
      node.style.removeProperty('will-change');
    });

    if (!spacer) {
      return;
    }

    [
      'height',
      'min-height',
      'max-height',
      'padding-top',
      'padding-bottom',
      'margin-top',
      'margin-bottom',
      'top',
      'left',
      'right',
      'bottom',
      'inset'
    ].forEach(function (property) {
      spacer.style.removeProperty(property);
    });
  }

  function initProcessTimeline() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-process-section').forEach(function (section) {
      if (section.classList.contains('products-process')) {
        return;
      }

      var timeline = section.querySelector('.services-process__timeline');
      var lineFill = section.querySelector('.js-process-line-fill');
      var steps = Array.prototype.slice.call(section.querySelectorAll('.js-process-step'));
      var line = lineFill ? lineFill.parentElement : null;

      if (!timeline || !lineFill || !line || steps.length === 0) {
        return;
      }

      function getStepTags() {
        return steps.map(function (step) {
          return step.querySelector('.process-step__tag');
        }).filter(Boolean);
      }

      function updateLineBounds() {
        var tags = getStepTags();

        if (tags.length === 0) {
          return 0;
        }

        var timelineRect = timeline.getBoundingClientRect();
        var firstRect = tags[0].getBoundingClientRect();
        var start = firstRect.top - timelineRect.top + firstRect.height * 0.5;
        var note = timeline.querySelector('.products-process__note, .mediahub-process__note');
        var end;

        if (note) {
          var noteRect = note.getBoundingClientRect();
          end = noteRect.bottom - timelineRect.top;
        } else {
          var lastRect = tags[tags.length - 1].getBoundingClientRect();
          end = lastRect.top - timelineRect.top + lastRect.height * 0.5;
        }

        var lineHeight = Math.max(end - start, 0);

        line.style.top = start + 'px';
        line.style.height = lineHeight + 'px';

        return lineHeight;
      }

      function setActiveStep(activeIndex) {
        steps.forEach(function (step, index) {
          step.classList.toggle('is-active', index === activeIndex);
        });
      }

      updateLineBounds();
      setActiveStep(0);

      window.gsap.fromTo(lineFill, {
        height: 0
      }, {
        height: function () {
          return updateLineBounds();
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 62%',
          end: 'bottom 72%',
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: function () {
            updateLineBounds();
          }
        }
      });

      steps.forEach(function (step, index) {
        window.ScrollTrigger.create({
          trigger: step,
          start: 'top 42%',
          end: 'bottom 42%',
          onEnter: function () {
            setActiveStep(index);
          },
          onEnterBack: function () {
            setActiveStep(index);
          }
        });
      });
    });

    refreshScrollTriggersUnlessProductsPage();
  }

  /**
   * /products/ .products-process — прямий вертикальний timeline без ScrollTrigger.
   * Рахуємо заповнення від фактичної позиції тегів у viewport, щоб блок не залежав від pin/refresh.
   */
  function initProductsPageProcessTimeline() {
    if (window.innerWidth <= 1024) {
      return;
    }

    var section = document.querySelector('.site-main--products .products-process.js-process-section');

    if (!section || section.getAttribute('data-products-process-timeline') === '1') {
      return;
    }

    var timeline = section.querySelector('.services-process__timeline');
    var lineFill = section.querySelector('.js-process-line-fill');
    var steps = Array.prototype.slice.call(section.querySelectorAll('.js-process-step'));
    var line = lineFill ? lineFill.parentElement : null;

    if (!timeline || !lineFill || !line || steps.length === 0) {
      return;
    }

    section.setAttribute('data-products-process-timeline', '1');

    var stepTags = steps.map(function (step) {
      return step.querySelector('.process-step__tag');
    }).filter(Boolean);
    var cachedLineHeight = 0;
    var productsProcessActiveIndex = 0;
    var timelineTicking = false;

    function measureLineBounds() {
      if (stepTags.length === 0) {
        cachedLineHeight = 0;
        return 0;
      }

      var timelineRect = timeline.getBoundingClientRect();
      var firstRect = stepTags[0].getBoundingClientRect();
      var start = firstRect.top - timelineRect.top + firstRect.height * 0.5;
      var note = timeline.querySelector('.products-process__note');
      var end;

      if (note) {
        var noteRect = note.getBoundingClientRect();
        end = noteRect.bottom - timelineRect.top;
      } else {
        var lastRect = stepTags[stepTags.length - 1].getBoundingClientRect();
        end = lastRect.top - timelineRect.top + lastRect.height * 0.5;
      }

      cachedLineHeight = Math.max(end - start, 0);

      line.style.top = start + 'px';
      line.style.height = cachedLineHeight + 'px';

      return cachedLineHeight;
    }

    function getFocusY() {
      return (window.innerHeight || document.documentElement.clientHeight) * 0.44;
    }

    function setActiveStep(activeIndex) {
      steps.forEach(function (step, index) {
        step.classList.toggle('is-active', index === activeIndex);
      });
    }

    function syncLineFill(progress) {
      if (cachedLineHeight <= 0) {
        lineFill.style.height = '0px';
        return;
      }

      lineFill.style.height = Math.round(cachedLineHeight * progress) + 'px';
    }

    function updateProductsProcessTimeline() {
      timelineTicking = false;
      measureLineBounds();

      if (stepTags.length === 0 || cachedLineHeight <= 0) {
        syncLineFill(0);
        return;
      }

      var focusY = getFocusY();
      var firstRect = stepTags[0].getBoundingClientRect();
      var lastRect = stepTags[stepTags.length - 1].getBoundingClientRect();
      var firstY = firstRect.top + firstRect.height * 0.5;
      var lastY = lastRect.top + lastRect.height * 0.5;
      var total = Math.max(lastY - firstY, 1);
      var progress = Math.max(0, Math.min((focusY - firstY) / total, 1));
      var closestIndex = 0;
      var closestDistance = Infinity;

      stepTags.forEach(function (tag, index) {
        var rect = tag.getBoundingClientRect();
        var center = rect.top + rect.height * 0.5;
        var distance = Math.abs(center - focusY);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      syncLineFill(progress);

      if (progress <= 0.002) {
        closestIndex = 0;
      } else if (progress >= 0.998) {
        closestIndex = steps.length - 1;
      }

      if (closestIndex !== productsProcessActiveIndex) {
        productsProcessActiveIndex = closestIndex;
        setActiveStep(closestIndex);
      }
    }

    function scheduleProductsProcessTimelineUpdate() {
      if (timelineTicking) {
        return;
      }

      timelineTicking = true;
      window.requestAnimationFrame(updateProductsProcessTimeline);
    }

    measureLineBounds();
    syncLineFill(0);
    setActiveStep(0);
    lineFill.style.height = '0px';
    updateProductsProcessTimeline();

    window.addEventListener('scroll', scheduleProductsProcessTimelineUpdate, { passive: true });
    window.addEventListener('resize', scheduleProductsProcessTimelineUpdate, { passive: true });

    if (window.__graffitLenis && typeof window.__graffitLenis.on === 'function') {
      window.__graffitLenis.on('scroll', scheduleProductsProcessTimelineUpdate);
    }

    Array.prototype.slice.call(section.querySelectorAll('img')).forEach(function (img) {
      if (!img.complete) {
        img.addEventListener('load', scheduleProductsProcessTimelineUpdate, { once: true });
      }
    });
  }

  function initProcessMobileTimeline() {
    if (window.innerWidth > 1024) {
      return;
    }

    document.querySelectorAll('.js-process-section').forEach(function (section) {
      if (section.getAttribute('data-process-mobile') === '1') {
        return;
      }

      var lineFill = section.querySelector('.js-process-line-fill');
      var line = lineFill ? lineFill.parentElement : null;
      var steps = Array.prototype.slice.call(section.querySelectorAll('.js-process-step'));

      if (steps.length === 0 || !lineFill || !line) {
        return;
      }

      section.setAttribute('data-process-mobile', '1');
      var activeIndex = 0;
      var ticking = false;
      var tags = steps.map(function (step) {
        return step.querySelector('.process-step__tag');
      }).filter(Boolean);

      function getFocusY() {
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return viewportHeight * 0.38;
      }

      function updateLineFillHeight() {
        var lineRect = line.getBoundingClientRect();

        if (lineRect.height <= 0) {
          return;
        }

        if (tags.length < 2) {
          var fallbackHeight = lineRect.height * ((activeIndex + 1) / steps.length);
          lineFill.style.height = Math.round(fallbackHeight) + 'px';
          return;
        }

        var focusY = getFocusY();
        var firstRect = tags[0].getBoundingClientRect();
        var note = section.querySelector('.products-process__note, .mediahub-process__note');
        var lastRect = tags[tags.length - 1].getBoundingClientRect();
        var lastCenter = lastRect.top + lastRect.height / 2;

        if (note) {
          var noteRect = note.getBoundingClientRect();
          lastCenter = noteRect.top + noteRect.height / 2;
        }

        var firstCenter = firstRect.top + firstRect.height / 2;
        var clampedFocus = Math.min(Math.max(focusY, firstCenter), lastCenter);
        var startOffset = Math.max(firstCenter - lineRect.top, 0);
        var endOffset = Math.min(lastCenter - lineRect.top, lineRect.height);
        var fillHeight = startOffset;

        if (lastCenter > firstCenter) {
          var progress = (clampedFocus - firstCenter) / (lastCenter - firstCenter);
          fillHeight = startOffset + (endOffset - startOffset) * progress;
        }

        lineFill.style.height = Math.round(Math.max(fillHeight, 0)) + 'px';
      }

      function setActive(index) {
        var clamped = Math.max(0, Math.min(index, steps.length - 1));
        var changed = clamped !== activeIndex;

        activeIndex = clamped;

        for (var j = 0; j < steps.length; j++) {
          steps[j].classList.toggle('is-active', j <= clamped);
        }

        if (changed) {
          updateLineFillHeight();
        }
      }

      function syncActiveStep() {
        var focusY = getFocusY();
        var bestIndex = 0;
        var bestDistance = Number.POSITIVE_INFINITY;

        for (var i = 0; i < steps.length; i++) {
          var rect = steps[i].getBoundingClientRect();
          var stepCenter = rect.top + rect.height / 2;
          var distance = Math.abs(stepCenter - focusY);

          if (rect.top <= focusY && rect.bottom >= focusY) {
            bestIndex = i;
            bestDistance = -1;
            break;
          }

          if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = i;
          }
        }

        setActive(bestIndex);
      }

      function requestSync() {
        if (ticking) {
          return;
        }

        ticking = true;

        window.requestAnimationFrame(function () {
          ticking = false;
          syncActiveStep();
          updateLineFillHeight();
        });
      }

      window.addEventListener('scroll', requestSync, { passive: true });
      window.addEventListener(
        'resize',
        function () {
          window.requestAnimationFrame(function () {
            syncActiveStep();
            updateLineFillHeight();
          });
        },
        { passive: true }
      );

      window.requestAnimationFrame(function () {
        syncActiveStep();
        updateLineFillHeight();
      });
    });
  }

  function initProductsNavDropdowns() {
    document.querySelectorAll('.js-header-products').forEach(function (root) {
      var toggle = root.querySelector('.js-header-products-toggle');
      var mainLink = root.querySelector('.site-header__nav-link');
      if (!toggle) {
        return;
      }

      if (mainLink) {
        mainLink.addEventListener('click', function () {
          root.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !root.classList.contains('is-open');
        root.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t && t.closest && t.closest('.js-header-products')) {
        return;
      }
      document.querySelectorAll('.js-header-products.is-open').forEach(function (root) {
        var btn = root.querySelector('.js-header-products-toggle');
        root.classList.remove('is-open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') {
        return;
      }
      document.querySelectorAll('.js-header-products.is-open').forEach(function (root) {
        var btn = root.querySelector('.js-header-products-toggle');
        root.classList.remove('is-open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.querySelectorAll('.js-mobile-products').forEach(function (root) {
      var toggle = root.querySelector('.js-mobile-products-toggle');
      var panel = root.querySelector('.js-mobile-products-panel');
      var mobileMainLink = root.querySelector('.mobile-menu__nav-link--products-main');
      if (!toggle || !panel) {
        return;
      }

      function setMobileProductsOpen(open) {
        root.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      }

      if (mobileMainLink) {
        mobileMainLink.addEventListener('click', function () {
          setMobileProductsOpen(false);
        });
      }

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setMobileProductsOpen(!root.classList.contains('is-open'));
      });
    });
  }

  function initMobileMenu() {
    var menu = document.querySelector('.js-mobile-menu');

    if (!menu) {
      return;
    }

    var toggles = Array.prototype.slice.call(document.querySelectorAll('.js-mobile-menu-toggle'));
    var panel = menu.querySelector('.mobile-menu__panel');

    function open() {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mobile-menu-open');

      toggles.forEach(function (btn) {
        if (btn.getAttribute('aria-expanded') !== null) {
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      if (window.__graffitLenis && typeof window.__graffitLenis.stop === 'function') {
        window.__graffitLenis.stop();
      }
    }

    function close() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mobile-menu-open');

      toggles.forEach(function (btn) {
        if (btn.getAttribute('aria-expanded') !== null) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });

      menu.querySelectorAll('.js-mobile-products.is-open').forEach(function (root) {
        root.classList.remove('is-open');
        var subToggle = root.querySelector('.js-mobile-products-toggle');
        var subPanel = root.querySelector('.js-mobile-products-panel');
        if (subToggle) {
          subToggle.setAttribute('aria-expanded', 'false');
        }
        if (subPanel) {
          subPanel.setAttribute('aria-hidden', 'true');
        }
      });

      if (window.__graffitLenis && typeof window.__graffitLenis.start === 'function') {
        window.__graffitLenis.start();
      }
    }

    function toggle() {
      if (menu.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', toggle);
    });

    if (panel) {
      panel.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function () {
          close();
        });
      });
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
      }
    });
  }

  function initRequestPopup() {
    var popup = document.getElementById('site-popup');
    var servicesPage = document.querySelector('.site-main--services');
    var productsPage = document.querySelector('.site-main--products');

    if (!popup) {
      return;
    }

    var panels = Array.prototype.slice.call(popup.querySelectorAll('.site-popup__panel'));
    var form = popup.querySelector('.js-request-form');
    var statusNode = form ? form.querySelector('[data-form-status]') : null;
    var lastFocusedElement = null;

    function decorateImplicitTriggers() {
      if (!servicesPage && !productsPage) {
        return;
      }

      var candidates = Array.prototype.slice.call(
        document.querySelectorAll(
          '.site-main--services a, .site-main--services button, .site-main--products a, .site-main--products button, .site-footer a, .site-footer button'
        )
      );

      candidates.forEach(function (node) {
        var label = (node.textContent || '').replace(/\s+/g, ' ').trim();

        if (node.hasAttribute('data-popup-open')) {
          return;
        }

        if (label !== 'Залишити заявку' && label !== 'Отримати консультацію') {
          return;
        }

        node.setAttribute('data-popup-open', 'request');
        node.setAttribute(
          'data-popup-source',
          productsPage && productsPage.contains(node) ? 'products-auto-trigger' : 'services-auto-trigger'
        );
        node.setAttribute('data-popup-source-label', label);
      });
    }

    function stopLenis() {
      if (window.__graffitLenis && typeof window.__graffitLenis.stop === 'function') {
        window.__graffitLenis.stop();
      }
    }

    function startLenis() {
      if (window.__graffitLenis && typeof window.__graffitLenis.start === 'function') {
        window.__graffitLenis.start();
      }
    }

    function getPanel(name) {
      return popup.querySelector('[data-popup-panel="' + name + '"]');
    }

    function getFocusableElements(panel) {
      if (!panel) {
        return [];
      }

      return Array.prototype.slice.call(
        panel.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter(function (node) {
        return !node.hasAttribute('hidden');
      });
    }

    function focusPanel(panel) {
      var focusable = getFocusableElements(panel);

      if (focusable.length === 0) {
        return;
      }

      window.requestAnimationFrame(function () {
        focusable[0].focus();
      });
    }

    function setStatus(message, tone) {
      if (!statusNode) {
        return;
      }

      statusNode.textContent = message || '';
      statusNode.classList.remove('is-error', 'is-success');

      if (tone) {
        statusNode.classList.add('is-' + tone);
      }
    }

    function setPanel(name) {
      panels.forEach(function (panel) {
        var isTarget = panel.getAttribute('data-popup-panel') === name;
        panel.hidden = !isTarget;
        panel.classList.toggle('is-active', isTarget);
      });

      focusPanel(getPanel(name));
    }

    function updateSource(trigger) {
      if (!form || !trigger) {
        return;
      }

      var sourceInput = form.querySelector('input[name="source"]');
      var sourceLabelInput = form.querySelector('input[name="source_label"]');
      var source = trigger.getAttribute('data-popup-source') || 'site';
      var sourceLabel = trigger.getAttribute('data-popup-source-label') || trigger.textContent.trim() || 'Сайт';

      if (sourceInput) {
        sourceInput.value = source;
      }

      if (sourceLabelInput) {
        sourceLabelInput.value = sourceLabel;
      }
    }

    function openPopup(name, trigger) {
      if (!popup.classList.contains('is-open')) {
        lastFocusedElement = trigger || document.activeElement;
      }

      if (name === 'request') {
        updateSource(trigger);
      }

      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('graffit-popup-open');
      stopLenis();
      setPanel(name);
    }

    function closePopup() {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('graffit-popup-open');
      startLenis();
      setPanel('request');
      setStatus('');

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    function findFieldWrap(name) {
      return form ? form.querySelector('[data-field-wrap="' + name + '"]') : null;
    }

    function findFieldError(name) {
      return form ? form.querySelector('[data-field-error="' + name + '"]') : null;
    }

    function setFieldState(name, message) {
      if (!form) {
        return;
      }

      var wrap = findFieldWrap(name);
      var error = findFieldError(name);
      var field = form.elements[name];
      var isInvalid = Boolean(message);

      if (wrap) {
        wrap.classList.toggle('is-invalid', isInvalid);
      }

      if (error) {
        error.textContent = message || '';
      }

      if (field && typeof field.setAttribute === 'function') {
        field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
      }
    }

    function clearFieldStates() {
      if (!form) {
        return;
      }

      ['name', 'phone', 'message', 'consent'].forEach(function (name) {
        setFieldState(name, '');
      });
    }

    function normalizePhone(value) {
      var normalized = value.replace(/[^\d+()\-\s]/g, '');
      var firstChar = normalized.charAt(0);

      if (firstChar === '+') {
        normalized = '+' + normalized.slice(1).replace(/\+/g, '');
      } else {
        normalized = normalized.replace(/\+/g, '');
      }

      return normalized.slice(0, 24);
    }

    function validateField(field) {
      if (!field || !field.name) {
        return '';
      }

      var name = field.name;
      var value = field.type === 'checkbox' ? field.checked : field.value.replace(/\s+/g, ' ').trim();

      if (name === 'name') {
        if (value.length < 2) {
          return 'Вкажіть імʼя.';
        }

        return '';
      }

      if (name === 'phone') {
        if (value === '') {
          return 'Вкажіть телефон.';
        }

        if (value.replace(/\D+/g, '').length < 10) {
          return 'Телефон виглядає неповним.';
        }

        return '';
      }

      if (name === 'message') {
        if (value.length < 5) {
          return 'Коротко опишіть запит.';
        }

        return '';
      }

      if (name === 'consent' && !value) {
        return 'Підтвердьте згоду на обробку даних.';
      }

      return '';
    }

    decorateImplicitTriggers();

    function validateForm() {
      if (!form) {
        return {};
      }

      var fieldNames = ['name', 'phone', 'message', 'consent'];
      var errors = {};

      fieldNames.forEach(function (name) {
        var field = form.elements[name];
        var message = validateField(field);

        setFieldState(name, message);

        if (message) {
          errors[name] = message;
        }
      });

      return errors;
    }

    function focusFirstInvalid(errors) {
      if (!form) {
        return;
      }

      var firstInvalid = Object.keys(errors)[0];
      var field = firstInvalid ? form.elements[firstInvalid] : null;

      if (field && typeof field.focus === 'function') {
        field.focus();
      }
    }

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-popup-open="request"]');

      if (trigger) {
        event.preventDefault();
        openPopup('request', trigger);
        return;
      }

      if (!popup.classList.contains('is-open')) {
        return;
      }

      if (event.target.closest('[data-popup-close]')) {
        event.preventDefault();
        closePopup();
      }
    });

    popup.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closePopup();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      var activePanel = popup.querySelector('.site-popup__panel.is-active');
      var focusable = getFocusableElements(activePanel);

      if (focusable.length === 0) {
        return;
      }

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    if (!form) {
      return;
    }

    form.addEventListener('input', function (event) {
      var field = event.target;

      if (!field || !field.name) {
        return;
      }

      if (field.name === 'phone') {
        field.value = normalizePhone(field.value);
      }

      if (findFieldWrap(field.name) && findFieldWrap(field.name).classList.contains('is-invalid')) {
        setFieldState(field.name, validateField(field));
      }
    });

    form.addEventListener('blur', function (event) {
      var field = event.target;

      if (!field || !field.name) {
        return;
      }

      setFieldState(field.name, validateField(field));
    }, true);

    form.addEventListener('change', function (event) {
      var field = event.target;

      if (!field || !field.name) {
        return;
      }

      if (field.type === 'checkbox') {
        setFieldState(field.name, validateField(field));
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      clearFieldStates();
      setStatus('');

      var errors = validateForm();

      if (Object.keys(errors).length > 0) {
        setStatus('Перевірте заповнення форми.', 'error');
        focusFirstInvalid(errors);
        return;
      }

      form.classList.add('is-submitting');
      setStatus('Надсилаємо заявку...', 'success');

      window.fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new window.FormData(form),
        credentials: 'same-origin',
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      }).then(function (response) {
        return response.json().catch(function () {
          return {
            success: false,
            data: {
              message: 'Сервер повернув неочікувану відповідь.'
            }
          };
        });
      }).then(function (result) {
        var data = result && result.data ? result.data : {};

        if (!result || !result.success) {
          if (data.errors) {
            Object.keys(data.errors).forEach(function (name) {
              setFieldState(name, data.errors[name]);
            });

            focusFirstInvalid(data.errors);
          }

          setStatus(data.message || 'Не вдалося відправити заявку.', 'error');
          return;
        }

        form.reset();
        clearFieldStates();
        setStatus('');
        openPopup('success');
      }).catch(function () {
        setStatus('Не вдалося відправити заявку. Спробуйте ще раз.', 'error');
      }).finally(function () {
        form.classList.remove('is-submitting');
      });
    });
  }

  function initFaqAccordion() {
    var items = document.querySelectorAll('.js-faq-item');

    items.forEach(function (details) {
      var summary = details.querySelector('summary');
      var answer = details.querySelector('.home-faq__answer, .js-faq-answer');
      if (!summary || !answer) return;

      var isAnimating = false;

      function forceAnswerLayout() {
        return answer.offsetHeight;
      }

      function getFaqPaddingBottom() {
        var paddingBottom = window.getComputedStyle(answer).getPropertyValue('--faq-answer-padding-bottom').trim();
        return paddingBottom || '0px';
      }

      function refreshFaqLayout() {
        window.requestAnimationFrame(function () {
          var lenis = window.__graffitLenis;

          if (lenis && typeof lenis.resize === 'function') {
            lenis.resize();
          }

          if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        });
      }

      function finishAnimation() {
        answer.style.removeProperty('transition');
        answer.style.removeProperty('max-height');
        answer.style.removeProperty('padding-bottom');
        details.classList.remove('is-faq-animating');
        isAnimating = false;
      }

      function measureOpenHeight(paddingBottom) {
        answer.style.transition = 'none';
        answer.style.maxHeight = 'none';
        answer.style.paddingBottom = paddingBottom;
        var height = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        answer.style.paddingBottom = '0px';
        forceAnswerLayout();
        answer.style.removeProperty('transition');
        return height;
      }

      function closeAnswer() {
        var currentHeight = answer.scrollHeight;
        var closeTimer;
        var didClose = false;

        isAnimating = true;
        details.classList.add('is-faq-animating');
        answer.style.transition = 'none';
        answer.style.maxHeight = currentHeight + 'px';
        forceAnswerLayout();
        answer.style.removeProperty('transition');

        requestAnimationFrame(function () {
          answer.style.maxHeight = '0px';
        });

        function completeClose() {
          if (didClose) {
            return;
          }

          didClose = true;
          window.clearTimeout(closeTimer);
          details.open = false;
          finishAnimation();
          refreshFaqLayout();
          answer.removeEventListener('transitionend', onClose);
        }

        var onClose = function (ev) {
          if (ev.propertyName !== 'max-height') return;
          completeClose();
        };

        answer.addEventListener('transitionend', onClose);
        closeTimer = window.setTimeout(completeClose, 500);
      }

      function openAnswer() {
        var paddingBottom = getFaqPaddingBottom();
        var targetHeight = measureOpenHeight(paddingBottom);
        var openTimer;
        var didOpen = false;

        isAnimating = true;
        details.classList.add('is-faq-animating');
        details.open = true;
        answer.style.maxHeight = '0px';
        answer.style.paddingBottom = '0px';
        forceAnswerLayout();

        requestAnimationFrame(function () {
          answer.style.paddingBottom = paddingBottom;
          answer.style.maxHeight = targetHeight + 'px';
        });

        function completeOpen() {
          if (didOpen) {
            return;
          }

          didOpen = true;
          window.clearTimeout(openTimer);
          answer.removeEventListener('transitionend', onOpen);
          answer.style.maxHeight = 'none';
          answer.style.removeProperty('padding-bottom');
          details.classList.remove('is-faq-animating');
          isAnimating = false;
          refreshFaqLayout();
        }

        var onOpen = function (ev) {
          if (ev.propertyName !== 'max-height') return;
          completeOpen();
        };

        answer.addEventListener('transitionend', onOpen);
        openTimer = window.setTimeout(completeOpen, 500);
      }

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (isAnimating) return;

        if (details.open) {
          closeAnswer();
          return;
        }

        openAnswer();
      });
    });
  }

  function initAboutStackMobileVisual() {
    if (window.innerWidth > 1024) {
      return;
    }

    var visuals = document.querySelectorAll('.js-about-stack-mobile-visual');

    if (!visuals.length) {
      return;
    }

    visuals.forEach(function (visual) {
      if (visual.getAttribute('data-about-stack-mobile-ready') === '1') {
        return;
      }

      visual.setAttribute('data-about-stack-mobile-ready', '1');

      function syncState() {
        var rect = visual.getBoundingClientRect();
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        var elementCenter = rect.top + rect.height / 2;
        var viewportCenter = viewportHeight / 2;
        var isNearViewportCenter = Math.abs(elementCenter - viewportCenter) <= rect.height * 0.22;
        var isVisible = rect.bottom > 0 && rect.top < viewportHeight;

        visual.classList.toggle('is-active', isVisible && isNearViewportCenter);
      }

      window.addEventListener('scroll', syncState, { passive: true });
      window.addEventListener('resize', syncState);
      window.requestAnimationFrame(syncState);
    });
  }

  function initHomeScrollFilm() {
    var container = document.querySelector('.js-home-scroll-film');
    var canvas = document.querySelector('.js-home-scroll-film-canvas');
    var loader = document.querySelector('.js-home-film-loader');

    function dismissInitialFilmLoader() {
      document.body.classList.remove('is-home-film-loading');

      if (!loader) {
        return;
      }

      loader.classList.add('is-ready');
      loader.classList.remove('is-active');

      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }

      loader = null;
    }

    dismissInitialFilmLoader();

    if (!container || !canvas) {
      dismissInitialFilmLoader();
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      dismissInitialFilmLoader();
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      dismissInitialFilmLoader();
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    function configNumber(value, fallback) {
      var parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : fallback;
    }

    function configInteger(value, fallback) {
      return Math.max(0, Math.round(configNumber(value, fallback)));
    }

    var MOBILE_FILM_SOURCE = 'mobile-ezgif-121';
    var MOBILE_FILM_CACHE_KEY = 'home-film-mobile-59266015f41124da';

    function mobileFilmFallbackConfig(baseConfig) {
      var base = (baseConfig && baseConfig.p1Base) || DEFAULT_LEGACY_BASE;

      return {
        enabled: true,
        p1Base: base,
        p2Base: base,
        p1Last: 120,
        p2Last: 120,
        poster: base + '001_result-4.webp',
        pad: 3,
        ext: '_result-4.webp',
        scrollPace: 1,
        phase2ScrollPace: 1.85,
        source: MOBILE_FILM_SOURCE,
        p2FrameOffset: 1,
        p2Ext: '_result-5.webp',
        p2AltExt: '',
        p2AltLastFrame: 0,
        p2TailFrameSkip: 0,
        cacheKey: MOBILE_FILM_CACHE_KEY
      };
    }

    function normalizeMobileFilmConfig(config) {
      var normalized;

      if (!config) {
        return config;
      }

      if (
        config.source !== 'mobile-ezgif' &&
        config.ext !== '_result-2-scaled.webp' &&
        config.p2Ext !== '_result-1-scaled.webp' &&
        config.p2AltExt !== '_result-3-scaled.webp'
      ) {
        if (config.source === MOBILE_FILM_SOURCE) {
          normalized = Object.assign({}, config);
          normalized.p1Last = 120;
          normalized.p2Last = 120;
          normalized.p2FrameOffset = 1;
          normalized.p2Ext = '_result-5.webp';
          normalized.p2AltExt = '';
          normalized.p2AltLastFrame = 0;
          normalized.p2TailFrameSkip = 0;
          normalized.cacheKey = MOBILE_FILM_CACHE_KEY;

          return normalized;
        }

        return config;
      }

      return mobileFilmFallbackConfig(config);
    }

    var rootFilmConfig = window.graffitHomeFilm || {};
    var DEFAULT_LEGACY_BASE = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/ezgif-frame-';
    var filmConfig = isMobileViewport()
      ? (rootFilmConfig.mobile || mobileFilmFallbackConfig(rootFilmConfig))
      : rootFilmConfig;
    filmConfig = isMobileViewport() ? normalizeMobileFilmConfig(filmConfig) : filmConfig;
    var isLegacyFilm = filmConfig.source === 'legacy-ezgif' || !filmConfig.p1Base;
    var usesSegmentedP2Frames = !!(
      filmConfig.p2Ext ||
      filmConfig.p2AltExt ||
      filmConfig.p2FrameOffset ||
      filmConfig.p2TailFrameSkip
    );
    var P1_BASE = filmConfig.p1Base || DEFAULT_LEGACY_BASE;
    var P2_BASE = filmConfig.p2Base || P1_BASE;
    var P1_LAST = configInteger(filmConfig.p1Last, 210);
    var P2_LAST = configInteger(filmConfig.p2Last, 240);
    var P1_COUNT = P1_LAST + 1;
    var P2_COUNT = P2_LAST + 1;
    var FRAME_PAD = configInteger(filmConfig.pad, isLegacyFilm ? 3 : 4);
    var FRAME_EXT = filmConfig.ext || (isLegacyFilm ? '_result-scaled.webp' : '.webp');
    var P2_FRAME_EXT = filmConfig.p2Ext || (isLegacyFilm ? '_result.webp' : FRAME_EXT);
    var P2_FRAME_ALT_EXT = filmConfig.p2AltExt || '';
    var P2_FRAME_ALT_LAST = configInteger(filmConfig.p2AltLastFrame, 0);
    var P2_FRAME_OFFSET = configInteger(filmConfig.p2FrameOffset, isLegacyFilm ? 1 : 0);
    var P2_FRAME_TAIL_SKIP = configInteger(filmConfig.p2TailFrameSkip, 0);
    var FILM_CACHE_STORAGE_KEY = 'graffitHomeFilmCacheKey';
    var FILM_CACHE_KEY = filmConfig.cacheKey
      || (loader ? loader.getAttribute('data-film-cache-key') : '')
      || [
        filmConfig.source || 'film',
        P1_BASE,
        P2_BASE,
        P1_LAST,
        P2_LAST,
        FRAME_EXT,
        P2_FRAME_EXT,
        P2_FRAME_ALT_EXT,
        P2_FRAME_ALT_LAST,
        P2_FRAME_OFFSET,
        P2_FRAME_TAIL_SKIP
      ].join('|');
    var FILM_FRAME_VERSION = encodeURIComponent(FILM_CACHE_KEY || 'home-film');
    var FIRST_FRAME_URL = versionFilmUrl(filmConfig.poster || (P1_BASE + String(1).padStart(FRAME_PAD, '0') + FRAME_EXT));

    function versionFilmUrl(url) {
      if (!url || !FILM_FRAME_VERSION) {
        return url;
      }

      return url + (url.indexOf('?') === -1 ? '?' : '&') + 'v=' + FILM_FRAME_VERSION;
    }

    canvas.style.backgroundImage = 'url("' + FIRST_FRAME_URL + '")';
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundRepeat = 'no-repeat';

    function filmFrameUrl(phase, index) {
      var frameNumber = index + 1;

      if (phase === 2 && (isLegacyFilm || usesSegmentedP2Frames)) {
        var p2FrameNumber = P2_FRAME_OFFSET + index;
        var p2FrameExt = P2_FRAME_ALT_EXT && p2FrameNumber <= P2_FRAME_ALT_LAST
          ? P2_FRAME_ALT_EXT
          : P2_FRAME_EXT;

        if (P2_FRAME_TAIL_SKIP > 0 && p2FrameExt === P2_FRAME_EXT) {
          p2FrameNumber += P2_FRAME_TAIL_SKIP;
        }

        return versionFilmUrl(P2_BASE + String(p2FrameNumber).padStart(FRAME_PAD, '0') + p2FrameExt);
      }

      var base = phase === 1 ? P1_BASE : P2_BASE;
      return versionFilmUrl(base + String(frameNumber).padStart(FRAME_PAD, '0') + FRAME_EXT);
    }

    var p1Images = container.__homeFilmP1Images;
    var p2Images = container.__homeFilmP2Images;
    var FILM_SCROLL_PACE = configNumber(filmConfig.scrollPace, 1);
    var FILM_PHASE2_SCROLL_PACE = configNumber(filmConfig.phase2ScrollPace, 1.85);
    var filmPhase2Latched = !!container.__homeFilmPhase2Latched;
    var FILM_PRELOAD_CONCURRENCY = isMobileViewport() ? 10 : 18;
    var activePhase = 1;
    var currentIndex = -1;
    var lastDrawnImage = null;
    var lastDrawnFrameIndex = -1;
    var pendingFilmFrame = null;
    var pendingFilmFrameRaf = 0;
    var filmPhase2DrawProgress = 0;
    var FILM_BOTTOM_WING_BLEED = 8;
    var filmOverlayRaf = 0;
    var filmPreloadComplete = false;

    function countFilmImagesReady(images, count) {
      var ready = 0;
      var i;

      if (!images) {
        return 0;
      }

      for (i = 0; i < count; i += 1) {
        if (isImageReady(images[i])) {
          ready += 1;
        }
      }

      return ready;
    }

    function areStoredFilmImagesComplete() {
      return countFilmImagesReady(p1Images, P1_COUNT) === P1_COUNT
        && countFilmImagesReady(p2Images, P2_COUNT) === P2_COUNT;
    }

    function finishFilmPreload(p1Result, p2Result) {
      var failed = (p1Result ? p1Result.failed : 0) + (p2Result ? p2Result.failed : 0);
      var ready = countFilmImagesReady(p1Images, P1_COUNT) + countFilmImagesReady(p2Images, P2_COUNT);

      filmPreloadComplete = ready > 0;

      if (ready === (P1_COUNT + P2_COUNT) && failed === 0) {
        markFilmCacheReady();
      }

      document.body.classList.remove('is-home-film-loading');
      dismissInitialFilmLoader();
      syncHomeScrollFilmFrame();
    }

    function writeLocalStorage(key, value) {
      try {
        if (window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (error) {}
    }

    function isMobileFilmLayout() {
      return (window.innerWidth || document.documentElement.clientWidth || 1440) <= 1024;
    }

    function isHomeFilmCanvasHidden() {
      return canvas.style.visibility === 'hidden';
    }

    function hideHomeFilmCanvas() {
      canvas.style.visibility = 'hidden';
      canvas.style.pointerEvents = 'none';
    }

    function showHomeFilmCanvas() {
      canvas.style.visibility = '';
      canvas.style.pointerEvents = '';
    }

    function shouldShowHomeFilmCanvas() {
      if (!isMobileFilmLayout()) {
        return true;
      }

      var about = document.getElementById('home-about');
      var hexFlow = document.querySelector('.home-hex-projects-flow');
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var notch = homeFilmNotchPx();

      if (about) {
        var aboutRect = about.getBoundingClientRect();

        if (aboutRect.bottom <= viewportHeight + notch) {
          return false;
        }
      }

      if (hexFlow) {
        var hexRect = hexFlow.getBoundingClientRect();

        if (hexRect.top <= viewportHeight * 0.12) {
          return false;
        }
      }

      return true;
    }

    function isMobileAboutFilmHandoffActive() {
      if (!isMobileFilmLayout()) {
        return true;
      }

      var about = document.getElementById('home-about');

      if (!about) {
        return false;
      }

      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var notch = homeFilmNotchPx();
      var aboutRect = about.getBoundingClientRect();

      if (aboutRect.bottom < notch * 2) {
        return false;
      }

      if (aboutRect.top > viewportHeight + notch) {
        return false;
      }

      return true;
    }

    function syncHomeFilmCanvasVisibility() {
      if (!isMobileFilmLayout()) {
        return;
      }

      if (shouldShowHomeFilmCanvas()) {
        if (isHomeFilmCanvasHidden()) {
          showHomeFilmCanvas();
          syncHomeScrollFilmFrame();
        }

        return;
      }

      hideHomeFilmCanvas();
      setHomeFilmHandoff(false, true);
      stopFilmOverlayLoop();
    }

    function markFilmCacheReady() {
      if (!FILM_CACHE_KEY) {
        return;
      }

      writeLocalStorage(FILM_CACHE_STORAGE_KEY, FILM_CACHE_KEY);
    }

    function isImageReady(img) {
      return !!(img && img.complete && img.naturalWidth);
    }

    function queueFilmFrameLoad(phase, index, highPriority) {
      var images = phase === 1 ? p1Images : p2Images;
      var count = phase === 1 ? P1_COUNT : P2_COUNT;
      var img;
      var safeIndex;

      if (!images || index < 0 || index >= count) {
        return;
      }

      safeIndex = index;
      img = images[safeIndex];

      if (isImageReady(img)) {
        return;
      }

      if (img && img.__homeFilmLoadBound) {
        return;
      }

      img = new Image();
      images[safeIndex] = img;
      img.__homeFilmLoadBound = true;
      img.loading = 'eager';
      img.decoding = 'async';

      if (highPriority) {
        img.fetchPriority = 'high';
      }

      img.addEventListener('load', function () {
        if (typeof img.decode === 'function') {
          img.decode().then(syncHomeScrollFilmFrame).catch(syncHomeScrollFilmFrame);
          return;
        }

        syncHomeScrollFilmFrame();
      }, { once: true });

      img.addEventListener('error', function () {
        if (!img.__homeFilmRetried) {
          img.__homeFilmRetried = true;
          img.src = filmFrameUrl(phase, safeIndex);
        }
      }, { once: true });

      img.src = filmFrameUrl(phase, safeIndex);
    }

    function warmFilmFramesAround(phase, index) {
      var lastIndex = phase === 1 ? P1_LAST : P2_LAST;
      var mobileFilm = isMobileFilmLayout();
      var behind = mobileFilm ? (phase === 2 ? 18 : 10) : 20;
      var ahead = mobileFilm ? (phase === 2 ? 48 : 34) : 20;
      var start = Math.max(0, index - behind);
      var end = Math.min(lastIndex, index + ahead);
      var i;

      for (i = start; i <= end; i += 1) {
        queueFilmFrameLoad(phase, i, mobileFilm && Math.abs(i - index) <= 10);
      }
    }

    function resolveFilmImage(images, index, phase) {
      if (isImageReady(images[index])) {
        return {
          img: images[index],
          frameIndex: index
        };
      }

      var offset = 1;
      var maxOffset = Math.min(32, images.length);
      var mobileFilm = isMobileFilmLayout();
      var isReverse = mobileFilm && activePhase === phase && currentIndex > index;
      var previousMatch = null;
      var nextMatch = null;

      while (offset <= maxOffset) {
        if (!previousMatch && isImageReady(images[index - offset])) {
          previousMatch = {
            img: images[index - offset],
            frameIndex: index - offset
          };
        }

        if (!nextMatch && isImageReady(images[index + offset])) {
          nextMatch = {
            img: images[index + offset],
            frameIndex: index + offset
          };
        }

        if (!mobileFilm && (previousMatch || nextMatch)) {
          return previousMatch || nextMatch;
        }

        if (mobileFilm && isReverse && nextMatch) {
          return nextMatch;
        }

        if (mobileFilm && !isReverse && previousMatch) {
          return previousMatch;
        }

        offset += 1;
      }

      if (
        mobileFilm &&
        activePhase === phase &&
        lastDrawnImage &&
        images[lastDrawnFrameIndex] === lastDrawnImage
      ) {
        return {
          img: lastDrawnImage,
          frameIndex: lastDrawnFrameIndex
        };
      }

      if (mobileFilm) {
        return isReverse ? (nextMatch || previousMatch) : (previousMatch || nextMatch);
      }

      return null;
    }

    function buildFilmPreloadOrder(phase, count) {
      var order = [];
      var seen = new Set();
      var mobileFilm = isMobileFilmLayout();
      var leadCount = mobileFilm ? (phase === 2 ? 28 : 36) : count;
      var keyframeStep = phase === 2 ? 4 : 5;
      var i;

      function pushIndex(index) {
        if (index < 0 || index >= count || seen.has(index)) {
          return;
        }

        seen.add(index);
        order.push(index);
      }

      if (!mobileFilm) {
        for (i = 0; i < count; i += 1) {
          pushIndex(i);
        }

        return order;
      }

      for (i = 0; i < Math.min(count, leadCount); i += 1) {
        pushIndex(i);
      }

      pushIndex(count - 1);

      for (i = 0; i < count; i += keyframeStep) {
        pushIndex(i);
      }

      for (i = Math.floor(keyframeStep / 2); i < count; i += keyframeStep) {
        pushIndex(i);
      }

      for (i = 0; i < count; i += 1) {
        pushIndex(i);
      }

      return order;
    }

    function preloadFilmPhase(phase, count, targetArray) {
      return new Promise(function (resolve) {
        var order = buildFilmPreloadOrder(phase, count);
        var nextIndex = 0;
        var activeLoads = 0;
        var failedLoads = 0;
        var preloadResolved = false;

        function resolvePreload() {
          if (!preloadResolved && nextIndex >= order.length && activeLoads === 0) {
            preloadResolved = true;
            resolve({
              failed: failedLoads,
            });
          }
        }

        function pump() {
          if (nextIndex >= order.length && activeLoads === 0) {
            resolvePreload();
            return;
          }

          while (activeLoads < FILM_PRELOAD_CONCURRENCY && nextIndex < order.length) {
            var preloadIndex = nextIndex;
            var preloadFrame = order[preloadIndex];

            nextIndex += 1;

            (function (idx, orderPosition) {
              var existing = targetArray[idx];
              activeLoads += 1;
              var img = new Image();
              var failed = false;

              if (isImageReady(existing) || (existing && existing.__homeFilmLoadBound)) {
                activeLoads -= 1;
                return;
              }

              targetArray[idx] = img;
              img.__homeFilmLoadBound = true;

              function finish() {
                activeLoads -= 1;

                if (failed || !isImageReady(img)) {
                  failedLoads += 1;
                }

                if (idx === 0 && phase === 1 && isImageReady(img) && activePhase === 1 && currentIndex <= 0) {
                  activePhase = phase;
                  currentIndex = 0;
                  lastDrawnFrameIndex = 0;
                  drawImage(img, phase);
                }

                pump();
              }

              img.onload = function () {
                if (typeof img.decode === 'function') {
                  img.decode().then(finish).catch(finish);
                  return;
                }

                finish();
              };
              img.onerror = function () {
                if (!img.__homeFilmRetried) {
                  img.__homeFilmRetried = true;
                  img.src = filmFrameUrl(phase, idx);
                  return;
                }

                failed = true;
                finish();
              };

              img.loading = 'eager';

              if (orderPosition < (isMobileFilmLayout() ? 36 : 8)) {
                img.fetchPriority = 'high';
              }

              img.decoding = 'async';
              img.src = filmFrameUrl(phase, idx);
            })(preloadFrame, preloadIndex);
          }

          resolvePreload();
        }

        pump();
      });
    }

    if (areStoredFilmImagesComplete()) {
      filmPreloadComplete = true;
      dismissInitialFilmLoader();
    } else {
      if (!p1Images || !p2Images) {
        p1Images = new Array(P1_COUNT).fill(null);
        p2Images = new Array(P2_COUNT).fill(null);
        container.__homeFilmP1Images = p1Images;
        container.__homeFilmP2Images = p2Images;
      }

      var p1Preload = preloadFilmPhase(1, P1_COUNT, p1Images);
      var p2Preload = preloadFilmPhase(2, P2_COUNT, p2Images);

      p1Preload.then(function () {
        if (countFilmImagesReady(p1Images, P1_COUNT) > 0) {
          filmPreloadComplete = true;
        }

        syncHomeScrollFilmFrame();
      });

      Promise.all([p1Preload, p2Preload]).then(function (results) {
        finishFilmPreload(results[0], results[1]);
      });
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function destroyHomeScrollFilmTriggers() {
      ['home-scroll-p1', 'home-scroll-p2'].forEach(function (id) {
        var st = window.ScrollTrigger.getById(id);

        if (!st) {
          return;
        }

        if (st.animation) {
          st.animation.kill();
        }

        st.kill();
      });
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      syncHomeScrollFilmFrame();
    }

    function homeFilmNotchPx() {
      var w = window.innerWidth || 1440;

      if (w <= 1024) {
        return Math.min((40 / 375) * w, 40);
      }

      return Math.min((90 / 1440) * w, 90);
    }

    function setHomeFilmHandoff(active, skipSync) {
      var flow = document.querySelector('.home-chaos-about-flow');

      if (!flow) {
        return;
      }

      if (isMobileFilmLayout() && active && !isMobileAboutFilmHandoffActive()) {
        active = false;
      }

      active = !!active;
      flow.classList.toggle('is-film-wedge-active', active);

      if (skipSync) {
        return;
      }

      if (active) {
        syncFilmBowTieOverlays();
        startFilmOverlayLoop();
        return;
      }

      stopFilmOverlayLoop();
      syncFilmBowTieOverlays();
    }

    function mountFilmOverlay(node) {
      if (!node || node.getAttribute('data-film-overlay-mounted') === '1') {
        return;
      }

      document.body.appendChild(node);
      node.setAttribute('data-film-overlay-mounted', '1');
    }

    function isHomeFilmHandoffActive() {
      var flow = document.querySelector('.home-chaos-about-flow');

      return !!(flow && flow.classList.contains('is-film-wedge-active'));
    }

    function startFilmOverlayLoop() {
      if (filmOverlayRaf) {
        return;
      }

      filmOverlayRaf = window.requestAnimationFrame(function tick() {
        filmOverlayRaf = 0;

        if (!isHomeFilmHandoffActive()) {
          syncFilmBowTieOverlays();
          return;
        }

        syncFilmBowTieOverlays();
        filmOverlayRaf = window.requestAnimationFrame(tick);
      });
    }

    function stopFilmOverlayLoop() {
      if (!filmOverlayRaf) {
        return;
      }

      window.cancelAnimationFrame(filmOverlayRaf);
      filmOverlayRaf = 0;
    }

    function syncFilmBottomWing() {
      var wing = document.querySelector('.js-home-film-bottom-wing');
      var about = document.getElementById('home-about');
      var wedgeActive = isHomeFilmHandoffActive();

      if (!wing) {
        return;
      }

      if (isMobileFilmLayout()) {
        wing.style.opacity = '0';
        wing.style.visibility = 'hidden';
        return;
      }

      mountFilmOverlay(wing);

      if (!wedgeActive || !about || canvas.style.visibility === 'hidden') {
        wing.style.opacity = '0';
        wing.style.visibility = 'hidden';
        return;
      }

      var viewport = about.querySelector('.services-clients__viewport');

      if (!viewport) {
        wing.style.opacity = '0';
        wing.style.visibility = 'hidden';
        return;
      }

      var notch = homeFilmNotchPx();
      var wingBleed = FILM_BOTTOM_WING_BLEED;
      var vpRect = viewport.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var wingTop = Math.floor(vpRect.bottom - notch - wingBleed);
      var wingHeight = viewportHeight - wingTop;

      if (vpRect.bottom < notch * 0.25 || vpRect.top > viewportHeight || wingTop >= viewportHeight || wingHeight <= 0) {
        wing.style.opacity = '0';
        wing.style.visibility = 'hidden';
        return;
      }

      wing.style.visibility = 'visible';
      wing.style.opacity = '1';
      wing.style.top = wingTop + 'px';
      wing.style.height = wingHeight + 'px';
      wing.style.setProperty('--home-film-bottom-wing-notch', notch + 'px');
      wing.style.setProperty('--home-film-bottom-wing-bleed', wingBleed + 'px');
    }

    function syncFilmBowTieOverlays() {
      syncHomeFilmCanvasVisibility();
      syncFilmWedge();
      syncFilmBottomWing();
    }

    function syncFilmWedge() {
      var wedge = document.querySelector('.js-home-film-wedge');

      if (!wedge) {
        return;
      }

      wedge.style.opacity = '0';
      wedge.style.visibility = 'hidden';
    }

    function drawImage(img, drawPhase) {
      if (!img || !img.complete || !img.naturalWidth) {
        return;
      }

      var cw = canvas.width;
      var ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      var w = img.naturalWidth * scale;
      var h = img.naturalHeight * scale;
      var x = (cw - w) / 2;
      var y = (ch - h) / 2;

      if (drawPhase === 2) {
        var notch = homeFilmNotchPx();
        var p2 = window.ScrollTrigger.getById('home-scroll-p2');
        var progress = p2 ? filmPhase2DrawProgress : 0;

        /* Прив’язка нижнього краю кадра до шва chaos → «Про нас» (не center-crop). */
        y = ch - h + notch * (0.42 + progress * 0.36);
      }

      ctx.drawImage(img, x, y, w, h);
      canvas.style.backgroundImage = 'none';
      lastDrawnImage = img;
      container.__homeFilmDraw = {
        url: img.currentSrc || img.src,
        w: w,
        h: h,
        posX: x,
        posY: y
      };

      if (!container.__homeFilmWedgeRaf) {
        container.__homeFilmWedgeRaf = window.requestAnimationFrame(function () {
          container.__homeFilmWedgeRaf = 0;
          syncFilmBowTieOverlays();
        });
      }
    }

    function progressToFrameIndex(progress, lastIndex) {
      if (lastIndex <= 0) {
        return 0;
      }

      return clamp(Math.round(progress * lastIndex), 0, lastIndex);
    }

    function renderFilmFrame(phase, index) {
      var images = phase === 1 ? p1Images : p2Images;
      var lastIndex = phase === 1 ? P1_LAST : P2_LAST;
      var nextIndex = clamp(index, 0, lastIndex);
      var resolved = resolveFilmImage(images, nextIndex, phase);
      var img = resolved ? resolved.img : null;

      warmFilmFramesAround(phase, nextIndex);

      if (!img) {
        queueFilmFrameLoad(phase, nextIndex, true);

        return;
      }

      if (activePhase === phase && currentIndex === nextIndex && img === lastDrawnImage) {
        syncFilmBowTieOverlays();
        return;
      }

      activePhase = phase;
      currentIndex = nextIndex;
      lastDrawnFrameIndex = resolved.frameIndex;
      drawImage(img, phase);
    }

    function setFilmFrame(phase, index) {
      if (!isMobileFilmLayout()) {
        renderFilmFrame(phase, index);
        return;
      }

      pendingFilmFrame = {
        phase: phase,
        index: index
      };

      if (pendingFilmFrameRaf) {
        return;
      }

      pendingFilmFrameRaf = window.requestAnimationFrame(function () {
        var nextFrame = pendingFilmFrame;

        pendingFilmFrame = null;
        pendingFilmFrameRaf = 0;

        if (!nextFrame) {
          return;
        }

        renderFilmFrame(nextFrame.phase, nextFrame.index);
      });
    }

    function phase1BaseSpanPx() {
      var hero = container.querySelector('.home-hero');
      var showcase = container.querySelector('.home-showcase');
      var span = 0;

      if (hero) {
        span += hero.offsetHeight;
      }

      if (showcase) {
        span += showcase.offsetHeight;
      }

      return span || window.innerHeight * 2;
    }

    function phase1PxPerFrame() {
      return (phase1BaseSpanPx() / P1_LAST) * FILM_SCROLL_PACE;
    }

    function phase1ScrollSpanPx() {
      return phase1PxPerFrame() * P1_LAST;
    }

    function phase2ScrollSpanPx() {
      return phase1PxPerFrame() * P2_LAST * FILM_PHASE2_SCROLL_PACE;
    }

    function phase2MobileScrollSpanPx() {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 844;

      return Math.round(clamp(viewportHeight * 1.33, 860, 1240));
    }

    function phase2EffectiveProgress(p1, p2) {
      var rawProgress = p2 ? clamp(p2.progress, 0, 1) : 0;

      if (!isMobileFilmLayout() || !p1 || !p2) {
        return rawProgress;
      }

      var start = Math.max(p1.end, p2.start);
      var end = Math.max(p2.end, start + 1);
      var scroll = typeof p1.scroll === 'function'
        ? p1.scroll()
        : (window.pageYOffset || document.documentElement.scrollTop || 0);

      return clamp((scroll - start) / (end - start), 0, 1);
    }

    function syncHomeScrollFilmFrame() {
      syncHomeFilmCanvasVisibility();

      if (isMobileFilmLayout() && isHomeFilmCanvasHidden()) {
        return;
      }

      var p1 = window.ScrollTrigger.getById('home-scroll-p1');
      var p2 = window.ScrollTrigger.getById('home-scroll-p2');

      if (!p1) {
        setFilmFrame(1, 0);
        return;
      }

      var p1Progress = clamp(p1.progress, 0, 1);
      var inPhase2 = !!(p2 && (p2.isActive || p2.progress > 0));

      if (inPhase2) {
        filmPhase2Latched = true;
        container.__homeFilmPhase2Latched = filmPhase2Latched;
        setHomeFilmHandoff(true);

        if (isMobileFilmLayout() && p1Progress < 1) {
          setFilmFrame(1, progressToFrameIndex(p1Progress, P1_LAST));
          syncFilmBowTieOverlays();
          return;
        }

        filmPhase2DrawProgress = phase2EffectiveProgress(p1, p2);
        setFilmFrame(2, progressToFrameIndex(filmPhase2DrawProgress, P2_LAST));
        syncFilmBowTieOverlays();
        return;
      }

      if (p1Progress < 1) {
        filmPhase2Latched = false;
        container.__homeFilmPhase2Latched = false;
        setHomeFilmHandoff(false);
        setFilmFrame(1, progressToFrameIndex(p1Progress, P1_LAST));
        syncFilmBowTieOverlays();
        return;
      }

      if (!p2) {
        setFilmFrame(1, P1_LAST);
        syncFilmBowTieOverlays();
        return;
      }

      var scroll = p1.scroll();
      var gap = Math.max(p2.start - p1.end, 1);
      var handoff = clamp((scroll - p1.end) / gap, 0, 1);
      var handoffLast = Math.min(16, P2_LAST);

      filmPhase2Latched = true;
      container.__homeFilmPhase2Latched = filmPhase2Latched;
      setHomeFilmHandoff(true);
      filmPhase2DrawProgress = handoff;
      setFilmFrame(2, progressToFrameIndex(handoff, handoffLast));
      syncFilmBowTieOverlays();
    }

    function onFilmScrollChange() {
      syncHomeScrollFilmFrame();
    }

    destroyHomeScrollFilmTriggers();

    var showcase = container.querySelector('.home-showcase');
    var chaos = document.querySelector('.home-chaos');

    resizeCanvas();

    var st1State = { frame: 0 };

    window.gsap.to(st1State, {
      frame: P1_LAST,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        id: 'home-scroll-p1',
        trigger: container,
        start: 'top top',
        end: function () {
          return '+=' + Math.round(phase1ScrollSpanPx());
        },
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: onFilmScrollChange,
        onUpdate: onFilmScrollChange
      }
    });

    if (chaos) {
      var st2State = { frame: 0 };
      var aboutFlow = document.querySelector('.home-chaos-about-flow');
      var mobileFilm = isMobileFilmLayout();
      var phase2Trigger = mobileFilm
        ? (chaos.querySelector('.home-chaos__inner') || chaos)
        : chaos;

      window.gsap.to(st2State, {
        frame: P2_LAST,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          id: 'home-scroll-p2',
          trigger: phase2Trigger,
          start: mobileFilm ? 'center center' : 'top top',
          endTrigger: mobileFilm ? undefined : (aboutFlow || chaos),
          /* Desktop pins the chaos section; mobile pins the centered copy until the final frame is reached. */
          end: mobileFilm ? function () {
            return '+=' + phase2MobileScrollSpanPx();
          } : aboutFlow ? 'top top' : function () {
            return '+=' + Math.round(phase2ScrollSpanPx());
          },
          pin: true,
          pinSpacing: true,
          pinClass: 'pin-spacer-home-scroll-p2',
          anticipatePin: mobileFilm ? 1 : 0,
          scrub: true,
          invalidateOnRefresh: true,
          onEnter: function () {
            filmPhase2Latched = true;
            container.__homeFilmPhase2Latched = true;
            setHomeFilmHandoff(true);
            syncHomeScrollFilmFrame();
          },
          onLeave: function () {
            if (mobileFilm) {
              filmPhase2Latched = true;
              container.__homeFilmPhase2Latched = true;
              setHomeFilmHandoff(true);
              filmPhase2DrawProgress = 1;
              setFilmFrame(2, P2_LAST);
              syncHomeFilmCanvasVisibility();
              syncFilmBowTieOverlays();
              return;
            }

            setHomeFilmHandoff(true);
            syncFilmBowTieOverlays();
          },
          onLeaveBack: function () {
            if (mobileFilm) {
              filmPhase2Latched = false;
              container.__homeFilmPhase2Latched = false;
              setHomeFilmHandoff(false);
              syncHomeScrollFilmFrame();
              return;
            }

            filmPhase2Latched = false;
            container.__homeFilmPhase2Latched = false;
            setHomeFilmHandoff(true);
            syncHomeScrollFilmFrame();
          },
          onRefresh: onFilmScrollChange,
          onUpdate: onFilmScrollChange
        }
      });
    }

    if (!container.__homeFilmWedgeScrollBound) {
      container.__homeFilmWedgeScrollBound = true;
      window.addEventListener('scroll', syncFilmBowTieOverlays, { passive: true });
    }

    if (!container.__homeFilmResizeBound) {
      container.__homeFilmResizeBound = true;

      window.addEventListener('resize', function () {
        resizeCanvas();

        if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
          window.ScrollTrigger.refresh();
        }
      }, { passive: true });
    }

    if (!container.__homeFilmCanvasHideBound) {
      container.__homeFilmCanvasHideBound = true;

      function bindHomeFilmCanvasHide() {
        var existing = window.ScrollTrigger.getById('home-scroll-film-canvas-hide');

        if (existing) {
          existing.kill();
        }

        existing = window.ScrollTrigger.getById('home-scroll-film-canvas-hide-hex');

        if (existing) {
          existing.kill();
        }

        var aboutSection = document.getElementById('home-about');

        if (!aboutSection) {
          return;
        }

        /* Canvas лишається під notch bow-tie під час pin «Про нас»; ховаємо після секції. */
        window.ScrollTrigger.create({
          id: 'home-scroll-film-canvas-hide',
          trigger: aboutSection,
          start: isMobileFilmLayout() ? 'bottom bottom' : 'bottom top',
          onEnter: function () {
            hideHomeFilmCanvas();
            setHomeFilmHandoff(false);
            syncFilmBowTieOverlays();
          },
          onLeaveBack: function () {
            showHomeFilmCanvas();
            syncHomeScrollFilmFrame();
          },
          invalidateOnRefresh: true
        });

        var hexFlow = document.querySelector('.home-hex-projects-flow');

        if (hexFlow && isMobileFilmLayout()) {
          window.ScrollTrigger.create({
            id: 'home-scroll-film-canvas-hide-hex',
            trigger: hexFlow,
            start: 'top bottom',
            onEnter: function () {
              hideHomeFilmCanvas();
              setHomeFilmHandoff(false);
              stopFilmOverlayLoop();
              syncFilmBowTieOverlays();
            },
            onLeaveBack: function () {
              showHomeFilmCanvas();
              syncHomeScrollFilmFrame();
            },
            invalidateOnRefresh: true
          });
        }
      }

      bindHomeFilmCanvasHide();
    }

    window.ScrollTrigger.refresh();
    syncHomeScrollFilmFrame();
    window.syncHomeFilmWedge = syncFilmBowTieOverlays;
  }

  function initHomeChaosFilm() {
    /* Replaced by two-phase logic inside initHomeScrollFilm. */
  }

  function initBrowserDiagnostics() {
    function cssSupports(property, value) {
      if (!window.CSS || typeof window.CSS.supports !== 'function') {
        return null;
      }

      try {
        return window.CSS.supports(property, value);
      } catch (error) {
        return null;
      }
    }

    function countCssRules(sheet) {
      try {
        return sheet && sheet.cssRules ? sheet.cssRules.length : 0;
      } catch (error) {
        return -1;
      }
    }

    function getMainStylesheetMeta() {
      var link = document.querySelector('link[href*="/assets/css/main.css"]');
      var href = link ? link.href : '';
      var loaded = false;
      var rules = 0;

      if (link && link.sheet) {
        rules = countCssRules(link.sheet);
        loaded = rules > 0 || rules === -1;
      }

      return {
        found: !!link,
        href: href,
        loaded: loaded,
        rules: rules
      };
    }

    function computedSummary() {
      var bodyStyle = window.getComputedStyle(document.body);
      var header = document.querySelector('.site-header');
      var headerStyle = header ? window.getComputedStyle(header) : null;

      return {
        'body.backgroundColor': bodyStyle ? bodyStyle.backgroundColor : '',
        'body.fontSize': bodyStyle ? bodyStyle.fontSize : '',
        'site-header.exists': !!header,
        'site-header.position': headerStyle ? headerStyle.position : '(відсутній)',
        'site-header.top': headerStyle ? headerStyle.top : '(відсутній)'
      };
    }

    function featureSummary() {
      return {
        'min()': cssSupports('width', 'min(100%, 1440px)'),
        'clamp()': cssSupports('width', 'clamp(10px, 2vw, 20px)'),
        'flex gap': cssSupports('gap', '1rem'),
        'margin-inline': cssSupports('margin-inline', '1px'),
        'overflow: clip': cssSupports('overflow', 'clip')
      };
    }

    function buildReport() {
      var mainStylesheet = getMainStylesheetMeta();

      return {
        timestamp: new Date().toISOString(),
        page: window.location.href,
        viewport: window.innerWidth + 'x' + window.innerHeight,
        dpr: window.devicePixelRatio || 1,
        userAgent: window.navigator.userAgent,
        language: window.navigator.language || '',
        stylesheet: mainStylesheet,
        features: featureSummary(),
        computed: computedSummary()
      };
    }

    window.graffitDebugReport = buildReport;
    window.graffitDebugPrint = function () {
      var report = buildReport();
      var main = report.stylesheet;

      if (window.console && typeof window.console.groupCollapsed === 'function') {
        window.console.groupCollapsed('GraffiT діагностика');
      }

      if (window.console && typeof window.console.log === 'function') {
        window.console.log('Сторінка:', report.page);
        window.console.log('Час:', report.timestamp);
        window.console.log('Viewport:', report.viewport, 'DPR:', report.dpr);
        window.console.log('Мова браузера:', report.language);
        window.console.log('User-Agent:', report.userAgent);
        window.console.log('main.css знайдено:', main.found);
        window.console.log('main.css URL:', main.href || '(не знайдено)');
        window.console.log('main.css завантажено:', main.loaded, '| к-сть правил:', main.rules);
      }

      if (window.console && typeof window.console.table === 'function') {
        window.console.table(report.features);
        window.console.table(report.computed);
      }

      if (window.console && typeof window.console.groupEnd === 'function') {
        window.console.groupEnd();
      }

      return report;
    };

    if (window.console && typeof window.console.info === 'function') {
      window.console.info('GraffiT: для звіту виконайте у консолі `window.graffitDebugPrint()`');
    }

    if (window.location.search.indexOf('graffit-debug=1') !== -1) {
      window.setTimeout(function () {
        window.graffitDebugPrint();
      }, 400);
    }
  }

  function initInnerPageReveal() {
    var main = document.querySelector('.site-main:not(.site-main--home)');

    if (!main) {
      return;
    }

    if (isMobileViewport() || prefersReducedMotion()) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    var selectors = [
      'h1, h2, h3',
      '.services-overview__eyebrow, .services-overview__title, .services-overview__text',
      '.service-card, .benefit-card, .trust-card, .project-case-card, .mediahub-capability-card',
      '.services-process__step, .products-catalog__item, .contacts__item',
      '.cta-band, .services-final-cta, .products-final-cta'
    ];

    var elements = Array.prototype.slice.call(main.querySelectorAll(selectors.join(',')));
    var seen = new WeakSet();
    // Do not apply generic reveal animation inside sections that already have
    // dedicated pin/scroll-driven motion. Mixing both causes visual conflicts
    // (hidden cards, early fade, broken sticky stack).
    var revealMotionExclusionSelector = [
      '.js-benefits-scroller',
      '.js-projects-scroller',
      '.js-products-page-projects',
      '.js-clients-scroller',
      '.js-process-section',
      '.js-products-catalog-scroller',
      /* /services/ hero + overview: reveal (autoAlpha/transform) + Lenis дають ривки фону при скролі. */
      '.services-hero',
      '.site-main--services .services-overview',
      '.site-main--services .services-inquiry',
      /* CTA на /products/: autoAlpha:0 лишав блок невидимим при зламаному скролі. */
      '.products-inquiry',
      '.site-main--products .services-final-cta',
      '.site-main--products .cta-band'
    ].join(', ');

    elements.forEach(function (element, index) {
      if (!element || seen.has(element)) {
        return;
      }

      if (element.closest(revealMotionExclusionSelector)) {
        return;
      }

      seen.add(element);

      var isTitle = element.matches('h1, h2, h3, .services-overview__title');
      var prefersLeft = index % 2 === 0;
      var offsetX = window.innerWidth <= 1024 ? 0 : (prefersLeft ? -26 : 26);
      var offsetY = isTitle ? 18 : 22;

      window.gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          x: offsetX,
          y: offsetY
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: isTitle ? 0.85 : 0.75,
          ease: 'power2.out',
          clearProps: 'opacity,visibility,transform',
          scrollTrigger: {
            trigger: element,
            start: 'top 86%',
            once: true
          }
        }
      );
    });

    refreshScrollTriggersUnlessProductsPage();
  }

  function initBlogArchiveFilters() {
    var filtersRoot = document.querySelector('.blog-page__filters');

    if (!filtersRoot) {
      return;
    }

    var filterLinks = filtersRoot.querySelectorAll('a, .blog-page__filter, [data-blog-filter]');
    var posts = document.querySelectorAll('.blog-layout--archive .blog-post, [data-blog-post], .blog-post--featured, .blog-post--compact');

    if (!filterLinks.length || !posts.length) {
      return;
    }

    var emptyMessage = document.querySelector('[data-blog-filter-empty]');

    if (!emptyMessage) {
      emptyMessage = document.createElement('p');
      emptyMessage.className = 'blog-section__empty';
      emptyMessage.setAttribute('data-blog-filter-empty', '');
      emptyMessage.textContent = 'За обраною категорією проєктів не знайдено.';
      emptyMessage.hidden = true;

      var archiveLayout = document.querySelector('.blog-layout--archive');

      if (archiveLayout && archiveLayout.parentNode) {
        archiveLayout.parentNode.insertBefore(emptyMessage, archiveLayout.nextSibling);
      }
    }

    function normalizeLabel(value) {
      return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function getFilterSlug(filterNode) {
      var byData = String(filterNode.getAttribute('data-blog-filter') || '').trim().toLowerCase();
      var label = normalizeLabel(filterNode.textContent || '');

      if (byData || filterNode.classList.contains('is-all') || label === 'усі рубрики' || label === 'усі проєкти') {
        return byData;
      }

      return '';
    }

    function getPostCategories(postNode) {
      var rawValue = String(postNode.getAttribute('data-blog-categories') || '').trim();

      if (!rawValue) {
        return [];
      }

      return rawValue.split(/\s+/).map(function (slug) {
        return String(slug || '').trim().toLowerCase();
      }).filter(Boolean);
    }

    function setActiveFilter(slug) {
      filterLinks.forEach(function (link) {
        var isActive = String(link.getAttribute('data-blog-filter') || '') === slug;
        link.classList.toggle('is-active', isActive);

        if (isActive) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    function applyFilter(slug) {
      var visibleCount = 0;

      posts.forEach(function (postNode) {
        var postCategories = getPostCategories(postNode);
        var isVisible = !slug || postCategories.indexOf(slug) !== -1;

        postNode.style.display = isVisible ? '' : 'none';
        postNode.hidden = !isVisible;
        postNode.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyMessage) {
        var hasVisiblePosts = visibleCount !== 0;
        emptyMessage.style.display = hasVisiblePosts ? 'none' : '';
        emptyMessage.hidden = hasVisiblePosts;
      }
    }

    filterLinks.forEach(function (link) {
      var slug = getFilterSlug(link);

      if (!link.hasAttribute('data-blog-filter')) {
        link.setAttribute('data-blog-filter', slug);
      }
    });

    function onFilterClick(event) {
      var eventNode = event.target;
      var eventElement = eventNode && eventNode.nodeType === 1 ? eventNode : eventNode.parentElement;
      var target = eventElement ? eventElement.closest('a, .blog-page__filter, [data-blog-filter]') : null;

      if (!target || !filtersRoot.contains(target)) {
        return;
      }

      var selectedSlug = getFilterSlug(target);

      if (target.tagName === 'A' && target.getAttribute('href')) {
        return;
      }

      event.preventDefault();
      setActiveFilter(selectedSlug);
      applyFilter(selectedSlug);
    }

    document.addEventListener('click', onFilterClick, true);

    var initialActive = filtersRoot.querySelector('.blog-page__filter.is-active, [data-blog-filter].is-active');
    var initialSlug = initialActive ? getFilterSlug(initialActive) : '';

    setActiveFilter(initialSlug);
    applyFilter(initialSlug);
  }

  function runInit(initFn, name) {
    try {
      initFn();
    } catch (error) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error('Init failed: ' + name, error);
      }
    }
  }

  runInit(initCriticalCssFallback, 'critical-css-fallback');
  runInit(initMobileMenu, 'mobile-menu');
  runInit(initProductsNavDropdowns, 'products-nav-dropdowns');
  runInit(initRequestPopup, 'request-popup');
  runInit(initScrollPerformanceConfig, 'scroll-performance-config');
  runInit(initLenis, 'lenis');
  runInit(initHeaderScrollBlur, 'header-scroll-blur');
  runInit(initHomeScrollFilm, 'home-scroll-film');
  runInit(initHomeChaosFilm, 'home-chaos-film');
  runInit(initHomeShowcaseParallax, 'home-showcase-parallax');
  runInit(initBenefitsScroller, 'benefits-scroller');
  runInit(initBenefitsMobileScroll, 'benefits-mobile-scroll');
  runInit(initProductsPageHorizontalScroll, 'products-page-catalog-scroll');
  runInit(initProductsPageProjectsScroll, 'products-page-projects-scroll');
  runInit(initProductsPageProcessTimeline, 'products-page-process-timeline');
  runInit(initProjectsScroller, 'projects-scroller');
  runInit(initProductsCatalogScroller, 'products-catalog-scroller');
  runInit(resetMediahubClientsLegacyState, 'mediahub-clients-legacy-reset');
  runInit(initClientsScroller, 'clients-scroller');
  runInit(initProjectsMobileCarousel, 'projects-mobile-carousel');
  runInit(initProductsPageProjectsMobileCarousel, 'products-page-projects-mobile');
  runInit(initProductsCatalogMobileCarousel, 'products-catalog-mobile-carousel');
  runInit(initProcessTimeline, 'process-timeline');
  runInit(initProcessMobileTimeline, 'process-mobile-timeline');
  runInit(initFaqAccordion, 'faq-accordion');
  runInit(initAboutStackMobileVisual, 'about-stack-mobile-visual');
  runInit(initInnerPageReveal, 'inner-page-reveal');
  runInit(finalizeProductsPageScrollTriggers, 'products-page-scroll-finalize');
  runInit(initBlogArchiveFilters, 'blog-archive-filters');
  runInit(initBrowserDiagnostics, 'browser-diagnostics');

  window.addEventListener(
    'load',
    function () {
      if (!window.ScrollTrigger) {
        return;
      }

      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          if (
            isMobileViewport() &&
            typeof window.ScrollTrigger.getAll === 'function' &&
            window.ScrollTrigger.getAll().length === 0
          ) {
            return;
          }

          if (isProductsPageMain()) {
            finalizeProductsPageScrollTriggers();
            return;
          }

          if (typeof window.ScrollTrigger.refresh === 'function') {
            window.ScrollTrigger.refresh();
          }
        });
      });
    },
    { once: true }
  );
})();
