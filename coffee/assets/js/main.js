/* ===== base ===== */
(function ($) {
  'use strict';

  var hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
  if (hasGsap) {
    // Set before document-ready so [data-split] text is hidden until it is split
    document.documentElement.classList.add('has-gsap');
    gsap.registerPlugin(ScrollTrigger, SplitText);
  }

  // Text reveals from the target's IX3 timelines (masked SplitText, random stagger, circ.out)
  // Masks get .25em of vertical room (.split-mask in theme.css) so Vietnamese marks (Ộ, ạ) are not clipped;
  // the hidden start is therefore -125% instead of the target's -100%.
  var HIDDEN = -125;
  var SPLITS = {
    'page-letter': { type: 'words,chars', mask: 'chars', key: 'chars', duration: 0.8, each: 0.05, delay: 0.1, from: { scale: 0.8, yPercent: HIDDEN } },
    'page-word': { type: 'words', mask: 'words', key: 'words', duration: 0.8, each: 0.05, delay: 0.1, from: { yPercent: HIDDEN } },
    'page-line': { type: 'lines', mask: 'lines', key: 'lines', duration: 0.8, each: 0.05, delay: 0.1, from: { yPercent: HIDDEN } },
    'scroll-letter': { type: 'words,chars', mask: 'chars', key: 'chars', duration: 0.5, each: 0.03, scroll: true },
    'scroll-word': { type: 'words', mask: 'words', key: 'words', duration: 0.8, each: 0.03, scroll: true },
    'scroll-line': { type: 'lines', mask: 'lines', key: 'lines', duration: 0.8, each: 0.03, scroll: true }
  };

  function splitReveal(el) {
    var cfg = SPLITS[el.getAttribute('data-split')];
    try {
      if (!cfg) return;
      var parts = SplitText.create(el, { type: cfg.type, mask: cfg.mask })[cfg.key];
      // Line masks sit block-on-block: extra vertical padding would collapse between
      // siblings and add height, so only inline (char/word) masks get the room that
      // keeps Vietnamese marks from clipping.
      if (cfg.mask !== 'lines') $(parts).parent().addClass('split-mask');
      var vars = { duration: cfg.duration, ease: 'circ.out', stagger: { each: cfg.each, from: 'random' } };
      if (cfg.scroll) {
        gsap.fromTo(parts, { yPercent: HIDDEN }, $.extend(vars, {
          yPercent: 0,
          scrollTrigger: { trigger: el, start: 'top bottom', once: true }
        }));
      } else {
        gsap.from(parts, $.extend(vars, cfg.from, { delay: cfg.delay }));
      }
    } finally {
      el.style.visibility = 'visible';
    }
  }

  $(function () {
    AOS.init({ duration: 300, easing: 'ease', offset: 0, once: true });

    if (!hasGsap) return;
    var start = function () {
      $('[data-split]').each(function () { splitReveal(this); });
      ScrollTrigger.refresh();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;
    var $toggle = $root.find('.s-header__toggle');

    function setOpen(open) {
      $root.toggleClass('is-open', open);
      $('html').toggleClass('has-menu-open', open);
      $toggle.attr('aria-expanded', open ? 'true' : 'false');
    }

    $toggle.on('click', function () {
      setOpen(!$root.hasClass('is-open'));
    });
    $root.find('.s-header__link').on('click', function () {
      setOpen(false);
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $root.hasClass('is-open')) {
        setOpen(false);
        $toggle.trigger('focus');
      }
    });
    $(window).on('resize', function () {
      if (window.innerWidth >= 768 && $root.hasClass('is-open')) setOpen(false);
    });
  });
})(jQuery);

