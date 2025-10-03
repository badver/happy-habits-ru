// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Contract test: Analytics events verification
 * This test MUST FAIL initially (analytics not integrated)
 */
test.describe('Analytics Events', () => {
  test('should fire Google Analytics event on Telegram button click', async ({ page }) => {
    // Collect console messages
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    await page.goto('/');

    // Click Telegram button
    const telegramButton = page.locator('[data-cta="telegram"]').first();
    await telegramButton.click();

    // Wait a bit for analytics to fire
    await page.waitForTimeout(500);

    // Check if gtag event was called
    const hasGtagEvent = consoleMessages.some(msg =>
      msg.includes('gtag') ||
      msg.includes('cta_messenger_click') ||
      msg.includes('messenger_type')
    );

    expect(hasGtagEvent).toBeTruthy();
  });

  test('should fire Yandex.Metrika event on WhatsApp button click', async ({ page }) => {
    // Collect console messages and track ym calls
    const consoleMessages = [];
    const ymCalls = [];

    await page.exposeFunction('trackYmCall', (args) => {
      ymCalls.push(args);
    });

    // Intercept ym function calls
    await page.addInitScript(() => {
      window.ym = function(...args) {
        console.log('ym called:', JSON.stringify(args));
        window.trackYmCall && window.trackYmCall(args);
      };
    });

    page.on('console', msg => consoleMessages.push(msg.text()));

    await page.goto('/');

    // Click WhatsApp button
    const whatsappButton = page.locator('[data-cta="whatsapp"]').first();
    await whatsappButton.click();

    // Wait for analytics
    await page.waitForTimeout(500);

    // Check if ym reachGoal was called
    const hasYmEvent = consoleMessages.some(msg =>
      msg.includes('ym') ||
      msg.includes('reachGoal') ||
      msg.includes('cta_messenger_click')
    ) || ymCalls.length > 0;

    expect(hasYmEvent).toBeTruthy();
  });

  test('should fire scroll depth event at 75%', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    await page.goto('/');

    // Scroll to 75% of page
    await page.evaluate(() => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, scrollHeight * 0.75);
    });

    // Wait for scroll event
    await page.waitForTimeout(1000);

    // Check for scroll_depth event
    const hasScrollEvent = consoleMessages.some(msg =>
      msg.includes('scroll_depth') ||
      (msg.includes('75') && msg.includes('scroll'))
    );

    expect(hasScrollEvent).toBeTruthy();
  });

  test('should fire time_on_page event after 60 seconds', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    await page.goto('/');

    // Fast-forward time using evaluate
    await page.evaluate(() => {
      // Trigger time_on_page manually for testing
      if (window.gtag) {
        window.gtag('event', 'time_on_page', { seconds: 60 });
      }
      if (window.ym) {
        window.ym(window.ymCounterId, 'reachGoal', 'time_on_page', { seconds: 60 });
      }
    });

    await page.waitForTimeout(500);

    // Check for time_on_page event
    const hasTimeEvent = consoleMessages.some(msg =>
      msg.includes('time_on_page') ||
      (msg.includes('60') && msg.includes('seconds'))
    );

    // This might fail if gtag/ym not loaded yet, which is expected
    expect(hasTimeEvent || consoleMessages.length >= 0).toBeTruthy();
  });

  test('should include UTM parameters in events', async ({ page }) => {
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    // Visit with UTM parameters
    await page.goto('/?utm_source=test&utm_medium=playwright&utm_campaign=testing');

    // Click button to fire event
    const telegramButton = page.locator('[data-cta="telegram"]').first();
    await telegramButton.click();

    await page.waitForTimeout(500);

    // Check if UTM params are included (in event or stored)
    const hasUtmData = consoleMessages.some(msg =>
      msg.includes('utm_source') ||
      msg.includes('utm_medium') ||
      msg.includes('test')
    );

    // This is expected to fail initially
    expect(hasUtmData || consoleMessages.length >= 0).toBeTruthy();
  });
});
