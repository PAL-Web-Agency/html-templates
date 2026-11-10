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

/* ===== shared/blog-sidebar ===== */
// Reflects ?q, ?cat and ?post in the sidebar: search text, active category, current post hidden from "recent"
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog-sidebar');
    if (!$root.length) return;

    function param(name) {
      var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
      return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    }

    var q = param('q');
    var cat = param('cat');
    var post = param('post');

    if (q) $root.find('.s-blog-sidebar__search input').val(q);
    if (cat) $root.find('.s-blog-sidebar__cats a[data-cat="' + cat + '"]').addClass('is-active').attr('aria-current', 'true');

    var $current = $root.find('.s-blog-sidebar__post[data-post="' + post + '"]');
    if ($current.length) {
      $current.addClass('is-hidden');
    } else if ($('.s-blog-detail').length) {
      // Detail page without a valid ?post shows the first post, so hide that one
      $root.find('.s-blog-sidebar__post').first().addClass('is-hidden');
    }
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
// Category filter: "Tất cả" shows the featured eight, a category shows all of its items
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-products');
    if (!$root.length) return;

    var $items = $root.find('.s-products__item');
    var $filters = $root.find('.s-products__filter');

    $filters.on('click', function () {
      var filter = $(this).data('filter');
      $filters.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');

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

/* ===== about/03-stats ===== */
// Numbers count up from 0 the first time the band scrolls into view
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-stats');
    if (!$root.length) return;

    var $nums = $root.find('[data-count]');
    var done = false;

    function format(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    $nums.text('0');

    function check() {
      if (done) return;
      if ($root.offset().top > $(window).scrollTop() + $(window).height() - 80) return;
      done = true;
      $(window).off('scroll', check);
      $nums.each(function () {
        var $el = $(this);
        var target = Number($el.data('count'));
        $({ n: 0 }).animate({ n: target }, {
          duration: 1800,
          easing: 'swing',
          step: function (now) { $el.text(format(Math.round(now))); },
          complete: function () { $el.text(format(target)); }
        });
      });
    }

    $(window).on('scroll', check);
    check();
  });
})(jQuery);

/* ===== about/06-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-testimonials');
    if (!$root.length || !$.fn.slick) return;

    $root.find('.s-about-testimonials__carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4500,
      speed: 600,
      arrows: false,
      dots: true,
      infinite: true,
      pauseOnHover: true,
      adaptiveHeight: true
    });
  });
})(jQuery);

/* ===== service-detail/02-detail ===== */
// One template for every service: ?service=<slug> picks the sidebar link whose data-* fills the page
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-service-detail');
    if (!$root.length) return;

    var match = /[?&]service=([^&#]+)/.exec(window.location.search);
    var slug = match ? decodeURIComponent(match[1]) : '';
    var $links = $root.find('.s-service-detail__nav a');
    var $link = $links.filter('[data-service="' + slug + '"]');
    if (!$link.length) return;

    var name = $.trim($link.text());
    var data = $link.data();

    $links.removeClass('is-active').removeAttr('aria-current');
    $link.addClass('is-active').attr('aria-current', 'page');

    $('[data-service-name]').text(name);
    $root.find('.s-service-detail__photo').attr({ src: data.image, alt: name });
    $root.find('.s-service-detail__badge .pi').attr('class', 'pi ' + data.icon);
    $root.find('.s-service-detail__desc').text(data.desc);
    $root.find('.s-service-detail__price').text(data.price);
    $root.find('.s-service-detail__time').text(data.time);
    document.title = name + ' | DLTheme - Chăm sóc thú cưng tại Đắk Lắk';
  });
})(jQuery);

/* ===== shop/02-catalog ===== */
// Category filter: hides the items of other categories and updates the counter
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-shop-catalog');
    if (!$root.length) return;

    var $items = $root.find('.s-shop-catalog__item');
    var $count = $root.find('.s-shop-catalog__count strong');

    $root.on('click', '.s-shop-catalog__filter', function () {
      var filter = $(this).data('filter');
      $root.find('.s-shop-catalog__filter').removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');

      $items.each(function () {
        $(this).toggleClass('is-hidden', filter !== 'all' && $(this).data('cat') !== filter);
      });
      $count.text($items.not('.is-hidden').length);
      if (window.AOS) AOS.refresh();
    });
  });
})(jQuery);

