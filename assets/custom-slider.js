(function () {
  function debounce(func, wait) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    };
  }

  function updateSlideCounter(swiper, container) {
    if (!swiper || !container) return;
    const currentElem = container.querySelector('.slideshow-counter-current');
    if (currentElem) {
      const realIndex = typeof swiper.realIndex !== 'undefined' ? swiper.realIndex : (swiper.activeIndex || 0);
      currentElem.textContent = realIndex + 1;
    }
  }

  // Function to check screen size and initialize the slider accordingly
  function checkScreenSizeAndInitSwipers() {
    if (typeof Swiper === 'undefined') {
      setTimeout(checkScreenSizeAndInitSwipers, 50);
      return;
    }

    const width = window.innerWidth;
    const isDesktop = width >= 992;
    const islaptop = width >= 768;
    const isTablet = width < 768;

    document.querySelectorAll('.swiper-container').forEach(container => {
      const uniqueId = container.getAttribute('data-id');
      const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
      const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
      const autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 3000;
      const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
      const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';

      const isMobileSlider = container.getAttribute('data-mobile-slider') !== 'false';
      const isTabletSlider = container.getAttribute('data-tablet-slider') !== 'false';
      const isDesktopSlider = container.getAttribute('data-desktop-slider') !== 'false';

      // Check if slider is enabled for the current device type
      const isSliderEnabled =
        (isDesktop && isDesktopSlider) ||
        (!isDesktop && islaptop && isTabletSlider) ||
        (isTablet && isMobileSlider);

      if (!isSliderEnabled) {
        if (container.swiper) {
          container.swiper.destroy(true, true);
          delete container.swiper;
        }
        return;
      }

      const slidesPerViewDesktop = parseFloat(container.getAttribute('data-slides-per-view-desktop')) || 1;
      const spaceBetweenDesktop = parseInt(container.getAttribute('data-space-between-desktop'), 10) || 0;
      const slidesPerViewLaptop = parseFloat(container.getAttribute('data-slides-per-view-laptop')) || slidesPerViewDesktop;
      const spaceBetweenLaptop = parseInt(container.getAttribute('data-space-between-laptop'), 10) || spaceBetweenDesktop;
      const slidesPerViewTablet = parseFloat(container.getAttribute('data-slides-per-view-tablet')) || 1;
      const spaceBetweenTablet = parseInt(container.getAttribute('data-space-between-tablet'), 10) || 0;
      const slidesPerViewMedTablet = parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) || slidesPerViewTablet;
      const spaceBetweenMedTablet = parseInt(container.getAttribute('data-space-between-medium-tablet'), 10) || spaceBetweenTablet;
      const slidesPerViewMobile = parseFloat(container.getAttribute('data-slides-per-view-mobile')) || 1;
      const spaceBetweenMobile = parseInt(container.getAttribute('data-space-between-mobile'), 10) || 0;

      // Destroy existing Swiper instance if it exists
      if (container.swiper) {
        container.swiper.destroy(true, true);
        delete container.swiper;
      }

      // Initialize Swiper with dynamic parameters
      const swiperContainer = document.getElementById(`swiper-${uniqueId}`);
      if (swiperContainer) {
        const swiper = new Swiper(swiperContainer, {
          slidesPerView: slidesPerViewMobile,
          spaceBetween: spaceBetweenMobile,
          loop: loopEnabled,
          autoplay: autoplayEnabled ? { delay: autoplayDelay, disableOnInteraction: false } : false,
          roundLengths: true,

          navigation: arrowsEnabled
            ? {
                nextEl: `#swiper-${uniqueId} .swiper-button-next`,
                prevEl: `#swiper-${uniqueId} .swiper-button-prev`,
              }
            : false,
          pagination: dotsEnabled
            ? {
                el: `#swiper-${uniqueId} .swiper-pagination`,
                clickable: true,
              }
            : false,
          breakpoints: {
            0: {
              slidesPerView: slidesPerViewMobile,
              spaceBetween: spaceBetweenMobile,
            },
            480: {
              slidesPerView: slidesPerViewMedTablet,
              spaceBetween: spaceBetweenMedTablet,
            },
            768: {
              slidesPerView: slidesPerViewTablet,
              spaceBetween: spaceBetweenTablet,
            },
            992: {
              slidesPerView: slidesPerViewLaptop,
              spaceBetween: spaceBetweenLaptop,
            },
            1200: {
              slidesPerView: slidesPerViewDesktop,
              spaceBetween: spaceBetweenDesktop,
            },
          },
          on: {
            init: function () {
              updateSlideCounter(this, container);
            },
            slideChange: function () {
              updateSlideCounter(this, container);
            },
          },
        });
        container.swiper = swiper;
      } else {
        console.error(`Element with ID swiper-${uniqueId} not found`);
      }
    });
  }

  // Wrap the initialization function with debounce
  const debouncedCheckScreenSizeAndInitSwipers = debounce(checkScreenSizeAndInitSwipers, 200);
  window.addEventListener('resize', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:load', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:select', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:deselect', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:reorder', debouncedCheckScreenSizeAndInitSwipers);

  // Initial call to set up sliders after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkScreenSizeAndInitSwipers);
  } else {
    checkScreenSizeAndInitSwipers();
  }
})();
