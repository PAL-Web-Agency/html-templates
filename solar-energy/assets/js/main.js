/* ===== base ===== */
(function ($) {
  'use strict';
  $(function () {
    AOS.init({ duration: 1250, easing: 'ease', offset: 120, once: true });

    // Shared carousel factory: mirrors the source theme's Swiper setup
    // (loop, 1.2s slides, 5s autoplay paused on hover, "item-active" visible slides
    // and a highlighted "center" card among the visible ones).
    window.dsCarousel = function ($root, options) {
      var $container = $root.find('.swiper-container').first();
      if (!$container.length || typeof Swiper === 'undefined') {
        return null;
      }
      var items = options.items || {};
      var swiper = new Swiper($container[0], {
        loop: true,
        speed: 1200,
        spaceBetween: 30,
        autoplay: { delay: 5000, disableOnInteraction: false },
        watchSlidesVisibility: true,
        slideVisibleClass: 'item-active',
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: $root.find('.ds-carousel__nav--next')[0],
          prevEl: $root.find('.ds-carousel__nav--prev')[0]
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          560: { slidesPerView: items.xx || 1 },
          640: { slidesPerView: items.xs || 1 },
          768: { slidesPerView: items.sm || 2 },
          1024: { slidesPerView: items.md || 3 },
          1200: { slidesPerView: items.lg || 3 },
          1400: { slidesPerView: items.xl || 3 }
        },
        on: {
          progress: function () {
            if (!options.center) {
              return;
            }
            var $visible = $container.find('.swiper-slide.item-active');
            var start = $visible.length === 5 ? 1 : 0;
            $container.find('.swiper-slide').removeClass('is-center');
            if ($visible.length > 1) {
              $visible.eq(start + 1).addClass('is-center');
            }
          }
        }
      });
      $container.on('mouseenter', function () {
        swiper.autoplay.stop();
      }).on('mouseleave', function () {
        swiper.autoplay.start();
      });
      return swiper;
    };

    // Shared YouTube popup (Fancybox 3): 16:9, up to 1100px wide, shrinks to fit
    window.dsVideoPopup = function (id) {
      if (!id || !$.fancybox) {
        return;
      }
      $.fancybox.open({
        src: 'https://www.youtube.com/watch?v=' + id,
        opts: { width: 1100, height: 619 }
      }, {
        baseClass: 'ds-fancybox',
        infobar: false,
        hash: false,
        idleTime: false,
        animationEffect: 'fade',
        buttons: ['close'],
        lang: 'vi',
        i18n: { vi: { CLOSE: 'Đóng', ERROR: 'Không thể tải video.' } },
        youtube: { autoplay: 1, rel: 0 }
      });
    };

    // Shared image lightbox (Fancybox 3) for the expand links of a Swiper gallery.
    // Swiper's loop clones slides, so the items come from the original slides only.
    window.dsImageGallery = function ($root, linkSelector, swiper) {
      if (!$.fancybox) {
        return;
      }
      $root.on('click', linkSelector, function (event) {
        event.preventDefault();
        var src = $(this).attr('href');
        var items = $root.find('.swiper-slide:not(.swiper-slide-duplicate) ' + linkSelector).map(function () {
          return { src: $(this).attr('href'), type: 'image', opts: { caption: '' } };
        }).get();
        var index = 0;
        $.each(items, function (i, item) {
          if (item.src === src) {
            index = i;
            return false;
          }
        });

        $.fancybox.open(items, {
          baseClass: 'ds-fancybox',
          loop: true,
          infobar: false,
          hash: false,
          idleTime: false,
          animationEffect: 'fade',
          transitionEffect: 'slide',
          buttons: ['fullScreen', 'zoom', 'close'],
          lang: 'vi',
          i18n: {
            vi: {
              CLOSE: 'Đóng',
              NEXT: 'Ảnh tiếp theo',
              PREV: 'Ảnh trước',
              ERROR: 'Không thể tải ảnh.',
              FULL_SCREEN: 'Toàn màn hình',
              ZOOM: 'Phóng to'
            }
          },
          btnTpl: {
            arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><i class="fa-solid fa-chevron-left"></i></button>',
            arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><i class="fa-solid fa-chevron-right"></i></button>'
          },
          beforeShow: function () {
            if (swiper) {
              swiper.autoplay.stop();
            }
          },
          afterClose: function () {
            if (swiper) {
              swiper.autoplay.start();
            }
          }
        }, index);
      });
    };
  });
})(jQuery);

