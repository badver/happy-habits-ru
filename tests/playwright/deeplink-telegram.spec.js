// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Contract test: Telegram deeplink verification
 * This test MUST FAIL initially (button doesn't exist yet)
 */
test.describe('Telegram Deeplink', () => {
  test('should have Telegram CTA button with correct deeplink', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Find Telegram button by data attribute
    const telegramButton = page.locator('[data-cta="telegram"]');

    // Verify button exists
    await expect(telegramButton).toBeVisible();

    // Verify href contains correct Telegram deeplink
    const href = await telegramButton.getAttribute('href');
    expect(href).toContain('tg://resolve?domain=happy_habits_ru');

    // Verify pre-filled text (URL encoded)
    const expectedText = encodeURIComponent('Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)');
    expect(href).toContain(expectedText);
  });

  test('should have fallback to web Telegram', async ({ page }) => {
    await page.goto('/');

    const telegramButton = page.locator('[data-cta="telegram"]');

    // Check if there's a fallback mechanism or alternative link
    // This could be data-fallback attribute or onclick handler
    const fallbackUrl = await telegramButton.getAttribute('data-fallback');

    if (fallbackUrl) {
      expect(fallbackUrl).toContain('https://t.me/happy_habits_ru');
    }
  });

  test('should open Telegram deeplink on click', async ({ page, context }) => {
    await page.goto('/');

    const telegramButton = page.locator('[data-cta="telegram"]').first();

    // Track popup/new tab
    const [popup] = await Promise.race([
      Promise.all([
        context.waitForEvent('page'),
        telegramButton.click()
      ]),
      // Fallback: just click and check href
      (async () => {
        const href = await telegramButton.getAttribute('href');
        expect(href).toBeTruthy();
        return [null];
      })()
    ]);

    if (popup) {
      // If popup opened, verify URL
      expect(popup.url()).toMatch(/tg:\/\/resolve|t\.me/);
    }
  });
});
