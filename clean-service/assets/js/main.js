/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    // Elementor entrance animations: 1.25s, once, disabled on tablet and below
    AOS.init({ duration: 1250, easing: 'ease', offset: 120, once: true, disable: function () { return window.innerWidth < 1025; } });
  });
})(jQuery);

/* ===== shared/floating ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-floating');
    if (!$root.length) return;

    var $top = $root.find('.s-floating__top');
    var $contact = $root.find('.s-floating__contact');
    var $toggle = $root.find('.s-floating__toggle');

    function onScroll() {
      $top.toggleClass('is-visible', $(window).scrollTop() > 300);
    }

    $(window).on('scroll', onScroll);
    onScroll();

    $top.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
    });

    $toggle.on('click', function () {
      var open = !$contact.hasClass('is-open');
      $contact.toggleClass('is-open', open);
      $toggle.attr('aria-expanded', open ? 'true' : 'false');
    });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;

    $root.find('.s-footer__form').on('submit', function (e) {
      e.preventDefault();
      var $input = $(this).find('input');
      if (!$input[0].checkValidity()) {
        $input[0].reportValidity();
        return;
      }
      $input.val('').attr('placeholder', 'Cảm ơn bạn đã đăng ký!');
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;

    var $search = $root.find('.s-header__search');
    var $menu = $root.find('.s-header__mobile-menu');

    function setSearch(open) {
      $search.toggleClass('is-open', open).attr('aria-hidden', open ? 'false' : 'true');
      if (open) {
        setTimeout(function () { $search.find('input').trigger('focus'); }, 300);
      }
    }

    $root.find('.js-search-open').on('click', function () { setSearch(true); });
    $root.find('.js-search-close').on('click', function () { setSearch(false); });

    $(document).on('keyup', function (e) {
      if (e.key === 'Escape') setSearch(false);
    });

    $search.find('form').on('submit', function (e) {
      e.preventDefault();
      setSearch(false);
    });

    $menu.find('a').on('click', function () {
      $menu.collapse('hide');
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;

    $root.find('.s-hero__slider').slick({
      fade: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 7000,
      pauseOnHover: false,
      arrows: false,
      dots: true,
      infinite: true
    });
  });
})(jQuery);

/* ===== home/02-about ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about');
    if (!$root.length) return;

    // Odometer-style count up when the counter enters the viewport
    var $num = $root.find('.js-counter');
    var target = parseInt($num.data('count'), 10) || 0;
    var done = false;

    function run() {
      if (done) return;
      done = true;
      $({ n: 0 }).animate({ n: target }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) { $num.text(Math.round(now)); },
        complete: function () { $num.text(target); }
      });
    }

    if (!('IntersectionObserver' in window)) return;
    $num.text('0');
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        run();
        io.disconnect();
      }
    }, { threshold: .5 });
    io.observe($num[0]);
  });
})(jQuery);

/* ===== home/04-services ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-services');
    if (!$root.length) return;

    $root.find('.s-services__slider').slick({
      slidesToShow: 3,
      slidesToScroll: 3,
      speed: 1000,
      infinite: true,
      arrows: false,
      dots: true,
      responsive: [
        { breakpoint: 1025, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
  });
})(jQuery);

/* ===== home/05-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-testimonials');
    if (!$root.length) return;

    $root.find('.s-testimonials__slider').slick({
      centerMode: true,
      variableWidth: true,
      slidesToShow: 1,
      speed: 1000,
      infinite: true,
      arrows: false,
      dots: false
    });
  });
})(jQuery);

/* ===== home/06-commitment ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-commitment');
    if (!$root.length) return;

    $root.find('.collapse')
      .on('show.bs.collapse', function () {
        $(this).closest('.s-commitment__item').addClass('is-active');
      })
      .on('hide.bs.collapse', function () {
        $(this).closest('.s-commitment__item').removeClass('is-active');
      })
      .on('shown.bs.collapse hidden.bs.collapse', function () {
        AOS.refresh();
      });
  });
})(jQuery);

/* ===== home/08-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact');
    if (!$root.length) return;

    var $form = $root.find('.s-contact__form');
    var $notice = $form.find('.s-contact__notice');

    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $form.find('[required]').each(function () {
        var ok = $.trim(this.value) !== '';
        $(this).toggleClass('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        $notice.text('Vui lòng nhập họ tên và số điện thoại.');
        return;
      }
      $form[0].reset();
      $notice.text('Cảm ơn bạn! DLTheme sẽ liên hệ lại trong thời gian sớm nhất.');
    });

    $form.find('[required]').on('input', function () {
      $(this).removeClass('is-invalid');
    });
  });
})(jQuery);