/* ===== shared/header ===== */
(function ($) {
  'use strict';
  $(function () {
    var $header = $('.s-header');
    if (!$header.length) {
      return;
    }

    // Sticky main bar once the page scrolls past the header
    var $win = $(window);
    function updateSticky() {
      var threshold = $header.find('.header-topbar').outerHeight() + $header.find('.header-main').outerHeight();
      $header.toggleClass('is-sticky', $win.scrollTop() > threshold);
    }
    updateSticky();
    $win.on('scroll resize', updateSticky);

    // Search dropdown
    var $search = $header.find('.header-search');
    $search.find('.header-search__toggle').on('click', function (e) {
      e.preventDefault();
      var open = !$search.hasClass('is-open');
      $search.toggleClass('is-open', open);
      $(this).attr('aria-expanded', open);
      if (open) {
        $search.find('.header-search__input').trigger('focus');
      }
    });
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.header-search').length) {
        $search.removeClass('is-open').find('.header-search__toggle').attr('aria-expanded', false);
      }
    });

    // Off-canvas mobile menu
    var $canvas = $header.find('.header-canvas');
    var $backdrop = $header.find('.header-backdrop');
    var $burger = $header.find('.header-burger');
    function setCanvas(open) {
      $canvas.toggleClass('is-open', open).attr('aria-hidden', !open);
      $backdrop.toggleClass('is-open', open);
      $burger.attr('aria-expanded', open);
      $('body').toggleClass('is-canvas-open', open);
    }
    $burger.on('click', function () {
      setCanvas(true);
    });
    $header.find('.header-canvas__close').add($backdrop).on('click', function () {
      setCanvas(false);
    });
    $canvas.find('.header-canvas__menu a').on('click', function () {
      setCanvas(false);
    });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape') {
        setCanvas(false);
      }
    });
  });
})(jQuery);

