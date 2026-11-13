/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 900, easing: 'lux', offset: 60, once: true });

    // Demo forms (no backend): booking + contact show a confirmation note.
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var toISO = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 864e5);

    $('.js-date-in').attr('min', toISO(today)).val(toISO(today));
    $('.js-date-out').attr('min', toISO(tomorrow)).val(toISO(tomorrow));

    $('.js-date-in').on('change', function () {
      var $form = $(this).closest('form');
      var start = new Date(this.value);
      if (isNaN(start)) { return; }
      var next = toISO(new Date(start.getTime() + 864e5));
      var $out = $form.find('.js-date-out').attr('min', next);
      if (!$out.val() || $out.val() < next) { $out.val(next); }
    });

    $('.js-booking-form, .js-contact-form').on('submit', function (e) {
      e.preventDefault();
      var $note = $(this).find('.form-note').addClass('is-visible');
      if (this.classList.contains('js-contact-form')) { this.reset(); }
      window.setTimeout(function () { $note.removeClass('is-visible'); }, 6000);
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    if (!$header.length) { return; }

    var update = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (y > 220) {
        $header.addClass('is-sticky');
      } else if (y < 120) {
        $header.removeClass('is-sticky');
      }
    };
    update();
    $(window).on('scroll', update);

    $('#header-menu').on('show.bs.collapse', function () {
      $header.find('.header-toggle').attr('aria-label', 'Đóng menu');
    }).on('hide.bs.collapse', function () {
      $header.find('.header-toggle').attr('aria-label', 'Mở menu');
    });

    $(window).on('resize', function () {
      if (window.innerWidth >= 1200) { $('#header-menu').collapse('hide'); }
    });
  });
})(jQuery);

/* ===== home/03-spaces ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-spaces');
    if (!$root.length) { return; }

    var $panels = $root.find('.space-panel');
    var activate = function () {
      $panels.removeClass('is-active');
      $(this).addClass('is-active');
    };
    $panels.on('mouseenter focus click', activate);
  });
})(jQuery);

/* ===== home/06-video ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-video');
    if (!$root.length) { return; }

    var video = $root.find('.js-home-video').get(0);
    var $btn = $root.find('.js-video-toggle');

    var sync = function () {
      var paused = video.paused;
      $btn.find('i').toggleClass('fa-pause', !paused).toggleClass('fa-play', paused);
      $btn.attr('aria-label', paused ? 'Phát video' : 'Tạm dừng video');
    };

    $btn.on('click', function () {
      if (video.paused) {
        var p = video.play();
        if (p && p.catch) { p.catch(function () {}); }
      } else {
        video.pause();
      }
    });
    $(video).on('play pause', sync);
    sync();
  });
})(jQuery);

/* ===== home/08-reviews ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-reviews');
    if (!$root.length || !$.fn.slick) { return; }

    $root.find('.js-reviews-slider').slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: false,
      dots: false,
      autoplay: true,
      autoplaySpeed: 5000,
      speed: 700,
      cssEase: 'cubic-bezier(.25, .8, .25, 1)',
      responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }]
    });

    $root.find('.js-reviews-prev').on('click', function () {
      $root.find('.js-reviews-slider').slick('slickPrev');
    });
    $root.find('.js-reviews-next').on('click', function () {
      $root.find('.js-reviews-slider').slick('slickNext');
    });
  });
})(jQuery);

/* ===== rooms/01-rooms-list ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-rooms-list');
    if (!$root.length) { return; }

    var $items = $root.find('.rooms-list-item');
    $root.find('.rooms-filter-btn').on('click', function () {
      var filter = $(this).data('filter');
      $(this).addClass('is-active').siblings().removeClass('is-active');
      $items.each(function () {
        var cats = String($(this).data('cat')).split(' ');
        $(this).toggleClass('is-hidden', filter !== 'all' && cats.indexOf(filter) === -1);
      });
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== contact/03-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-faq');
    if (!$root.length) { return; }

    $root.find('.collapse').on('show.bs.collapse', function () {
      $(this).closest('.faq-item').addClass('is-open');
    }).on('hide.bs.collapse', function () {
      $(this).closest('.faq-item').removeClass('is-open');
    });
  });
})(jQuery);
