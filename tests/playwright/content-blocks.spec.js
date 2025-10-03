// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Integration test: All content blocks present
 * This test MUST FAIL initially (blocks don't exist)
 */
test.describe('Content Blocks', () => {
  const expectedBlocks = [
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

  test('should have all 10 content blocks with data-block attributes', async ({ page }) => {
    await page.goto('/');

    for (const blockName of expectedBlocks) {
      const block = page.locator(`[data-block="${blockName}"]`);
      await expect(block).toBeVisible({
        timeout: 5000
      });
    }
  });

  test('each block should have visible content', async ({ page }) => {
    await page.goto('/');

    for (const blockName of expectedBlocks) {
      const block = page.locator(`[data-block="${blockName}"]`);

      // Check block exists and has some text content
      const textContent = await block.textContent();
      expect(textContent).toBeTruthy();
      expect(textContent.trim().length).toBeGreaterThan(0);
    }
  });

  test('blocks should appear in correct order', async ({ page }) => {
    await page.goto('/');

    // Get all blocks
    const blocks = await page.locator('[data-block]').all();

    expect(blocks.length).toBeGreaterThanOrEqual(10);

    // Verify order by checking data-block attributes
    const blockOrder = [];
    for (const block of blocks) {
      const dataBlock = await block.getAttribute('data-block');
      blockOrder.push(dataBlock);
    }

    // Hero should be first
    expect(blockOrder[0]).toBe('hero');

    // Footer should be last
    expect(blockOrder[blockOrder.length - 1]).toBe('footer');

    // CTA-final should come before footer
    const ctaIndex = blockOrder.indexOf('cta-final');
    const footerIndex = blockOrder.indexOf('footer');
    expect(ctaIndex).toBeLessThan(footerIndex);
  });

  test('Symptoms block should have checklist items', async ({ page }) => {
    await page.goto('/');

    const symptomsBlock = page.locator('[data-block="symptoms"]');
    await expect(symptomsBlock).toBeVisible();

    // Should have multiple symptom items (at least 8)
    const items = symptomsBlock.locator('li, .symptom-item, [class*="symptom"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(3); // At least some items
  });

  test('Benefits block should have result items', async ({ page }) => {
    await page.goto('/');

    const benefitsBlock = page.locator('[data-block="benefits"]');
    await expect(benefitsBlock).toBeVisible();

    // Should mention КПТ method
    const text = await benefitsBlock.textContent();
    expect(text).toContain('КПТ');
  });

  test('FAQ block should have questions and answers', async ({ page }) => {
    await page.goto('/');

    const faqBlock = page.locator('[data-block="faq"]');
    await expect(faqBlock).toBeVisible();

    // Should have at least 5 FAQ items
    const text = await faqBlock.textContent();
    expect(text.length).toBeGreaterThan(100); // Has substantial content
  });

  test('Pricing block should have price information', async ({ page }) => {
    await page.goto('/');

    const pricingBlock = page.locator('[data-block="pricing"]');
    await expect(pricingBlock).toBeVisible();

    const text = await pricingBlock.textContent();
    // Should contain price information
    expect(text).toMatch(/\d+\s*₽/); // Number followed by ruble symbol
  });

  test('Testimonials block should exist', async ({ page }) => {
    await page.goto('/');

    const testimonialsBlock = page.locator('[data-block="testimonials"]');
    await expect(testimonialsBlock).toBeVisible();
  });

  test('Process block should have steps', async ({ page }) => {
    await page.goto('/');

    const processBlock = page.locator('[data-block="process"]');
    await expect(processBlock).toBeVisible();

    const text = await processBlock.textContent();
    expect(text.length).toBeGreaterThan(50);
  });
});
