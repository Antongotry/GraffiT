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
        yPercent: -2.5,
        scale: 0.985
      }, {
        yPercent: 2.5,
        scale: 1.015,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
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
          anticipatePin: 1,
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

      function updateLineFillHeight() {
        var h = line.offsetHeight;

        if (h <= 0) {
          return;
        }

        var activeIndex = 0;

        for (var i = 0; i < steps.length; i++) {
          if (steps[i].classList.contains('is-active')) {
            activeIndex = i;
            break;
          }
        }

        var n = steps.length;
        var pct = (activeIndex + 1) / n;
        lineFill.style.height = Math.round(h * pct) + 'px';
      }

      function setActive(index) {
        var clamped = Math.max(0, Math.min(index, steps.length - 1));

        for (var j = 0; j < steps.length; j++) {
          steps[j].classList.toggle('is-active', j === clamped);
        }

        updateLineFillHeight();
      }

      var observer = new IntersectionObserver(
        function (entries) {
          var visible = entries.filter(function (e) {
            return e.isIntersecting;
          });

          if (visible.length === 0) {
            return;
          }

          visible.sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });

          var target = visible[0].target;
          var idx = steps.indexOf(target);

          if (idx >= 0) {
            setActive(idx);
          }
        },
        {
          root: null,
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        }
      );

      steps.forEach(function (step) {
        observer.observe(step);
      });

      window.addEventListener(
        'resize',
        function () {
          window.requestAnimationFrame(updateLineFillHeight);
        },
        { passive: true }
      );

      window.requestAnimationFrame(updateLineFillHeight);
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

    if (!popup) {
      return;
    }

    var panels = Array.prototype.slice.call(popup.querySelectorAll('.site-popup__panel'));
    var form = popup.querySelector('.js-request-form');
    var statusNode = form ? form.querySelector('[data-form-status]') : null;
    var lastFocusedElement = null;

    function decorateImplicitTriggers() {
      if (!servicesPage) {
        return;
      }

      var candidates = Array.prototype.slice.call(
        document.querySelectorAll('.site-main--services a, .site-main--services button, .site-footer a, .site-footer button')
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
        node.setAttribute('data-popup-source', 'services-auto-trigger');
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
  runInit(initProjectsMobileCarousel, 'projects-mobile-carousel');
  runInit(initProcessTimeline, 'process-timeline');
  runInit(initProcessMobileTimeline, 'process-mobile-timeline');
})();
