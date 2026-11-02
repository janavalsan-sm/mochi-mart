
// (function () {
//   function debounce(func, wait) {
//     let timeout;
//     return function () {
//       const context = this,
//         args = arguments;
//       clearTimeout(timeout);
//       timeout = setTimeout(function () {
//         func.apply(context, args);
//       }, wait);
//     };
//   }

//   // Function to check screen size and initialize the slider accordingly
//   function checkScreenSizeAndInitSwipers() {
//     const width = window.innerWidth;
//     const isDesktop = width >= 1480;
//     const islaptop = width >= 1025;
//     const isTablet = width <= 1024;
//     //const isMobile = width <= 991;
//     // Initialize Swipers only for the relevant screen sizes
//     document.querySelectorAll('.vertical-swiper-container').forEach(container => {
//       const uniqueId = container.getAttribute('data-id');
//       const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
//       const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
//       const autoplayDelay = parseInt(container.getAttribute('data-autoplay-delay'), 10) || 3000;
//       const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
//       const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';
//       const centerEnabled = container.getAttribute('data-mode-centered') === 'true';

//       // Check if slider is enabled for the current device type
//       const isSliderEnabled = (islaptop && container.getAttribute('data-desktop-slider') === 'true') ||
//                             //   (isTablet && container.getAttribute('data-tablet-slider') === 'true') ||
//                               (isTablet && container.getAttribute('data-mobile-slider') === 'true');

//       if (!isSliderEnabled) {
//         return; // Skip initialization if slider is not enabled for this device
//       }

//       let slidesPerView, spaceBetween;



//       // Destroy existing Swiper instance if it exists
//       if (container.swiper) {
//         container.swiper.destroy(true, true);
//         delete container.swiper; // Clear the reference
//       }

//       // Initialize Swiper with dynamic parameters
//        const swiperContainer = document.getElementById(`vertical-swiper-${uniqueId}`);
//       if (swiperContainer) {
//         container.swiper = new Swiper(swiperContainer, {
//           slidesPerView: slidesPerView,
//           spaceBetween: spaceBetween,
//           centeredSlides: false,
//           direction: "vertical",
//           loop: loopEnabled,
//           autoplay: autoplayEnabled ? { delay: autoplayDelay } : false,
          

//           navigation: arrowsEnabled ? {
//            nextEl: `.swiper-button-nexts[data-swiper-id="${uniqueId}"]`,
//             prevEl: `.swiper-button-previ[data-swiper-id="${uniqueId}"]`,
//           } : false,
//           pagination: dotsEnabled ? {
//             el: `#vertical-swiper-${uniqueId} .swiper-pagination`,
//             clickable: true,
//           } : false,

//             // 🔑 Fix centering & sizing
//   autoHeight: false,   // disable auto height
//   centeredSlidesBounds: false, // ensures center works correctly
//           breakpoints: {
//             // Optional: use breakpoints to manage slides per view
//             0: {
//               slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-mobile')) || 1,
//               spaceBetween: parseInt(container.getAttribute('data-space-between-mobile'), 10) || 0,
//             },
           
//             680: {
//               slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-medium-tablet')) || 1,
//               spaceBetween: parseInt(container.getAttribute('data-space-between-medium-tablet'), 10) || 0,
//             },
          
//              880: {
//               slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-tablet')) || 1,
//               spaceBetween: parseInt(container.getAttribute('data-space-between-tablet'), 10) || 0,
//             },

//             1280: {
//                 slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-laptop')) || 1,
//               spaceBetween: parseInt(container.getAttribute('data-space-between-laptop'), 10) || 0,
//             },

//             1680: {
//               slidesPerView: parseFloat(container.getAttribute('data-slides-per-view-desktop')) || 1,
//               spaceBetween: parseInt(container.getAttribute('data-space-between-desktop'), 10) || 0,
//             }
//           },
//         });
//       } else {
//         console.error(`Element with ID vertical-swiper--${uniqueId} not found`);
//       }
//     });
//   }
 

