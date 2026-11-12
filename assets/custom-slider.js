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

  // Function to check screen size and initialize the slider accordingly
  function checkScreenSizeAndInitSwipers() {
    const width = window.innerWidth;
    const islaptop = width >= 1025;
    const isTablet = width <= 1024;

    document.querySelectorAll('.swiper-container').forEach(container => {
      const uniqueId = container.getAttribute('data-id');
      const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
      const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
      const autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 3000;
      const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
      const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';

      // Check if slider is enabled for the current device type
      const isSliderEnabled = (islaptop && container.getAttribute('data-desktop-slider') === 'true') ||
                              (isTablet && container.getAttribute('data-tablet-slider') === 'true') ||
                              (isTablet && container.getAttribute('data-mobile-slider') === 'true');

      if (!isSliderEnabled) {
        return; // Skip initialization if slider is not enabled for this device
      }

      // Destroy existing Swiper instance if it exists
      if (container.swiper) {
        container.swiper.destroy(true, true);
        delete container.swiper; // Clear the reference
      }

      // Initialize Swiper with dynamic parameters
      const swiperContainer = document.getElementById(`swiper-${uniqueId}`);
      if (swiperContainer) {
        container.swiper = new Swiper(swiperContainer, {
          loop: loopEnabled,
          autoplay: autoplayEnabled ? { delay: autoplayDelay, disableOnInteraction: false, waitForTransition: false } : false,
          roundLengths: true,
          // Navigation handled internally by Swiper via nextEl/prevEl selectors.
          // The click delegation at the bottom only initialises Swiper if needed —
          // it never manually calls slideNext/Prev to avoid double-firing.
          navigation: arrowsEnabled ? {
            nextEl: `#swiper-${uniqueId} .swiper-button-next`,
            prevEl: `#swiper-${uniqueId} .swiper-button-prev`,
          } : false,
          pagination: dotsEnabled ? {
            el: `#swiper-${uniqueId} .swiper-pagination`,
            clickable: true,
          } : false,
          breakpoints: {
            0: {
              slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-mobile')) || 1,
              spaceBetween: parseInt(container.getAttribute('data-space-between-mobile'), 10) || 0,
            },
           
            680: {
              slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) || 1,
              spaceBetween: parseInt(container.getAttribute('data-space-between-medium-tablet'), 10) || 0,
            },
          
             880: {
              slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-tablet')) || 1,
              spaceBetween: parseInt(container.getAttribute('data-space-between-tablet'), 10) || 0,
            },

            1280: {
              slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-laptop')) || 1,
              spaceBetween: parseInt(container.getAttribute('data-space-between-laptop'), 10) || 0,
            },

            1680: {
              slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-desktop')) || 1,
              spaceBetween: parseInt(container.getAttribute('data-space-between-desktop'), 10) || 0,
            }
          },
        });
      } else {
        console.error(`Element with ID swiper-${uniqueId} not found`);
      }
    });
  }

  // Wrap the initialization function with debounce
  const debouncedCheckScreenSizeAndInitSwipers = debounce(checkScreenSizeAndInitSwipers, 300);
  window.addEventListener('resize', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:load', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:select', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:deselect', debouncedCheckScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:reorder', debouncedCheckScreenSizeAndInitSwipers);

  // Initial call to set up sliders after DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(checkScreenSizeAndInitSwipers, 150);
    });
  } else {
    setTimeout(checkScreenSizeAndInitSwipers, 150);
  }

  // Click delegation: ONLY initialises Swiper if it hasn't loaded yet when user
  // clicks a button. Does NOT call slideNext/Prev to avoid double-firing.
  document.addEventListener('click', function (e) {
    const nextBtn = e.target.closest('.swiper-button-next');
    const prevBtn = e.target.closest('.swiper-button-prev');
    const btn = nextBtn || prevBtn;
    if (!btn) return;

    const container = btn.closest('.swiper-container');
    if (!container) return;

    if (!container.swiper || container.swiper.destroyed) {
      checkScreenSizeAndInitSwipers();
      // Swiper's navigation handler on the same event bubble will
      // handle the actual slide movement after init.
    }
  });
})();
