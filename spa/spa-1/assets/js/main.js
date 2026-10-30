/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out', offset: 60, once: true });
  });
})(jQuery);

/* ===== shared/preloader ===== */
(function ($) {
  'use strict';
  $(function () {
    var pre = document.querySelector('.preloader');
    if (!pre) return;

    var lottieEl = document.getElementById('preloader-lottie');
    if (window.lottie && window.ZAIPUR_LOTTIE && lottieEl) {
      window.lottie.loadAnimation({
        container: lottieEl,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: window.ZAIPUR_LOTTIE
      });
    }

    var hidden = false;
    function hidePreloader() {
      if (hidden) return;
      hidden = true;
      pre.classList.add('is-hidden');
      window.setTimeout(function () {
        pre.style.display = 'none';
      }, 600);
    }

    function schedule() {
      window.setTimeout(hidePreloader, 1200);
    }

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule);
    }

    window.setTimeout(hidePreloader, 3000);
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

/* ===== home-v1/tabs ===== */
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

/* ===== home-v1/04-tranquility ===== */
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

/* ===== home-v1/06-luxurious ===== */
(function ($) {
  'use strict';
  $(function () {
    var sec = document.querySelector('.luxurious-place-hv1');
    if (!sec) return;

    var panels = [].slice.call(sec.querySelectorAll('.luxurious-place-typography-single'));
    var imgs = [].slice.call(sec.querySelectorAll('.luxurious-service-image'));
    var nums = [].slice.call(sec.querySelectorAll('.luxurious-service-number-text._1, .luxurious-service-number-text._2, .luxurious-service-number-text._3'));
    var sticky = sec.querySelector('.luxurious-sticky-content');
    var numSingle = sec.querySelector('.luxurious-service-number-single');
    var n = Math.max(panels.length, imgs.length, nums.length, 1);
    var denom = n > 1 ? n - 1 : 1;
    var win = 1 / denom;

    function op(i, t) {
      var d = Math.abs(t - i / denom);
      return Math.max(0, Math.min(1, 1 - d / win));
    }

    function update() {
      var top = sec.offsetTop;
      var h = sec.offsetHeight;
      var stickyH = sticky ? sticky.offsetHeight : 0;
      var range = Math.max(1, (h - stickyH) * 0.75);
      var t = (window.pageYOffset - top) / range;
      if (t < 0) t = 0; else if (t > 1) t = 1;
      var p = t * denom;
      var slot = panels[0] ? (panels[0].offsetHeight || 686) * 1.43 : 981;
      for (var i = 0; i < panels.length; i++) {
        var y = (i - p) * slot;
        if (y > slot) y = slot; else if (y < -slot) y = -slot;
        panels[i].style.transform = 'translateY(' + y.toFixed(1) + 'px)';
        panels[i].style.opacity = op(i, t);
      }
      for (i = 0; i < imgs.length; i++) imgs[i].style.opacity = op(i, t);
      var numSlot = numSingle ? numSingle.offsetHeight : 52;
      for (i = 0; i < nums.length; i++) {
        var ny = (i - p) * numSlot;
        if (ny > numSlot) ny = numSlot; else if (ny < -numSlot) ny = -numSlot;
        nums[i].style.transform = 'translateY(' + ny.toFixed(1) + 'px)';
        nums[i].style.opacity = op(i, t);
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }

    update();
    $(window).on('scroll', onScroll);
    $(window).on('resize', update);
  });
})(jQuery);

/* ===== home-v1/sliders ===== */
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