//   // Wrap the initialization function with debounce
//   const debouncedCheckScreenSizeAndInitSwipers = debounce(checkScreenSizeAndInitSwipers, 300);
//   // Add event listeners for window resize and Shopify section events
//   //window.addEventListener('resize', debouncedCheckScreenSizeAndInitSwipers);
//   document.addEventListener('shopify:section:load', debouncedCheckScreenSizeAndInitSwipers);
//   document.addEventListener('shopify:section:select', debouncedCheckScreenSizeAndInitSwipers);
//   document.addEventListener('shopify:section:deselect', debouncedCheckScreenSizeAndInitSwipers);
//   document.addEventListener('shopify:section:reorder', debouncedCheckScreenSizeAndInitSwipers);

//   // Initial call to set up sliders after DOM is fully loaded
//   document.addEventListener('DOMContentLoaded', checkScreenSizeAndInitSwipers);
// })();


(function () {
  function debounce(fn, wait) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), wait);
    };
  }

  function parseFloatOr(el, attr, fallback) {
    const v = el.getAttribute(attr);
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function parseIntOr(el, attr, fallback) {
    const v = el.getAttribute(attr);
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  function ensureSlides(wrapper) {
    if (!wrapper) return false;
    Array.from(wrapper.children).forEach(child => {
      if (!child.classList.contains('swiper-slide')) child.classList.add('swiper-slide');
    });
    return true;
  }

  function computeResponsiveValues(container, width) {
    // read data attributes with defaults
    const spvDesktop = parseFloatOr(container, 'data-slides-per-view-desktop', 1.2);
    const spvLaptop  = parseFloatOr(container, 'data-slides-per-view-laptop', spvDesktop);
    const spvTablet  = parseFloatOr(container, 'data-slides-per-view-tablet', 1);
    const spvMediumTablet = parseFloatOr(container, 'data-slides-per-view-medium-tablet', spvTablet);
    const spvMobile  = parseFloatOr(container, 'data-slides-per-view-mobile', 1);

    const sbDesktop = parseIntOr(container, 'data-space-between-desktop', 30);
    const sbLaptop  = parseIntOr(container, 'data-space-between-laptop', sbDesktop);
    const sbTablet  = parseIntOr(container, 'data-space-between-tablet', sbDesktop);
    const sbMediumTablet = parseIntOr(container, 'data-space-between-medium-tablet', sbTablet);
    const sbMobile  = parseIntOr(container, 'data-space-between-mobile', sbTablet);

    // choose the value based on common breakpoints (adjust if your breakpoints differ)
    let slidesPerView = spvMobile;
    let spaceBetween = sbMobile;
    if (width >= 1680) {
      slidesPerView = spvDesktop;
      spaceBetween = sbDesktop;
    } else if (width >= 1280) {
      slidesPerView = spvLaptop;
      spaceBetween = sbLaptop;
    } else if (width >= 880) {
      slidesPerView = spvTablet;
      spaceBetween = sbTablet;
    } else if (width >= 680) {
      slidesPerView = spvMediumTablet;
      spaceBetween = sbMediumTablet;
    } else {
      slidesPerView = spvMobile;
      spaceBetween = sbMobile;
    }

    // coerce to a positive number
    if (!Number.isFinite(slidesPerView) || slidesPerView <= 0) slidesPerView = 1;
    if (!Number.isFinite(spaceBetween)) spaceBetween = 0;

    return { slidesPerView, spaceBetween };
  }

  function initContainer(container) {
    if (!container) return;
    const wrapper = container.querySelector('.swiper-wrapper');
    if (!ensureSlides(wrapper)) {
      console.error('vertical-swiper: .swiper-wrapper not found for', container);
      return;
    }

    // use data-height or CSS fallback
    const dataHeight = container.getAttribute('data-height');
    if (dataHeight) container.style.height = dataHeight;
    // fallback if still no height from CSS
    if (!container.style.height) container.style.height = getComputedStyle(container).height || '680px';

    // destroy previous instance
    if (container.swiper) {
      try { container.swiper.destroy(true, true); } catch (e) {}
      delete container.swiper;
    }

    // compute responsive slidesPerView + spaceBetween based on current width
    const width = window.innerWidth || document.documentElement.clientWidth;
    const vals = computeResponsiveValues(container, width);
    const slidesPerView = vals.slidesPerView;
    const spaceBetween = vals.spaceBetween;

    // set slide heights so one slide is big and adjacent slides peek
    // height percent = 100 / slidesPerView -> e.g. slidesPerView=1.2 => 83.333% height per slide
    const wrapperChildren = Array.from(wrapper.children);
    const slideHeightPercent = (100 / slidesPerView) + '%';
    wrapperChildren.forEach(sl => {
      sl.style.height = slideHeightPercent;
      sl.classList.add('swiper-slide');
    });
    // ensure wrapper fills the container
    wrapper.style.height = '100%';

    // read flags
    const autoplayEnabled = container.getAttribute('data-autoplay-enabled') === 'true';
    const autoplayDelay = parseIntOr(container, 'data-autoplay-delay', 3000);
    const loopEnabled = container.getAttribute('data-loop-enabled') === 'true';
    const arrowsEnabled = container.getAttribute('data-arrows-enabled') === 'true';
    const dotsEnabled = container.getAttribute('data-dots-enabled') === 'true';

    // ensure pagination/nav exist
    if (!container.querySelector('.swiper-pagination')) {
      const p = document.createElement('div'); p.className = 'swiper-pagination'; container.appendChild(p);
    }
    if (!container.querySelector('.swiper-button-next')) {
      const n = document.createElement('div'); n.className = 'swiper-button-next'; container.appendChild(n);
    }
    if (!container.querySelector('.swiper-button-prev')) {
      const p = document.createElement('div'); p.className = 'swiper-button-prev'; container.appendChild(p);
    }

    // init
    try {
      container.swiper = new Swiper(container, {
        direction: 'vertical',
        slidesPerView: slidesPerView,
        spaceBetween: spaceBetween,
        centeredSlides: true,
        centeredSlidesBounds: true,
        loop: !!loopEnabled,
        autoHeight: false, // we control heights manually
        autoplay: autoplayEnabled ? { delay: autoplayDelay, disableOnInteraction: false } : false,
        pagination: dotsEnabled ? { el: container.querySelector('.swiper-pagination'), clickable: true } : false,
        navigation: arrowsEnabled ? {
          nextEl: container.querySelector('.swiper-button-next'),
          prevEl: container.querySelector('.swiper-button-prev'),
        } : false,
        on: {
          init: function () {
            console.log('vertical-swiper: initialized', { container, slidesPerView, spaceBetween });
          },
          slideChange: function () {
            // ensure the currently active slide has correct class
            wrapperChildren.forEach(s => s.classList.remove('is-active-slide'));
            const active = container.querySelector('.swiper-slide-active');
            if (active) active.classList.add('is-active-slide');
          }
        }
      });
    } catch (err) {
      console.error('vertical-swiper: failed to init', err, container);
    }
  }

  function checkScreenSizeAndInitSwipers() {
    document.querySelectorAll('.vertical-swiper-container').forEach(container => {
      const width = window.innerWidth || document.documentElement.clientWidth;
      const enableMobile = container.getAttribute('data-mobile-slider') === 'true';
      const enableDesktop = container.getAttribute('data-desktop-slider') === 'true';
      const isTabletOrMobile = width <= 1024;
      let shouldInit = true;
      if (enableMobile || enableDesktop) {
        shouldInit = isTabletOrMobile ? !!enableMobile : !!enableDesktop;
      }
      if (shouldInit) {
        initContainer(container);
      } else {
        // destroy if present
        if (container.swiper) {
          try { container.swiper.destroy(true, true); } catch (e) {}
          delete container.swiper;
          console.log('vertical-swiper: destroyed (not enabled on this device)', container);
        }
      }
    });
  }

  const debouncedInit = debounce(checkScreenSizeAndInitSwipers, 250);
  window.addEventListener('resize', debouncedInit);
  document.addEventListener('DOMContentLoaded', checkScreenSizeAndInitSwipers);
  document.addEventListener('shopify:section:load', debouncedInit);
  document.addEventListener('shopify:section:select', debouncedInit);
  document.addEventListener('shopify:section:deselect', debouncedInit);
  document.addEventListener('shopify:section:reorder', debouncedInit);
})();
