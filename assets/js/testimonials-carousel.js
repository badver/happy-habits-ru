/**
 * Testimonials Carousel
 * Swipeable carousel for testimonials with touch support
 */

(function () {
  'use strict';

  class TestimonialsCarousel {
    constructor(container) {
      this.container = container;
      this.track = container.querySelector('.testimonials__track');
      this.cards = Array.from(this.track.querySelectorAll('.testimonial-card'));
      this.prevBtn = container.querySelector('.carousel__btn--prev');
      this.nextBtn = container.querySelector('.carousel__btn--next');
      this.dotsContainer = container.parentElement.querySelector('.carousel__dots');

      this.currentIndex = 0;
      this.isDragging = false;
      this.startPos = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.animationID = null;

      this.init();
    }

    init() {
      if (!this.track || this.cards.length === 0) return;

      this.createDots();
      this.attachEventListeners();
      this.updateButtons();
      this.updateDots();
    }

    createDots() {
      if (!this.dotsContainer) return;

      this.cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel__dot');
        dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
        dot.addEventListener('click', () => this.goToSlide(index));
        this.dotsContainer.appendChild(dot);
      });

      this.dots = Array.from(this.dotsContainer.querySelectorAll('.carousel__dot'));
    }

    attachEventListeners() {
      // Button navigation
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prev());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.next());
      }

      // Touch events
      this.track.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
      this.track.addEventListener('touchmove', this.touchMove.bind(this), { passive: true });
      this.track.addEventListener('touchend', this.touchEnd.bind(this));

      // Mouse events (for desktop dragging)
      this.track.addEventListener('mousedown', this.touchStart.bind(this));
      this.track.addEventListener('mousemove', this.touchMove.bind(this));
      this.track.addEventListener('mouseup', this.touchEnd.bind(this));
      this.track.addEventListener('mouseleave', this.touchEnd.bind(this));

      // Keyboard navigation
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Intersection Observer for scroll snapping
      this.observeCards();
    }

    observeCards() {
      const options = {
        root: this.track,
        threshold: 0.3  // Reduced from 0.5 to be less aggressive
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const index = this.cards.indexOf(entry.target);
            if (index !== -1) {
              this.currentIndex = index;
              this.updateButtons();
              this.updateDots();
            }
          }
        });
      }, options);

      this.cards.forEach(card => observer.observe(card));
    }

    touchStart(event) {
      // Only handle horizontal swipes within carousel, don't interfere with page scroll
      this.isDragging = false;  // Will be set to true only if horizontal movement detected
      this.startPos = this.getPositionX(event);
      this.startPosY = this.getPositionY(event);
      this.hasMoved = false;
    }

    touchMove(event) {
      if (!this.hasMoved) {
        const currentX = this.getPositionX(event);
        const currentY = this.getPositionY(event);
        const deltaX = Math.abs(currentX - this.startPos);
        const deltaY = Math.abs(currentY - this.startPosY);

        // Only start dragging if horizontal movement is more significant than vertical
        if (deltaX > deltaY && deltaX > 10) {
          this.isDragging = true;
          this.hasMoved = true;
          this.track.style.cursor = 'grabbing';
        } else if (deltaY > deltaX && deltaY > 10) {
          // Vertical scroll detected, don't interfere
          this.isDragging = false;
          this.hasMoved = true;
          return;
        }
      }

      if (this.isDragging) {
        const currentPosition = this.getPositionX(event);
        this.currentTranslate = this.prevTranslate + currentPosition - this.startPos;
      }
    }

    touchEnd() {
      if (!this.hasMoved || !this.isDragging) {
        this.isDragging = false;
        return;
      }

      this.isDragging = false;
      this.track.style.cursor = 'grab';

      const movedBy = this.currentTranslate - this.prevTranslate;

      // Swipe threshold - increased to require more deliberate swipe
      if (movedBy < -75 && this.currentIndex < this.cards.length - 1) {
        this.next();
      } else if (movedBy > 75 && this.currentIndex > 0) {
        this.prev();
      } else {
        this.goToSlide(this.currentIndex);
      }
    }

    getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    getPositionY(event) {
      return event.type.includes('mouse') ? event.pageY : event.touches[0].clientY;
    }

    animation() {
      if (this.isDragging) {
        requestAnimationFrame(this.animation.bind(this));
      }
    }

    goToSlide(index) {
      this.currentIndex = Math.max(0, Math.min(index, this.cards.length - 1));

      const card = this.cards[this.currentIndex];
      if (card) {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }

      this.updateButtons();
      this.updateDots();
    }

    prev() {
      if (this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      }
    }

    next() {
      if (this.currentIndex < this.cards.length - 1) {
        this.goToSlide(this.currentIndex + 1);
      }
    }

    updateButtons() {
      if (this.prevBtn) {
        this.prevBtn.disabled = this.currentIndex === 0;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = this.currentIndex === this.cards.length - 1;
      }
    }

    updateDots() {
      if (!this.dots) return;

      this.dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });
    }
  }

  // Initialize carousel when DOM is ready
  function init() {
    const carousels = document.querySelectorAll('.testimonials-carousel');
    carousels.forEach(carousel => new TestimonialsCarousel(carousel));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
