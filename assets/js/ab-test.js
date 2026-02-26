/**
 * A/B Testing Logic
 * Random title + subtitle combo on every page load (no persistence)
 */

(function () {
  'use strict';

  const YM_ID = '{{ .Site.Params.yandexMetrikaID }}';

  const TITLES = [
    'Тревога мешает жить. Я помогу это изменить.',
    'Тревога не отпускает. Есть выход.',
    'Устали бороться с тревогой? Есть метод, который работает.',
    'Верните себе спокойствие. Без таблеток, без лишних слов.'
  ];

  const SUBTITLES = [
    'Психолог онлайн. Работаю с тревогой методом КПТ — научно обоснованный подход с конкретными результатами.',
    'Онлайн-психолог, метод КПТ. Конкретные навыки вместо бесконечных разговоров.',
    'КПТ-психолог онлайн. Структурный подход: вы получите инструменты, а не просто поддержку.',
    'Психолог онлайн. Когнитивно-поведенческая терапия — от первой встречи к ощутимым переменам.'
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

  function applyHeroVariants() {
    const title = pickRandom(TITLES);
    const subtitle = pickRandom(SUBTITLES);

    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');

    if (heroTitle) heroTitle.textContent = title;
    if (heroSubtitle) heroSubtitle.textContent = subtitle;

    trackVariant('hero_title', title);
    trackVariant('hero_subtitle', subtitle);
  }

  function init() {
    try {
      applyHeroVariants();
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
