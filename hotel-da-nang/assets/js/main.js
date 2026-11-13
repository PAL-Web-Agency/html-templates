/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 900, easing: 'sb-ease', offset: 80, once: true, disable: function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } });
    $('body').attr('data-aos-easing', 'sb-ease');

    // Demo forms (static site): show the confirmation note instead of submitting
    $(document).on('submit', '.js-demo-form', function (e) {
      e.preventDefault();
      var $form = $(this);
      $form.find('.form-note').addClass('is-visible');
      this.reset();
    });

    // Back to top button
    var $top = $('.back-top');
    if ($top.length) {
      $(window).on('scroll.backtop', function () {
        $top.toggleClass('is-visible', $(window).scrollTop() > 600);
      });
      $top.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600);
      });
    }

    // Footer year
    $('.js-year').text(new Date().getFullYear());
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    if (!$header.length) return;

    var onScroll = function () {
      $header.toggleClass('is-scrolled', $(window).scrollTop() > 40);
    };
    onScroll();
    $(window).on('scroll.header', onScroll);

    var open = function () {
      $header.addClass('is-open');
      $('body').addClass('is-locked');
      $header.find('.header-toggle').attr('aria-expanded', 'true');
    };
    var close = function () {
      $header.removeClass('is-open');
      $('body').removeClass('is-locked');
      $header.find('.header-toggle').attr('aria-expanded', 'false');
    };

    $header.on('click', '.header-toggle', open);
    $header.on('click', '.drawer-close, .header-overlay', close);
    $(document).on('keydown.header', function (e) {
      if (e.key === 'Escape') close();
    });
    $(window).on('resize.header', function () {
      if (window.innerWidth >= 1200) close();
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;

    // Default dates: today and tomorrow
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var fmt = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var today = new Date();
    var tomorrow = new Date(today.getTime() + 864e5);
    $root.find('#hero-checkin').attr('min', fmt(today)).val(fmt(today));
    $root.find('#hero-checkout').attr('min', fmt(tomorrow)).val(fmt(tomorrow));
    $root.find('#hero-checkin').on('change', function () {
      var d = new Date(this.value);
      if (isNaN(d)) return;
      var next = fmt(new Date(d.getTime() + 864e5));
      $root.find('#hero-checkout').attr('min', next);
      if ($root.find('#hero-checkout').val() < next) $root.find('#hero-checkout').val(next);
    });
  });
})(jQuery);

