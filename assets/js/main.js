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
      duration: 1.1,
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

    window.__graffitLenis = lenis;
    window.requestAnimationFrame(raf);

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
          item.classList.toggle('is-active', index === activeIndex);
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
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            setActiveState(self.progress);
          }
        }
      });
    });

    window.ScrollTrigger.refresh();
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
      var stage = section.querySelector('.js-projects-stage');
      var track = section.querySelector('.js-projects-track');
      var prevButton = section.querySelector('.js-projects-prev');
      var nextButton = section.querySelector('.js-projects-next');
      var cards = Array.prototype.slice.call(section.querySelectorAll('.project-case-card'));

      if (!viewport || !stage || !track || cards.length === 0) {
        return;
      }

      var currentIndex = 0;

      function getMaxIndex() {
        return Math.max(cards.length - 1, 0);
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
          invalidateOnRefresh: true,
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

      if (!viewport || !stage || !track) {
        return;
      }

      window.gsap.to(track, {
        y: function () {
          return -(track.scrollHeight - stage.clientHeight);
        },
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            return '+=' + Math.max(track.scrollHeight - stage.clientHeight, 0);
          },
          pin: viewport,
          scrub: 1,
          invalidateOnRefresh: true
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
        var lastRect = tags[tags.length - 1].getBoundingClientRect();
        var start = firstRect.top - timelineRect.top + firstRect.height * 0.5;
        var end = lastRect.top - timelineRect.top + lastRect.height * 0.5;
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

  function runInit(initFn, name) {
    try {
      initFn();
    } catch (error) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error('Init failed: ' + name, error);
      }
    }
  }

  runInit(initLenis, 'lenis');
  runInit(initBenefitsScroller, 'benefits-scroller');
  runInit(initClientsScroller, 'clients-scroller');
  runInit(initProjectsScroller, 'projects-scroller');
  runInit(initProcessTimeline, 'process-timeline');
})();
