(function () {
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () { func.apply(context, args); }, wait);
    };
  }

  function initSwiper(container) {
    const uniqueId = container.getAttribute('data-id');
    const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
    const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
    const autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 3000;
    const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
    const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';
    const centeredEnabled = container.getAttribute('data-centered-enabled') === 'true';

    const swiperContainer = document.getElementById(`new-swiper-${uniqueId}`);
    if (!swiperContainer) return;

    if (container.swiper && !container.swiper.destroyed) {
      container.swiper.destroy(true, true);
    }

    container.swiper = new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      centeredSlides: centeredEnabled,
      centeredSlidesBounds: centeredEnabled,
      spaceBetween: 0,
      loop: loopEnabled,
      initialSlide: 0,
      roundLengths: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      autoplay: autoplayEnabled ? {
        delay: autoplayDelay,
        disableOnInteraction: false,
        waitForTransition: true,
      } : false,
      navigation: arrowsEnabled ? {
        nextEl: `.swiper-button-nexts[data-swiper-id="${uniqueId}"]`,
        prevEl: `.swiper-button-previ[data-swiper-id="${uniqueId}"]`,
      } : false,
      pagination: dotsEnabled ? {
        el: `#new-swiper-${uniqueId} .swiper-pagination`,
        clickable: true,
      } : false,
      breakpoints: {
        0:    { slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-mobile'))        || 1, spaceBetween: parseInt(container.getAttribute('data-space-between-mobile'),        10) || 0, centeredSlides: centeredEnabled },
        680:  { slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) || 1, spaceBetween: parseInt(container.getAttribute('data-space-between-medium-tablet'), 10) || 0, centeredSlides: centeredEnabled },
        880:  { slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-tablet'))        || 1, spaceBetween: parseInt(container.getAttribute('data-space-between-tablet'),        10) || 0, centeredSlides: centeredEnabled },
        1280: { slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-laptop'))        || 1, spaceBetween: parseInt(container.getAttribute('data-space-between-laptop'),        10) || 0, centeredSlides: centeredEnabled },
        1680: { slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-desktop'))       || 1, spaceBetween: parseInt(container.getAttribute('data-space-between-desktop'),       10) || 0, centeredSlides: centeredEnabled },
      },
    });
  }

  function checkScreenSizeAndInitSwipers() {
    const width = window.innerWidth;
    const islaptop = width >= 1025;
    const isTablet = width <= 1024;

    document.querySelectorAll('.new-swiper-container').forEach(container => {
      const isSliderEnabled =
        (islaptop && container.getAttribute('data-desktop-slider') === 'true') ||
        (isTablet && container.getAttribute('data-tablet-slider') === 'true') ||
        (isTablet && container.getAttribute('data-mobile-slider') === 'true');

      if (!isSliderEnabled) return;

      // Skip if already properly initialized
      if (container.swiper && !container.swiper.destroyed) return;

      initSwiper(container);
    });
  }

  const debouncedResize = debounce(checkScreenSizeAndInitSwipers, 300);

  window.addEventListener('resize', debouncedResize);

  // On section load, wait for Horizon to finish rendering then init
  document.addEventListener('shopify:section:load', function () {
    setTimeout(checkScreenSizeAndInitSwipers, 200);
  });

  document.addEventListener('shopify:section:select', debouncedResize);
  document.addEventListener('shopify:section:deselect', debouncedResize);
  document.addEventListener('shopify:section:reorder', debouncedResize);

  // Delay initial call to let Horizon finish its own deferred rendering
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(checkScreenSizeAndInitSwipers, 150);
    });
  } else {
    setTimeout(checkScreenSizeAndInitSwipers, 150);
  }

  // Instant click delegation so buttons NEVER get stuck if clicked immediately on visit/refresh
  document.addEventListener('click', function (e) {
    const nextBtn = e.target.closest('.swiper-button-nexts');
    const prevBtn = e.target.closest('.swiper-button-previ');
    if (nextBtn) {
      const id = nextBtn.getAttribute('data-swiper-id');
      const container = document.querySelector(`.new-swiper-container[data-id="${id}"]`);
      if (container) {
        if (!container.swiper || container.swiper.destroyed) {
          initSwiper(container);
        }
        if (container.swiper) {
          container.swiper.slideNext();
        }
      }
    } else if (prevBtn) {
      const id = prevBtn.getAttribute('data-swiper-id');
      const container = document.querySelector(`.new-swiper-container[data-id="${id}"]`);
      if (container) {
        if (!container.swiper || container.swiper.destroyed) {
          initSwiper(container);
        }
        if (container.swiper) {
          container.swiper.slidePrev();
        }
      }
    }
  });
})();
