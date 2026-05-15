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

    var lenis = new window.Lenis({
      /* Коротша дистанція до immediate scroll від ScrollTrigger — менше «гуми» на межі pin. */
      duration: 0.75,
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
    var threshold = 32;

    function scrollY() {
      var lenis = window.__graffitLenis;

      if (lenis && typeof lenis.scroll === 'number') {
        return lenis.scroll;
      }

      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function sync() {
      header.classList.toggle(scrolledClass, scrollY() > threshold);
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

      window.gsap.to(track, {
        x: function () {
          return -(track.scrollWidth - stage.clientWidth);
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            return '+=' + Math.max(track.scrollWidth - stage.clientWidth, 0);
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

  function initProjectsScroller() {
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-projects-scroller').forEach(function (section) {
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

      var isProductsProjects = section.classList.contains('products-projects');
      var isHomeProjects = section.id === 'services-projects';
      var isMediahubProjects = section.id === 'mediahub-capabilities';
      var startOffset = isProductsProjects ? 360 : ((isHomeProjects || isMediahubProjects) ? 0 : 100);

      if (!viewport || !stage || !track || cards.length === 0 || ((isHomeProjects || isMediahubProjects) && !container)) {
        return;
      }

      if (isProductsProjects) {
        return;
      }

      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      /* На головній refresh під час pin давав ривок; RO лишаємо для інших .js-projects-scroller (картки з async-зображеннями). */
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
        scrollTrigger: {
          /* Головна: scrub/pin лише коли .services-projects__container упирається у верх вікна. */
          trigger: (isHomeProjects || isMediahubProjects) ? container : section,
          start: (isHomeProjects || isMediahubProjects) ? 'top top' : ('top+=' + startOffset + ' top'),
          end: function () {
            return '+=' + Math.max(track.scrollWidth - stage.clientWidth, 0);
          },
          /*
           * Головна: pin на всю секцію — фон, __bg і ::before рухаються одним шаром з контентом
           * (раніше pin тільки на viewport + translateY на .__container зсував текст відносно фону).
           */
          pin: (isHomeProjects || isMediahubProjects) ? section : viewport,
          scrub: true,
          anticipatePin: 0,
          invalidateOnRefresh: true,
          onToggle: function (self) {
            if (isProductsProjects) {
              section.classList.toggle('is-projects-active', self.isActive);
            }

            document.documentElement.classList.toggle('is-projects-pinned', self.isActive);

            var header = document.querySelector('.site-header');
            if (header) {
              header.classList.toggle('is-hidden-by-pin', self.isActive);
            }
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

    window.ScrollTrigger.refresh();
  }

  function initProductsProjectsCarousel() {
    if (window.innerWidth <= 1024) {
      return;
    }

    document.querySelectorAll('.products-projects').forEach(function (section) {
      if (section.getAttribute('data-products-projects-carousel') === '1') {
        return;
      }

      var stage = section.querySelector('.js-projects-stage');
      var track = section.querySelector('.js-projects-track');
      var prevButton = section.querySelector('.js-projects-prev');
      var nextButton = section.querySelector('.js-projects-next');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.project-case-card'));

      if (!stage || !track || cards.length === 0) {
        return;
      }

      section.setAttribute('data-products-projects-carousel', '1');
      track.style.setProperty('transition', 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)');
      track.style.setProperty('will-change', 'transform');
      track.style.setProperty('transform', 'translateX(0px)', 'important');
      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      function cardOffset(index) {
        var firstCard = cards[0];
        var targetCard = cards[index];

        if (!firstCard || !targetCard) {
          return 0;
        }

        return Math.max(targetCard.offsetLeft - firstCard.offsetLeft, 0);
      }

      function applyPosition() {
        var offset = cardOffset(currentIndex);
        track.style.setProperty('transform', 'translateX(' + -offset + 'px)', 'important');
      }

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
        currentIndex = clampedIndex;
        applyPosition();
        updateButtons();
      }

      window.addEventListener('resize', function () {
        applyPosition();
        updateButtons();
      }, { passive: true });

      window.requestAnimationFrame(function () {
        applyPosition();
        updateButtons();
      });

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
  }

  function initProjectsMobileCarousel() {
    if (window.innerWidth > 1024) {
      return;
    }

    document.querySelectorAll('.js-projects-scroller').forEach(function (section) {
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
      var viewport = section.querySelector('.products-catalog__viewport');
      var stage = section.querySelector('.js-products-catalog-stage');
      var track = section.querySelector('.js-products-catalog-track');
      var prevButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-prev'));
      var nextButtons = Array.prototype.slice.call(section.querySelectorAll('.js-products-catalog-next'));
      var cards = Array.prototype.slice.call(section.querySelectorAll('.product-catalog-card'));

      if (!viewport || !stage || !track || cards.length === 0) {
        return;
      }

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
            return '+=' + Math.max(track.scrollWidth - stage.clientWidth, 0);
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
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

    window.ScrollTrigger.refresh();
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
    if (window.innerWidth <= 1024) {
      return;
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll('.js-clients-scroller').forEach(function (section) {
      if (section.id === 'mediahub-clients') {
        section.classList.remove('is-clients-top-fade');

        var mediahubTrack = section.querySelector('.js-clients-track');
        if (mediahubTrack) {
          mediahubTrack.style.transform = 'translate3d(0px, 0px, 0px)';
        }
        return;
      }

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

      if (!viewport || !stage || !track) {
        return;
      }

      section.setAttribute('data-clients-scroller-init', '1');
      section.classList.remove('is-clients-top-fade');

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

      function clientsTopFadeStartPx() {
        var w = window.innerWidth || 1440;
        var offset = Math.round((24 / 1440) * w);
        return Math.min(Math.max(offset, 20), 30);
      }

      function updateClientsTopFade(progress) {
        var distance = clientsTrackScrollDistance() * progress;
        section.classList.toggle('is-clients-top-fade', distance > clientsTopFadeStartPx());
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
            return '+=' + clientsTrackScrollDistance();
          },
          pin: viewport,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            updateClientsTopFade(self.progress);
          },
          onToggle: function (self) {
            var header;

            if (!self.isActive && self.progress <= 0.001) {
              section.classList.remove('is-clients-top-fade');
            }

            if (!shouldHideHeader) {
              return;
            }

            header = document.querySelector('.site-header');

            if (header) {
              header.classList.toggle('is-hidden-by-pin', self.isActive);
            }
          }
        }
      });

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

  function initMediahubClientsMotion() {
    if (window.innerWidth <= 1024) {
      return;
    }

    var section = document.querySelector('.js-mediahub-clients-motion');

    if (!section || section.getAttribute('data-mediahub-clients-motion-init') === '1') {
      return;
    }

    var stage = section.querySelector('.js-clients-stage');
    var track = section.querySelector('.js-clients-track');

    if (!stage || !track) {
      return;
    }

    section.setAttribute('data-mediahub-clients-motion-init', '1');

    var ticking = false;
    var lockSpan = 0;

    function computeLockSpan() {
      var overflow = Math.max(track.scrollHeight - stage.clientHeight, 0);

      if (overflow <= 0) {
        return 0;
      }

      var w = window.innerWidth || 1440;
      var extra = Math.round((200 / 1440) * w);
      extra = Math.min(Math.max(extra, 120), 280);

      return overflow + extra;
    }

    function updateGeometry() {
      lockSpan = computeLockSpan();
      section.style.setProperty('--mediahub-clients-lock-span', lockSpan + 'px');
    }

    function sync() {
      ticking = false;

      if (lockSpan <= 0) {
        track.style.transform = 'translate3d(0px, 0px, 0px)';
        return;
      }

      var rect = section.getBoundingClientRect();
      var sectionTopAbs = (window.scrollY || window.pageYOffset || 0) + rect.top;
      var currentScroll = window.scrollY || window.pageYOffset || 0;
      var progress = (currentScroll - sectionTopAbs) / lockSpan;

      progress = Math.min(Math.max(progress, 0), 1);

      var y = -Math.round(lockSpan * progress);
      track.style.transform = 'translate3d(0px, ' + y + 'px, 0px)';
    }

    function requestSync() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(sync);
    }

    function requestRecalc() {
      updateGeometry();
      requestSync();
    }

    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestRecalc, { passive: true });

    if (typeof ResizeObserver === 'function') {
      var mediahubResizeObserver = new ResizeObserver(requestRecalc);
      mediahubResizeObserver.observe(track);
      mediahubResizeObserver.observe(stage);
    }

    updateGeometry();
    window.requestAnimationFrame(sync);
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
        var note = timeline.querySelector('.mediahub-process__note');
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

    window.ScrollTrigger.refresh();
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
        var note = section.querySelector('.mediahub-process__note');
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
      var answer = details.querySelector('.home-faq__answer');
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
    /* Runs on all screen sizes — canvas is now enabled on mobile too. */
    var container = document.querySelector('.js-home-scroll-film');
    var canvas = document.querySelector('.js-home-scroll-film-canvas');

    if (!container || !canvas) {
      return;
    }

    var ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    var BASE_URL = 'https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/05/';

    /* Phase 1 — hero + showcase: frames 001–211 (_result.webp) */
    var P1_COUNT = 211;
    var p1Images = new Array(P1_COUNT).fill(null);

    /* Phase 2 — chaos: frames 028–181 (_result-1.webp) */
    var P2_FIRST = 28;
    var P2_LAST  = 181;
    var P2_COUNT = P2_LAST - P2_FIRST + 1;
    var p2Images = new Array(P2_COUNT).fill(null);

    var activePhase  = 1;
    var currentIndex = 0;

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      renderCurrent();
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
    }

    function renderCurrent() {
      var img = activePhase === 1 ? p1Images[currentIndex] : p2Images[currentIndex];
      drawImage(img);
    }

    resizeCanvas();

    /* Preload phase 1 — draw first frame the moment it arrives */
    for (var i1 = 0; i1 < P1_COUNT; i1++) {
      (function (idx) {
        var img = new Image();
        img.onload = function () {
          p1Images[idx] = img;

          if (idx === 0 && activePhase === 1 && currentIndex === 0) {
            drawImage(img);
          }
        };
        img.src = BASE_URL + 'ezgif-frame-' + String(idx + 1).padStart(3, '0') + '_result.webp';
      })(i1);
    }

    /* Preload phase 2 */
    for (var i2 = 0; i2 < P2_COUNT; i2++) {
      (function (idx) {
        var img = new Image();
        img.onload = function () { p2Images[idx] = img; };
        img.src = BASE_URL + 'ezgif-frame-' + String(P2_FIRST + idx).padStart(3, '0') + '_result-1.webp';
      })(i2);
    }

    if (!window.gsap || !window.ScrollTrigger) {
      return;
    }

    window.gsap.registerPlugin(window.ScrollTrigger);

    var showcase = container.querySelector('.home-showcase');
    var chaos    = container.querySelector('.home-chaos');

    /*
     * Phase 1 — hero + showcase.
     *
     * scrub: true   → frame updates on every GSAP tick (60 fps on all devices,
     *                  no lag/trailing) while keeping perfect scroll sync.
     * immediateRender: false → suppresses the "last-frame flash" that happens
     *                  when ScrollTrigger calls refresh() during initialisation.
     * onRefresh     → after any layout recalc (resize, init) snap to the exact
     *                  frame matching the current scroll position.
     */
    var st1State = { frame: 0 };

    /*
     * Phase 1 — hero + showcase, ending exactly at the chaos centre (= Phase 2
     * start) so there is zero gap and no "jump" to the third animation.
     */
    window.gsap.to(st1State, {
      frame: P1_COUNT - 1,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        endTrigger: chaos || showcase || container,
        end: 'center center',
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: function (self) {
          var f = Math.round(self.progress * (P1_COUNT - 1));
          st1State.frame = f;
          /* Phase 1 always updates unless Phase 2 has already claimed ownership
           * (self.progress === 1 means we're at or past the Phase 2 boundary). */
          if (self.progress < 1 || activePhase !== 2) {
            activePhase  = 1;
            currentIndex = f;
            renderCurrent();
          }
        }
      },
      onUpdate: function () {
        var f = Math.round(st1State.frame);

        if (activePhase !== 1 || f !== currentIndex) {
          activePhase  = 1;
          currentIndex = f;
          renderCurrent();
        }
      }
    });

    /*
     * Phase 2 — chaos section pinned at viewport centre.
     * Extended to 500 vh so each of the 154 frames has ~3.25 vh of scroll —
     * the same comfortable pace as Phase 1.
     * onRefresh uses self.progress > 0 so it only takes ownership when the
     * user has actually scrolled into Phase 2 territory.
     */
    if (chaos) {
      var st2State = { frame: 0 };

      window.gsap.to(st2State, {
        frame: P2_COUNT - 1,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: chaos,
          start: 'center center',
          end: '+=500vh',
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: function (self) {
            var f = Math.round(self.progress * (P2_COUNT - 1));
            st2State.frame = f;

            if (self.progress > 0) {
              activePhase  = 2;
              currentIndex = f;
              renderCurrent();
            }
          }
        },
        onUpdate: function () {
          var f = Math.round(st2State.frame);

          if (activePhase !== 2 || f !== currentIndex) {
            activePhase  = 2;
            currentIndex = f;
            renderCurrent();
          }
        }
      });
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
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

    elements.forEach(function (element, index) {
      if (!element || seen.has(element)) {
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

    window.ScrollTrigger.refresh();
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
  runInit(initRequestPopup, 'request-popup');
  runInit(initLenis, 'lenis');
  runInit(initHeaderScrollBlur, 'header-scroll-blur');
  runInit(initHomeScrollFilm, 'home-scroll-film');
  runInit(initHomeChaosFilm, 'home-chaos-film');
  runInit(initHomeShowcaseParallax, 'home-showcase-parallax');
  runInit(initBenefitsScroller, 'benefits-scroller');
  runInit(initBenefitsMobileScroll, 'benefits-mobile-scroll');
  runInit(initClientsScroller, 'clients-scroller');
  runInit(initMediahubClientsMotion, 'mediahub-clients-motion');
  runInit(initProjectsScroller, 'projects-scroller');
  runInit(initProductsProjectsCarousel, 'products-projects-carousel');
  runInit(initProjectsMobileCarousel, 'projects-mobile-carousel');
  runInit(initProductsCatalogScroller, 'products-catalog-scroller');
  runInit(initProductsCatalogMobileCarousel, 'products-catalog-mobile-carousel');
  runInit(initProcessTimeline, 'process-timeline');
  runInit(initProcessMobileTimeline, 'process-mobile-timeline');
  runInit(initFaqAccordion, 'faq-accordion');
  runInit(initAboutStackMobileVisual, 'about-stack-mobile-visual');
  runInit(initInnerPageReveal, 'inner-page-reveal');
  runInit(initBrowserDiagnostics, 'browser-diagnostics');

  window.addEventListener(
    'load',
    function () {
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh();
      }
    },
    { once: true }
  );
})();
