/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      offset: 80,
      once: true,
      disable: function () {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
    });
  });
})(jQuery);

/* ===== shared/footer ===== */
(function ($) {
  'use strict';
  $(function () {
    var $btn = $('.s-footer__totop');
    if (!$btn.length) return;

    var $win = $(window);
    function update() {
      $btn.toggleClass('is-visible', $win.scrollTop() > 600);
    }

    $win.on('scroll', update);
    update();

    $btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    if (!$header.length) return;

    var $win = $(window);
    var $menu = $header.find('.navbar-collapse');

    function update() {
      $header.toggleClass('is-scrolled', $win.scrollTop() > 40);
    }

    $win.on('scroll', update);
    update();

    $menu.on('show.bs.collapse', function () {
      $header.addClass('is-open');
    });

    $menu.on('hidden.bs.collapse', function () {
      $header.removeClass('is-open');
    });

    // On desktop the dropdown opens on hover, so a click on its toggle follows the link
    $header.on('click', '.dropdown-toggle', function (event) {
      if (window.matchMedia('(min-width: 992px)').matches) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = $(this).attr('href');
      }
    });

    // Close the mobile menu after picking a link that may stay on this page
    $menu.on('click', 'a[href*="#"]:not(.dropdown-toggle), .dropdown-item', function () {
      if ($menu.hasClass('show')) {
        $menu.collapse('hide');
      }
    });
  });
})(jQuery);

/* ===== home/08-booking ===== */
(function ($) {
  'use strict';
  $(function () {
    var $form = $('.s-booking__form');
    if (!$form.length) return;

    var $note = $form.find('.s-booking__note');
    var $date = $form.find('input[type="date"]');

    // Earliest bookable day is today
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    $date.attr('min', now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()));

    $form.on('input change', '.is-invalid', function () {
      $(this).removeClass('is-invalid');
    });

    $form.on('submit', function (event) {
      event.preventDefault();

      var $invalid = $form.find('[required]').filter(function () {
        return !$.trim($(this).val());
      });

      $form.find('[required]').removeClass('is-invalid');

      if ($invalid.length) {
        $invalid.addClass('is-invalid');
        $invalid.first().trigger('focus');
        $note.addClass('is-error').text('Vui lòng điền đầy đủ thông tin để đặt lịch.');
        return;
      }

      var name = $.trim($form.find('[name="name"]').val());
      $note.removeClass('is-error').text('Cảm ơn ' + name + '! DLTheme Barber sẽ gọi xác nhận lịch hẹn trong ít phút.');
      $form[0].reset();
    });
  });
})(jQuery);

/* ===== home/10-faq ===== */
(function ($) {
  'use strict';
  $(function () {
    var $faq = $('.s-faq');
    if (!$faq.length) return;

    $faq.find('.collapse.show').closest('.s-faq__item').addClass('is-open');

    $faq.on('show.bs.collapse', '.collapse', function () {
      $(this).closest('.s-faq__item').addClass('is-open');
    });

    $faq.on('hide.bs.collapse', '.collapse', function () {
      $(this).closest('.s-faq__item').removeClass('is-open');
    });
  });
})(jQuery);

/* ===== chi-tiet-dich-vu/05-service-booking ===== */
(function ($) {
  'use strict';
  $(function () {
    var $form = $('.s-service-booking__form');
    if (!$form.length) return;

    var $note = $form.find('.s-service-booking__note');
    var $slots = $form.find('.s-service-booking__slots');
    var $slotBtns = $form.find('.s-service-booking__slot');
    var $slotInput = $form.find('[name="slot"]');
    var $date = $form.find('input[type="date"]');

    // Earliest bookable day is today
    var now = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    $date.attr('min', now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()));

    $slotBtns.attr({ role: 'radio', 'aria-checked': 'false' });

    $slotBtns.on('click', function () {
      $slotBtns.removeClass('is-active').attr('aria-checked', 'false');
      $(this).addClass('is-active').attr('aria-checked', 'true');
      $slotInput.val($(this).data('slot'));
      $slots.removeClass('is-invalid');
    });

    $form.on('input change', '.is-invalid', function () {
      $(this).removeClass('is-invalid');
    });

    $form.on('submit', function (event) {
      event.preventDefault();

      var $required = $form.find('[required]');
      var $invalid = $required.filter(function () {
        return !$.trim($(this).val());
      });

      $required.removeClass('is-invalid');
      $slots.toggleClass('is-invalid', !$slotInput.val());

      if ($invalid.length) {
        $invalid.not($slotInput).addClass('is-invalid');
        var $first = $invalid.first();
        ($first.is($slotInput) ? $slotBtns.first() : $first).trigger('focus');
        $note.addClass('is-error').text('Vui lòng điền đầy đủ thông tin và chọn khung giờ.');
        return;
      }

      var name = $.trim($form.find('[name="name"]').val());
      $note.removeClass('is-error').text('Cảm ơn ' + name + '! DLTheme Barber sẽ gọi xác nhận lịch hẹn ' + $slotInput.val().toLowerCase() + ' ngày ' + $date.val().split('-').reverse().join('/') + '.');
      $form[0].reset();
      $slotBtns.removeClass('is-active').attr('aria-checked', 'false');
      $slotInput.val('');
    });
  });
})(jQuery);

