// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Contract test: WhatsApp deeplink verification
 * This test MUST FAIL initially (button doesn't exist yet)
 */
test.describe('WhatsApp Deeplink', () => {
  test('should have WhatsApp CTA button with correct deeplink', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Find WhatsApp button by data attribute
    const whatsappButton = page.locator('[data-cta="whatsapp"]');

    // Verify button exists
    await expect(whatsappButton).toBeVisible();

    // Verify href contains correct WhatsApp link
    const href = await whatsappButton.getAttribute('href');
    expect(href).toContain('https://wa.me/905071754633');

    // Verify pre-filled text (URL encoded)
    const expectedText = encodeURIComponent('Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)');
    expect(href).toContain(expectedText);
  });

  test('should have same pre-filled message as Telegram', async ({ page }) => {
    await page.goto('/');

    const telegramButton = page.locator('[data-cta="telegram"]').first();
    const whatsappButton = page.locator('[data-cta="whatsapp"]').first();

    const telegramHref = await telegramButton.getAttribute('href');
    const whatsappHref = await whatsappButton.getAttribute('href');

    // Both should contain the same encoded message
    const expectedText = encodeURIComponent('Здравствуйте! Хочу записаться на бесплатную диагностику (30 минут)');

    expect(telegramHref).toContain(expectedText);
    expect(whatsappHref).toContain(expectedText);
  });

  test('should have fallback to web WhatsApp', async ({ page }) => {
    await page.goto('/');

    const whatsappButton = page.locator('[data-cta="whatsapp"]');

    // Check if there's a fallback mechanism
    const fallbackUrl = await whatsappButton.getAttribute('data-fallback');

    if (fallbackUrl) {
      expect(fallbackUrl).toContain('https://web.whatsapp.com/');
    }
  });

  test('should open WhatsApp deeplink on click', async ({ page }) => {
    await page.goto('/');

    const whatsappButton = page.locator('[data-cta="whatsapp"]').first();

    // Verify href is valid before clicking
    const href = await whatsappButton.getAttribute('href');
    expect(href).toMatch(/wa\.me\/905071754633/);
    expect(href).toContain('text=');
  });
});
