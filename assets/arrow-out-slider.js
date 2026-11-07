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
    if (typeof Swiper === 'undefined') {
      setTimeout(function () { initSwiper(container); }, 50);
      return;
    }

    const uniqueId = container.getAttribute('data-id');
    const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
    const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
    const autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 3000;
    const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
    const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';
    const centeredEnabled = container.getAttribute('data-centered-enabled') === 'true';

    const swiperContainer = document.getElementById(`new-swiper-${uniqueId}`) || container;
    if (!swiperContainer) return;

    if (container.swiper && !container.swiper.destroyed) {
      container.swiper.destroy(true, true);
    }

    const sliderOuter = container.closest('.slider-outer');
    const paginationEl =
      (sliderOuter && sliderOuter.querySelector('.swiper-pagination')) ||
      container.querySelector('.swiper-pagination');

    const mobileSpv = parseFloat(container.getAttribute('data-slides-per-view-mobile')) || 2.2;
    const mobileGap = parseInt(container.getAttribute('data-space-between-mobile'), 10) || 12;

    const medTabletSpv =
      parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) ||
      parseFloat(container.getAttribute('data-slides-per-view-tablet')) ||
      2.5;
    const medTabletGap =
      parseInt(container.getAttribute('data-space-between-medium-tablet'), 10) ||
      parseInt(container.getAttribute('data-space-between-mobile'), 10) ||
      12;

    const tabletSpv =
      parseFloat(container.getAttribute('data-slides-per-view-tablet')) ||
      parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) ||
      3;
    const tabletGap =
      parseInt(container.getAttribute('data-space-between-tablet'), 10) ||
      parseInt(container.getAttribute('data-space-between-desktop'), 10) ||
      16;

    const laptopSpv =
      parseFloat(container.getAttribute('data-slides-per-view-laptop')) ||
      parseFloat(container.getAttribute('data-slides-per-view-desktop')) ||
      4;
    const laptopGap =
      parseInt(container.getAttribute('data-space-between-laptop'), 10) ||
      parseInt(container.getAttribute('data-space-between-desktop'), 10) ||
      16;

    const desktopSpv = parseFloat(container.getAttribute('data-slides-per-view-desktop')) || 5;
    const desktopGap = parseInt(container.getAttribute('data-space-between-desktop'), 10) || 16;

    const slideElements = swiperContainer.querySelectorAll('.swiper-slide');
    const slidesCount = slideElements.length;
    const maxSpv = Math.max(mobileSpv, medTabletSpv, tabletSpv, laptopSpv, desktopSpv);
    const shouldLoop = loopEnabled && slidesCount > 1 && slidesCount >= Math.ceil(maxSpv) * 2;

    const nextBtn =
      (sliderOuter && sliderOuter.querySelector(`.swiper-button-nexts[data-swiper-id="${uniqueId}"]`)) ||
      document.querySelector(`.swiper-button-nexts[data-swiper-id="${uniqueId}"]`);
    const prevBtn =
      (sliderOuter && sliderOuter.querySelector(`.swiper-button-previ[data-swiper-id="${uniqueId}"]`)) ||
      document.querySelector(`.swiper-button-previ[data-swiper-id="${uniqueId}"]`);

    container.swiper = new Swiper(swiperContainer, {
      slidesPerView: mobileSpv,
      spaceBetween: mobileGap,
      centeredSlides: centeredEnabled,
      centeredSlidesBounds: centeredEnabled,
      loop: shouldLoop,
      initialSlide: 0,
      roundLengths: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      grabCursor: true,
      autoplay: autoplayEnabled
        ? {
            delay: autoplayDelay,
            disableOnInteraction: false,
            waitForTransition: true,
          }
        : false,
      navigation: arrowsEnabled && nextBtn && prevBtn
        ? {
            nextEl: nextBtn,
            prevEl: prevBtn,
          }
        : false,
      pagination: dotsEnabled && paginationEl
        ? {
            el: paginationEl,
            clickable: true,
          }
        : false,
      breakpoints: {
        0: {
          slidesPerView: mobileSpv,
          spaceBetween: mobileGap,
          centeredSlides: centeredEnabled,
        },
        600: {
          slidesPerView: medTabletSpv,
          spaceBetween: medTabletGap,
          centeredSlides: centeredEnabled,
        },
        768: {
          slidesPerView: tabletSpv,
          spaceBetween: tabletGap,
          centeredSlides: centeredEnabled,
        },
        1025: {
          slidesPerView: laptopSpv,
          spaceBetween: laptopGap,
          centeredSlides: centeredEnabled,
        },
        1440: {
          slidesPerView: desktopSpv,
          spaceBetween: desktopGap,
          centeredSlides: centeredEnabled,
        },
      },
    });

    if (container.swiper && typeof container.swiper.update === 'function') {
      container.swiper.update();
    }
  }

  function checkScreenSizeAndInitSwipers() {
    if (typeof Swiper === 'undefined') {
      setTimeout(checkScreenSizeAndInitSwipers, 50);
      return;
    }

    const width = window.innerWidth;
    const isDesktop = width >= 1025;
    const isTablet = width <= 1024 && width >= 768;
    const isMobile = width < 768;

    document.querySelectorAll('.new-swiper-container').forEach(container => {
      const desktopSlider = container.getAttribute('data-desktop-slider') === 'true';
      const tabletSlider =
        container.getAttribute('data-tablet-slider') === 'true' ||
        container.getAttribute('data-mobile-slider') === 'true';
      const mobileSlider = container.getAttribute('data-mobile-slider') === 'true';

      const isSliderEnabled =
        (isDesktop && desktopSlider) ||
        (isTablet && tabletSlider) ||
        (isMobile && mobileSlider);

      if (!isSliderEnabled) {
        if (container.swiper && !container.swiper.destroyed) {
          container.swiper.destroy(true, true);
          delete container.swiper;
        }
        return;
      }

      // If already initialized and not destroyed, update dimensions
      if (container.swiper && !container.swiper.destroyed) {
        container.swiper.update();
        return;
      }

      initSwiper(container);
    });
  }

  const debouncedResize = debounce(checkScreenSizeAndInitSwipers, 200);

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
})();
