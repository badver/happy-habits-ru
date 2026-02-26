/**
 * A/B Testing Logic
 * Random title + subtitle + CTA combo on every page load (no persistence)
 */

(function () {
  'use strict';

  const YM_ID = '{{ .Site.Params.yandexMetrikaID }}';

  const TITLES = [
    'Тревога мешает жить? Я помогу это изменить.',
    'Тревога не отпускает? Есть выход.',
    'Устали бороться с тревогой? Есть метод, который работает.',
    'Верните себе спокойствие. Без таблеток, без лишних слов.'
  ];

  const SUBTITLES = [
    'Психолог онлайн. Работаю с тревогой методом КПТ — научно обоснованный подход с конкретными результатами.',
    'Онлайн-психолог, метод КПТ. Конкретные навыки вместо бесконечных разговоров.',
    'КПТ-психолог онлайн. Структурный подход: вы получите инструменты, а не просто поддержку.',
    'Психолог онлайн. Когнитивно-поведенческая терапия — от первой встречи к ощутимым переменам.'
  ];

  const CTA_BUTTONS = [
    'Записаться на вводную встречу',
    'Обсудить мою ситуацию',
    'Сделать первый шаг',
    'Узнать, подходит ли мне КПТ'
  ];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function trackVariant(testName, value) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_variant', { test_name: testName, variant_id: value });
    }
    if (typeof ym !== 'undefined' && YM_ID) {
      ym(YM_ID, 'params', { [`ab_test_${testName}`]: value });
    }
  }

  function init() {
    try {
      const title = pickRandom(TITLES);
      const subtitle = pickRandom(SUBTITLES);
      const cta = pickRandom(CTA_BUTTONS);

      const heroTitle = document.querySelector('.hero__title');
      const heroSubtitle = document.querySelector('.hero__subtitle');

      if (heroTitle) heroTitle.textContent = title;
      if (heroSubtitle) heroSubtitle.textContent = subtitle;

      // Update hero CTA button (keep icon if present)
      const heroBtn = document.querySelector('.hero__cta .btn');
      if (heroBtn) {
        heroBtn.textContent = cta;
        heroBtn.setAttribute('aria-label', cta);
      }

      trackVariant('hero_title', title);
      trackVariant('hero_subtitle', subtitle);
      trackVariant('hero_cta', cta);
    } catch (e) {
      console.error('A/B test error:', e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
