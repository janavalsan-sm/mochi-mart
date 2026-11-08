import { yieldToMainThread } from '@theme/utilities';
import { Component } from '@theme/component';

/**
 * FlyToCart custom element for animating product images to cart
 * This component creates a visual effect of a product "flying" to the cart when added
 */
class FlyToCart extends Component {
  /** @type {Element} */
  source;

  /** @type {boolean} */
  useSourceSize = false;

  /** @type {Element} */
  destination;

  connectedCallback() {
    super.connectedCallback();

    if (!this.source) {
      this.remove();
      return;
    }

    // Direct synchronous rect measurement — never hangs when cart icon is scrolled out of view
    const sourceRect = this.source.getBoundingClientRect();
    const destinationRect = this.destination ? this.destination.getBoundingClientRect() : null;

    if (sourceRect && sourceRect.width > 0) {
      this.#animate(sourceRect, destinationRect);
    } else {
      this.remove();
    }
  }

  /**
   * Animates the flying thingy along the curve.
   * @param {DOMRectReadOnly} sourceRect - The bounding client rect of the source.
   * @param {DOMRectReadOnly | null} destinationRect - The bounding client rect of the destination.
   */
  #animate = async (sourceRect, destinationRect) => {
    // Guaranteed cleanup fallback so element never gets stuck in the DOM
    const safetyTimer = setTimeout(() => {
      this.remove();
    }, 750);

    try {
      const startPoint = {
        x: sourceRect.left + sourceRect.width / 2,
        y: sourceRect.top + sourceRect.height / 2,
      };

      // Destination coordinates — if cart icon is scrolled offscreen or hidden, fly to top-right
      const destLeft = destinationRect ? destinationRect.left : 0;
      const destTop = destinationRect ? destinationRect.top : 0;
      const destWidth = destinationRect ? destinationRect.width : 0;
      const destHeight = destinationRect ? destinationRect.height : 0;

      const endPoint = {
        x: (destWidth > 0 && destLeft > 0) ? destLeft + destWidth / 2 : window.innerWidth - 28,
        y: (destHeight > 0 && destTop >= 0) ? destTop + destHeight / 2 : 24,
      };

      if (this.useSourceSize) {
        this.style.setProperty('--width', `${sourceRect.width}px`);
        this.style.setProperty('--height', `${sourceRect.height}px`);
      }
      this.style.setProperty('--start-x', `${startPoint.x}px`);
      this.style.setProperty('--start-y', `${startPoint.y}px`);
      this.style.setProperty('--travel-x', `${endPoint.x - startPoint.x}px`);
      this.style.setProperty('--travel-y', `${endPoint.y - startPoint.y}px`);

      await yieldToMainThread();

      const animations = this.getAnimations();
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 550));
      }
    } catch (_) {
      // ignore
    } finally {
      clearTimeout(safetyTimer);
      this.remove();
    }
  };
}

if (!customElements.get('fly-to-cart')) {
  customElements.define('fly-to-cart', FlyToCart);
}
