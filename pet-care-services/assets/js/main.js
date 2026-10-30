/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 1250, easing: 'ease', offset: 80, once: true });

    // Pill buttons: the dark fill grows from the point where the pointer enters
    $(document).on('mouseenter', '.btn-pill', function (e) {
      var offset = $(this).offset();
      $(this).children('.btn-pill__fill').css({
        left: e.pageX - offset.left,
        top: e.pageY - offset.top
      });
    });

    // Lightbox for every [data-fancybox] group (home gallery, footer gallery)
    if ($.fancybox) {
      $.fancybox.defaults.lang = 'vi';
      $.fancybox.defaults.i18n.vi = {
        CLOSE: 'Đóng',
        NEXT: 'Tiếp',
        PREV: 'Trước',
        ERROR: 'Không tải được ảnh. <br/> Vui lòng thử lại sau.',
        PLAY_START: 'Trình chiếu',
        PLAY_STOP: 'Dừng trình chiếu',
        FULL_SCREEN: 'Toàn màn hình',
        THUMBS: 'Ảnh thu nhỏ',
        DOWNLOAD: 'Tải xuống',
        SHARE: 'Chia sẻ',
        ZOOM: 'Phóng to'
      };
      $.extend($.fancybox.defaults, {
        loop: true,
        animationEffect: 'zoom-in-out',
        transitionEffect: 'slide',
        buttons: ['zoom', 'slideShow', 'fullScreen', 'thumbs', 'close'],
        backFocus: false
      });
    }

    // Keep layout-dependent AOS offsets right once images have loaded
    $(window).on('load', function () {
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== shared/float-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-float-contact');
    if (!$root.length) return;

    var $top = $root.find('.s-float-contact__top');
    var path = $root.find('.s-float-contact__ring path').get(0);
    var length = path.getTotalLength();

    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;

    function update() {
      var scroll = $(window).scrollTop();
      var max = $(document).height() - $(window).height();
      path.style.strokeDashoffset = length - (max > 0 ? scroll * length / max : 0);
      $top.toggleClass('is-visible', scroll > 50);
    }

    update();
    $(window).on('scroll', update);

    $top.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 550);
    });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;

    // Static site: the callback request is acknowledged locally (no backend)
    $root.find('.s-footer__lead-form').on('submit', function (e) {
      e.preventDefault();
      var $form = $(this);
      var $input = $form.find('.s-footer__lead-input');
      var phone = $.trim($input.val()).replace(/[\s.-]/g, '');

      if (!/^(\+?84|0)\d{8,10}$/.test(phone)) {
        $input.trigger('focus');
        $form.removeClass('is-sent');
        $form.find('.s-footer__lead-note').text('Vui lòng nhập số điện thoại hợp lệ.');
        $form.addClass('is-sent');
        return;
      }

      $form.find('.s-footer__lead-note').text('Cảm ơn bạn! DLTheme sẽ gọi lại trong thời gian sớm nhất.');
      $form.addClass('is-sent');
      $input.val('');
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;

    var $toggle = $root.find('.s-header__toggle');
    var $links = $root.find('.s-header__menu a, .s-header__panel-nav a');

    // Sticky copy of the header slides in after the first screen part
    function onScroll() {
      $root.toggleClass('is-sticky', $(window).scrollTop() > 300);
    }

    onScroll();
    $(window).on('scroll', onScroll);

    // Off-canvas panel
    function setOpen(open) {
      $root.toggleClass('is-open', open);
      $toggle.attr('aria-expanded', open ? 'true' : 'false');
      $('body').toggleClass('overflow-hidden', open);
    }

    $toggle.on('click', function () {
      setOpen(true);
    });

    $root.find('.s-header__close, .s-header__overlay').on('click', function () {
      setOpen(false);
    });

    $root.find('.s-header__panel-nav a').on('click', function () {
      setOpen(false);
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $root.hasClass('is-open')) setOpen(false);
    });

    // Highlight the menu item of the section in view
    var $targets = $links.map(function () {
      var id = $(this).attr('href');
      return id.charAt(0) === '#' && id.length > 1 ? $(id).get(0) : null;
    });

    function spy() {
      var pos = $(window).scrollTop() + 160;
      var current = '#trang-chu';
      $targets.each(function () {
        if ($(this).offset().top <= pos) current = '#' + this.id;
      });
      $links.removeClass('is-active').filter('[href="' + current + '"]').addClass('is-active');
    }

    spy();
    $(window).on('scroll', spy);
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;

    var $bgs = $root.find('.s-hero__bg');
    var $slides = $root.find('.s-hero__slide');
    var count = $slides.length;
    var current = 0;
    var DELAY = 8000;

    if (count < 2) return;

    function go(next) {
      var $from = $bgs.eq(current);
      var $to = $bgs.eq(next);

      // Park the incoming background on the left without animating, then slide both
      $to.removeClass('is-animating is-leaving is-active');
      $to.get(0).offsetWidth; // reflow
      $from.addClass('is-animating is-leaving').removeClass('is-active');
      $to.addClass('is-animating is-active');

      setTimeout(function () {
        $from.removeClass('is-animating is-leaving');
      }, 1250);

      $slides.eq(current).removeClass('is-active');
      $slides.eq(next).addClass('is-active');
      current = next;
    }

    setInterval(function () {
      if (document.hidden) return;
      go((current + 1) % count);
    }, DELAY);
  });
})(jQuery);

