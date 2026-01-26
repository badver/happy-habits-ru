/**
 * Analytics Integration
 * Handles Google Analytics 4 and Yandex.Metrika events
 */

(function () {
  'use strict';

  // Get analytics IDs from config (injected by Hugo)
  const GA4_ID = '{{ .Site.Params.googleAnalyticsID }}';
  const YM_ID = '{{ .Site.Params.yandexMetrikaID }}';

  // Extract UTM parameters from URL
  function getUTMParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || ''
    };
  }

  // Store UTM parameters in sessionStorage
  const utmParams = getUTMParameters();
  if (Object.values(utmParams).some(val => val !== '')) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
  }

  // Get stored UTM parameters
  function getStoredUTM() {
    try {
      return JSON.parse(sessionStorage.getItem('utm_params') || '{}');
    } catch (e) {
      return {};
    }
  }

  /**
   * Track CTA messenger click
   * @param {string} messengerType - 'telegram' or 'whatsapp'
   * @param {string} buttonPosition - location of button (e.g., 'hero', 'symptoms', 'final-cta')
   */
  window.trackMessengerClick = function (messengerType, buttonPosition) {
    // Get current color palette for conversion analysis
    const colorPalette = window.paletteSwitcher?.getCurrent() || 'unknown';

    const eventData = {
      messenger_type: messengerType,
      button_position: buttonPosition,
      color_palette: colorPalette,
      ...getStoredUTM()
    };

    // Google Analytics 4
    if (typeof gtag !== 'undefined' && GA4_ID) {
      gtag('event', 'cta_messenger_click', eventData);
      console.log('GA4 event fired:', 'cta_messenger_click', eventData);
    }

    // Yandex.Metrika
    if (typeof ym !== 'undefined' && YM_ID) {
      ym(YM_ID, 'reachGoal', 'cta_messenger_click', eventData);
      console.log('YM event fired:', 'cta_messenger_click', eventData);
    }
  };

  /**
   * Track scroll depth
   */
  let scrollDepthTracked = {
    25: false,
    50: false,
    75: false,
    100: false
  };

  function trackScrollDepth() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollPercent = (scrolled / scrollHeight) * 100;

    Object.keys(scrollDepthTracked).forEach(depth => {
      if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
        scrollDepthTracked[depth] = true;

        const eventData = {
          scroll_depth: depth,
          ...getStoredUTM()
        };

        // Google Analytics 4
        if (typeof gtag !== 'undefined' && GA4_ID) {
          gtag('event', 'scroll_depth', eventData);
          console.log('GA4 scroll_depth:', depth + '%');
        }

        // Yandex.Metrika
        if (typeof ym !== 'undefined' && YM_ID) {
          ym(YM_ID, 'reachGoal', 'scroll_depth_' + depth);
        }
      }
    });
  }

  // Debounce scroll tracking
  let scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 100);
  });

  /**
   * Track time on page
   */
  const timeCheckpoints = [30, 60, 120]; // seconds
  let timeTracked = {};

  timeCheckpoints.forEach(seconds => {
    timeTracked[seconds] = false;

    setTimeout(() => {
      if (!timeTracked[seconds]) {
        timeTracked[seconds] = true;

        const eventData = {
          seconds: seconds,
          ...getStoredUTM()
        };

        // Google Analytics 4
        if (typeof gtag !== 'undefined' && GA4_ID) {
          gtag('event', 'time_on_page', eventData);
          console.log('GA4 time_on_page:', seconds + 's');
        }

        // Yandex.Metrika
        if (typeof ym !== 'undefined' && YM_ID) {
          ym(YM_ID, 'reachGoal', 'time_on_page_' + seconds);
        }
      }
    }, seconds * 1000);
  });

  /**
   * Attach click handlers to CTA buttons
   */
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('[data-cta]');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function () {
        const messengerType = this.getAttribute('data-cta');
        const buttonPosition = this.getAttribute('data-position') || 'unknown';
        window.trackMessengerClick(messengerType, buttonPosition);
      });
    });

    console.log('CTA tracking initialized for', ctaButtons.length, 'buttons');
  }

  /**
   * Initialize analytics tracking
   */
  document.addEventListener('DOMContentLoaded', function () {
    console.log('Analytics initialized');
    console.log('UTM parameters:', getStoredUTM());
    initCTATracking();
  });
})();
