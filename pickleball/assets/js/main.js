/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 1250, easing: 'ease', offset: 50, once: true });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;

    $root.find('.js-back-to-top').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 600);
    });

    $root.find('.s-footer__form').on('submit', function (e) {
      e.preventDefault();
      this.reset();
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;

    var $bar = $root.find('.s-header__bar');
    var desktop = window.matchMedia('(min-width: 1025px)');

    // Desktop only: the bar becomes fixed (white + shadow) once the header has scrolled out of view
    function updateSticky() {
      $bar.toggleClass('is-sticky', desktop.matches && $(window).scrollTop() > $root.outerHeight());
    }

    $(window).on('scroll resize', updateSticky);
    updateSticky();

    function setOpen(open) {
      $root.toggleClass('is-open', open);
      $root.find('.s-header__toggle').attr('aria-expanded', open ? 'true' : 'false');
    }

    $root.find('.s-header__toggle').on('click', function () {
      setOpen(true);
    });

    $root.find('.s-header__close, .s-header__overlay, .s-header__panel-menu a').on('click', function () {
      setOpen(false);
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;

    // Ken Burns background slideshow: fade every 5s, active slide zooms 1.3 → 1 over 10s
    var $slides = $root.find('.s-hero__slide');
    var index = 0;
    if ($slides.length > 1) {
      setInterval(function () {
        $slides.eq(index).removeClass('is-active');
        index = (index + 1) % $slides.length;
        $slides.eq(index).addClass('is-active');
      }, 5000);
    }

    // Count-up numbers when the stats card enters the viewport
    var $numbers = $root.find('.js-count');
    function countUp(el) {
      var $el = $(el);
      var target = parseInt($el.data('target'), 10);
      $({ n: 0 }).animate({ n: target }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $el.text(Math.round(now).toLocaleString('en-US'));
        },
        complete: function () {
          $el.text(target.toLocaleString('en-US'));
        }
      });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            io.unobserve(entry.target);
          }
        });
      });
      $numbers.each(function () { io.observe(this); });
    }

    // Video popup: load the embed on open, stop it on close
    var $modal = $root.find('.s-hero__modal');
    var $frame = $modal.find('iframe');
    $modal.on('show.bs.modal', function () {
      $frame.attr('src', $frame.data('src'));
    });
    $modal.on('hidden.bs.modal', function () {
      $frame.attr('src', '');
    });
  });
})(jQuery);

/* ===== home/08-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-testimonials');
    if (!$root.length) return;

    $root.find('.carousel').carousel({ interval: 5000, pause: 'hover' });
  });
})(jQuery);

/* ===== home/10-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-faq');
    if (!$root.length) return;

    $root.find('.collapse')
      .on('show.bs.collapse', function () {
        $(this).closest('.s-faq__item').addClass('is-open');
      })
      .on('hide.bs.collapse', function () {
        $(this).closest('.s-faq__item').removeClass('is-open');
      })
      .on('shown.bs.collapse hidden.bs.collapse', function () {
        AOS.refresh();
      });
  });
})(jQuery);
