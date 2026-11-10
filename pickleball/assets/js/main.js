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

/* ===== dich-vu/01-services-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-services-hero');
    if (!$root.length) return;

    // Count-up numbers once the counters card is visible
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
      $root.find('.js-count').each(function () { io.observe(this); });
    }
  });
})(jQuery);

/* ===== dich-vu/05-video-banner ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-video-banner');
    if (!$root.length) return;

    // Load the YouTube embed on open, stop it on close
    var $modal = $root.find('.s-video-banner__modal');
    var $frame = $modal.find('iframe');
    $modal.on('show.bs.modal', function () {
      $frame.attr('src', $frame.data('src'));
    });
    $modal.on('hidden.bs.modal', function () {
      $frame.attr('src', '');
    });
  });
})(jQuery);

/* ===== blog/02-blog-list ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog-list');
    if (!$root.length) return;

    var $cells = $root.find('.s-blog-list__cell');
    var $triggers = $root.find('[data-filter]');
    var $empty = $root.find('.s-blog-list__empty');

    // Category filter: chips above the grid and sidebar category links share data-filter
    function applyFilter(filter) {
      var shown = 0;

      $cells.each(function () {
        var match = filter === 'all' || $(this).data('category') === filter;
        $(this).toggleClass('is-hidden', !match);
        if (match) shown += 1;
      });

      $triggers.removeClass('is-active');
      $triggers.filter('[data-filter="' + filter + '"]').addClass('is-active');
      $empty.toggleClass('is-visible', shown === 0);
      if (window.AOS) AOS.refresh();
    }

    $triggers.on('click', function (e) {
      e.preventDefault();
      applyFilter($(this).data('filter'));
      if ($(this).hasClass('blog-sidebar__cat-link')) {
        $('html, body').animate({ scrollTop: $root.offset().top - 100 }, 500);
      }
    });

    // Links from other pages (blog.html#cat-guide) open with that category selected
    var hash = window.location.hash.replace('#cat-', '');
    if (hash && $triggers.filter('[data-filter="' + hash + '"]').length) {
      applyFilter(hash);
    }

    // "Xem thêm": every post is already on the page, so it confirms there is nothing more
    var $load = $root.find('.s-blog-list__load-btn');
    $load.on('click', function () {
      if ($load.hasClass('is-done') || $load.hasClass('is-loading')) return;
      $load.addClass('is-loading').text($load.data('loading'));
      setTimeout(function () {
        $load.removeClass('is-loading').addClass('is-done').prop('disabled', true).text($load.data('done'));
      }, 700);
    });
  });
})(jQuery);

/* ===== blog-detail/02-post ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-post');
    if (!$root.length) return;

    // Gallery: scroll-snap track, arrows scroll one slide, dots follow the scroll position
    var $track = $root.find('.s-post__track');
    var $slides = $track.children();
    var $dots = $root.find('.s-post__dots span');

    function slideWidth() {
      return $slides.first().outerWidth();
    }

    function currentIndex() {
      var max = $track[0].scrollWidth - $track[0].clientWidth;
      if (max > 0 && $track.scrollLeft() >= max - 2) return $slides.length - 1;
      return Math.round($track.scrollLeft() / slideWidth());
    }

    $root.find('.s-post__arrow--prev').on('click', function () {
      $track[0].scrollBy({ left: -slideWidth(), behavior: 'smooth' });
    });
    $root.find('.s-post__arrow--next').on('click', function () {
      var atEnd = currentIndex() >= $slides.length - 1;
      $track[0].scrollTo({ left: atEnd ? 0 : $track.scrollLeft() + slideWidth(), behavior: 'smooth' });
    });
    $track.on('scroll', function () {
      $dots.removeClass('is-active').eq(currentIndex()).addClass('is-active');
    });

    // Copy the page link
    var $copy = $root.find('.s-post__copy');
    $copy.on('click', function () {
      var url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).catch(function () {});
      }
      $copy.addClass('is-copied');
      setTimeout(function () { $copy.removeClass('is-copied'); }, 1600);
    });

    // "Trả lời": jump to the form and focus the comment box
    $root.find('.s-post__reply').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $('#post-respond').offset().top - 110 }, 500, function () {
        $('#post-comment').trigger('focus');
      });
    });

    // Comment form: static site, so validate and confirm without sending anything
    var $form = $root.find('.s-post__form');
    var $status = $root.find('.s-post__status');
    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $form.find('[required]').each(function () {
        var ok = this.checkValidity();
        $(this).toggleClass('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        $status.text('Vui lòng điền đầy đủ các trường bắt buộc.');
        $form.find('.is-invalid').first().trigger('focus');
        return;
      }
      $status.text('Cảm ơn bạn! Bình luận đang chờ kiểm duyệt.');
      this.reset();
    });
    $form.find('[required]').on('input', function () {
      if (this.checkValidity()) $(this).removeClass('is-invalid');
    });
  });
})(jQuery);

/* ===== lien-he/01-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact');
    if (!$root.length) return;

    // Ken Burns slideshow: fade every 5s, the active slide zooms 1.3 → 1 over 10s
    var $slides = $root.find('.s-contact__slide');
    var index = 0;
    if ($slides.length > 1) {
      setInterval(function () {
        $slides.eq(index).removeClass('is-active');
        index = (index + 1) % $slides.length;
        $slides.eq(index).addClass('is-active');
      }, 5000);
    }

    // Contact form: static site, so validate and confirm without sending anything
    var $form = $root.find('.s-contact__form');
    var $status = $root.find('.s-contact__status');
    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $form.find('[required]').each(function () {
        var ok = this.checkValidity();
        $(this).toggleClass('is-invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) {
        $status.text('Vui lòng nhập họ tên, email hợp lệ và nội dung.');
        $form.find('.is-invalid').first().trigger('focus');
        return;
      }
      $status.text('Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.');
      this.reset();
    });
    $form.find('[required]').on('input', function () {
      if (this.checkValidity()) $(this).removeClass('is-invalid');
    });
  });
})(jQuery);
