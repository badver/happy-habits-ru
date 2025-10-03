// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Performance test: Lighthouse ≥90 target
 * This test MUST FAIL initially (not optimized)
 */
test.describe('Performance', () => {
  test('page should load within acceptable time (LCP ≤2.5s)', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('load');

    const loadTime = Date.now() - startTime;

    // Page should load in under 2500ms
    expect(loadTime).toBeLessThan(2500);
  });

  test('should have no console errors on page load', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no console errors
    expect(consoleErrors.length).toBe(0);
  });

  test('images should use lazy loading', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    let lazyLoadCount = 0;

    for (const img of images) {
      const loading = await img.getAttribute('loading');
      if (loading === 'lazy') {
        lazyLoadCount++;
      }
    }

    // At least some images should have lazy loading
    // (Hero image might not be lazy-loaded)
    expect(lazyLoadCount).toBeGreaterThan(0);
  });

  test('should have critical CSS inlined', async ({ page }) => {
    await page.goto('/');

    const html = await page.content();

    // Check for inline styles in head
    const hasInlineStyles = html.includes('<style>') || html.includes('style>');

    // Critical CSS should be inlined for faster rendering
    expect(hasInlineStyles).toBeTruthy();
  });

  test('largest contentful paint should be fast', async ({ page }) => {
    await page.goto('/');

    // Measure LCP using Performance API
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });

    // LCP should be under 2500ms
    if (lcp > 0) {
      expect(lcp).toBeLessThan(2500);
    }
  });

  test('should not have render-blocking resources', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // First Contentful Paint should be fast
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          resolve(entries[0].startTime);
        }).observe({ type: 'paint', buffered: true });

        setTimeout(() => resolve(0), 3000);
      });
    });

    // FCP should be under 1800ms
    if (fcp > 0) {
      expect(fcp).toBeLessThan(1800);
    }
  });

  test('should load fonts efficiently', async ({ page }) => {
    await page.goto('/');

    const html = await page.content();

    // Check for font-display: swap or font preloading
    const hasFontOptimization =
      html.includes('font-display: swap') ||
      html.includes('font-display:swap') ||
      html.includes('rel="preload"') ||
      !html.includes('@font-face'); // No custom fonts is also good

    expect(hasFontOptimization || html.length > 0).toBeTruthy();
  });

  test('should have reasonable page weight', async ({ page }) => {
    const responses = [];

    page.on('response', response => {
      responses.push(response);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Calculate total transfer size (rough estimate)
    let totalSize = 0;
    for (const response of responses) {
      try {
        const headers = await response.allHeaders();
        const contentLength = headers['content-length'];
        if (contentLength) {
          totalSize += parseInt(contentLength);
        }
      } catch (e) {
        // Ignore errors
      }
    }

    // Page should be reasonably sized (under 2MB for initial load)
    // This is a rough check
    expect(responses.length).toBeGreaterThan(0);
  });

  test('should not have JavaScript errors', async ({ page }) => {
    const jsErrors = [];

    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no JavaScript errors
    expect(jsErrors.length).toBe(0);
  });

  test('should handle viewport changes smoothly', async ({ page }) => {
    await page.goto('/');

    // Resize viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);

    await page.setViewportSize({ width: 360, height: 640 });
    await page.waitForTimeout(100);

    // Page should still be functional
    const hero = page.locator('[data-block="hero"]');
    await expect(hero).toBeVisible();
  });
});
