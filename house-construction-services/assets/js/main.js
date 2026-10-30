/* ===== base ===== */
(function ($) {
  'use strict';

  // Counts [data-count] elements up from 0 the first time they enter the viewport
  window.dlCountUp = function ($items) {
    if (!$items.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        var $el = $(entry.target);
        var end = parseInt($el.data('count'), 10);
        var suffix = $el.data('suffix') || '';
        $({ n: 0 }).animate({ n: end }, {
          duration: 1800,
          easing: 'swing',
          step: function (now) { $el.text(Math.round(now) + suffix); },
          complete: function () { $el.text(end + suffix); }
        });
      });
    }, { threshold: 0.6 });
    $items.each(function () { observer.observe(this); });
  };

  // Fancybox: shared lightbox for [data-fancybox] video links and project galleries
  if ($.fancybox) {
    $.extend(true, $.fancybox.defaults, {
      lang: 'vi',
      i18n: {
        vi: {
          CLOSE: 'Đóng',
          NEXT: 'Tiếp',
          PREV: 'Trước',
          ERROR: 'Không thể tải nội dung. <br/> Vui lòng thử lại sau.',
          PLAY_START: 'Trình chiếu',
          PLAY_STOP: 'Dừng trình chiếu',
          FULL_SCREEN: 'Toàn màn hình',
          THUMBS: 'Ảnh thu nhỏ',
          DOWNLOAD: 'Tải xuống',
          SHARE: 'Chia sẻ',
          ZOOM: 'Phóng to'
        }
      },
      buttons: ['zoom', 'slideShow', 'fullScreen', 'thumbs', 'close'],
      animationEffect: 'zoom-in-out',
      transitionEffect: 'slide',
      backFocus: false
    });
  }

  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out', offset: 60, once: true });
    // Sliders change section heights after init; recompute trigger positions
    $(window).on('load', function () { AOS.refresh(); });

    // Back-to-top button
    var $top = $('.c-scroll-top');
    if (!$top.length) return;
    $(window).on('scroll.scrollTop', function () {
      $top.toggleClass('is-visible', $(window).scrollTop() > 400);
    }).trigger('scroll.scrollTop');
    $top.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  });
})(jQuery);

/* ===== shared/about ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about');
    if (!$root.length) return;
    window.dlCountUp($root.find('[data-count]'));
  });
})(jQuery);

/* ===== shared/case ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-case');
    if (!$root.length) return;
    var $form = $root.find('.s-case__form');
    var $notice = $form.find('.s-case__notice');

    // Static site: no backend, so confirm locally instead of submitting
    $form.on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $notice.text('Cảm ơn bạn! DLTheme sẽ liên hệ lại trong thời gian sớm nhất.');
      this.reset();
    });
  });
})(jQuery);

/* ===== shared/counter ===== */
(function ($) {
  'use strict';

  $(function () {
    var $root = $('.s-counter');
    if (!$root.length) return;
    window.dlCountUp($root.find('[data-count]'));
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;
    $root.find('.s-footer__year').text(new Date().getFullYear());
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;

    var $win = $(window);
    $win.on('scroll.header', function () {
      $root.toggleClass('is-sticky', $win.scrollTop() > $root.outerHeight() + 100);
    }).trigger('scroll.header');

    // Close the mobile menu after picking an in-page link
    $root.find('.s-header__mobile-menu a[href^="#"]').on('click', function () {
      $('#header-mobile-nav').collapse('hide');
    });
  });
})(jQuery);

