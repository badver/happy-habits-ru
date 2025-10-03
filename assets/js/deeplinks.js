/**
 * Deeplink Logic
 * Handles Telegram and WhatsApp deeplinks with fallback
 */

(function() {
  'use strict';

  const TELEGRAM_USERNAME = 'happy_habits_ru';
  const WHATSAPP_NUMBER = '905071754633';
  const DEFAULT_MESSAGE = 'Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)';
  const FALLBACK_TIMEOUT = 2000; // 2 seconds

  /**
   * Build Telegram deeplink
   * @param {string} message - Message to pre-fill
   * @returns {string} Telegram deeplink URL
   */
  function buildTelegramDeeplink(message = DEFAULT_MESSAGE) {
    const encodedMessage = encodeURIComponent(message);
    return `tg://resolve?domain=${TELEGRAM_USERNAME}&text=${encodedMessage}`;
  }

  /**
   * Build WhatsApp deeplink
   * @param {string} message - Message to pre-fill
   * @returns {string} WhatsApp deeplink URL
   */
  function buildWhatsAppDeeplink(message = DEFAULT_MESSAGE) {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  }

  /**
   * Get fallback URL for messenger
   * @param {string} messengerType - 'telegram' or 'whatsapp'
   * @returns {string} Fallback URL
   */
  function getFallbackURL(messengerType) {
    if (messengerType === 'telegram') {
      return `https://t.me/${TELEGRAM_USERNAME}`;
    } else if (messengerType === 'whatsapp') {
      return `https://web.whatsapp.com/`;
    }
    return '';
  }

  /**
   * Handle messenger button click
   * @param {Event} event - Click event
   * @param {HTMLElement} button - Button element
   */
  function handleMessengerClick(event, button) {
    const messengerType = button.getAttribute('data-cta');
    const buttonPosition = button.getAttribute('data-position') || 'unknown';

    // Track analytics
    if (typeof window.trackMessengerClick === 'function') {
      window.trackMessengerClick(messengerType, buttonPosition);
    }

    // Get deeplink URL
    let deeplinkURL;
    if (messengerType === 'telegram') {
      deeplinkURL = buildTelegramDeeplink();
    } else if (messengerType === 'whatsapp') {
      deeplinkURL = buildWhatsAppDeeplink();
    } else {
      return; // Unknown messenger type
    }

    // Try to open deeplink
    const fallbackURL = button.getAttribute('data-fallback') || getFallbackURL(messengerType);

    // Detect if deeplink failed (simplified approach)
    let appOpened = false;
    const startTime = Date.now();

    // Set up fallback timer
    const fallbackTimer = setTimeout(() => {
      if (!appOpened && Date.now() - startTime >= FALLBACK_TIMEOUT) {
        console.log(`Deeplink timeout, redirecting to fallback: ${fallbackURL}`);
        window.location.href = fallbackURL;
      }
    }, FALLBACK_TIMEOUT);

    // Listen for visibility change (app might have opened)
    const visibilityHandler = () => {
      if (document.hidden) {
        appOpened = true;
        clearTimeout(fallbackTimer);
      }
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    // Also listen for blur event
    const blurHandler = () => {
      appOpened = true;
      clearTimeout(fallbackTimer);
      window.removeEventListener('blur', blurHandler);
    };
    window.addEventListener('blur', blurHandler);

    // Try to open deeplink
    try {
      window.location.href = deeplinkURL;
    } catch (e) {
      console.error('Failed to open deeplink:', e);
      clearTimeout(fallbackTimer);
      window.location.href = fallbackURL;
    }

    // Prevent default link behavior
    event.preventDefault();
  }

  /**
   * Initialize deeplink handlers
   */
  function initDeeplinks() {
    // Find all CTA buttons
    const ctaButtons = document.querySelectorAll('[data-cta="telegram"], [data-cta="whatsapp"]');

    ctaButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        handleMessengerClick(event, button);
      });
    });

    console.log(`Initialized ${ctaButtons.length} deeplink buttons`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeeplinks);
  } else {
    initDeeplinks();
  }

  // Expose functions for testing
  window.buildTelegramDeeplink = buildTelegramDeeplink;
  window.buildWhatsAppDeeplink = buildWhatsAppDeeplink;
})();