/* ===== home/03-about ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about');
    if (!$root.length) return;

    var $count = $root.find('.s-about__count');
    if (!$count.length || !('IntersectionObserver' in window)) return;

    var target = parseInt($count.data('to'), 10) || 0;
    var started = false;

    // Count up from 0 the first time the experience badge is visible (2s, as on the target)
    var observer = new IntersectionObserver(function (entries) {
      if (started || !entries[0].isIntersecting) return;
      started = true;
      observer.disconnect();
      $({ value: 0 }).animate({ value: target }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $count.text(Math.round(now));
        }
      });
    }, { threshold: 0.5 });

    $count.text('0');
    observer.observe($count.get(0));
  });
})(jQuery);

/* ===== home/05-products ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-products');
    if (!$root.length) return;

    var $items = $root.find('.s-products__item');
    var $filters = $root.find('.s-products__filter');
    var $modal = $root.find('#products-modal');

    // Category filter: "Tất cả" shows the featured eight, a category shows all of its items
    $filters.on('click', function () {
      var filter = $(this).data('filter');
      $filters.removeClass('is-active');
      $(this).addClass('is-active');

      $items.each(function () {
        var $item = $(this);
        var show = filter === 'all' ? $item.data('all') === 1 : $item.data('cat') === filter;
        $item.toggleClass('is-hidden', !show).removeClass('is-entering');
        if (show) {
          $item.get(0).offsetWidth; // restart the entrance animation
          $item.addClass('is-entering');
        }
      });

      AOS.refresh();
    });

    // Product details in a modal (showcase only, no cart)
    function openDetail($card) {
      var old = $card.data('old-price');
      $modal.find('.s-products__modal-img').attr({ src: $card.data('img'), alt: $card.data('name') });
      $modal.find('.s-products__modal-cat').text($card.data('cat-label'));
      $modal.find('.s-products__modal-title').text($card.data('name'));
      $modal.find('.s-products__modal-now').text($card.data('price'));
      $modal.find('.s-products__modal-old').text(old || '').toggle(!!old);
      $modal.find('.s-products__modal-desc').text($card.data('desc'));
      $modal.modal('show');
    }

    $root.on('click', '.s-products__detail, .s-products__detail-link, .s-products__thumb img', function (e) {
      e.preventDefault();
      openDetail($(this).closest('.s-products__card'));
    });
  });
})(jQuery);

/* ===== home/10-news ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-news');
    if (!$root.length || !$.fn.slick) return;

    $root.find('.s-news__carousel').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      speed: 600,
      arrows: false,
      dots: false,
      infinite: true,
      pauseOnHover: true,
      responsive: [
        { breakpoint: 1025, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
  });
})(jQuery);

/* ===== about/03-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-testimonials');
    if (!$root.length || !$.fn.slick) return;

    $root.find('.s-about-testimonials__carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      speed: 600,
      arrows: false,
      dots: true,
      infinite: true,
      pauseOnHover: true,
      adaptiveHeight: true
    });
  });
})(jQuery);

/* ===== about/04-trust-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-trust-faq');
    if (!$root.length) return;

    var $items = $root.find('.s-about-trust-faq__item');

    $items.each(function () {
      var $item = $(this);
      if (!$item.hasClass('is-open')) $item.find('.s-about-trust-faq__answer').hide();
    });

    $items.find('button').on('click', function () {
      var $current = $(this).closest('.s-about-trust-faq__item');
      $items.not($current).removeClass('is-open').find('button').attr('aria-expanded', 'false').find('span').text('+');
      $items.not($current).find('.s-about-trust-faq__answer').stop(true, true).slideUp(250);
      var open = !$current.hasClass('is-open');
      $current.toggleClass('is-open', open);
      $current.find('button').attr('aria-expanded', open ? 'true' : 'false').find('span').text(open ? '−' : '+');
      $current.find('.s-about-trust-faq__answer').stop(true, true)[open ? 'slideDown' : 'slideUp'](250);
    });
  });
})(jQuery);
