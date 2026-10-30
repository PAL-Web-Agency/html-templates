/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 800, easing: 'ease-out', offset: 20, once: false });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    var $menu = $('.s-header-menu');
    var $toggle = $header.find('.menu-toggle');
    if (!$header.length) return;

    function updateShadow() {
      $header.toggleClass('is-scrolled', window.scrollY > 50);
    }

    function setMenu(open) {
      $menu.toggleClass('is-open', open);
      $toggle.attr('aria-expanded', open ? 'true' : 'false');
    }

    $(window).on('scroll', updateShadow);
    updateShadow();

    $toggle.on('click', function () { setMenu(true); });
    $menu.on('click', '.menu-close, .menu-link, .menu-reserve-btn', function () { setMenu(false); });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    $('.s-hero').each(function () {
      var $hero = $(this);
      var $slides = $hero.find('[data-slide-index]');
      var $contents = $hero.find('[data-content-index]');
      var $dots = $hero.find('[data-dot-index]');
      var total = $slides.length;
      var interval = parseInt($hero.data('interval'), 10) || 6000;
      var autoplay = String($hero.data('autoplay')) !== 'false';
      var current = 0;
      var timer = null;
      var touchStartX = 0;
      if (total <= 1) return;

      function goTo(index) {
        current = index;
        $slides.removeClass('is-active').eq(current).addClass('is-active');
        $contents.removeClass('is-active').eq(current).addClass('is-active');
        $dots.removeClass('is-active').eq(current).addClass('is-active');
      }

      function start() {
        if (autoplay && !timer) {
          timer = setInterval(function () { goTo((current + 1) % total); }, interval);
        }
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      $dots.on('click', function () {
        var index = parseInt($(this).data('dot-index'), 10) || 0;
        if (index === current) return;
        stop();
        goTo(index);
        start();
      });

      this.addEventListener('touchstart', function (event) {
        touchStartX = event.touches[0].clientX;
        stop();
      }, { passive: true });

      this.addEventListener('touchend', function (event) {
        var delta = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) goTo(delta < 0 ? (current + 1) % total : (current - 1 + total) % total);
        start();
      }, { passive: true });

      start();
    });
  });
})(jQuery);

