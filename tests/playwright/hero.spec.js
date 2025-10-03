// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration test: Hero section rendering
 * This test MUST FAIL initially (Hero partial doesn't exist)
 */
test.describe('Hero Section', () => {
  test('should render H1 with correct text', async ({ page }) => {
    await page.goto('/');

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    const h1Text = await h1.textContent();
    expect(h1Text).toContain('Освободитесь от тревоги за 8-12 сессий');
  });

  test('should render subtitle with social proof', async ({ page }) => {
    await page.goto('/');

    // Look for subtitle or any element containing the social proof
    const subtitle = page.locator('text=/8 из 10 клиентов/');
    await expect(subtitle).toBeVisible();
  });

  test('should have 2 CTA buttons (Telegram and WhatsApp)', async ({ page }) => {
    await page.goto('/');

    const telegramButton = page.locator('[data-cta="telegram"]').first();
    const whatsappButton = page.locator('[data-cta="whatsapp"]').first();

    await expect(telegramButton).toBeVisible();
    await expect(whatsappButton).toBeVisible();
  });

  test('should have 3 badges visible', async ({ page }) => {
    await page.goto('/');

    // Look for badges with specific text
    const confidentialBadge = page.locator('text=/Конфиденциально/');
    const onlineBadge = page.locator('text=/Только онлайн/');
    const responseBadge = page.locator('text=/Ответ в течение 2 часов/');

    await expect(confidentialBadge).toBeVisible();
    await expect(onlineBadge).toBeVisible();
    await expect(responseBadge).toBeVisible();
  });

  test('should have psychologist photo', async ({ page }) => {
    await page.goto('/');

    // Look for image in hero section
    const heroSection = page.locator('[data-block="hero"]');
    const photo = heroSection.locator('img').first();

    await expect(photo).toBeVisible();

    // Verify image has alt text
    const altText = await photo.getAttribute('alt');
    expect(altText).toBeTruthy();
    expect(altText.length).toBeGreaterThan(0);
  });

  test('should have data-block attribute on Hero section', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('[data-block="hero"]');
    await expect(heroSection).toBeVisible();
  });

  test('CTA buttons should be properly sized for touch', async ({ page }) => {
    await page.goto('/');

    const telegramButton = page.locator('[data-cta="telegram"]').first();

    // Get button dimensions
    const box = await telegramButton.boundingBox();
    expect(box).toBeTruthy();

    // Verify minimum touch target size (44x44px)
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });
});
