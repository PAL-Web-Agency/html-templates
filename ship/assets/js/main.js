/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 800, easing: 'ease', offset: 120, once: true });

    // Count-up for every .js-counter when it first enters the viewport
    var $counters = $('.js-counter');
    if (!$counters.length) {
      return;
    }

    function countUp(el) {
      var $el = $(el);
      var target = parseInt($el.data('count'), 10) || 0;
      $({ n: 0 }).animate({ n: target }, {
        duration: 1600,
        easing: 'swing',
        step: function (now) { $el.text(Math.ceil(now)); },
        complete: function () { $el.text(target); }
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
      }, { threshold: .6 });
      $counters.each(function () { io.observe(this); });
    }
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) {
      return;
    }

    var $sticky = $root.find('.s-header__sticky');
    var $win = $(window);
    var $body = $('body');

    // Sticky menu bar after 400px of scroll; a placeholder keeps the layout from jumping
    var $holder = $('<div class="s-header__holder" aria-hidden="true"></div>').insertBefore($sticky).hide();
    function onScroll() {
      var top = $win.scrollTop();
      if (top > 400) {
        if (!$sticky.hasClass('is-sticky')) {
          $holder.height($sticky.outerHeight()).show();
          $sticky.addClass('is-sticky');
        }
      } else if (top < 150 && $sticky.hasClass('is-sticky')) {
        $sticky.removeClass('is-sticky');
        $holder.hide();
      }
    }
    $win.on('scroll', onScroll);
    onScroll();

    // Overlays: mobile menu, side info panel, search
    function openPanel($panel) {
      $panel.addClass('is-open');
      $body.addClass('is-locked');
    }
    function closePanels() {
      $root.find('.s-header__mobile, .s-header__side, .s-header__search').removeClass('is-open');
      $body.removeClass('is-locked');
    }

    $root.on('click', '.s-header__toggle', function () { openPanel($root.find('.s-header__mobile')); });
    $root.on('click', '.s-header__side-btn', function () { openPanel($root.find('.s-header__side')); });
    $root.on('click', '.s-header__search-btn', function () {
      openPanel($root.find('.s-header__search'));
      setTimeout(function () { $('#header-search-input').trigger('focus'); }, 300);
    });

    $root.on('click', '.s-header__mobile-close, .s-header__side-close, .s-header__search-close', closePanels);
    $root.on('click', '.s-header__mobile, .s-header__side, .s-header__search', function (e) {
      if (e.target === this) {
        closePanels();
      }
    });
    $root.on('click', '.s-header__mobile-nav a, .s-header__side a', function () {
      if (this.getAttribute('href').charAt(0) === '#') {
        closePanels();
      }
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanels();
      }
    });

    // Mobile sub-menu accordion
    $root.on('click', '.s-header__expand', function () {
      var $btn = $(this);
      $btn.toggleClass('is-open').siblings('.sub-list').stop(true).slideToggle(300);
    });

    $root.on('submit', '.s-header__search-form', function (e) {
      e.preventDefault();
      closePanels();
    });
  });
})(jQuery);

/* ===== shared/scroll-top ===== */
(function ($) {
  'use strict';
  $(function () {
    var $btn = $('.s-scroll-top');
    if (!$btn.length) {
      return;
    }

    var path = $btn.find('path')[0];
    var length = path.getTotalLength();
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    var $win = $(window);
    function update() {
      var scroll = $win.scrollTop();
      var height = $(document).height() - $win.height();
      path.style.strokeDashoffset = height > 0 ? length - (scroll * length / height) : length;
      $btn.toggleClass('is-visible', scroll > 50);
    }
    $win.on('scroll resize', update);
    update();

    $btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 750);
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) {
      return;
    }

    var $modal = $root.find('#hero-video-modal');
    var $frame = $modal.find('iframe');

    $root.on('click', '.s-hero__play', function () {
      $frame.attr('src', $(this).data('video'));
    });
    $modal.on('hidden.bs.modal', function () {
      $frame.attr('src', '');
    });
  });
})(jQuery);

/* ===== home/03-services ===== */
(function ($) {
  'use strict';
  $(function () {
    var $slider = $('.s-services .s-services__slider');
    if (!$slider.length) {
      return;
    }

    $slider.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      speed: 1000,
      arrows: false,
      dots: false,
      infinite: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 3 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
  });
})(jQuery);

/* ===== home/08-brands ===== */
(function ($) {
  'use strict';
  $(function () {
    var $slider = $('.s-brands .s-brands__slider');
    if (!$slider.length) {
      return;
    }

    $slider.slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      speed: 800,
      arrows: false,
      dots: false,
      infinite: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 4 } },
        { breakpoint: 992, settings: { slidesToShow: 3 } },
        { breakpoint: 576, settings: { slidesToShow: 2 } }
      ]
    });
  });
})(jQuery);

/* ===== home/09-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $form = $('.s-contact .s-contact__form');
    if (!$form.length) {
      return;
    }

    var $message = $form.find('.s-contact__message');

    // Static site: validate on the client and confirm; no data is sent anywhere
    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $form.find('input, select').each(function () {
        var ok = this.checkValidity() && $.trim(this.value) !== '';
        $(this).closest('.s-contact__field').toggleClass('is-invalid', !ok);
        valid = valid && ok;
      });
      if (!valid) {
        $message.text('Vui lòng điền đầy đủ và chính xác các thông tin.');
        return;
      }
      $message.text('Cảm ơn bạn! DLTheme sẽ liên hệ lại trong thời gian sớm nhất.');
      this.reset();
    });

    $form.on('input change', 'input, select', function () {
      $(this).closest('.s-contact__field').removeClass('is-invalid');
    });
  });
})(jQuery);

/* ===== home/10-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $slider = $('.s-testimonials .s-testimonials__slider');
    if (!$slider.length) {
      return;
    }

    $slider.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      speed: 1000,
      arrows: false,
      dots: true,
      infinite: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
  });
})(jQuery);

/* ===== home/11-blog ===== */
(function ($) {
  'use strict';
  $(function () {
    var $slider = $('.s-blog .s-blog__slider');
    if (!$slider.length) {
      return;
    }

    $slider.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      speed: 1000,
      arrows: false,
      dots: false,
      infinite: true,
      responsive: [
        { breakpoint: 1200, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
  });
})(jQuery);
