/**
 * A/B Testing Logic
 * Manages variant assignment and application
 */

(function () {
  'use strict';

  // Get analytics IDs from config (injected by Hugo)
  const YM_ID = '{{ .Site.Params.yandexMetrikaID }}';

  // A/B Test Configuration
  const AB_TESTS = {
    hero_headline: {
      name: 'hero_headline',
      variants: {
        A: 'Верните спокойствие и уверенность — научитесь управлять тревогой с помощью проверенных методов КПТ',
        B: 'Перестаньте жить в постоянном напряжении — бережная работа с психологом для возвращения к активной жизни'
      }
    },
    cta_button_text: {
      name: 'cta_button_text',
      variants: {
        A: 'Записаться на вводную встречу',
        B: 'Записаться на консультацию',
        C: 'Получить консультацию'
      }
    }
  };

  /**
   * Get or assign variant for a test
   * @param {string} testName - Name of the A/B test
   * @param {number} variantCount - Number of variants (2 or 3)
   * @returns {string} Variant ID ('A', 'B', or 'C')
   */
  function getVariant(testName, variantCount = 2) {
    const storageKey = `ab_test_${testName}`;

    // Check if variant already assigned
    let variant = localStorage.getItem(storageKey);

    if (!variant) {
      // Assign random variant
      const random = Math.random();
      if (variantCount === 2) {
        variant = random < 0.5 ? 'A' : 'B';
      } else if (variantCount === 3) {
        if (random < 0.33) variant = 'A';
        else if (random < 0.66) variant = 'B';
        else variant = 'C';
      }

      // Store variant
      localStorage.setItem(storageKey, variant);
      console.log(`A/B Test: ${testName} assigned variant ${variant}`);
    } else {
      console.log(`A/B Test: ${testName} using existing variant ${variant}`);
    }

    return variant;
  }

  /**
   * Send variant info to analytics
   * @param {string} testName - Name of the test
   * @param {string} variantId - Variant ID
   */
  function trackVariant(testName, variantId) {
    const eventData = {
      test_name: testName,
      variant_id: variantId
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_variant', eventData);
    }

    // Yandex.Metrika
    if (typeof ym !== 'undefined' && YM_ID) {
      ym(YM_ID, 'params', {
        [`ab_test_${testName}`]: variantId
      });
    }
  }

  /**
   * Apply Hero Headline Test
   */
  function applyHeroHeadlineTest() {
    const test = AB_TESTS.hero_headline;
    const variant = getVariant(test.name, 2);
    const headlineText = test.variants[variant];

    // Find hero title element
    const heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      heroTitle.textContent = headlineText;
      console.log(`Applied hero headline variant ${variant}: "${headlineText}"`);
    }

    // Track variant
    trackVariant(test.name, variant);
  }

  /**
   * Apply CTA Button Text Test
   */
  function applyCTAButtonTest() {
    const test = AB_TESTS.cta_button_text;
    const variant = getVariant(test.name, 3);
    const buttonText = test.variants[variant];

    // Find CTA buttons (only in hero and symptoms sections for this test)
    const ctaButtons = document.querySelectorAll('.hero__cta .btn, .symptoms__cta .btn');

    ctaButtons.forEach(button => {
      // Only change Telegram buttons for this test
      if (button.getAttribute('data-cta') === 'telegram') {
        // Keep the icon, just change text
        const icon = button.querySelector('.btn__icon');
        button.textContent = buttonText;
        if (icon) {
          button.prepend(icon);
        }
      }
    });

    if (ctaButtons.length > 0) {
      console.log(`Applied CTA button variant ${variant}: "${buttonText}"`);
    }

    // Track variant
    trackVariant(test.name, variant);
  }

  /**
   * Initialize A/B tests
   * IMPORTANT: Must run before page is visible to avoid flicker
   */
  function initABTests() {
    try {
      // Apply tests
      applyHeroHeadlineTest();
      applyCTAButtonTest();

      console.log('A/B tests initialized');
    } catch (error) {
      console.error('Error initializing A/B tests:', error);
    }
  }

  // Run immediately (before DOMContentLoaded) to prevent flicker
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initABTests);
  } else {
    initABTests();
  }

  // Expose for testing
  window.getABVariant = getVariant;
})();