/* ===== home/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-hero');
    if (!$root.length || typeof Swiper === 'undefined') {
      return;
    }

    function setParallax(swiper) {
      $(swiper.slides).find('.hero-slide__image img').attr('data-swiper-parallax', swiper.width - 200);
    }

    function animateActive(swiper) {
      $(swiper.slides).removeClass('is-animating');
      var slide = swiper.slides[swiper.activeIndex];
      if (slide) {
        void slide.offsetWidth;
        $(slide).addClass('is-animating');
      }
    }

    var swiper = new Swiper($root.find('.hero-slider')[0], {
      loop: true,
      speed: 1200,
      spaceBetween: 0,
      slidesPerView: 1,
      grabCursor: true,
      parallax: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: {
        el: $root.find('.hero-pagination')[0],
        clickable: true
      },
      on: {
        init: function () {
          setParallax(this);
          animateActive(this);
        },
        resize: function () {
          setParallax(this);
          this.update();
        },
        slideChangeTransitionStart: function () {
          var self = this;
          setTimeout(function () {
            animateActive(self);
          }, 100);
        }
      }
    });

    $root.find('.hero-slider').on('mouseenter', function () {
      swiper.autoplay.stop();
    }).on('mouseleave', function () {
      swiper.autoplay.start();
    });
  });
})(jQuery);

/* ===== home/03-projects ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-projects');
    if (!$root.length) {
      return;
    }

    window.dsCarousel($root.find('.projects-carousel'), {
      center: true,
      items: { xx: 1, xs: 2, sm: 2, md: 4, lg: 4, xl: 4 }
    });

    // Count-up numbers (jQuery numerator equivalent), once when visible
    var $values = $root.find('.projects-counter__value');
    function formatNumber(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    function runCounter(el) {
      var $el = $(el);
      var target = parseInt($el.data('count'), 10);
      $({ value: 0 }).animate({ value: target }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
          $el.text(formatNumber(Math.ceil(now)));
        },
        complete: function () {
          $el.text(formatNumber(target));
        }
      });
    }
    if ('IntersectionObserver' in window) {
      $values.text('0');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      $values.each(function () {
        observer.observe(this);
      });
    }
  });
})(jQuery);

/* ===== home/04-solutions ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-solutions');
    if (!$root.length) {
      return;
    }

    // Progress bars fill to their percentage when they enter the viewport
    var $bars = $root.find('.solutions-progress__bar');
    function fill(el) {
      $(el).css('width', $(el).data('percent') + '%');
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      $bars.each(function () {
        observer.observe(this);
      });
    } else {
      $bars.each(function () {
        fill(this);
      });
    }
  });
})(jQuery);

/* ===== home/05-gallery ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-gallery');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.gallery-carousel'), {
      center: true,
      items: { xx: 1, xs: 2, sm: 3, md: 4, lg: 5, xl: 5 }
    });
  });
})(jQuery);

/* ===== shared/team ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-team');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.team-carousel'), {
      center: true,
      items: { xx: 1, xs: 2, sm: 3, md: 4, lg: 4, xl: 4 }
    });
  });
})(jQuery);

/* ===== shared/contact-form ===== */
(function ($) {
  'use strict';
  $(function () {
    var $form = $('.contact-form');
    if (!$form.length) {
      return;
    }
    // Static site: validate locally and confirm, no data is sent anywhere
    $form.on('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $form.find('[required]').each(function () {
        var ok = this.value.trim() !== '' && (this.type !== 'email' || /\S+@\S+\.\S+/.test(this.value));
        $(this).toggleClass('is-invalid', !ok);
        valid = valid && ok;
      });
      $form.find('.contact-form__message').text(valid ?
        'Cảm ơn bạn! DLTheme sẽ liên hệ lại trong vòng 24 giờ.' :
        'Vui lòng điền đầy đủ các trường bắt buộc (*).');
      if (valid) {
        this.reset();
      }
    });
  });
})(jQuery);