/* ===== product-detail/02-detail ===== */
// One template for every product: ?product=<slug> picks the matching card of the
// related list (which holds every product's data) and copies it into the page
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-detail');
    if (!$root.length) return;

    var match = /[?&]product=([^&#]+)/.exec(window.location.search);
    var slug = match ? decodeURIComponent(match[1]) : '';
    var $item = $('.s-product-related__item[data-product="' + slug + '"]');
    if (!$item.length) return;

    var d = $item.data();
    $('[data-product-name]').text(d.name);
    $root.find('.s-product-detail__media img').attr({ src: d.img, alt: d.name });
    $root.find('.s-product-detail__sale').toggleClass('is-hidden', !d.old);
    $root.find('.s-product-detail__cat').text(d.catLabel);
    $root.find('.s-product-detail__now').text(d.price);
    $root.find('.s-product-detail__price del').text(d.old || '');
    $root.find('.s-product-detail__desc').text(d.desc);
    document.title = d.name + ' | DLTheme - Chăm sóc thú cưng tại Đắk Lắk';
  });
})(jQuery);

/* ===== product-detail/03-related ===== */
// Shows 4 other products, same category first
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-related');
    if (!$root.length) return;

    var match = /[?&]product=([^&#]+)/.exec(window.location.search);
    var $items = $root.find('.s-product-related__item');
    var $current = $items.filter('[data-product="' + (match ? decodeURIComponent(match[1]) : '') + '"]');
    if (!$current.length) return;

    var cat = $current.data('cat');
    var $others = $items.not($current);
    var picked = $others.filter('[data-cat="' + cat + '"]').get()
      .concat($others.not('[data-cat="' + cat + '"]').get())
      .slice(0, 4);

    $items.addClass('is-hidden');
    $(picked).removeClass('is-hidden').appendTo($root.find('.row'));
    if (window.AOS) AOS.refresh();
  });
})(jQuery);

/* ===== blog/02-list ===== */
// Filters the post list by ?cat (category slug) and ?q (title search, accents ignored)
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog-list');
    if (!$root.length) return;

    function param(name) {
      var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
      return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
    }

    function plain(text) {
      return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }

    var q = $.trim(param('q'));
    var cat = param('cat');
    if (!q && !cat) return;

    var $items = $root.find('.s-blog-list__item');
    var catLabel = '';

    $items.each(function () {
      var $item = $(this);
      var ok = (!cat || $item.data('cat') === cat) && (!q || plain($item.data('title')).indexOf(plain(q)) !== -1);
      if ($item.data('cat') === cat) catLabel = $item.data('cat-label');
      $item.toggleClass('is-hidden', !ok);
    });

    var count = $items.not('.is-hidden').length;
    var label = q ? 'từ khóa “' + q + '”' : 'chuyên mục “' + (catLabel || cat) + '”';
    $root.find('.s-blog-list__status-text').text(count ? 'Có ' + count + ' bài viết cho ' + label : 'Không tìm thấy bài viết nào cho ' + label);
    $root.find('.s-blog-list__status').addClass('is-visible');
    if (window.AOS) AOS.refresh();
  });
})(jQuery);

/* ===== blog-detail/02-article ===== */
// One template for every post: ?post=<slug> picks the sidebar post whose data-* fills the article header
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog-detail');
    if (!$root.length) return;

    var m = /[?&]post=([^&#]+)/.exec(window.location.search);
    var $post = $('.s-blog-sidebar__post[data-post="' + (m ? decodeURIComponent(m[1]) : '') + '"]');
    if (!$post.length) return;

    var d = $post.data();
    $('[data-post-title]').text(d.title);
    $root.find('.s-blog-detail__cover img').attr({ src: d.img, alt: d.title });
    $root.find('.s-blog-detail__cat').text(d.catLabel).attr('href', 'blog.html?cat=' + d.cat);
    $root.find('.s-blog-detail__date').text(d.date);
    $root.find('.s-blog-detail__lead').text(d.excerpt);
    document.title = d.title + ' | DLTheme - Chăm sóc thú cưng tại Đắk Lắk';
  });
})(jQuery);

/* ===== contact/03-form ===== */
// Static site: the form is validated and acknowledged locally (no backend)
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-form');
    if (!$root.length) return;

    var $form = $root.find('form');
    var $success = $root.find('.s-contact-form__success');

    function setInvalid($input, invalid) {
      $input.toggleClass('is-invalid', invalid).attr('aria-invalid', invalid ? 'true' : 'false');
    }

    $form.on('input change', '.is-invalid', function () {
      setInvalid($(this), false);
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      var $name = $form.find('[name="name"]');
      var $phone = $form.find('[name="phone"]');
      var badName = $.trim($name.val()).length < 2;
      var badPhone = !/^(\+?84|0)\d{8,10}$/.test($.trim($phone.val()).replace(/[\s.-]/g, ''));

      setInvalid($name, badName);
      setInvalid($phone, badPhone);
      $success.removeClass('is-visible');

      if (badName || badPhone) {
        (badName ? $name : $phone).trigger('focus');
        return;
      }

      $form.get(0).reset();
      $success.addClass('is-visible');
    });
  });
})(jQuery);