/* ===== home/02-intro ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-intro');
    if (!$root.length || !('IntersectionObserver' in window)) return;

    var $counts = $root.find('.js-count');
    var run = function (el) {
      var $el = $(el);
      var to = parseFloat($el.data('to'));
      var dec = parseInt($el.data('decimals') || 0, 10);
      $({ v: 0 }).animate({ v: to }, {
        duration: 1800,
        easing: 'swing',
        step: function (v) { $el.text(v.toFixed(dec)); },
        complete: function () { $el.text(to.toFixed(dec)); }
      });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .6 });
    $counts.each(function () { io.observe(this); });
  });
})(jQuery);

/* ===== home/03-rooms ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-rooms');
    if (!$root.length || !$.fn.slick) return;

    var $slider = $root.find('.rooms-slider');
    var $bar = $root.find('.js-rooms-bar');
    var total = $slider.children().length;
    var setBar = function (index) {
      $bar.css('width', ((index + 1) / total * 100) + '%');
    };

    $slider.on('init', function () { setBar(0); });
    $slider.on('beforeChange', function (e, slick, cur, next) { setBar(next); });
    $slider.slick({
      variableWidth: true,
      infinite: false,
      arrows: false,
      dots: false,
      speed: 700,
      cssEase: 'cubic-bezier(.22, .8, .25, 1)',
      swipeToSlide: true
    });
    $root.find('.js-rooms-prev').on('click', function () { $slider.slick('slickPrev'); });
    $root.find('.js-rooms-next').on('click', function () { $slider.slick('slickNext'); });
  });
})(jQuery);

/* ===== home/04-amenities ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-amenities');
    if (!$root.length) return;

    var $items = $root.find('.amenity-item');
    var $imgs = $root.find('.amenity-img');
    var $hours = $root.find('.js-amenity-hours');

    var activate = function ($item) {
      if ($item.hasClass('is-active')) return;
      var idx = $item.data('amenity');
      $items.removeClass('is-active');
      $item.addClass('is-active');
      $imgs.removeClass('is-active').filter('[data-amenity="' + idx + '"]').addClass('is-active');
      $hours.text($item.data('hours'));
    };

    $items.on('mouseenter focusin', function () { activate($(this)); });
  });
})(jQuery);

/* ===== home/05-video ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-video');
    if (!$root.length) return;

    var $modal = $root.find('.home-video-modal');
    var player = $root.find('.home-video-player').get(0);

    // Move the modal to <body> so no ancestor can affect its fixed positioning
    $modal.appendTo('body');
    $modal.on('shown.bs.modal', function () {
      if (player) player.play();
    });
    $modal.on('hide.bs.modal', function () {
      if (player) player.pause();
    });

    // Gentle parallax on the background image
    var $media = $root.find('.home-video-media');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var ticking = false;
    var update = function () {
      var rect = $root.get(0).getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom > 0 && rect.top < vh) {
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        $media.css('transform', 'translate3d(0,' + (progress * -80).toFixed(1) + 'px,0)');
      }
      ticking = false;
    };
    $(window).on('scroll.homevideo resize.homevideo', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    });
    update();
  });
})(jQuery);

/* ===== home/07-reviews ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-home-reviews');
    if (!$root.length || !$.fn.slick) return;

    var $slider = $root.find('.reviews-slider');
    $slider.slick({
      slidesToShow: 1,
      infinite: true,
      arrows: false,
      dots: false,
      speed: 700,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      cssEase: 'cubic-bezier(.22, .8, .25, 1)',
      adaptiveHeight: false
    });
    $root.find('.js-reviews-prev').on('click', function () { $slider.slick('slickPrev'); });
    $root.find('.js-reviews-next').on('click', function () { $slider.slick('slickNext'); });
  });
})(jQuery);

/* ===== about/02-stats ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-stats');
    if (!$root.length) return;

    var run = function () {
      $root.find('.js-count').each(function () {
        var $el = $(this);
        var target = parseFloat($el.data('count'));
        var decimals = parseInt($el.data('decimals'), 10) || 0;
        var start = null;
        var duration = 1600;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          $el.text((target * eased).toFixed(decimals).replace('.', ','));
          if (p < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      });
    };

    if (!('IntersectionObserver' in window)) {
      run();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        run();
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe($root[0]);
  });
})(jQuery);

/* ===== about/04-video ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-video');
    if (!$root.length) return;

    var $modal = $root.find('#about-video-modal');
    var video = $modal.find('video')[0];
    if (!video) return;

    $modal.on('shown.bs.modal', function () {
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
    $modal.on('hide.bs.modal', function () {
      video.pause();
      video.currentTime = 0;
    });
  });
})(jQuery);

/* ===== rooms/01-list ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-rooms-list');
    if (!$root.length) return;

    var $items = $root.find('.rooms-item');
    var $count = $root.find('.rooms-count-num');

    $root.on('click', '.rooms-filter-btn', function () {
      var $btn = $(this);
      if ($btn.hasClass('is-active')) return;
      var filter = $btn.data('filter');

      $root.find('.rooms-filter-btn').removeClass('is-active');
      $btn.addClass('is-active');

      var $show = filter === '*' ? $items : $items.filter(function () {
        return (' ' + $(this).data('category') + ' ').indexOf(' ' + filter + ' ') > -1;
      });
      var $hide = $items.not($show);

      $count.text($show.length);
      $hide.stop(true, true).fadeOut(250);
      setTimeout(function () {
        $show.stop(true, true).fadeIn(350);
        if (window.AOS) AOS.refresh();
      }, 260);
    });
  });
})(jQuery);

/* ===== room-detail/01-gallery ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-room-detail-gallery');
    if (!$root.length || !$.fn.slick) return;

    var $main = $root.find('.gallery-main');
    var $thumbs = $root.find('.gallery-thumb');
    var $current = $root.find('.gallery-counter-current');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    $main.on('beforeChange', function (e, slick, cur, next) {
      $thumbs.removeClass('is-current').eq(next).addClass('is-current');
      $current.text(pad(next + 1));
    });

    $main.slick({
      fade: true,
      speed: 700,
      autoplay: true,
      autoplaySpeed: 5000,
      pauseOnHover: true,
      arrows: false,
      dots: false
    });

    $thumbs.on('click', function () {
      $main.slick('slickGoTo', parseInt($(this).data('index'), 10));
    });
    $root.on('click', '.gallery-arrow.is-prev', function () { $main.slick('slickPrev'); });
    $root.on('click', '.gallery-arrow.is-next', function () { $main.slick('slickNext'); });
  });
})(jQuery);

/* ===== room-detail/02-content ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-room-detail-content');
    if (!$root.length) return;

    // Default stay: tomorrow → two nights later
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var fmt = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var day = 864e5;
    var now = Date.now();
    var $in = $root.find('input[name="checkin"]');
    var $out = $root.find('input[name="checkout"]');

    $in.attr('min', fmt(new Date(now))).val(fmt(new Date(now + day)));
    $out.attr('min', fmt(new Date(now + day * 2))).val(fmt(new Date(now + day * 3)));

    $in.on('change', function () {
      var d = new Date(this.value);
      if (isNaN(d)) return;
      var next = fmt(new Date(d.getTime() + day));
      $out.attr('min', next);
      if ($out.val() < next) $out.val(next);
    });
  });
})(jQuery);

/* ===== blog/01-featured ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog-featured');
    if (!$root.length) return;

    var $cols = $('.s-blog-grid .blog-card-col');
    var $empty = $('.s-blog-grid .blog-grid-empty');

    $root.on('click', '.blog-pill', function () {
      var $pill = $(this);
      var filter = $pill.data('filter');
      $root.find('.blog-pill').removeClass('is-active');
      $pill.addClass('is-active');

      var shown = 0;
      $cols.each(function () {
        var $col = $(this);
        var match = filter === 'all' || $col.hasClass('is-promo') || $col.data('cat') === filter;
        $col.toggleClass('is-hidden', !match);
        if (match && !$col.hasClass('is-promo')) shown += 1;
      });
      $empty.toggleClass('is-visible', shown === 0);
      if (window.AOS) AOS.refresh();
    });
  });
})(jQuery);

/* ===== faq/01-main ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-faq-main');
    if (!$root.length) return;

    $root.on('show.bs.collapse', '.collapse', function () {
      $(this).closest('.faq-item').addClass('is-open');
    });
    $root.on('hide.bs.collapse', '.collapse', function () {
      $(this).closest('.faq-item').removeClass('is-open');
    });

    $root.on('shown.bs.tab', '.faq-cat', function () {
      if (window.AOS) AOS.refresh();
      // Keep the active category visible in the horizontal mobile row
      var nav = $root.find('.faq-cats')[0];
      if (nav && nav.scrollWidth > nav.clientWidth) {
        nav.scrollTo({ left: this.offsetLeft - 20, behavior: 'smooth' });
      }
    });
  });
})(jQuery);
