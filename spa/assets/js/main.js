/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out', offset: 60, once: true });
  });
})(jQuery);

/* Keyframe helper for the scroll/mouse interactions cloned from the Webflow site.
   at(frames, p): value at progress p (0-100) from [[percent, value], ...], linear between
   keyframes and held before the first / after the last (Webflow continuous actions).
   scrollProgress(el): 0 when el's top enters the bottom of the viewport,
   1 when its bottom leaves the top (Webflow "while scrolling in view"). */
window.dlIx = {
  at: function (frames, p) {
    if (p <= frames[0][0]) return frames[0][1];
    for (var i = 1; i < frames.length; i++) {
      if (p <= frames[i][0]) {
        var a = frames[i - 1];
        var b = frames[i];
        return a[1] + (b[1] - a[1]) * (p - a[0]) / (b[0] - a[0]);
      }
    }
    return frames[frames.length - 1][1];
  },
  scrollProgress: function (el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var t = (vh - r.top) / (vh + r.height);
    return t < 0 ? 0 : t > 1 ? 1 : t;
  }
};

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    // Keep the copyright year current
    $('.footer-copyright-year').text(new Date().getFullYear());
  });
})(jQuery);

/* ===== shared/preloader ===== */
(function ($) {
  'use strict';
  $(function () {
    var pre = document.querySelector('.preloader');
    if (!pre) return;

    // Webflow "Preloader" interaction: page start -> fade out after 1700ms (300ms linear)
    window.setTimeout(function () {
      pre.classList.add('is-hidden');
      window.setTimeout(function () {
        pre.style.display = 'none';
      }, 300);
    }, 1700);
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $nav = $('.navbar');
    if (!$nav.length) return;

    $nav.on('click', '.menu-button', function () {
      $nav.toggleClass('is-open');
    });

    $nav.on('click', '.nav-menu a', function () {
      $nav.removeClass('is-open');
    });

    $nav.on('click', '.w-dropdown-toggle', function (e) {
      if (window.matchMedia('(max-width: 991px)').matches && !$(e.target).closest('a').length) {
        e.preventDefault();
        $(this).closest('.menu-dropdown-wrapper').toggleClass('is-open');
      }
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var sec = document.querySelector('.banner-section');
    if (!sec) return;
    var content = sec.querySelector('.banner-content');
    var img = sec.querySelector('.banner-image');
    var el1 = sec.querySelector('.banner-element-one');
    var el2 = sec.querySelector('.banner-element-two');

    // Webflow mouse-move actions: smoothing 95 (5% of the gap per frame),
    // resting state 95% when the pointer is outside the element.
    var REST = 0.95;
    var EASE = 0.05;
    var cur = { sy: REST, cx: REST };
    var tgt = { sy: REST, cx: REST };
    var raf = 0;

    function render() {
      // "Banner Image": scale 1 -> 1.1 across the section
      if (img) img.style.transform = 'scale(' + (1 + 0.1 * cur.sy).toFixed(4) + ')';
      // "Previwe Banner Element": decorations drift +/-50px across the content (X axis)
      if (el1) el1.style.transform = 'translate3d(0, ' + (50 * cur.cx).toFixed(2) + 'px, 0)';
      if (el2) el2.style.transform = 'translate3d(0, ' + (-50 * cur.cx).toFixed(2) + 'px, 0)';
    }

    function tick() {
      var moving = false;
      ['sy', 'cx'].forEach(function (k) {
        var d = tgt[k] - cur[k];
        if (Math.abs(d) > 0.0005) { cur[k] += d * EASE; moving = true; } else { cur[k] = tgt[k]; }
      });
      render();
      raf = moving ? window.requestAnimationFrame(tick) : 0;
    }

    function start() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    function ratio(v, min, size) {
      var t = (v - min) / size;
      return t < 0 ? 0 : t > 1 ? 1 : t;
    }

    sec.addEventListener('mousemove', function (e) {
      var r = sec.getBoundingClientRect();
      tgt.sy = ratio(e.clientY, r.top, r.height);
      start();
    });
    sec.addEventListener('mouseleave', function () {
      tgt.sy = cur.sy = REST;
      start();
    });

    if (content) {
      content.addEventListener('mousemove', function (e) {
        var r = content.getBoundingClientRect();
        tgt.cx = ratio(e.clientX, r.left, r.width);
        start();
      });
      content.addEventListener('mouseleave', function () {
        tgt.cx = cur.cx = REST;
        start();
      });
    }

    render();
  });
})(jQuery);

/* ===== home/tabs ===== */
(function ($) {
  'use strict';
  $(function () {
    $('.w-tabs').each(function () {
      var $tabs = $(this);
      var $links = $tabs.find('.w-tab-menu > .w-tab-link');
      var $panes = $tabs.find('.w-tab-content > .w-tab-pane');
      if (!$links.length) return;

      $links.on('click', function (e) {
        e.preventDefault();
        var i = $links.index(this);
        $links.removeClass('w--current');
        $(this).addClass('w--current');
        $panes.removeClass('w--tab-active').eq(i).addClass('w--tab-active');
        AOS.refresh();
      });
    });
  });
})(jQuery);

/* ===== home/04-tranquility ===== */
(function ($) {
  'use strict';
  $(function () {
    var $t = $('.tranquility-content');
    if (!$t.length) return;

    $t.on('click', '.tranquility-content-close', function () {
      $t.addClass('is-closed');
    });

    $t.on('click', '.tranquility-tab-link', function () {
      $t.removeClass('is-closed');
    });
  });
})(jQuery);

/* ===== home/06-luxurious ===== */
(function ($) {
  'use strict';
  $(function () {
    var sec = document.querySelector('.luxurious-place-hv1');
    if (!sec || !window.dlIx) return;
    var at = window.dlIx.at;
    var q = function (sel) { return sec.querySelector(sel); };

    // Webflow "Luxurious Scrolling" keyframes (scroll progress % -> translateY % of own height, opacity)
    var items = [
      { el: q('.luxurious-place-typography-single.absulote._1'), y: [[30, 0], [45, -120]] },
      { el: q('.luxurious-place-typography-single.absulote._2'), y: [[30, 120], [45, 0], [60, -120]], o: [[30, 0], [45, 1]] },
      { el: q('.luxurious-place-typography-single.absulote._3'), y: [[30, 120], [45, 120], [60, 0]], o: [[30, 0], [45, 0], [60, 1]] },
      { el: q('.luxurious-service-image._1'), o: [[30, 1], [45, 0]] },
      { el: q('.luxurious-service-image._2'), o: [[30, 0], [44, 0], [45, 1], [60, 0]] },
      { el: q('.luxurious-service-image._3'), o: [[30, 0], [45, 0], [59, 0], [60, 1]] },
      { el: q('.luxurious-service-number-text._1'), y: [[30, 0], [45, -100]] },
      { el: q('.luxurious-service-number-text._2'), y: [[30, 100], [45, 0], [60, -100]], o: [[30, 0], [45, 1]] },
      { el: q('.luxurious-service-number-text._3'), y: [[30, 100], [45, 100], [60, 0]], o: [[30, 0], [45, 0], [60, 1]] }
    ].filter(function (it) { return it.el; });

    // Smoothing 90: the progress moves 10% of the remaining gap per frame
    var cur = window.dlIx.scrollProgress(sec) * 100;
    var raf = 0;

    function render(p) {
      items.forEach(function (it) {
        if (it.y) it.el.style.transform = 'translate3d(0, ' + at(it.y, p).toFixed(2) + '%, 0)';
        if (it.o) it.el.style.opacity = at(it.o, p).toFixed(3);
      });
    }

    function tick() {
      var target = window.dlIx.scrollProgress(sec) * 100;
      var d = target - cur;
      cur = Math.abs(d) > 0.01 ? cur + d * 0.1 : target;
      render(cur);
      raf = cur !== target ? window.requestAnimationFrame(tick) : 0;
    }

    function start() {
      if (!raf) raf = window.requestAnimationFrame(tick);
    }

    render(cur);
    $(window).on('scroll resize', start);
  });
})(jQuery);

/* ===== home/sliders ===== */
(function ($) {
  'use strict';
  $(function () {
    $('.w-slider').each(function () {
      var $s = $(this);
      var $mask = $s.children('.w-slider-mask');
      var $slides = $mask.children('.w-slide');
      var n = $slides.length;
      if (!n) return;

      var $nav = $s.children('.w-slider-nav');
      if ($nav.length) {
        for (var k = 0; k < n; k++) $nav.append('<div class="w-slider-dot"></div>');
      }
      var $dots = $nav.children('.w-slider-dot');
      var i = 0;

      function step() {
        if (n < 2) return $slides.outerWidth();
        var d = $slides.eq(1).position().left - $slides.eq(0).position().left;
        return d > 0 ? d : $slides.outerWidth();
      }

      function go(idx) {
        i = (idx + n) % n;
        var w = step();
        $slides.removeClass('w-active').eq(i).addClass('w-active');
        $dots.removeClass('w-active').eq(i).addClass('w-active');
        $slides.css('transform', 'translateX(' + (-i * w) + 'px)');
      }

      $s.on('click', '.w-slider-arrow-left', function () { go(i - 1); });
      $s.on('click', '.w-slider-arrow-right', function () { go(i + 1); });
      $nav.on('click', '.w-slider-dot', function () { go($(this).index()); });
      $(window).on('resize', function () { go(i); });

      go(0);
    });
  });
})(jQuery);

/* ===== about-us/09-gallery ===== */
(function ($) {
  'use strict';
  $(function () {
    // Fancybox binds [data-fancybox] itself; this only sets the gallery options
    if (!$('.s-about-gallery').length || !$.fancybox) return;

    $('[data-fancybox="about-gallery"]').fancybox({
      loop: true,
      animationEffect: 'zoom-in-out',
      transitionEffect: 'slide',
      buttons: ['zoom', 'slideShow', 'fullScreen', 'thumbs', 'close'],
      backFocus: false
    });
  });
})(jQuery);
