/* Theme scripts entry point. */
(function () {
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
      var startOffset = isProductsProjects ? 360 : (isHomeProjects ? 0 : 100);

      if (!viewport || !stage || !track || cards.length === 0 || (isHomeProjects && !container)) {
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
          trigger: isHomeProjects ? container : section,
          start: isHomeProjects ? 'top top' : ('top+=' + startOffset + ' top'),
          end: function () {
            return '+=' + Math.max(track.scrollWidth - stage.clientWidth, 0);
          },
          /*
           * Головна: pin на всю секцію — фон, __bg і ::before рухаються одним шаром з контентом
           * (раніше pin тільки на viewport + translateY на .__container зсував текст відносно фону).
           */
          pin: isHomeProjects ? section : viewport,
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
      track.style.transform = '';

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
      }

      function nearestIndex() {
        var scrollLeft = stage.scrollLeft;
        var best = 0;
        var bestDistance = Infinity;

        for (var i = 0; i < cards.length; i++) {
          var distance = Math.abs(cards[i].offsetLeft - scrollLeft);

          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        }

        return best;
      }

      function updateButtons() {
        var index = nearestIndex();

        if (prevButton) {
          prevButton.disabled = index <= 0;
        }

        if (nextButton) {
          nextButton.disabled = index >= getMaxIndex();
        }
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
      var viewport = section.querySelector('.services-clients__viewport');
      var stage = section.querySelector('.js-clients-stage');
      var track = section.querySelector('.js-clients-track');
      var shouldHideHeader = section.id === 'about-clients';

      if (!viewport || !stage || !track) {
        return;
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
          invalidateOnRefresh: true,
          onToggle: function (self) {
            var header;

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
    });

    window.ScrollTrigger.refresh();
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

      ['name', 'phone', 'email', 'message', 'consent'].forEach(function (name) {
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

      if (name === 'email') {
        if (value === '') {
          return 'Вкажіть e-mail.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Вкажіть коректний e-mail.';
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

      var fieldNames = ['name', 'phone', 'email', 'message', 'consent'];
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

  function runInit(initFn, name) {
    try {
      initFn();
    } catch (error) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error('Init failed: ' + name, error);
      }
    }
  }

  runInit(initMobileMenu, 'mobile-menu');
  runInit(initRequestPopup, 'request-popup');
  runInit(initLenis, 'lenis');
  runInit(initHomeShowcaseParallax, 'home-showcase-parallax');
  runInit(initBenefitsScroller, 'benefits-scroller');
  runInit(initBenefitsMobileScroll, 'benefits-mobile-scroll');
  runInit(initClientsScroller, 'clients-scroller');
  runInit(initProjectsScroller, 'projects-scroller');
  runInit(initProductsProjectsCarousel, 'products-projects-carousel');
  runInit(initProjectsMobileCarousel, 'projects-mobile-carousel');
  runInit(initProductsCatalogScroller, 'products-catalog-scroller');
  runInit(initProductsCatalogMobileCarousel, 'products-catalog-mobile-carousel');
  runInit(initProcessTimeline, 'process-timeline');
  runInit(initProcessMobileTimeline, 'process-mobile-timeline');
  runInit(initFaqAccordion, 'faq-accordion');
  runInit(initAboutStackMobileVisual, 'about-stack-mobile-visual');

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
