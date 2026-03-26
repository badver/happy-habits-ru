/**
 * Deeplink Logic
 * Handles Telegram, WhatsApp and Max deeplinks with fallback and bridge toast
 */

(function() {
  'use strict';

  const TELEGRAM_USERNAME = 'happy_habits_ru';
  const WHATSAPP_NUMBER = '905071754633';
  const DEFAULT_MESSAGE = 'Здравствуйте! Хочу записаться на вводную встречу (30 минут)';
  const FALLBACK_TIMEOUT = 2000;
  const BRIDGE_DELAY = 1500;

  const MESSENGER_NAMES = {
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    max: 'Макс'
  };

  const CONCERN_MAP = {
    anxiety: 'тревожность',
    panic: 'приступы тревоги',
    stress: 'стресс и выгорание',
    ocd: 'навязчивые мысли',
    other: null
  };

  const DURATION_MAP = {
    less_month: 'менее месяца',
    '1_6_months': '1\u20136 месяцев',
    '6_12_months': '6\u201312 месяцев',
    more_year: 'более года',
    several_years: 'несколько лет'
  };

  function buildPersonalizedMessage() {
    if (typeof window.quizGate === 'undefined' || typeof window.quizGate.getAnswers !== 'function') {
      return DEFAULT_MESSAGE;
    }

    var a = window.quizGate.getAnswers();
    var concern = a.q1 && CONCERN_MAP[a.q1];
    if (!concern) return DEFAULT_MESSAGE;

    var duration = a.q2 && DURATION_MAP[a.q2];
    if (duration) {
      return 'Здравствуйте! Меня беспокоит ' + concern + ' уже ' + duration + '. Хочу записаться на вводную встречу (30 минут)';
    }
    return 'Здравствуйте! Меня беспокоит ' + concern + '. Хочу записаться на вводную встречу (30 минут)';
  }

  function buildTelegramDeeplink(message) {
    message = message || DEFAULT_MESSAGE;
    return 'tg://resolve?domain=' + TELEGRAM_USERNAME + '&text=' + encodeURIComponent(message);
  }

  function buildWhatsAppDeeplink(message) {
    message = message || DEFAULT_MESSAGE;
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  function getFallbackURL(messengerType, message) {
    message = message || DEFAULT_MESSAGE;
    var encodedMessage = encodeURIComponent(message);
    if (messengerType === 'telegram') {
      return 'https://t.me/' + TELEGRAM_USERNAME + '?text=' + encodedMessage;
    } else if (messengerType === 'whatsapp') {
      return 'https://web.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodedMessage;
    }
    return '';
  }

  function showBridge(messengerType, callback) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      callback();
      return;
    }

    var bridge = document.getElementById('messenger-bridge');
    if (!bridge) {
      callback();
      return;
    }

    var textEl = bridge.querySelector('.messenger-bridge__text');
    var name = MESSENGER_NAMES[messengerType] || messengerType;
    if (messengerType === 'max') {
      textEl.textContent = 'Сейчас откроется ' + name + '. Напишите \u00ABЗдравствуйте\u00BB\u00A0\u2014 Ксения ответит в течение 2 часов';
    } else {
      textEl.textContent = 'Сейчас откроется ' + name + '. Сообщение уже заполнено\u00A0\u2014 просто нажмите \u00ABОтправить\u00BB';
    }

    bridge.classList.add('messenger-bridge--visible');

    setTimeout(function() {
      bridge.classList.remove('messenger-bridge--visible');
      callback();
    }, BRIDGE_DELAY);
  }

  function openDeeplink(messengerType, message, button) {
    var deeplinkURL;
    if (messengerType === 'telegram') {
      deeplinkURL = buildTelegramDeeplink(message);
    } else if (messengerType === 'whatsapp') {
      deeplinkURL = buildWhatsAppDeeplink(message);
    } else if (messengerType === 'max') {
      window.open(button.href, '_blank');
      return;
    } else {
      return;
    }

    var fallbackURL = button.getAttribute('data-fallback') || getFallbackURL(messengerType, message);

    var appOpened = false;
    var startTime = Date.now();

    var fallbackTimer = setTimeout(function() {
      if (!appOpened && Date.now() - startTime >= FALLBACK_TIMEOUT) {
        window.open(fallbackURL, '_blank');
      }
    }, FALLBACK_TIMEOUT);

    var visibilityHandler = function() {
      if (document.hidden) {
        appOpened = true;
        clearTimeout(fallbackTimer);
      }
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    var blurHandler = function() {
      appOpened = true;
      clearTimeout(fallbackTimer);
      window.removeEventListener('blur', blurHandler);
    };
    window.addEventListener('blur', blurHandler);

    try {
      window.location.href = deeplinkURL;
    } catch (e) {
      clearTimeout(fallbackTimer);
      window.open(fallbackURL, '_blank');
    }
  }

  function handleMessengerClick(event, button) {
    event.preventDefault();

    var messengerType = button.getAttribute('data-cta');
    var buttonPosition = button.getAttribute('data-position') || 'unknown';

    if (typeof window.trackMessengerClick === 'function') {
      window.trackMessengerClick(messengerType, buttonPosition);
    }

    var message = buildPersonalizedMessage();

    showBridge(messengerType, function() {
      openDeeplink(messengerType, message, button);
    });
  }

  function initDeeplinks() {
    var ctaButtons = document.querySelectorAll('[data-cta="telegram"], [data-cta="whatsapp"], [data-cta="max"]');

    ctaButtons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        handleMessengerClick(event, button);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDeeplinks);
  } else {
    initDeeplinks();
  }

  window.buildTelegramDeeplink = buildTelegramDeeplink;
  window.buildWhatsAppDeeplink = buildWhatsAppDeeplink;
})();
