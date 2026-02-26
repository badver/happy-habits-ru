/**
 * A/B Testing Router
 *
 * Assigns visitors to a random landing page variant on every visit.
 * No localStorage persistence — fresh random each time.
 * Use /?v=b to force a specific variant.
 */
(function() {
  'use strict';

  var config = window.VARIANT_CONFIG || {
    variants: ['a'],
    weights: [100],
    defaultVariant: 'a',
    forceParam: 'v',
    enabled: true,
    yandexMetrikaID: 0,
    googleAnalyticsID: ''
  };

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

  function getUrlParam(param) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function isValidVariant(variant) {
    return variant && config.variants.indexOf(variant) !== -1;
  }

  function trackAssignment(variant, source) {
    if (config.googleAnalyticsID && typeof gtag === 'function') {
      gtag('event', 'variant_assigned', {
        variant: variant,
        assignment_source: source,
        event_category: 'ab_test',
        event_label: 'landing_' + variant
      });
    }

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

  function redirect(variant) {
    var targetUrl = '/v/' + variant + '/';

    var urlParams = new URLSearchParams(window.location.search);
    urlParams.delete(config.forceParam);

    var queryString = urlParams.toString();
    if (queryString) {
      targetUrl += '?' + queryString;
    }

    if (window.location.hash) {
      targetUrl += window.location.hash;
    }

    window.location.replace(targetUrl);
  }

  // Main router — random every visit
  function route() {
    if (!config.enabled) {
      redirect(config.defaultVariant);
      return;
    }

    // 1. Check URL force parameter (e.g., /?v=b)
    var forcedVariant = getUrlParam(config.forceParam);
    if (isValidVariant(forcedVariant)) {
      trackAssignment(forcedVariant, 'forced');
      redirect(forcedVariant);
      return;
    }

    // 2. Random assignment every visit
    var variant = weightedRandom(config.variants, config.weights);
    trackAssignment(variant, 'random');
    redirect(variant);
  }

  route();
})();
