/**
 * A/B Testing Router
 *
 * Assigns visitors to landing page variants and redirects to the appropriate page.
 * Variant assignment is stored in localStorage for consistent experience.
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'landing_variant';
  var config = window.VARIANT_CONFIG || {
    variants: ['a'],
    weights: [100],
    defaultVariant: 'a',
    forceParam: 'v',
    enabled: true,
    yandexMetrikaID: 0,
    googleAnalyticsID: ''
  };

  /**
   * Select a random variant based on weights
   * @param {string[]} variants - Array of variant identifiers
   * @param {number[]} weights - Array of weights (should sum to 100)
   * @returns {string} Selected variant
   */
  function weightedRandom(variants, weights) {
    var totalWeight = weights.reduce(function(sum, w) { return sum + w; }, 0);
    var random = Math.random() * totalWeight;
    var cumulative = 0;

    for (var i = 0; i < variants.length; i++) {
      cumulative += weights[i];
      if (random < cumulative) {
        return variants[i];
      }
    }

    return variants[variants.length - 1];
  }

  /**
   * Get URL parameter value
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value or null
   */
  function getUrlParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  /**
   * Check if variant is valid
   * @param {string} variant - Variant to check
   * @returns {boolean} True if variant is in the list
   */
  function isValidVariant(variant) {
    return variant && config.variants.indexOf(variant) !== -1;
  }

  /**
   * Track variant assignment in analytics
   * @param {string} variant - Assigned variant
   * @param {string} source - How variant was determined (forced, stored, assigned)
   */
  function trackAssignment(variant, source) {
    // Google Analytics 4
    if (config.googleAnalyticsID && typeof gtag === 'function') {
      gtag('event', 'variant_assigned', {
        variant: variant,
        assignment_source: source,
        event_category: 'ab_test',
        event_label: 'landing_' + variant
      });
    }

    // Yandex Metrika
    if (config.yandexMetrikaID && typeof ym === 'function') {
      ym(config.yandexMetrikaID, 'params', {
        landing_variant: variant,
        variant_source: source
      });
      ym(config.yandexMetrikaID, 'reachGoal', 'variant_assigned', {
        variant: variant,
        source: source
      });
    }
  }

  /**
   * Redirect to variant page
   * @param {string} variant - Variant identifier
   */
  function redirect(variant) {
    var targetUrl = '/v/' + variant + '/';

    // Preserve any query parameters except the force param
    var urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(config.forceParam);

    var queryString = urlParams.toString();
    if (queryString) {
      targetUrl += '?' + queryString;
    }

    // Preserve hash
    if (window.location.hash) {
      targetUrl += window.location.hash;
    }

    window.location.replace(targetUrl);
  }

  /**
   * Main router logic
   */
  function route() {
    // If variants are disabled, go to default
    if (!config.enabled) {
      redirect(config.defaultVariant);
      return;
    }

    var variant;
    var source;

    // 1. Check URL force parameter (e.g., /?v=b)
    var forcedVariant = getUrlParam(config.forceParam);
    if (isValidVariant(forcedVariant)) {
      variant = forcedVariant;
      source = 'forced';
      try {
        localStorage.setItem(STORAGE_KEY, variant);
      } catch (e) {
        // localStorage not available
      }
      trackAssignment(variant, source);
      redirect(variant);
      return;
    }

    // 2. Check localStorage for existing assignment
    try {
      var storedVariant = localStorage.getItem(STORAGE_KEY);
      if (isValidVariant(storedVariant)) {
        variant = storedVariant;
        source = 'stored';
        trackAssignment(variant, source);
        redirect(variant);
        return;
      }
    } catch (e) {
      // localStorage not available
    }

    // 3. Assign new variant based on weights
    variant = weightedRandom(config.variants, config.weights);
    source = 'assigned';

    try {
      localStorage.setItem(STORAGE_KEY, variant);
    } catch (e) {
      // localStorage not available
    }

    trackAssignment(variant, source);
    redirect(variant);
  }

  // Execute router immediately
  route();
})();
