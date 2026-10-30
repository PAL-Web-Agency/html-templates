/* ===== base ===== */
(function ($) {
  'use strict';

  // Shared banner slider (hero + deal banner): main slide with parallax image + round thumbnails
  $.fn.bannerSlider = function () {
    return this.each(function () {
      var $root = $(this);
      var mainEl = $root.find('.banner-slider-main .swiper')[0];
      var thumbEl = $root.find('.banner-slider-thumb .swiper')[0];
      if (!mainEl || !thumbEl || typeof Swiper === 'undefined') return;

      var thumbs = new Swiper(thumbEl, {
        slidesPerView: 'auto',
        spaceBetween: 0,
        watchSlidesProgress: true
      });

      new Swiper(mainEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 1000,
        effect: 'coverflow',
        grabCursor: true,
        parallax: true,
        centeredSlides: true,
        coverflowEffect: { rotate: 0.05, depth: 0, stretch: 0, modifier: 1, slideShadows: false },
        thumbs: { swiper: thumbs },
        on: {
          init: function (swiper) {
            $(swiper.slides).find('.banner-img').attr('data-swiper-parallax', 0.9 * swiper.width);
          },
          resize: function (swiper) {
            $(swiper.slides).find('.banner-img').attr('data-swiper-parallax', 0.9 * swiper.width);
            swiper.update();
          }
        }
      });
    });
  };

  // Wrap each character of [data-split] headings so split-* AOS animations can stagger them
  function splitText(el) {
    var index = 0;
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (word, w) {
      var wordEl = document.createElement('span');
      wordEl.className = 'word';
      Array.from(word).forEach(function (ch) {
        var charEl = document.createElement('span');
        charEl.className = 'char';
        charEl.textContent = ch;
        charEl.style.setProperty('--char-index', index++);
        wordEl.appendChild(charEl);
      });
      el.appendChild(wordEl);
      if (w < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.setAttribute('aria-label', words.join(' '));
  }

  $(function () {
    $('[data-split]').each(function () {
      splitText(this);
    });

    // Placeholder links (pages not built yet) must not jump to the top
    $(document).on('click', 'a[href="#"]', function (e) {
      e.preventDefault();
    });

    AOS.init({
      offset: 0,
      duration: 1200,
      delay: 200,
      easing: 'ease',
      once: true,
      disable: function () {
        return window.innerWidth <= 768;
      }
    });
  });
})(jQuery);

/* ===== shared/back-to-top ===== */
(function ($) {
  'use strict';
  $(function () {
    var $btn = $('.s-back-to-top');
    if (!$btn.length) return;

    function update() {
      $btn.toggleClass('is-active', window.scrollY > 10);
    }

    $(window).on('scroll', update);
    update();

    $btn.on('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
})(jQuery);

/* ===== shared/broll ===== */
(function ($) {
  'use strict';
  $(function () {
    var $bands = $('.s-broll');
    if (!$bands.length) return;

    // Scroll-scrubbed marquee (desktop ≥ 1201px): the track shifts by 9 items while the band
    // travels one band-width past the moment its centre reaches the bottom of the viewport.
    var ticking = false;
    function update() {
      ticking = false;
      $bands.each(function () {
        var $band = $(this);
        var $track = $band.find('.broll-track');
        if (window.innerWidth <= 1200) {
          $track.css('transform', '');
          return;
        }
        var rect = this.getBoundingClientRect();
        var start = rect.top + rect.height / 2 - window.innerHeight;
        var progress = Math.min(1, Math.max(0, -start / rect.width));
        var $items = $track.children();
        var distance = 0;
        $items.slice(0, Math.max(0, $items.length - 9)).each(function () {
          distance += this.offsetWidth;
        });
        var direction = $band.hasClass('is-third') ? 1 : -1;
        $track.css('transform', 'translate3d(' + direction * progress * distance + 'px, 0, 0)');
      });
    }
    $(window).on('scroll resize', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    });
    update();
  });
})(jQuery);

/* ===== shared/cate ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-cate');
    if (!$root.length) return;

    var $panel = $root.find('.cate');
    var $outBtn = $root.find('.cate-btn.out');
    var $openers = $('.cate-open');

    function setOpen(open) {
      $panel.toggleClass('is-open', open);
      $outBtn.toggleClass('is-hidden', open);
      $('.hd-icon-cate').toggleClass('is-active', open);
      $openers.attr('aria-expanded', open ? 'true' : 'false');
    }

    $openers.on('click', function (e) {
      e.stopPropagation();
      setOpen(!$panel.hasClass('is-open'));
    });

    $root.find('.cate-close').on('click', function () {
      setOpen(false);
    });

    $panel.on('click', 'a', function () {
      setOpen(false);
    });

    $(document).on('click', function (e) {
      if ($panel.hasClass('is-open') && !$(e.target).closest('.cate').length) setOpen(false);
    });

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-footer');
    if (!$root.length) return;

    // Store tabs
    var $tabs = $root.find('.ft-ct-nav-item');
    $tabs.on('click', function () {
      var $tab = $(this);
      $tabs.removeClass('is-active').attr('aria-selected', 'false');
      $tab.addClass('is-active').attr('aria-selected', 'true');
      $root.find('.ft-ct-panel').removeClass('is-active');
      $('#' + $tab.attr('aria-controls')).addClass('is-active');
    });

    // Call-back request form (no backend: confirm locally)
    $root.find('.ft-regi-form').on('submit', function (e) {
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $(this).find('.ft-regi-msg').prop('hidden', false);
      this.reset();
    });

    $root.find('.ft-year').text(new Date().getFullYear());
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    if (!$header.length) return;

    var $body = $('body');
    var $burger = $header.find('.hd-burger');
    var $mobile = $header.find('.mobile');
    var $overlay = $header.find('.mobile-overlay');

    function updateSticky() {
      var sticky = window.scrollY > 0;
      $header.toggleClass('is-sticky', sticky);
      $body.toggleClass('has-sticky-header', sticky);
    }

    $(window).on('scroll', updateSticky);
    updateSticky();

    function setMenu(open) {
      $burger.toggleClass('is-active', open).attr('aria-expanded', open ? 'true' : 'false');
      $mobile.toggleClass('is-open', open);
      $overlay.toggleClass('is-open', open);
      $body.toggleClass('no-scroll', open);
    }

    $burger.on('click', function () {
      setMenu(!$mobile.hasClass('is-open'));
    });

    $overlay.on('click', function () {
      setMenu(false);
    });

    $mobile.on('click', '.menu-link', function () {
      setMenu(false);
    });

    $header.find('.hd-icon-search').on('click', function () {
      var $search = $header.find('.re-search').toggleClass('is-open');
      if ($search.hasClass('is-open')) $search.find('.re-input').trigger('focus');
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length) return;
    $root.find('.banner-slider').bannerSlider();
  });
})(jQuery);

/* ===== home/03-deal ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-deal');
    if (!$root.length) return;

    // Product slider
    if (typeof Swiper !== 'undefined') {
      new Swiper($root.find('.pro-slider .swiper')[0], {
        slidesPerView: 'auto',
        spaceBetween: 0,
        speed: 1200,
        watchSlidesProgress: true,
        navigation: {
          prevEl: $root.find('.deal-prev')[0],
          nextEl: $root.find('.deal-next')[0]
        }
      });
    }

    // "Giá tốt mỗi ngày" countdown: time left until midnight
    var $numbers = $root.find('.cdw .number');
    function pad(n) {
      return n < 10 ? '0' + n : String(n);
    }
    function tick() {
      var now = new Date();
      var end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var left = Math.max(0, Math.floor((end - now) / 1000));
      var values = {
        day: Math.floor(left / 86400),
        hour: Math.floor(left % 86400 / 3600),
        minute: Math.floor(left % 3600 / 60),
        second: left % 60
      };
      $numbers.each(function () {
        this.textContent = pad(values[this.getAttribute('data-unit')]);
      });
    }
    tick();
    setInterval(tick, 1000);

    // Waves drift sideways with scroll (desktop only, like the target's ScrollTrigger)
    var $waveItems = $root.find('.wave-item');
    var ticking = false;
    function drift() {
      ticking = false;
      if (window.innerWidth <= 1200) {
        $waveItems.css('transform', '');
        return;
      }
      var width = $root.find('.wave').first().width();
      var offset = (window.scrollY * 0.3) % width;
      $waveItems.css('transform', 'translate3d(' + -offset + 'px, 0, 0)');
    }
    $(window).on('scroll resize', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(drift);
      }
    });
    drift();
  });
})(jQuery);

/* ===== danh-sach-san-pham/01-products ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-products');
    if (!$root.length) return;

    // Filter drawer (< 1200px)
    var $panel = $root.find('.side-fixed');
    var $overlay = $root.find('.side-overlay');
    var $opener = $root.find('.pros-side-open');

    function setDrawer(open) {
      $panel.toggleClass('is-open', open);
      $overlay.toggleClass('is-open', open);
      $opener.attr('aria-expanded', open ? 'true' : 'false');
      $('body').toggleClass('no-scroll', open);
    }

    $opener.on('click', function () {
      setDrawer(true);
    });
    $root.find('.side-close').add($overlay).on('click', function () {
      setDrawer(false);
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $panel.hasClass('is-open')) setDrawer(false);
    });

    // Keep the filter showing what was submitted (GET params)
    var params = new URLSearchParams(window.location.search);
    $root.find('.fil input').each(function () {
      var values = params.getAll(this.name);
      if (!values.length) return;
      if (this.type === 'checkbox') this.checked = values.indexOf(this.value) > -1;
      else this.value = values[0];
    });

    // Category view on the same page: ?product_cat=<slug> (category links) or exactly one ticked category.
    // WordPress renders this server-side on /danh-muc-san-pham/<slug>/ with the same archive template.
    var $catInputs = $root.find('.fil input[name="taxonomies[product_cat][]"]');
    var catSlug = params.get('product_cat');
    if (catSlug) $catInputs.filter(function () { return this.value === catSlug; }).prop('checked', true);
    var $checkedCats = $catInputs.filter(':checked');
    if ($checkedCats.length === 1) {
      var catName = $checkedCats.closest('.recheck-item').find('.recheck-text').text().trim();
      $root.find('.pros-title').text('Danh mục sản phẩm: ' + catName);
      $root.find('.pros-result .c-pri').text('“Tất cả sản phẩm thuộc ' + catName + '”');
      document.title = catName + ' – DLTheme Honey';

      // Breadcrumb: Trang chủ • Sản phẩm (link) • {category}
      var $bcList = $('.s-breadcrumb .bc-list');
      var $current = $bcList.find('.bc-item.is-current');
      $current.removeClass('is-current').find('.bc-link')
        .replaceWith('<a class="bc-link" href="danh-sach-san-pham.html">' + $current.text().trim() + '</a>');
      $('<li class="bc-item is-current"><span class="bc-link" aria-current="page"></span></li>')
        .find('.bc-link').text(catName).end()
        .appendTo($bcList);
    }

    // Dual price range
    var $range = $root.find('.range');
    var $min = $range.find('.range-min');
    var $max = $range.find('.range-max');
    var $progress = $range.find('.progress');
    var money = new Intl.NumberFormat('vi-VN');

    function updateRange(e) {
      var step = Number($min.attr('step')) || 1;
      var top = Number($max.attr('max'));
      var lo = Number($min.val());
      var hi = Number($max.val());
      if (hi - lo < step) {
        if (e && e.target === $min[0]) $min.val(lo = hi - step);
        else $max.val(hi = lo + step);
      }
      $progress.css({ left: (lo / top) * 100 + '%', right: 100 - (hi / top) * 100 + '%' });
      $range.find('.range-price-min').text(money.format(lo) + ' đ');
      $range.find('.range-price-max').text(money.format(hi) + ' đ');
    }
    $min.add($max).on('input', updateRange);
    updateRange();

    // Sorting: WordPress submits the woocommerce-ordering form; the static demo sorts in place
    var $list = $root.find('.pro-list');
    var original = $list.children().get();
    function priceOf(li) {
      var amount = $(li).find('.pro-price ins .amount, .pro-price > .amount').first().text();
      return Number(amount.replace(/\D/g, '')) || 0;
    }
    $root.find('.woocommerce-ordering').on('change', 'select', function () {
      var $form = $(this).closest('form');
      if (!$form.is('[data-demo-sort]')) {
        $form.trigger('submit');
        return;
      }
      var by = this.value;
      var items = original.slice();
      if (by === 'title') {
        items.sort(function (a, b) {
          return $(a).find('.pro-name').text().trim().localeCompare($(b).find('.pro-name').text().trim(), 'vi');
        });
      } else if (by === 'price' || by === 'price-desc') {
        items.sort(function (a, b) {
          return by === 'price' ? priceOf(a) - priceOf(b) : priceOf(b) - priceOf(a);
        });
      }
      $list.append(items);
    }).on('submit', function (e) {
      if ($(this).is('[data-demo-sort]')) e.preventDefault();
    });
  });
})(jQuery);

/* ===== chi-tiet-san-pham/01-product-summary ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-summary');
    if (!$root.length || typeof Swiper === 'undefined') return;

    // Gallery: vertical thumbs ≥ 611px (horizontal below), main slide linked to thumbs
    var $line = $root.find('.dt-slider-thumb-line');
    var count = $root.find('.dt-slider-main .swiper-slide').length;
    var thumbs = new Swiper($root.find('.dt-slider-thumb .swiper')[0], {
      direction: window.innerWidth < 611 ? 'horizontal' : 'vertical',
      slidesPerView: 'auto',
      spaceBetween: 12,
      speed: 1000,
      watchSlidesProgress: true
    });
    new Swiper($root.find('.dt-slider-main .swiper')[0], {
      slidesPerView: 1,
      speed: 1000,
      thumbs: { swiper: thumbs },
      on: {
        init: function (swiper) {
          $line.css('--h', ((swiper.activeIndex + 1) / count) * 100 + '%');
        },
        slideChange: function (swiper) {
          $line.css('--h', ((swiper.activeIndex + 1) / count) * 100 + '%');
        }
      }
    });
  });
})(jQuery);

/* ===== chi-tiet-san-pham/02-product-info ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-info');
    if (!$root.length) return;

    // Tabs: description / reviews
    var $tabs = $root.find('.dt-nav-item');
    $tabs.on('click', function () {
      var $tab = $(this);
      $tabs.removeClass('is-active').attr('aria-selected', 'false');
      $tab.addClass('is-active').attr('aria-selected', 'true');
      $root.find('.dt-tab-panel').prop('hidden', true);
      $('#' + $tab.attr('aria-controls')).prop('hidden', false);
    });

    // Review form: WordPress posts it to wp-comments-post.php; the static demo confirms locally
    $root.find('.comment-form').on('submit', function (e) {
      if (this.getAttribute('action') !== '#') return;
      e.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      $(this).find('.dt-form-msg').prop('hidden', false);
      this.reset();
    });
  });
})(jQuery);

/* ===== chi-tiet-san-pham/03-product-related ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-product-related');
    if (!$root.length || typeof Swiper === 'undefined') return;
    new Swiper($root.find('.pro-slider .swiper')[0], {
      slidesPerView: 'auto',
      speed: 1200,
      watchSlidesProgress: true,
      navigation: {
        prevEl: $root.find('.related-prev')[0],
        nextEl: $root.find('.related-next')[0]
      }
    });
  });
})(jQuery);

/* ===== gioi-thieu/01-about-intro ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-intro');
    if (!$root.length) return;

    // Count up the figures when AOS reveals their item (AOS is off ≤ 768px: the final numbers stay as written)
    var money = new Intl.NumberFormat('vi-VN');
    function countUp(el) {
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      var target = Number(el.getAttribute('data-count'));
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / 2000);
        el.textContent = money.format(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }
    document.addEventListener('aos:in', function (e) {
      if (e.detail && $root[0].contains(e.detail)) $(e.detail).find('[data-count]').each(function () { countUp(this); });
    });
  });
})(jQuery);

/* ===== gioi-thieu/03-about-media ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-media');
    if (!$root.length) return;
    if (typeof Swiper !== 'undefined') {
      new Swiper($root.find('.swiper')[0], {
        slidesPerView: 'auto',
        spaceBetween: 20,
        speed: 1200,
        watchSlidesProgress: true,
        breakpoints: { 0: { spaceBetween: 8 }, 501: { spaceBetween: 12 }, 1200: { spaceBetween: 20 } },
        navigation: { prevEl: $root.find('.media-prev')[0], nextEl: $root.find('.media-next')[0] }
      });
    }
    // Lightbox: Fancybox 4 (same library and version as the target)
    if (window.Fancybox) Fancybox.bind('[data-fancybox="about-media"]', { Thumbs: { autoStart: true } });
  });
})(jQuery);

/* ===== gioi-thieu/06-about-channel ===== */
(function ($) {
  'use strict';
  $(function () {
    var $frame = $('.s-about-channel .channel-dv-frame');
    if (!$frame.length) return;
    // imgPageScr scrolls the screenshot by (its height − the frame height)
    function setHeight() {
      $frame[0].style.setProperty('--height', $frame.outerHeight() + 'px');
    }
    setHeight();
    $(window).on('resize', setHeight);
  });
})(jQuery);

/* ===== gioi-thieu/07-about-customers ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-about-customers');
    if (!$root.length) return;
    if (typeof Swiper !== 'undefined') {
      new Swiper($root.find('.swiper')[0], {
        slidesPerView: 'auto',
        spaceBetween: 10,
        speed: 1200,
        watchSlidesProgress: true,
        navigation: { prevEl: $root.find('.cust-prev')[0], nextEl: $root.find('.cust-next')[0] }
      });
    }
    if (window.Fancybox) Fancybox.bind('[data-fancybox="about-customers"]', { Thumbs: { autoStart: false } });
  });
})(jQuery);

/* ===== chi-tiet-tin-tuc/01-post-detail ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-post-detail');
    if (!$root.length) return;
    // Social share links open in a small popup window (target used inline onclick handlers)
    $root.find('.post-share-link:not(.is-zalo)').on('click', function (e) {
      var popup = window.open(this.href, 'share', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=600');
      if (popup) e.preventDefault();
    });
  });
})(jQuery);
