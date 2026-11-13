/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', offset: 80, once: true });
  });
})(jQuery);

/* ===== shared/back-to-top ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-back-to-top');
    if (!$root.length) return;

    var $win = $(window);

    function onScroll() {
      $root.toggleClass('is-visible', $win.scrollTop() > 400);
    }

    onScroll();
    $win.on('scroll', onScroll);

    // Scroll the window itself (the fixed header can't be an anchor target)
    $root.on('click', function () {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;

    var $form = $root.find('.newsletter-form');
    var $note = $root.find('.newsletter-note');

    $form.on('submit', function (event) {
      event.preventDefault();
      var $input = $form.find('input[type="email"]');
      var value = $.trim($input.val());
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      $note.text(valid ? 'Cảm ơn bạn! DL Global sẽ gửi bản tin mới nhất qua email.' : 'Vui lòng nhập email hợp lệ.');
      if (valid) $input.val('');
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-header');
    if (!$root.length) return;

    var $win = $(window);
    var $menu = $root.find('#header-menu');

    function onScroll() {
      $root.toggleClass('is-scrolled', $win.scrollTop() > 40);
    }

    onScroll();
    $win.on('scroll', onScroll);

    // Close the mobile menu after choosing a link or when resizing to desktop
    $menu.on('click', 'a', function () {
      $menu.collapse('hide');
    });

    $win.on('resize', function () {
      if (window.innerWidth >= 992) $menu.collapse('hide');
    });

    // Give the collapsed header a background while the mobile menu is open
    $menu.on('show.bs.collapse', function () {
      $root.addClass('is-scrolled');
    }).on('hidden.bs.collapse', onScroll);
  });
})(jQuery);

/* ===== shared/stats ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-stats');
    if (!$root.length) return;

    var $counts = $root.find('.stat-count');

    function format(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function run($el) {
      var target = parseInt($el.data('count'), 10) || 0;
      $({ value: 0 }).animate({ value: target }, {
        duration: 1800,
        easing: 'swing',
        step: function (now) { $el.text(format(Math.round(now))); },
        complete: function () { $el.text(format(target)); }
      });
    }

    if (!('IntersectionObserver' in window)) return;

    $counts.text('0');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run($(entry.target));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    $counts.each(function () { observer.observe(this); });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;

    // Search forms jump to the chosen country / job list on the target page
    $root.find('.search-form').on('submit', function (event) {
      event.preventDefault();
      var $form = $(this);
      var $select = $form.find('[data-target-page]');
      var page = $select.data('target-page') || $form.attr('action');
      var hash = $select.val();
      window.location.href = page + (hash ? '#' + hash : '');
    });
  });
})(jQuery);

/* ===== home/10-testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-testimonials');
    if (!$root.length) return;

    // Duplicate each track so translateY(-50%) loops without a jump
    $root.find('.testimonial-track').each(function () {
      var $track = $(this);
      $track.children().clone().attr('aria-hidden', 'true').appendTo($track);
    });
  });
})(jQuery);

/* ===== home/11-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-faq');
    if (!$root.length) return;

    $root.find('.collapse').each(function () {
      $(this).closest('.faq-item').toggleClass('is-open', $(this).hasClass('show'));
    }).on('show.bs.collapse', function () {
      $(this).closest('.faq-item').addClass('is-open');
    }).on('hide.bs.collapse', function () {
      $(this).closest('.faq-item').removeClass('is-open');
    }).on('shown.bs.collapse hidden.bs.collapse', function () {
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== du-hoc/01-countries ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-countries');
    if (!$root.length) return;

    var $tabs = $root.find('.country-tabs a[data-toggle="pill"]');

    // Open the country named in the URL hash (e.g. du-hoc.html#country-korea)
    function openFromHash(scroll) {
      var hash = window.location.hash;
      if (!/^#country-[a-z]+$/.test(hash)) return;
      var $tab = $tabs.filter('[href="' + hash + '"]');
      if (!$tab.length) return;
      $tab.tab('show');
      if (scroll) {
        $('html, body').animate({ scrollTop: $root.offset().top - 90 }, 500);
      }
    }

    openFromHash(true);
    $(window).on('hashchange', function () { openFromHash(true); });

    $tabs.on('shown.bs.tab', function (event) {
      if (window.history && history.replaceState) {
        history.replaceState(null, '', $(event.target).attr('href'));
      }
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== xuat-khau-lao-dong/02-jobs ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-jobs');
    if (!$root.length) return;

    var $filters = $root.find('.job-filter');
    var $cols = $root.find('.job-col');

    function applyFilter(key) {
      var $btn = $filters.filter('[data-filter="' + key + '"]');
      if (!$btn.length) return;
      $filters.removeClass('is-active').attr('aria-pressed', 'false');
      $btn.addClass('is-active').attr('aria-pressed', 'true');
      $cols.each(function () {
        var $col = $(this);
        var show = key === 'all' || $col.data('country') === key;
        $col.toggleClass('is-hidden', !show).removeClass('is-entering');
        if (show) {
          void this.offsetWidth;
          $col.addClass('is-entering');
        }
      });
      AOS.refresh();
    }

    $filters.on('click', function () {
      applyFilter($(this).data('filter'));
    });

    // Hero search on the home page links here as #jobs-<country code>
    var match = window.location.hash.match(/^#jobs-([a-z]{2})$/);
    if (match) {
      applyFilter(match[1]);
      $('html, body').animate({ scrollTop: $root.offset().top - 90 }, 500);
    }
  });
})(jQuery);

/* ===== tin-tuc/01-news-list ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-news-list');
    if (!$root.length) return;

    var $filters = $root.find('.news-filter');
    var $cols = $root.find('.news-col');

    $filters.on('click', function () {
      var key = $(this).data('filter');
      $filters.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      $cols.each(function () {
        var $col = $(this);
        $col.toggleClass('is-hidden', key !== 'all' && $col.data('cat') !== key);
      });
      AOS.refresh();
    });

    // Demo template: article links have no detail page yet
    $root.on('click', 'a[href="#"]', function (event) {
      event.preventDefault();
    });
  });
})(jQuery);

/* ===== chi-tiet-tin-tuc/01-article ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-article');
    if (!$root.length) return;

    var $win = $(window);
    var $content = $root.find('.article-content');
    var $bar = $root.find('.article-progress span');
    var $tocLinks = $root.find('.toc-list a');
    var $headings = $content.find('h2[id]');

    // Reading progress (0 → 1 across the article body) + active table-of-contents item
    function onScroll() {
      var top = $content.offset().top;
      var height = $content.outerHeight();
      var y = $win.scrollTop() + $win.height() * 0.35;
      var progress = Math.min(Math.max((y - top) / height, 0), 1);
      $bar.css('transform', 'scaleX(' + progress + ')');

      var current = '';
      $headings.each(function () {
        if ($(this).offset().top <= $win.scrollTop() + 160) current = this.id;
      });
      $tocLinks.removeClass('is-active');
      if (current) $tocLinks.filter('[href="#' + current + '"]').addClass('is-active');
    }

    onScroll();
    $win.on('scroll resize', onScroll);

    // Copy the article link
    var $copy = $root.find('.article-copy');
    var $note = $root.find('.article-copy-note');
    var timer;

    function done(ok) {
      $copy.toggleClass('is-copied', ok);
      $note.text(ok ? 'Đã sao chép liên kết' : 'Không thể sao chép');
      clearTimeout(timer);
      timer = setTimeout(function () {
        $copy.removeClass('is-copied');
        $note.text('');
      }, 2000);
    }

    $copy.on('click', function () {
      var url = window.location.href;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () { done(true); }, function () { done(false); });
        return;
      }
      var $tmp = $('<textarea readonly>').val(url).css({ position: 'fixed', top: '-1000px' }).appendTo('body');
      $tmp[0].select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      $tmp.remove();
      done(ok);
    });
  });
})(jQuery);

/* ===== lien-he/01-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact');
    if (!$root.length) return;

    var $form = $root.find('.contact-form');
    var $success = $form.find('.form-success');

    function check($input, valid) {
      $input.closest('.form-field').toggleClass('has-error', !valid);
      return valid;
    }

    function validate() {
      var $name = $form.find('[name="name"]');
      var $phone = $form.find('[name="phone"]');
      var okName = check($name, $.trim($name.val()).length >= 2);
      var okPhone = check($phone, /^(0|\+84)\d{9,10}$/.test($phone.val().replace(/[\s.-]/g, '')));
      return okName && okPhone;
    }

    $form.on('input', 'input', function () {
      if ($(this).closest('.form-field').hasClass('has-error')) validate();
    });

    $form.on('submit', function (event) {
      event.preventDefault();
      $success.text('');
      if (!validate()) {
        $form.find('.has-error input').first().trigger('focus');
        return;
      }
      var name = $.trim($form.find('[name="name"]').val());
      $success.text('Cảm ơn ' + name + '! Chuyên viên DL Global sẽ liên hệ với bạn trong thời gian sớm nhất.');
      $form[0].reset();
    });
  });
})(jQuery);