/* ===== shared/news ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-news');
    if (!$root.length) return;

    // Share buttons: build the share URL from the current page address
    var url = encodeURIComponent(window.location.href.split('#')[0]);
    var title = encodeURIComponent(document.title);
    var image = encodeURIComponent(($root.find('.s-news__cover').prop('src') || ''));
    var params = {
      facebook: '?u=' + url,
      twitter: '?url=' + url + '&text=' + title,
      pinterest: '?url=' + url + '&media=' + image + '&description=' + title,
      linkedin: '?url=' + url
    };
    $root.find('[data-share]').each(function () {
      var $a = $(this);
      $a.attr('href', $a.attr('href') + (params[$a.data('share')] || ''));
    });

    // Comment form: static site, so confirm locally instead of submitting
    var $form = $root.find('.s-news__comment-form');
    $form.on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $form.find('.s-news__comment-notice').text('Cảm ơn bạn! Bình luận sẽ hiển thị sau khi được duyệt.');
      this.reset();
    });
  });
})(jQuery);

/* ===== shared/projects ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-projects');
    if (!$root.length) return;
    var $items = $root.find('.s-projects__item');

    // An item can belong to several categories: data-category="dang-thi-cong noi-bat"
    $root.find('.s-projects__filter-item').on('click', function () {
      var filter = $(this).data('filter');
      $(this).addClass('is-active').siblings().removeClass('is-active');
      $items.each(function () {
        var $item = $(this);
        var match = filter === '*' || String($item.data('category')).split(' ').indexOf(filter) !== -1;
        $item.toggleClass('is-hidden', !match);
      });
      AOS.refresh();
    });

    // Lightbox gallery of the currently visible projects, starting at the clicked one
    if (!$.fancybox) return;
    $root.on('click', '.js-project-open', function (e) {
      e.preventDefault();
      var $cards = $items.not('.is-hidden').find('.s-projects__card');
      var $card = $(this).closest('.s-projects__card');
      $.fancybox.open($cards.map(function () {
        return { src: $(this).data('src'), opts: { caption: $(this).data('caption') } };
      }).get(), { loop: true }, $cards.index($card));
    });
  });
})(jQuery);

/* ===== shared/services ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-services');
    if (!$root.length) return;
    $root.find('.s-services__slider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 600,
      autoplay: true,
      autoplaySpeed: 5000,
      prevArrow: $root.find('.s-services__arrow--prev'),
      nextArrow: $root.find('.s-services__arrow--next'),
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
    AOS.refresh();
  });
})(jQuery);

/* ===== shared/testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-testimonials');
    if (!$root.length) return;
    $root.find('.s-testimonials__slider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      speed: 600,
      autoplay: true,
      autoplaySpeed: 5000,
      arrows: false,
      dots: true,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 1 } }
      ]
    });
    AOS.refresh();
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
      speed: 800,
      autoplay: true,
      autoplaySpeed: 6000,
      pauseOnHover: false,
      prevArrow: '<button class="s-hero__arrow s-hero__arrow--prev" type="button" aria-label="Slide trước"><i class="fa-solid fa-chevron-left"></i></button>',
      nextArrow: '<button class="s-hero__arrow s-hero__arrow--next" type="button" aria-label="Slide tiếp theo"><i class="fa-solid fa-chevron-right"></i></button>'
    });
    AOS.refresh();
  });
})(jQuery);

/* ===== home/09-pricing ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-pricing');
    if (!$root.length) return;
    $root.find('[data-toggle="tab"]').on('shown.bs.tab', function () {
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== home/12-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact');
    if (!$root.length) return;
    var $form = $root.find('.s-contact__form');
    var $notice = $form.find('.s-contact__notice');

    // Static site: no backend, so confirm locally instead of submitting
    $form.on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $notice.text('Cảm ơn bạn! DLTheme sẽ liên hệ lại trong thời gian sớm nhất.');
      this.reset();
    });
  });
})(jQuery);

/* ===== gioi-thieu/03-awards ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-awards');
    if (!$root.length) return;
    window.dlCountUp($root.find('[data-count]'));
  });
})(jQuery);

/* ===== contact-us/03-form ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-form');
    if (!$root.length) return;
    var $form = $root.find('.s-contact-form__form');

    // Static site: no backend, so confirm locally instead of submitting
    $form.on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $form.find('.s-contact-form__notice').text('Cảm ơn bạn! DLTheme sẽ liên hệ lại trong thời gian sớm nhất.');
      this.reset();
    });
  });
})(jQuery);