/* ===== tin-tuc/01-posts ===== */
(function ($) {
  'use strict';
  $(function () {
    var $posts = $('.s-posts');
    if (!$posts.length) return;

    var $chips = $posts.find('.s-posts__chip');
    var $cols = $posts.find('.s-posts__col');
    var $empty = $posts.find('.s-posts__empty');

    $chips.on('click', function () {
      var filter = $(this).data('filter');

      $chips.removeClass('is-active').attr('aria-pressed', 'false');
      $(this).addClass('is-active').attr('aria-pressed', 'true');

      $cols.each(function () {
        var match = filter === 'all' || $(this).data('cat') === filter;
        $(this).toggleClass('is-hidden', !match);
      });

      $empty.text($cols.not('.is-hidden').length ? '' : 'Chưa có bài viết nào trong chủ đề này.');

      if (window.AOS) {
        AOS.refresh();
      }
    });

    $chips.filter('.is-active').attr('aria-pressed', 'true');
    $chips.not('.is-active').attr('aria-pressed', 'false');
  });
})(jQuery);

/* ===== chi-tiet-tin-tuc/01-article ===== */
(function ($) {
  'use strict';
  $(function () {
    var $article = $('.s-article');
    if (!$article.length) return;

    var $copy = $article.find('.s-article__copy');
    var timer;

    $copy.on('click', function () {
      var url = window.location.href;
      var done = function () {
        $copy.addClass('is-copied').attr('aria-label', 'Đã sao chép liên kết');
        clearTimeout(timer);
        timer = setTimeout(function () {
          $copy.removeClass('is-copied').attr('aria-label', 'Sao chép liên kết');
        }, 2000);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(done, function () {});
      } else {
        var $tmp = $('<textarea>').val(url).addClass('sr-only').appendTo('body');
        $tmp[0].select();
        try {
          document.execCommand('copy');
          done();
        } catch (e) {
          // copying is not available; nothing else to do
        }
        $tmp.remove();
      }
    });
  });
})(jQuery);

/* ===== lien-he/02-contact-form ===== */
(function ($) {
  'use strict';
  $(function () {
    var $form = $('.s-contact-form__form');
    if (!$form.length) return;

    var $note = $form.find('.s-contact-form__note');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function isEmpty($field) {
      if ($field.is(':checkbox')) return !$field.is(':checked');
      return !$.trim($field.val());
    }

    $form.on('input change', '.is-invalid', function () {
      $(this).removeClass('is-invalid');
    });

    $form.on('submit', function (event) {
      event.preventDefault();

      var $required = $form.find('[required]');
      var $invalid = $required.filter(function () {
        return isEmpty($(this));
      });

      var $email = $form.find('[name="email"]');
      if (!isEmpty($email) && !emailRe.test($.trim($email.val()))) {
        $invalid = $invalid.add($email);
      }

      $required.removeClass('is-invalid');

      if ($invalid.length) {
        $invalid.addClass('is-invalid');
        $invalid.first().trigger('focus');
        $note.addClass('is-error').text('Vui lòng điền đầy đủ, đúng thông tin và đồng ý với điều khoản.');
        return;
      }

      var name = $.trim($form.find('[name="name"]').val());
      $note.removeClass('is-error').text('Cảm ơn ' + name + '! Lời nhắn đã được gửi, DLTheme Barber sẽ phản hồi bạn sớm nhất.');
      $form[0].reset();
    });
  });
})(jQuery);