/* ===== shared/testimonials ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-testimonials');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.testimonials-carousel'), {
      items: { xx: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }
    });
  });
})(jQuery);

/* ===== home/11-news ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-news');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.news-carousel'), {
      items: { xx: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }
    });
  });
})(jQuery);

/* ===== shared/partners ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-partners');
    if (!$root.length || typeof Swiper === 'undefined') {
      return;
    }
    var swiper = new Swiper($root.find('.partners-carousel')[0], {
      loop: true,
      speed: 1200,
      slidesPerView: 2,
      autoplay: { delay: 5000, disableOnInteraction: true },
      breakpoints: {
        768: { slidesPerView: 4 },
        1025: { slidesPerView: 5 }
      }
    });
    $root.find('.partners-carousel').on('mouseenter', function () {
      swiper.autoplay.stop();
    }).on('mouseleave', function () {
      swiper.autoplay.start();
    });
  });
})(jQuery);

/* ===== about/03-video ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-video');
    if (!$root.length) {
      return;
    }

    $root.find('.video-block__play').on('click', function () {
      window.dsVideoPopup($(this).data('video'));
    });
  });
})(jQuery);

/* ===== dich-vu/02-intro ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-services-intro');
    if (!$root.length) {
      return;
    }

    var $bars = $root.find('.services-intro__bar');
    function fill(el) {
      var $el = $(el);
      $el.css('width', $el.data('percent') + '%');
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      $bars.each(function () {
        observer.observe(this);
      });
    } else {
      $bars.each(function () {
        fill(this);
      });
    }
  });
})(jQuery);

/* ===== case-he-thong-dien-mat-troi-hoa-luoi/02-gallery ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-case-gallery');
    if (!$root.length) {
      return;
    }

    if (typeof Swiper !== 'undefined') {
      var swiper = new Swiper($root.find('.case-gallery__swiper')[0], {
        loop: true,
        speed: 1200,
        spaceBetween: 30,
        autoplay: { delay: 5000, disableOnInteraction: false },
        navigation: {
          nextEl: $root.find('.ds-carousel__nav--next')[0],
          prevEl: $root.find('.ds-carousel__nav--prev')[0]
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 }
        }
      });
      $root.find('.case-gallery__swiper').on('mouseenter', function () {
        swiper.autoplay.stop();
      }).on('mouseleave', function () {
        if (!($.fancybox && $.fancybox.getInstance())) {
          swiper.autoplay.start();
        }
      });
    }

    window.dsImageGallery($root, '.case-gallery-card__expand', swiper);
  });
})(jQuery);

/* ===== case-he-thong-dien-mat-troi-hoa-luoi/05-benefits ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-case-benefits');
    if (!$root.length) {
      return;
    }

    $root.find('.case-benefits__play').on('click', function () {
      window.dsVideoPopup($(this).data('video'));
    });

    var $bars = $root.find('.case-benefits__bar');
    function fill(el) {
      $(el).css('width', $(el).data('percent') + '%');
    }
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fill(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      $bars.each(function () {
        observer.observe(this);
      });
    } else {
      $bars.each(function () {
        fill(this);
      });
    }
  });
})(jQuery);

/* ===== services/02-projects ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-services-projects');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.services-projects__carousel'), {
      center: true,
      items: { xx: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }
    });
  });
})(jQuery);

/* ===== du-an-tp-ta/03-main ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-service-detail');
    if (!$root.length) {
      return;
    }

    var $swiper = $root.find('.service-detail__gallery-swiper');
    if ($swiper.length && typeof Swiper !== 'undefined') {
      var swiper = new Swiper($swiper[0], {
        loop: true,
        speed: 1200,
        spaceBetween: 30,
        autoplay: { delay: 5000, disableOnInteraction: false },
        navigation: {
          nextEl: $root.find('.detail-gallery__nav--next')[0],
          prevEl: $root.find('.detail-gallery__nav--prev')[0]
        }
      });
      $swiper.on('mouseenter', function () {
        swiper.autoplay.stop();
      }).on('mouseleave', function () {
        if (!($.fancybox && $.fancybox.getInstance())) {
          swiper.autoplay.start();
        }
      });
    }

    window.dsImageGallery($root, '.detail-gallery-card__expand', swiper);
  });
})(jQuery);

/* ===== du-an-tp-ta/04-iconbox ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-service-iconbox');
    if (!$root.length) {
      return;
    }
    window.dsCarousel($root.find('.service-iconbox__carousel'), {
      center: true,
      items: { xx: 1, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }
    });
  });
})(jQuery);

/* ===== du-an-tp-ta/05-values ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-service-values');
    if (!$root.length) {
      return;
    }

    $root.find('.service-values__ring').each(function () {
      this.style.setProperty('--service-value', $(this).data('value'));
    });

    $root.find('.service-values__acc-toggle').on('click', function () {
      var isOpen = $(this).hasClass('is-open');
      $root.find('.service-values__acc-toggle').removeClass('is-open').attr('aria-expanded', false);
      $root.find('.service-values__acc-body').stop(true, true).slideUp(300);
      if (!isOpen) {
        $(this).addClass('is-open').attr('aria-expanded', true);
        $(this).next('.service-values__acc-body').stop(true, true).slideDown(300);
      }
    });

    $root.find('.service-values__acc-toggle').first().trigger('click');
  });
})(jQuery);

/* ===== contact/01-hero ===== */
(function ($) {
  'use strict';
  $(function () {
    var $root = $('.s-contact-hero');
    if (!$root.length || typeof Swiper === 'undefined') {
      return;
    }
    var $slider = $root.find('.contact-hero__slider');
    if (!$slider.length) {
      return;
    }
    new Swiper($slider[0], {
      loop: true,
      effect: 'fade',
      speed: 500,
      slidesPerView: 1,
      autoplay: { delay: 5000, disableOnInteraction: true }
    });
  });
})(jQuery);