/* ===== shared/hours ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hours');
    if (!$root.length || !window.gsap || !window.ScrollTrigger) return;
    var frame = $root.find('.s-hours__frame')[0];
    var scrub = { start: 'top bottom', end: 'bottom top', scrub: 0.8 };

    gsap.fromTo($root.find('.s-hours__bg'), { scale: 1 }, {
      scale: 1.05, ease: 'none', scrollTrigger: $.extend({ trigger: frame }, scrub)
    });

    // [slot, y from, y to, rotation from, rotation to] — measured on the target
    var desktopTags = [
      [1, '0vh', '50vh', -15, 10],
      [2, '0vh', '-60vh', 15, -15],
      [3, '5vh', '60vh', -10, 20],
      [4, '0vh', '-30vh', 20, -20],
      [5, '0vh', '45vh', -10, 15],
      [6, '0vh', '-60vh', 20, -20],
      [7, '10vh', '50vh', -20, 10]
    ];

    gsap.matchMedia()
      .add('(min-width: 992px)', function () {
        var list = $root.find('.s-hours__tags--desktop')[0];
        var tl = gsap.timeline({ scrollTrigger: $.extend({ trigger: list }, scrub) });
        desktopTags.forEach(function (t) {
          var tag = $root.find('.s-hours__tags--desktop .s-hours__slot--' + t[0] + ' > .s-hours__tag')[0];
          tl.fromTo(tag, { y: t[1], rotation: t[3] }, { y: t[2], rotation: t[4], duration: 0.25, ease: 'none' }, 0);
        });
      })
      .add('(max-width: 991.98px)', function () {
        $root.find('.s-hours__tags--mobile .s-hours__slot').each(function () {
          gsap.fromTo(this, { yPercent: 50 }, {
            yPercent: -50, ease: 'circ.out', scrollTrigger: $.extend({ trigger: this }, scrub)
          });
        });
      });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $box = $('.s-hero__box');
    if (!$box.length || !window.gsap) return;

    // Port of the target's mouse image trail (threshold 300px, 1s power3 in, .5s fade after .5s)
    var trail = $box.find('.s-hero__trail')[0];
    var images = $box.find('.s-hero__trail-img').toArray().map(function (el) {
      return { el: el, rect: el.getBoundingClientRect() };
    });
    if (!images.length) return;

    var opts = {
      threshold: 300, opacityFrom: 0.6, scaleFrom: 0.8, opacityTo: 1, scaleTo: 1,
      mainDuration: 1, mainEase: 'power3', fadeOutDuration: 0.5, fadeOutDelay: 0.5, fadeOutEase: 'power3',
      resetIndexDelay: 200
    };
    var state = {
      mouse: { x: 0, y: 0 }, last: { x: 0, y: 0 }, cache: { x: 0, y: 0 },
      index: 0, zIndex: 1, frameCount: 0, stopped: true
    };
    var lerp = function (a, b, n) { return (1 - n) * a + n * b; };

    function isActive(img) {
      return gsap.isTweening(img.el) || (img.el.style.opacity !== '' && img.el.style.opacity !== '0');
    }

    function showNextImage() {
      var img = images[state.index];
      var rotation = gsap.utils.random(-15, 15);
      gsap.killTweensOf(img.el);
      gsap.timeline()
        .set(img.el, {
          opacity: opts.opacityFrom, scale: opts.scaleFrom, zIndex: state.zIndex,
          x: (state.cache.x / window.innerWidth) * 100 + 'vw',
          y: state.cache.y - img.rect.height / 2, rotationZ: rotation
        })
        .to(img.el, {
          ease: opts.mainEase, duration: opts.mainDuration, opacity: opts.opacityTo, scale: opts.scaleTo, rotationZ: rotation,
          x: (state.mouse.x / window.innerWidth) * 100 + 'vw',
          y: state.mouse.y - img.rect.height / 2
        })
        .to(img.el, {
          ease: opts.fadeOutEase, duration: opts.fadeOutDuration, delay: opts.fadeOutDelay, opacity: 0, scale: opts.scaleFrom,
          onComplete: function () {
            gsap.set(img.el, { x: 0, y: 0, scale: 1, opacity: 0, zIndex: 1, rotationZ: 0 });
          }
        });
    }

    function render() {
      var distance = Math.hypot(state.mouse.x - state.last.x, state.mouse.y - state.last.y);
      state.cache.x = lerp(state.cache.x || state.mouse.x, state.mouse.x, 0.1);
      state.cache.y = lerp(state.cache.y || state.mouse.y, state.mouse.y, 0.1);

      if (distance > opts.threshold) {
        showNextImage();
        state.zIndex++;
        state.index = state.index < images.length - 1 ? state.index + 1 : 0;
        state.last = state.mouse;
      }

      if (!images.some(isActive)) {
        state.frameCount++;
        if (state.frameCount >= opts.resetIndexDelay) {
          state.frameCount = 0;
          state.index = 0;
        }
        state.zIndex = 1;
      }

      if (!state.stopped) requestAnimationFrame(render);
    }

    $box.on('mousemove', function (e) {
      var rect = trail.getBoundingClientRect();
      state.frameCount = 0;
      state.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });
    $box.on('mouseenter', function () {
      state.stopped = false;
      state.index = 0;
      state.frameCount = 0;
      requestAnimationFrame(render);
    });
    $box.on('mouseleave', function () {
      state.stopped = true;
    });
    $(window).on('resize', function () {
      images.forEach(function (img) {
        gsap.set(img.el, { scale: 1, x: 0, y: 0, opacity: 0 });
        img.rect = img.el.getBoundingClientRect();
      });
    });
  });
})(jQuery);

/* ===== home/03-about ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about');
    if (!$root.length || !window.gsap || !window.ScrollTrigger) return;

    gsap.timeline({
      scrollTrigger: { trigger: $root.find('.s-about__box')[0], start: 'top bottom', end: 'bottom top', scrub: 0.8 }
    })
      .fromTo($root.find('.s-about__img--2'), { scale: 0 }, { scale: 1, duration: 0.25, ease: 'none' }, 0)
      .fromTo($root.find('.s-about__img--3'), { scale: 0 }, { scale: 1, duration: 0.25, ease: 'none' }, 0.23);
  });
})(jQuery);

/* ===== home/04-menu-marquee ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-menu-marquee');
    if (!$root.length || !window.gsap || !window.ScrollTrigger) return;
    var halfVw = function () { return -window.innerWidth * 0.5; };

    gsap.timeline({
      scrollTrigger: { trigger: $root.find('.s-menu-marquee__track')[0], start: 'top bottom', end: 'bottom top', scrub: 0.8, invalidateOnRefresh: true }
    })
      .fromTo($root.find('.s-menu-marquee__row--1'), { x: 0 }, { x: halfVw, duration: 0.5, ease: 'none' }, 0)
      .fromTo($root.find('.s-menu-marquee__row--2'), { x: halfVw }, { x: 0, duration: 0.5, ease: 'none' }, 0);

    var reveal = gsap.fromTo($root.find('.is-overlay h2'), { opacity: 0 }, {
      opacity: 1, duration: 0.2, ease: 'circ.out', stagger: { each: 0.05, from: 'random' }, paused: true
    });
    $root.find('.s-menu-marquee__link')
      .on('mouseenter focus', function () { reveal.play(); })
      .on('mouseleave blur', function () { reveal.reverse(); });
  });
})(jQuery);

/* ===== about/02-about-marquee ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-marquee');
    if (!$root.length || !window.gsap || !window.ScrollTrigger || !window.SplitText) return;

    var first = $root.find('.s-about-marquee__text--1')[0];
    var second = $root.find('.s-about-marquee__text--2')[0];
    if (!first || !second) return;

    function words(el) {
      return SplitText.create(el, { type: 'words', mask: 'words' }).words;
    }

    var w1 = words(first);
    var w2 = words(second);
    gsap.set([w1, w2], { yPercent: 100 });

    // Two headlines slide up from below the mask, then out above it, scrubbed with the scroll.
    gsap.timeline({
      scrollTrigger: {
        trigger: $root.find('.s-about-marquee__slider')[0],
        start: 'top top',
        end: 'bottom 80%',
        scrub: 0.8
      }
    })
      .to(w1, { yPercent: 0, duration: 0.75, stagger: 0.05, ease: 'none' }, 0)
      .to(w1, { yPercent: -100, duration: 0.75, stagger: 0.05, ease: 'none' }, 1.5)
      .to(w2, { yPercent: 0, duration: 0.75, stagger: 0.05, ease: 'none' }, 2)
      .to(w2, { yPercent: -100, duration: 0.75, stagger: 0.05, ease: 'none' }, 3.75);

    gsap.fromTo($root.find('.s-about-marquee__img'), { scale: 1 }, {
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: $root.find('.s-about-marquee__img')[0],
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8
      }
    });
  });
})(jQuery);

/* ===== menu/02-menu-categories ===== */
(function ($) {
  'use strict';
  $(function () {
    if (!$('.s-menu-category').length || !window.gsap || !window.ScrollTrigger) return;

    $('.s-menu-category').each(function () {
      var $cat = $(this);
      var images = $cat.find('.s-menu-category__images')[0];
      if (!images) return;
      gsap.timeline({
        scrollTrigger: { trigger: images, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      })
        .fromTo($cat.find('.s-menu-category__img--2'), { scale: 0 }, { scale: 1, duration: 0.3, ease: 'none' }, 0)
        .fromTo($cat.find('.s-menu-category__img--3'), { scale: 0 }, { scale: 1, duration: 0.25, ease: 'none' }, 0.3);
    });
  });
})(jQuery);

/* ===== shop/02-shop-products ===== */
(function ($) {
  'use strict';
  $(function () {
    if (!$('.s-shop-products__tab').length) return;
    // Bootstrap switches the panes but, with anchor triggers outside a .nav list,
    // leaves the previous trigger flagged active. Delegated on document so it runs
    // after Bootstrap's own handler, then keep exactly one pill active.
    $(document).on('click', '.s-shop-products__tab', function () {
      var $tab = $(this);
      $('.s-shop-products__tab').not($tab).removeClass('active');
      $tab.addClass('active');
    });
  });
})(jQuery);
