/* Theme scripts entry point. */
(function () {
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

    function sync() {
      header.classList.toggle(scrolledClass, scrollY() > headerScrollThreshold());
    }

    var lenis = window.__graffitLenis;

    if (lenis && typeof lenis.on === 'function') {
      lenis.on('scroll', sync);
    }

    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    window.requestAnimationFrame(sync);
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
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            if (isServicesPageBenefits) {
              return 'clamp(+=' + servicesBenefitsPinDistance(track, stage) + ')';
            }

            return 'clamp(+=' + graffitCappedHorizontalPinDistance(section, track, stage, 1.2) + ')';
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
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

    return overflow + extra;
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
      var projectsStartOffset = isPinnedProjectsPage || isHomeProjects ? 72 : 100;
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

            if (isHomeProjects || isServicesProjectsPage) {
              return 'clamp(+=' + overflow + ')';
            }

            return 'clamp(+=' + graffitCappedHorizontalPinDistance(section, track, stage) + ')';
          },
          /*
           * Головна: pin на всю секцію — фон, __bg і ::before рухаються одним шаром з контентом
           * (раніше pin тільки на viewport + translateY на .__container зсував текст відносно фону).
           */
          pin: (isHomeProjects || isMediahubProjects || isServicesProjectsPage) ? section : viewport,
          scrub: true,
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

  /* /products/ desktop: каталог без ScrollTrigger pin-spacer; wheel тимчасово рухає track. */
  function initProductsPageHorizontalScroll() {
    if (window.innerWidth <= 1024) {
      killProductsPageCatalogScroll();
      return;
    }

    var main = document.querySelector('.site-main--products');

    if (!main || main.getAttribute('data-products-horizontal-scroll-init') === '1') {
      return;
    }

    killProductsPageCatalogScroll();

    var catalogSection = main.querySelector('.js-products-catalog-scroller');

    if (!catalogSection) {
      return;
    }

    var catalogStage = catalogSection.querySelector('.js-products-catalog-stage');
    var catalogTrack = catalogSection.querySelector('.js-products-catalog-track');
    var catalogCards = Array.prototype.slice.call(catalogSection.querySelectorAll('.product-catalog-card'));
    var catalogPrevButtons = Array.prototype.slice.call(
      catalogSection.querySelectorAll('.js-products-catalog-prev')
    );
    var catalogNextButtons = Array.prototype.slice.call(
      catalogSection.querySelectorAll('.js-products-catalog-next')
    );

    if (!catalogStage || !catalogTrack || catalogCards.length === 0) {
      return;
    }

    main.setAttribute('data-products-horizontal-scroll-init', '1');

    var catalogIndex = 0;
    var catalogProgress = 0;
    var catalogTargetProgress = 0;
    var catalogMaxDistance = 0;
    var isCatalogLocked = false;
    var lockScrollTop = 0;
    var lastScrollTop = getCurrentScrollTop();
    var animationFrame = 0;
    var lockOffset = 112;
    var pendingReleaseDirection = 0;

    function getCatalogMaxIndex() {
      return Math.max(catalogCards.length - 1, 0);
    }

    function setCatalogActiveCard(index) {
      catalogCards.forEach(function (card, cardIndex) {
        card.classList.toggle('is-active', cardIndex === index);
      });
    }

    function updateCatalogButtons() {
      catalogPrevButtons.forEach(function (button) {
        button.disabled = catalogIndex <= 0;
      });

      catalogNextButtons.forEach(function (button) {
        button.disabled = catalogIndex >= getCatalogMaxIndex();
      });
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

    function measureCatalog() {
      catalogMaxDistance = productsPageHorizontalPinDistance(catalogTrack, catalogStage);
      catalogProgress = Math.max(0, Math.min(catalogProgress, 1));
      catalogTargetProgress = Math.max(0, Math.min(catalogTargetProgress, 1));
    }

    function renderCatalog() {
      var x = -Math.round(catalogMaxDistance * catalogProgress);
      var maxIndex = getCatalogMaxIndex();
      var rawIndex = catalogProgress * maxIndex;

      catalogTrack.style.transform = 'translate3d(' + x + 'px, 0, 0)';
      catalogIndex = catalogProgress >= 0.998 ? maxIndex : Math.round(rawIndex);
      setCatalogActiveCard(catalogIndex);
      updateCatalogButtons();
    }

    function settleCatalogAnimation() {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      if (!pendingReleaseDirection) {
        return;
      }

      if (
        (pendingReleaseDirection > 0 && catalogProgress >= 0.998) ||
        (pendingReleaseDirection < 0 && catalogProgress <= 0.002)
      ) {
        pendingReleaseDirection = 0;
        unlockCatalog();
      }
    }

    function animateCatalogToTarget() {
      if (animationFrame) {
        return;
      }

      function tick() {
        var diff = catalogTargetProgress - catalogProgress;

        if (Math.abs(diff) < 0.0012) {
          catalogProgress = catalogTargetProgress;
          renderCatalog();
          settleCatalogAnimation();
          return;
        }

        catalogProgress += diff * 0.16;
        renderCatalog();

        if (isCatalogLocked && Math.abs(getCurrentScrollTop() - lockScrollTop) > 1) {
          scrollImmediately(lockScrollTop);
        }

        animationFrame = window.requestAnimationFrame(tick);
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    function getCatalogLockTop() {
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

    function lockCatalog() {
      if (isCatalogLocked || catalogMaxDistance <= 0) {
        return;
      }

      lockScrollTop = getCatalogLockTop();
      isCatalogLocked = true;
      document.documentElement.classList.add('is-products-catalog-wheel-locked');
      stopLenis();
      scrollImmediately(lockScrollTop);
    }

    function unlockCatalog() {
      if (!isCatalogLocked) {
        return;
      }

      isCatalogLocked = false;
      document.documentElement.classList.remove('is-products-catalog-wheel-locked');
      startLenis();
      lastScrollTop = getCurrentScrollTop();
    }

    function shouldLockForDirection(direction) {
      var rect = catalogSection.getBoundingClientRect();

      if (catalogMaxDistance <= 0) {
        return false;
      }

      if (direction > 0) {
        return catalogTargetProgress < 0.998 && rect.top <= lockOffset && rect.bottom > lockOffset;
      }

      return catalogTargetProgress > 0.002 && rect.top < lockOffset && rect.bottom >= lockOffset;
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
      var maxWheelStep = Math.max(catalogMaxDistance * 0.16, 120);
      var clampedDelta = Math.max(-maxWheelStep, Math.min(scaledDelta, maxWheelStep));
      var nextDistance = catalogTargetProgress * catalogMaxDistance + clampedDelta;
      var direction = clampedDelta >= 0 ? 1 : -1;

      catalogTargetProgress = Math.max(0, Math.min(nextDistance / catalogMaxDistance, 1));
      pendingReleaseDirection = 0;

      if (direction > 0 && catalogTargetProgress >= 0.998) {
        pendingReleaseDirection = 1;
      } else if (direction < 0 && catalogTargetProgress <= 0.002) {
        pendingReleaseDirection = -1;
      }

      if (
        pendingReleaseDirection &&
        Math.abs(catalogTargetProgress - catalogProgress) < 0.004
      ) {
        catalogProgress = catalogTargetProgress;
        renderCatalog();
        settleCatalogAnimation();
        return;
      }

      animateCatalogToTarget();
    }

    function onCatalogWheel(event) {
      if (window.innerWidth <= 1024) {
        unlockCatalog();
        return;
      }

      measureCatalog();

      if (catalogMaxDistance <= 0) {
        unlockCatalog();
        return;
      }

      var delta = normalizeWheelDelta(event);
      var direction = delta >= 0 ? 1 : -1;

      if (!isCatalogLocked && shouldLockForDirection(direction)) {
        lockCatalog();
      }

      if (!isCatalogLocked) {
        return;
      }

      if (
        ((direction > 0 && catalogTargetProgress >= 0.998) ||
          (direction < 0 && catalogTargetProgress <= 0.002)) &&
        Math.abs(catalogTargetProgress - catalogProgress) < 0.004
      ) {
        unlockCatalog();
        return;
      }

      event.preventDefault();
      consumeWheel(delta);
    }

    function onCatalogScroll() {
      if (window.innerWidth <= 1024 || isCatalogLocked) {
        lastScrollTop = getCurrentScrollTop();
        return;
      }

      measureCatalog();

      var currentTop = getCurrentScrollTop();
      var direction = currentTop >= lastScrollTop ? 1 : -1;

      lastScrollTop = currentTop;

      if (shouldLockForDirection(direction)) {
        lockCatalog();
      }
    }

    function scrollCatalogToIndex(index) {
      var clampedIndex = Math.max(0, Math.min(index, getCatalogMaxIndex()));
      var targetProgress = getCatalogMaxIndex() === 0 ? 0 : clampedIndex / getCatalogMaxIndex();

      catalogTargetProgress = targetProgress;
      pendingReleaseDirection = 0;
      animateCatalogToTarget();
    }

    measureCatalog();
    catalogTargetProgress = catalogProgress;
    renderCatalog();

    catalogPrevButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        scrollCatalogToIndex(catalogIndex - 1);
      });
    });

    catalogNextButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        scrollCatalogToIndex(catalogIndex + 1);
      });
    });

    function scheduleCatalogRemeasure() {
      window.requestAnimationFrame(function () {
        if (window.innerWidth <= 1024) {
          unlockCatalog();
          catalogProgress = 0;
          catalogTargetProgress = 0;
          pendingReleaseDirection = 0;
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          catalogTrack.style.transform = '';
          catalogIndex = 0;
          setCatalogActiveCard(0);
          updateCatalogButtons();
          return;
        }

        measureCatalog();
        renderCatalog();

        if (productsPageHorizontalPinDistance(catalogTrack, catalogStage) > 0) {
          return;
        }

        Array.prototype.slice.call(catalogTrack.querySelectorAll('img')).forEach(function (img) {
          if (!img.complete) {
            img.addEventListener('load', scheduleCatalogRemeasure, { once: true });
          }
        });
      });
    }

    window.addEventListener('wheel', onCatalogWheel, { passive: false, capture: true });
    window.addEventListener('scroll', onCatalogScroll, { passive: true });
    window.addEventListener('resize', scheduleCatalogRemeasure, { passive: true });

    scheduleCatalogRemeasure();
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
    var lockOffset = 72;
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
      var rect = section.getBoundingClientRect();

      if (projectsMaxDistance <= 0) {
        return false;
      }

      if (direction > 0) {
        return projectsTargetProgress < 0.998 && rect.top <= lockOffset && rect.bottom > lockOffset;
      }

      return projectsTargetProgress > 0.002 && rect.top < lockOffset && rect.bottom >= lockOffset;
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
      if (section.closest('.site-main--products')) {
        return;
      }

      if (section.getAttribute('data-products-catalog-pin-init') === '1') {
        return;
      }

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

      var tween = window.gsap.to(track, {
        x: function () {
          return -(track.scrollWidth - stage.clientWidth);
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            return 'clamp(+=' + Math.max(track.scrollWidth - stage.clientWidth, 0) + ')';
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
          pinSpacing: true,
          refreshPriority: 0,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            currentIndex = Math.round(self.progress * getMaxIndex());
            setActiveCard(currentIndex);
            updateButtons();
          }
        }
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

  function initClientsScroller() {
    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    function initAboutClientsStackedCards() {
      var aboutSection = document.getElementById('about-clients');
      var viewport;
      var stage;
      var track;
      var cards;
      var timeline;
      var nodes;
      var spacer;

      if (!aboutSection) {
        return;
      }

      aboutSection.classList.remove('is-about-clients-stacked-desktop');
      aboutSection.classList.remove('is-clients-top-fade');

      if (window.innerWidth <= 1024) {
        viewport = aboutSection.querySelector('.services-clients__viewport');
        stage = aboutSection.querySelector('.js-clients-stage');
        track = aboutSection.querySelector('.js-clients-track');
        cards = Array.prototype.slice.call(aboutSection.querySelectorAll('.trust-card'));
        spacer = aboutSection.parentElement && aboutSection.parentElement.classList.contains('pin-spacer')
          ? aboutSection.parentElement
          : null;

        if (window.ScrollTrigger && typeof window.ScrollTrigger.getAll === 'function') {
          window.ScrollTrigger.getAll().forEach(function (trigger) {
            if (trigger.trigger === aboutSection || trigger.pin === viewport || trigger.trigger === viewport) {
              trigger.kill(true);
            }
          });
        }

        aboutSection.removeAttribute('data-about-clients-stacked-init');
        aboutSection.classList.remove('is-about-clients-stacked');
        [aboutSection, spacer, viewport, stage, track].concat(cards).forEach(function (node) {
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
        return;
      }

      if (aboutSection.getAttribute('data-about-clients-stacked-init') === '1') {
        return;
      }

      viewport = aboutSection.querySelector('.services-clients__viewport');
      stage = aboutSection.querySelector('.js-clients-stage');
      track = aboutSection.querySelector('.js-clients-track');
      cards = Array.prototype.slice.call(aboutSection.querySelectorAll('.trust-card'));

      if (!viewport || !stage || !track || cards.length < 2) {
        return;
      }

      aboutSection.setAttribute('data-about-clients-stacked-init', '1');
      aboutSection.classList.add('is-about-clients-stacked');
      nodes = [
        aboutSection.querySelector('.services-clients__viewport'),
        aboutSection.querySelector('.js-clients-stage'),
        aboutSection.querySelector('.js-clients-track')
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

      window.gsap.set(cards, { clearProps: 'transform,opacity,visibility,willChange' });

      function aboutClientsCardCascade() {
        var w = window.innerWidth || 1440;

        if (w <= 1024) {
          return Math.min(Math.max(Math.round((72 / 375) * w), 64), 84);
        }

        return Math.min(Math.max(Math.round((116 / 1440) * w), 88), 132);
      }

      function aboutClientsPinDistance() {
        var w = window.innerWidth || 1440;
        var step = w <= 1024 ? Math.round(window.innerHeight * 0.62) : Math.round(window.innerHeight * 0.72);
        var raw = Math.max(step * (cards.length - 1), cards.length * 180);
        var cap = Math.round(window.innerHeight * 2.4);

        return Math.min(raw, cap);
      }

      timeline = window.gsap.timeline({
        scrollTrigger: {
          id: 'about-clients-stacked',
          trigger: aboutSection,
          start: 'top top',
          end: function () {
            return 'clamp(+=' + aboutClientsPinDistance() + ')';
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      cards.forEach(function (card, index) {
        if (index === 0) {
          return;
        }

        timeline.to(card, {
          y: function () {
            return -(card.offsetTop - cards[0].offsetTop) + (aboutClientsCardCascade() * index);
          },
          ease: 'none',
          duration: 1.35
        }, (index - 1) * 0.42);
      });
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

    if (window.innerWidth <= 1024) {
      window.ScrollTrigger.refresh();
      return;
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
      var shouldForceZeroBottomPadding = section.id === 'home-about';

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
        extra = Math.min(Math.max(extra, 120), 280);
        return overflow + extra;
      }

      function clientsPinScrollDistance() {
        var raw = clientsTrackScrollDistance();

        if (section.id !== 'mediahub-clients') {
          return raw;
        }

        // Enough scroll to finish the card stack; cap excess pin-spacer on the product page.
        var minDistance = Math.round(window.innerHeight * 0.92);
        var maxDistance = Math.round(window.innerHeight * 1.75);

        return Math.min(Math.max(raw, minDistance), maxDistance);
      }

      function clientsTopFadeStartPx() {
        var w = window.innerWidth || 1440;
        var offset = Math.round((24 / 1440) * w);
        return Math.min(Math.max(offset, 20), 30);
      }

      function clientsTopFadeRamp() {
        var w = window.innerWidth || 1440;

        if (section.id === 'home-about' || section.id === 'services-clients') {
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

        if ((section.id === 'home-about' || section.id === 'services-clients') && stage) {
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

      window.gsap.to(track, {
        y: function () {
          return -clientsTrackScrollDistance();
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            // Clamp pin distance to the document scroll bounds so the spacer
            // cannot create a blank tail after the footer on short pages.
            return 'clamp(+=' + clientsPinScrollDistance() + ')';
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
          refreshPriority: section.id === 'mediahub-clients' ? -5 : 0,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            updateClientsTopFade(self.progress);
          },
          onToggle: function (self) {
            var header;

            if (!self.isActive && self.progress <= 0.001) {
              section.classList.remove('is-clients-top-fade');

              if ((section.id === 'home-about' || section.id === 'services-clients') && stage) {
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
          }
        }
      });

      enforceViewportBottomPadding();

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

  function initProjectsNavDropdowns() {
    document.querySelectorAll('.js-header-projects').forEach(function (root) {
      var toggle = root.querySelector('.js-header-projects-toggle');
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
      if (t && t.closest && t.closest('.js-header-projects')) {
        return;
      }
      document.querySelectorAll('.js-header-projects.is-open').forEach(function (root) {
        var btn = root.querySelector('.js-header-projects-toggle');
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
      document.querySelectorAll('.js-header-projects.is-open').forEach(function (root) {
        var btn = root.querySelector('.js-header-projects-toggle');
        root.classList.remove('is-open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.querySelectorAll('.js-mobile-projects').forEach(function (root) {
      var toggle = root.querySelector('.js-mobile-projects-toggle');
      var panel = root.querySelector('.js-mobile-projects-panel');
      var mobileMainLink = root.querySelector('.mobile-menu__nav-link--projects-main');
      if (!toggle || !panel) {
        return;
      }

      function setMobileProjectsOpen(open) {
        root.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      }

      if (mobileMainLink) {
        mobileMainLink.addEventListener('click', function () {
          setMobileProjectsOpen(false);
        });
      }

      toggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setMobileProjectsOpen(!root.classList.contains('is-open'));
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

      menu.querySelectorAll('.js-mobile-projects.is-open').forEach(function (root) {
        root.classList.remove('is-open');
        var subToggle = root.querySelector('.js-mobile-projects-toggle');
        var subPanel = root.querySelector('.js-mobile-projects-panel');
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

      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (isAnimating) return;

        if (details.open) {
          isAnimating = true;
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity = '1';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              answer.style.maxHeight = '0px';
              answer.style.opacity = '0';
            });
          });
          var onClose = function (ev) {
            if (ev.propertyName !== 'max-height') return;
            details.open = false;
            answer.style.maxHeight = '';
            answer.style.opacity = '';
            isAnimating = false;
            answer.removeEventListener('transitionend', onClose);
          };
          answer.addEventListener('transitionend', onClose);
        } else {
          details.open = true;
          isAnimating = true;
          answer.style.opacity = '';
          var h = answer.scrollHeight;
          answer.style.maxHeight = '0px';
          answer.style.opacity = '0';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              answer.style.maxHeight = h + 'px';
              answer.style.opacity = '1';
            });
          });
          var onOpen = function (ev) {
            if (ev.propertyName !== 'max-height') return;
            answer.style.maxHeight = 'none';
            answer.style.opacity = '';
            isAnimating = false;
            answer.removeEventListener('transitionend', onOpen);
          };
          answer.addEventListener('transitionend', onOpen);
        }
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

    if (!container || !canvas) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    var BASE_URL = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/05/';
    var P1_LAST = 210;
    var P1_COUNT = P1_LAST + 1;
    var P2_FIRST = 28;
    var P2_LAST_FRAME = 181;
    var P2_COUNT = P2_LAST_FRAME - P2_FIRST + 1;
    var P2_LAST = P2_COUNT - 1;
    var FIRST_FRAME_URL = BASE_URL + 'ezgif-frame-001_result.webp';

    // Fallback poster to avoid black flash before first decoded frame.
    canvas.style.backgroundImage = 'url("' + FIRST_FRAME_URL + '")';
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundRepeat = 'no-repeat';

    var p1Images = container.__homeFilmP1Images;

    if (!p1Images) {
      p1Images = new Array(P1_COUNT).fill(null);
      container.__homeFilmP1Images = p1Images;

      for (var i1 = 0; i1 < P1_COUNT; i1++) {
        (function (idx) {
          var img = new Image();
          img.onload = function () {
            p1Images[idx] = img;
            if (idx === 0) {
              drawImage(img);
            }
          };
          img.src = BASE_URL + 'ezgif-frame-' + String(idx + 1).padStart(3, '0') + '_result.webp';
        })(i1);
      }
    }

    var p2Images = container.__homeFilmP2Images;

    if (!p2Images) {
      p2Images = new Array(P2_COUNT).fill(null);
      container.__homeFilmP2Images = p2Images;

      for (var i2 = 0; i2 < P2_COUNT; i2++) {
        (function (idx) {
          var img = new Image();
          img.onload = function () {
            p2Images[idx] = img;
          };
          img.src = BASE_URL + 'ezgif-frame-' + String(P2_FIRST + idx).padStart(3, '0') + '_result-1.webp';
        })(i2);
      }
    }

    var activePhase = 1;
    var currentIndex = 0;

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

    function drawImage(img) {
      if (!img || !img.complete || !img.naturalWidth) {
        return;
      }

      var cw = canvas.width;
      var ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      var w = img.naturalWidth * scale;
      var h = img.naturalHeight * scale;

      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      canvas.style.backgroundImage = 'none';
    }

    function setFilmFrame(phase, index) {
      var nextIndex = clamp(index, 0, phase === 1 ? P1_LAST : P2_LAST);

      if (activePhase === phase && currentIndex === nextIndex) {
        return;
      }

      activePhase = phase;
      currentIndex = nextIndex;
      drawImage(phase === 1 ? p1Images[currentIndex] : p2Images[currentIndex]);
    }

    function phase1PxPerFrame() {
      var p1 = window.ScrollTrigger.getById('home-scroll-p1');

      if (p1 && p1.end > p1.start) {
        return (p1.end - p1.start) / P1_LAST;
      }

      return (window.innerHeight * 2) / P1_LAST;
    }

    function phase2ScrollSpanPx() {
      return phase1PxPerFrame() * P2_LAST;
    }

    /*
     * One timeline: phase 1 until showcase end, then phase 2 from that point through
     * chaos pin (including any DOM gap) — same px/frame, no frozen pause.
     */
    function syncHomeScrollFilmFrame() {
      var p1 = window.ScrollTrigger.getById('home-scroll-p1');
      var p2 = window.ScrollTrigger.getById('home-scroll-p2');

      if (!p1) {
        setFilmFrame(1, 0);
        return;
      }

      var scroll = p1.scroll();
      var p1Start = p1.start;
      var p1End = p1.end;
      var p1Span = Math.max(p1End - p1Start, 1);

      if (!p2 || scroll <= p1End) {
        var p1Progress = clamp((scroll - p1Start) / p1Span, 0, 1);
        setFilmFrame(1, Math.round(p1Progress * P1_LAST));
        return;
      }

      var phase2Span = Math.max(p2.end - p1End, 1);
      var p2Progress = clamp((scroll - p1End) / phase2Span, 0, 1);
      setFilmFrame(2, Math.round(p2Progress * P2_LAST));
    }

    function onFilmScrollChange() {
      syncHomeScrollFilmFrame();
    }

    destroyHomeScrollFilmTriggers();

    var showcase = container.querySelector('.home-showcase');
    var chaos = container.querySelector('.home-chaos');

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
        endTrigger: showcase || container,
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: onFilmScrollChange,
        onUpdate: onFilmScrollChange
      }
    });

    if (chaos) {
      var st2State = { frame: 0 };

      window.gsap.to(st2State, {
        frame: P2_LAST,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          id: 'home-scroll-p2',
          trigger: chaos,
          start: 'top bottom',
          end: function () {
            return '+=' + Math.round(phase2ScrollSpanPx());
          },
          pin: true,
          pinSpacing: true,
          pinClass: 'pin-spacer-home-scroll-p2',
          anticipatePin: 1,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: onFilmScrollChange,
          onUpdate: onFilmScrollChange
        }
      });
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

    window.ScrollTrigger.refresh();
    syncHomeScrollFilmFrame();
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

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
  runInit(initProjectsNavDropdowns, 'projects-nav-dropdowns');
  runInit(initRequestPopup, 'request-popup');
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
