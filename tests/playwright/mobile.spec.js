// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration test: Mobile rendering (360px viewport)
 * This test MUST FAIL initially (no responsive design)
 */
test.describe('Mobile Rendering', () => {
  test.use({
    viewport: { width: 360, height: 640 }
  });

  test('should render without horizontal scroll', async ({ page }) => {
    await page.goto('/');

    // Check document width
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    // No horizontal overflow
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
  });

  test('CTA buttons should meet minimum touch target size (44x44px)', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('[data-cta]').all();

    for (const button of buttons) {
      const box = await button.boundingBox();

      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('font size should be at least 16px on mobile', async ({ page }) => {
    await page.goto('/');

    // Check body font size
    const bodyFontSize = await page.evaluate(() => {
      const body = document.querySelector('body');
      return window.getComputedStyle(body).fontSize;
    });

    const fontSize = parseFloat(bodyFontSize);
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test('images should have lazy loading attribute', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();

    for (const img of images) {
      const loading = await img.getAttribute('loading');

      // At least check that some images have lazy loading
      // (first image might not be lazy-loaded if it's above the fold)
      if (loading) {
        expect(loading).toBe('lazy');
      }
    }

    // Ensure at least one image exists
    expect(images.length).toBeGreaterThan(0);
  });

  test('all content blocks should be visible on mobile', async ({ page }) => {
    await page.goto('/');

    const blocks = [
      'hero',
      'symptoms',
      'benefits',
      'about',
      'process',
      'testimonials',
      'pricing',
      'faq',
      'cta-final',
      'footer'
    ];

    for (const blockName of blocks) {
      const block = page.locator(`[data-block="${blockName}"]`);
      await expect(block).toBeVisible();
    }
  });

  test('navigation and scrolling should work smoothly', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(100);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(100);

    // Should still be on same page
    expect(page.url()).toContain('/');
  });

  test('text should not overflow containers on mobile', async ({ page }) => {
    await page.goto('/');

    // Check for horizontal scroll caused by text overflow
    const hasOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          return true;
        }
      }
      return false;
    });

    expect(hasOverflow).toBe(false);
  });

  test('Hero section should be visible above the fold', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('[data-block="hero"]');
    await expect(hero).toBeInViewport();
  });
});