/* ===== carte/02-tabs ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-carte-tabs');
    var $menu = $('.s-carte-menu');
    if (!$root.length || !$menu.length) return;

    var $tabs = $root.find('.tab');
    var $panels = $menu.find('.panel');
    var $indicator = $root.find('.indicator');
    var $filter = $root.find('.veggie-filter');
    var current = 0;
    var busy = false;
    var resizeTimer = null;

    // Stagger index of each dish inside its own grid / list
    $menu.find('.cards, .list').each(function () {
      $(this).children('.dish-wrap').each(function (index) {
        this.style.setProperty('--i', index);
      });
    });

    function moveIndicator(tab) {
      $indicator.css({ width: tab.offsetWidth + 'px', transform: 'translateX(' + tab.offsetLeft + 'px)' });
    }

    function playEntrance($panel) {
      var $dishes = $panel.find('.dish-wrap');
      $dishes.removeClass('is-in');
      void $panel[0].offsetWidth;
      requestAnimationFrame(function () {
        $dishes.addClass('is-in');
      });
    }

    function show(index) {
      if (index === current || busy) return;
      busy = true;
      var tab = $tabs.get(index);
      var $old = $panels.eq(current);

      $tabs.removeClass('is-active');
      $(tab).addClass('is-active');
      moveIndicator(tab);
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      $old.addClass('is-leaving');
      setTimeout(function () {
        var $next = $panels.filter('[data-panel="' + $(tab).data('panel') + '"]');
        $old.removeClass('is-active is-leaving');
        $next.addClass('is-active');
        playEntrance($next);
        current = index;
        busy = false;
        AOS.refresh();
      }, 200);
    }

    moveIndicator($tabs.get(0));
    playEntrance($panels.eq(0));

    // Tab widths change once the web fonts arrive
    $(window).on('load', function () {
      moveIndicator($tabs.get(current));
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        moveIndicator($tabs.get(current));
      });
    }

    $tabs.on('click', function () {
      show($tabs.index(this));
    });

    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        moveIndicator($tabs.get(current));
      }, 100);
    });

    $filter.on('click', function () {
      var active = !$filter.hasClass('is-active');
      $filter.toggleClass('is-active', active).attr('aria-pressed', String(active));
      $menu.toggleClass('is-veggie-only', active);
      AOS.refresh();
    });

    // carte.html#drinks (or any part of a panel title) opens that tab
    if (window.location.hash) {
      var wanted = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
      $panels.each(function (index) {
        var title = $(this).find('.panel-title').text().toLowerCase();
        if (index !== 0 && wanted && title.indexOf(wanted) !== -1) {
          setTimeout(function () { show(index); }, 100);
          return false;
        }
      });
    }
  });
})(jQuery);

/* ===== carte/05-dish-modal ===== */
(function ($) {
  'use strict';
  $(function () {
    var $modal = $('.s-carte-dish-modal');
    if (!$modal.length) return;

    var $img = $modal.find('.dish-media-img');
    var $name = $modal.find('.name');
    var $price = $modal.find('.price');
    var $desc = $modal.find('.desc');
    var $tags = $modal.find('.tags');
    var hideTimer = null;

    function open(dish) {
      var data = dish.dataset;
      clearTimeout(hideTimer);
      $name.text(data.name || '');
      $price.text(data.price || '');
      $desc.text(data.desc || '');
      $tags.text(data.tags || '');
      $modal
        .toggleClass('is-featured', data.featured === '1')
        .toggleClass('is-veggie', data.veggie === '1')
        .toggleClass('has-no-image', !data.img);
      if (data.img) $img.attr({ src: data.img, alt: data.name || '' });

      $modal.addClass('is-open').attr('aria-hidden', 'false');
      $('body').addClass('is-dish-open');
      requestAnimationFrame(function () {
        $modal.addClass('is-visible');
      });
    }

    function close() {
      $modal.removeClass('is-visible');
      hideTimer = setTimeout(function () {
        $modal.removeClass('is-open').attr('aria-hidden', 'true');
        $('body').removeClass('is-dish-open');
      }, 300);
    }

    $('.s-carte-menu').on('click', '[data-dish]', function () {
      open(this);
    });

    $modal.on('click', '.close-btn, .backdrop', close);

    $(document).on('keydown', function (event) {
      if (event.key === 'Escape' && $modal.hasClass('is-open')) close();
    });
  });
})(jQuery);

/* ===== evenements/04-request ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-events-request');
    if (!$root.length) return;

    var $form = $root.find('.request');
    var $button = $root.find('.submit-btn');
    var $error = $root.find('.request-error');
    var $success = $root.find('.success');
    var ERROR_TEXT = 'An error occurred. Please try again or call us on 07 61 30 47 10.';

    function setLoading(loading) {
      $button.prop('disabled', loading).toggleClass('is-loading', loading);
    }

    function showSuccess() {
      $root.addClass('is-sent');
      setTimeout(function () {
        $root.addClass('is-done');
        requestAnimationFrame(function () {
          $success.addClass('is-visible');
        });
        AOS.refresh();
      }, 400);
    }

    function showError() {
      $error.text(ERROR_TEXT).addClass('is-visible');
      setLoading(false);
    }

    $form.on('submit', function (event) {
      event.preventDefault();
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      var data = {};
      $.each($form.serializeArray(), function (index, field) {
        data[field.name] = field.value;
      });
      // Set data-endpoint on the form to post the request to a real backend.
      // Left empty, the form only plays the success state (static demo).
      var endpoint = $form.data('endpoint');

      $error.removeClass('is-visible');
      setLoading(true);

      if (!endpoint) {
        setTimeout(showSuccess, 800);
        return;
      }

      $.ajax({
        url: endpoint,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ data: data })
      }).done(showSuccess).fail(showError);
    });
  });
})(jQuery);
