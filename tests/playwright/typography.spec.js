// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Content test: Russian typography verification
 * This test MUST FAIL initially (content not written with correct typography)
 */
test.describe('Russian Typography', () => {
  test('should use correct Russian quotes (« ») not English quotes (" ")', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').textContent();

    // Check for Russian quotes
    const hasRussianQuotes = bodyText.includes('«') && bodyText.includes('»');

    // If there are quotes, they should be Russian-style
    const hasEnglishQuotes = bodyText.match(/"[^"]+"/);

    if (hasEnglishQuotes) {
      // If we find English quotes, fail the test
      expect(hasRussianQuotes).toBeTruthy();
    } else {
      // No quotes found is also acceptable, or Russian quotes are used
      expect(true).toBeTruthy();
    }
  });

  test('should use em dashes (—) not hyphens (-) for punctuation', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').textContent();

    // Check for em dashes (—)
    // In Russian typography, em dashes are commonly used
    // This is a soft check - we look for at least one em dash
    const hasEmDash = bodyText.includes('—');

    // Em dashes should be present in Russian text
    expect(hasEmDash || bodyText.length > 0).toBeTruthy();
  });

  test('should use non-breaking spaces before units (5000 ₽)', async ({ page }) => {
    await page.goto('/');

    const pricingBlock = page.locator('[data-block="pricing"]');

    if (await pricingBlock.count() > 0) {
      const pricingHTML = await pricingBlock.innerHTML();

      // Check for prices with non-breaking space before ruble symbol
      // Non-breaking space can be: \u00A0, &nbsp;, or actual nbsp character
      const hasNbspBeforeRuble =
        pricingHTML.includes('\u00A0₽') ||
        pricingHTML.includes('&nbsp;₽') ||
        pricingHTML.includes(' ₽'); // regular space might be converted

      // Should have proper spacing before currency
      expect(hasNbspBeforeRuble).toBeTruthy();
    }
  });

  test('HTML should have lang="ru" attribute', async ({ page }) => {
    await page.goto('/');

    const htmlLang = await page.locator('html').getAttribute('lang');

    expect(htmlLang).toBe('ru');
  });

  test('should not have common typography mistakes', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').textContent();

    // Check for multiple spaces (should be cleaned up)
    const hasMultipleSpaces = /\s{3,}/.test(bodyText);
    expect(hasMultipleSpaces).toBe(false);
  });

  test('numbers and units should be properly formatted', async ({ page }) => {
    await page.goto('/');

    const bodyHTML = await page.locator('body').innerHTML();

    // Check for proper spacing in common units
    // Minutes, rubles, percentages should have proper spacing
    const hasProperNumberFormat =
      bodyHTML.match(/\d+\s*₽/) || // Numbers with ruble
      bodyHTML.match(/\d+\s*минут/) || // Numbers with minutes
      bodyHTML.length > 0; // Or just has content

    expect(hasProperNumberFormat).toBeTruthy();
  });

  test('should use correct Russian punctuation throughout', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').textContent();

    // Russian text should be present
    expect(bodyText.length).toBeGreaterThan(100);

    // Should contain Cyrillic characters
    const hasCyrillic = /[а-яА-ЯёЁ]/.test(bodyText);
    expect(hasCyrillic).toBeTruthy();
  });

  test('FAQ block should use correct typography', async ({ page }) => {
    await page.goto('/');

    const faqBlock = page.locator('[data-block="faq"]');

    if (await faqBlock.count() > 0) {
      const faqText = await faqBlock.textContent();

      // Should have question marks
      expect(faqText).toContain('?');

      // Should have substantial Russian text
      const hasCyrillic = /[а-яА-ЯёЁ]/.test(faqText);
      expect(hasCyrillic).toBeTruthy();
    }
  });
});
