/* ===== base ===== */
(function ($) {
  'use strict';

  // Front-end validation for .form-dl forms (no backend): marks invalid
  // required fields and writes the result into .form-dl__status.
  $.fn.dlForm = function (options) {
    return this.each(function () {
      var $form = $(this);
      var $status = $form.find('.form-dl__status');

      $form.on('input change', '.form-control', function () {
        $(this).removeClass('is-invalid');
      });

      $form.on('submit', function (e) {
        e.preventDefault();
        var valid = true;

        $form.find('[required], [type="email"], [type="url"], [pattern]').each(function () {
          var empty = $.trim(this.value) === '';
          var ok = this.checkValidity() && !(this.required && empty);
          $(this).toggleClass('is-invalid', !ok);
          if (!ok) valid = false;
        });

        if (!valid) {
          $status.removeClass('is-success').addClass('is-error').text(options.error);
          $form.find('.is-invalid').first().trigger('focus');
          return;
        }

        var data = {};
        $.each($form.serializeArray(), function (i, field) { data[field.name] = $.trim(field.value); });
        $status.removeClass('is-error').addClass('is-success').text(options.success(data));
        this.reset();
      });
    });
  };

  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', offset: 80, once: true });
  });
})(jQuery);

/* ===== shared/float-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-float-contact');
    if (!$root.length) return;

    var $win = $(window);
    function update() {
      $root.toggleClass('is-visible', $win.scrollTop() > 600);
    }
    $win.on('scroll', update);
    update();

    $root.find('.s-float-contact__btn--top').on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
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
    var $collapse = $root.find('.navbar-collapse');
    var $links = $root.find('.navbar-nav .nav-link');
    // Scroll-spy only for in-page anchors; page links keep their static is-active
    var sections = $links.map(function () {
      var href = $(this).attr('href') || '';
      if (href.charAt(0) !== '#' || href.length < 2) return null;
      var $target = $(href);
      return $target.length ? { link: $(this), target: $target } : null;
    }).get();

    function update() {
      var top = $win.scrollTop();
      $root.toggleClass('is-scrolled', top > 40);

      // Highlight the section currently under the header
      var marker = top + $root.outerHeight() + 80;
      var current = sections.length ? sections[0] : null;
      $.each(sections, function (i, item) {
        if (item.target.offset().top <= marker) current = item;
      });
      if (top + $win.height() >= $(document).height() - 4 && sections.length) {
        current = sections[sections.length - 1];
      }
      if (sections.length) {
        $links.removeClass('is-active');
        if (current) current.link.addClass('is-active');
      }
    }

    $win.on('scroll resize', update);
    update();

    // Close the mobile menu after picking a link
    $links.add($root.find('.s-header__cta')).on('click', function () {
      if ($collapse.hasClass('show')) $collapse.collapse('hide');
    });

    // Solid header while the mobile menu is open at the top of the page
    $collapse.on('show.bs.collapse', function () {
      $root.addClass('is-scrolled');
    }).on('hidden.bs.collapse', update);
  });
})(jQuery);

/* ===== home/03-bikes ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-bikes');
    if (!$root.length) return;

    var $tabs = $root.find('.s-bikes__tab');
    var $items = $root.find('.s-bikes__item');

    $tabs.on('click', function () {
      var filter = $(this).data('filter');
      $tabs.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');

      $items.each(function () {
        var $item = $(this);
        var cat = $item.data('category');
        var show = filter === 'all' || cat === filter || cat === 'all';
        $item.removeClass('is-entering').toggleClass('is-hidden', !show);
        if (show) {
          // Restart the entrance animation
          void this.offsetWidth;
          $item.addClass('is-entering');
        }
      });
      AOS.refresh();
    });

    // "Nhận báo giá": prefill the contact form with the chosen bike
    $root.find('.s-bikes__quote').on('click', function () {
      var bike = $(this).data('bike');
      var $select = $('#contact-bike');
      if ($select.length && bike) {
        $select.val(bike);
        $('#contact-need').val('Nhận báo giá');
      }
    });
  });
})(jQuery);

/* ===== home/05-about ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about');
    if (!$root.length) return;

    var $counts = $root.find('.s-about__count');

    function format(n) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function run($el) {
      var end = parseInt($el.data('count'), 10) || 0;
      var suffix = $el.data('suffix') || '';
      $({ n: 0 }).animate({ n: end }, {
        duration: 1600,
        easing: 'swing',
        step: function (now) { $el.text(format(Math.round(now)) + suffix); },
        complete: function () { $el.text(format(end) + suffix); }
      });
    }

    if (!('IntersectionObserver' in window)) {
      $counts.each(function () { run($(this)); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run($(entry.target));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    $counts.each(function () { observer.observe(this); });
  });
})(jQuery);

/* ===== home/09-contact ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact');
    if (!$root.length) return;

    var $form = $root.find('#contact-form');
    var $status = $form.find('.s-contact__status');

    $form.on('input change', '.form-control', function () {
      $(this).removeClass('is-invalid');
    });

    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;

      $form.find('[required]').each(function () {
        var ok = this.checkValidity() && $.trim(this.value) !== '';
        $(this).toggleClass('is-invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        $status.removeClass('is-success').addClass('is-error')
          .text('Vui lòng nhập họ tên và số điện thoại hợp lệ.');
        $form.find('.is-invalid').first().trigger('focus');
        return;
      }

      var name = $.trim($('#contact-name').val());
      $status.removeClass('is-error').addClass('is-success')
        .text('Cảm ơn ' + name + '! DLTheme Bike đã nhận yêu cầu và sẽ gọi lại cho bạn trong 30 phút.');
      this.reset();
    });
  });
})(jQuery);

/* ===== shop/01-catalog ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-shop');
    if (!$root.length) return;

    var $grid = $root.find('.s-shop__grid');
    var $items = $grid.children('.s-shop__item');
    var $cats = $root.find('.s-shop__cat');
    var $sizes = $root.find('.s-shop__size');
    var $colors = $root.find('.s-shop__color');
    var $total = $root.find('.s-shop__total');
    var $empty = $root.find('.s-shop__empty');
    var state = { cat: 'all', sizes: [], colors: [] };

    // Multi-select: an item matches when it has any of the chosen values
    function matches(chosen, values) {
      return !chosen.length || chosen.some(function (v) { return values.indexOf(v) !== -1; });
    }

    function apply() {
      var shown = 0;
      $items.each(function () {
        var $item = $(this);
        var catOk = state.cat === 'all' || $item.data('category') === state.cat;
        var show = catOk &&
          matches(state.sizes, String($item.data('sizes')).split(' ')) &&
          matches(state.colors, String($item.data('colors')).split(' '));
        $item.removeClass('is-entering').toggleClass('is-hidden', !show);
        if (show) {
          shown += 1;
          void this.offsetWidth; // restart the entrance animation
          $item.addClass('is-entering');
        }
      });
      $total.text(shown);
      $empty.prop('hidden', shown > 0);
      AOS.refresh();
    }

    $cats.on('click', function () {
      state.cat = $(this).data('filter');
      $cats.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      apply();
    });

    function toggle($group, key, attr) {
      return function () {
        var on = !$(this).hasClass('is-active');
        $(this).toggleClass('is-active', on).attr('aria-pressed', String(on));
        state[key] = $group.filter('.is-active').map(function () { return String($(this).data(attr)); }).get();
        apply();
      };
    }

    $sizes.on('click', toggle($sizes, 'sizes', 'size'));
    $colors.on('click', toggle($colors, 'colors', 'color'));

    $root.find('.s-shop__reset').on('click', function () {
      $cats.first().trigger('click');
      $sizes.add($colors).removeClass('is-active').attr('aria-pressed', 'false');
      state.sizes = [];
      state.colors = [];
      apply();
    });

    // Footer links open the catalog pre-filtered: shop.html?loai=dia-hinh
    var preset = /[?&]loai=([^&]*)/.exec(window.location.search);
    if (preset) $cats.filter('[data-filter="' + decodeURIComponent(preset[1]) + '"]').trigger('click');

    $root.find('#shop-sort').on('change', function () {
      var mode = this.value;
      var sorted = $items.get().sort(function (a, b) {
        var $a = $(a);
        var $b = $(b);
        if (mode === 'newest') return $b.data('order') - $a.data('order');
        if (mode === 'az') return String($a.data('name')).localeCompare(String($b.data('name')), 'vi');
        if (mode === 'za') return String($b.data('name')).localeCompare(String($a.data('name')), 'vi');
        return $items.index(a) - $items.index(b);
      });
      $grid.prepend(sorted); // keep the CTA tile last
      apply();
    });
  });
})(jQuery);

/* ===== product-supercaliber-9-9-xtr/01-overview ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product');
    if (!$root.length) return;

    var $thumbs = $root.find('.s-product__thumb');
    var $quote = $root.find('.s-product__quote');
    var choice = { color: 'Đen nhám', size: 'M' };

    // Keep the active thumbnail in sync with the gallery carousel
    $root.find('#product-gallery').on('slide.bs.carousel', function (e) {
      $thumbs.removeClass('is-active').eq(e.to).addClass('is-active');
    });

    function updateQuote() {
      var base = $quote.attr('href').split('?')[0];
      var bike = $quote.data('bike') + ' – ' + choice.color + ', size ' + choice.size;
      $quote.attr('href', base + '?xe=' + encodeURIComponent(bike));
    }

    $root.find('.s-product__color').on('click', function () {
      choice.color = $(this).data('color');
      $root.find('.s-product__color').removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      $root.find('.s-product__color-name').text(choice.color);
      updateQuote();
    });

    $root.find('.s-product__size').on('click', function () {
      choice.size = String($(this).data('size'));
      $root.find('.s-product__size').removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      $root.find('.s-product__size-name').text(choice.size);
      updateQuote();
    });

    updateQuote();
  });
})(jQuery);

/* ===== product-supercaliber-9-9-xtr/02-details ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-details');
    if (!$root.length) return;

    // Tab panes change the page height; recompute AOS trigger points
    $root.find('[data-toggle="tab"]').on('shown.bs.tab', function () {
      AOS.refresh();
    });
  });
})(jQuery);

/* ===== blog/01-posts ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-blog');
    if (!$root.length) return;

    var $items = $root.find('.s-blog__item');
    var $cats = $root.find('.s-blog__cat');
    var $search = $root.find('#blog-search');
    var $empty = $root.find('.s-blog__empty');
    var $pager = $root.find('.s-blog__pager');
    var state = { cat: 'all', q: '', expanded: false };

    function normalize(s) {
      return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }

    function apply() {
      var filtering = state.cat !== 'all' || state.q !== '';
      var shown = 0;
      $items.each(function () {
        var $item = $(this);
        var cats = String($item.data('cats')).split(' ');
        var text = normalize($item.find('.s-blog__title').text() + ' ' + $item.find('.s-blog__excerpt').text());
        var match = (state.cat === 'all' || cats.indexOf(state.cat) !== -1) && (!state.q || text.indexOf(state.q) !== -1);
        $item.removeClass('is-entering').toggleClass('is-hidden', !match);
        if (match) {
          shown += 1;
          void this.offsetWidth; // restart the entrance animation
          $item.addClass('is-entering');
        }
      });
      // Filters search every post; the "load more" limit only applies to the unfiltered list
      $items.toggleClass('is-more', false);
      if (!filtering && !state.expanded) $items.slice(6).addClass('is-more');
      $pager.toggleClass('is-done', filtering || state.expanded);
      $empty.prop('hidden', shown > 0);
      AOS.refresh();
    }

    $cats.on('click', function () {
      state.cat = $(this).data('cat');
      $cats.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');
      apply();
    });

    $search.on('input', function () {
      state.q = normalize($.trim(this.value));
      apply();
    });

    $root.find('.s-blog__load').on('click', function () {
      state.expanded = true;
      apply();
    });
  });
})(jQuery);

/* ===== a-new-kind-of-speed-dating/01-article ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-post');
    if (!$root.length) return;

    var $win = $(window);
    var $bar = $root.find('.s-post__progress span');
    var $article = $root.find('.s-post__article');
    var $tocLinks = $root.find('.s-post__toc a');
    var $tips = $tocLinks.map(function () { return $($(this).attr('href'))[0]; });

    function update() {
      var top = $win.scrollTop();
      var start = $article.offset().top;
      var end = start + $article.outerHeight() - $win.height();
      var ratio = Math.min(1, Math.max(0, (top - start) / Math.max(1, end - start)));
      $bar.css('transform', 'scaleX(' + ratio + ')');

      // Highlight the tip currently being read
      var marker = top + 160;
      var current = -1;
      $tips.each(function (i) {
        if ($(this).offset().top <= marker) current = i;
      });
      $tocLinks.removeClass('is-active');
      if (current > -1) $tocLinks.eq(current).addClass('is-active');
    }

    $win.on('scroll resize', update);
    update();

    $root.find('.s-post__copy').on('click', function () {
      var $btn = $(this);
      var done = function () {
        $btn.addClass('is-done');
        setTimeout(function () { $btn.removeClass('is-done'); }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(done, done);
      } else {
        done();
      }
    });

    $root.find('#post-comment').dlForm({
      error: 'Vui lòng nhập bình luận, tên và email hợp lệ.',
      success: function (data) {
        return 'Cảm ơn ' + data.name + '! Bình luận của bạn đang chờ kiểm duyệt.';
      }
    });
  });
})(jQuery);

/* ===== faqs/01-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-faq');
    if (!$root.length) return;

    var $items = $root.find('.s-faq__item');
    var $panes = $root.find('.tab-pane');
    var $empty = $root.find('.s-faq__empty');

    // Open/closed styling follows the Bootstrap collapse events
    $root.on('show.bs.collapse', '.collapse', function () {
      $(this).closest('.s-faq__item').addClass('is-open');
    }).on('hide.bs.collapse', '.collapse', function () {
      $(this).closest('.s-faq__item').removeClass('is-open');
    });

    function normalize(s) {
      return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
    }

    // Search shows matching questions from every group at once
    $root.find('#faq-search').on('input', function () {
      var q = normalize($.trim(this.value));
      $root.toggleClass('is-searching', q !== '');
      var shown = 0;

      $items.each(function () {
        var match = !q || normalize($(this).text()).indexOf(q) !== -1;
        $(this).toggleClass('is-hidden', !match);
        if (match) shown += 1;
      });
      $panes.each(function () {
        $(this).toggleClass('is-hidden', q !== '' && !$(this).find('.s-faq__item:not(.is-hidden)').length);
      });
      $empty.prop('hidden', shown > 0);
      AOS.refresh();
    });

    // Picking a group clears the search
    $root.find('[data-toggle="pill"]').on('show.bs.tab', function () {
      var $search = $root.find('#faq-search');
      if ($search.val()) $search.val('').trigger('input');
    });
  });
})(jQuery);

/* ===== contact-us/02-form ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-form');
    if (!$root.length) return;

    var $form = $root.find('#contact-page-form');

    // "Nhận báo giá" links from the catalog pass the bike as ?xe=…
    var match = /[?&]xe=([^&]*)/.exec(window.location.search);
    if (match) {
      var bike = decodeURIComponent(match[1].replace(/\+/g, ' '));
      $form.find('#contact-page-bike').val(bike);
      $form.find('#contact-page-topic').val('Nhận báo giá');
    }

    $form.dlForm({
      error: 'Vui lòng nhập tên và số điện thoại hợp lệ.',
      success: function (data) {
        return 'Cảm ơn ' + data.name + '! DLTheme Bike đã nhận tin nhắn và sẽ gọi lại cho bạn trong 30 phút.';
      }
    });
  });
})(jQuery);

/* ===== contact-us/03-newsletter ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-newsletter');
    if (!$root.length) return;

    $root.find('#contact-newsletter').dlForm({
      error: 'Vui lòng nhập một địa chỉ email hợp lệ.',
      success: function () {
        return 'Đăng ký thành công! Hãy kiểm tra hộp thư để nhận ưu đãi đầu tiên.';
      }
    });
  });
})(jQuery);
