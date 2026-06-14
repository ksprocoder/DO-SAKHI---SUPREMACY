const { chromium } = require('playwright');
const fs = require('fs');

async function runQA() {
  console.log('Starting Playwright QA...');
  const browser = await chromium.launch({ headless: true });
  
  const viewports = [
    { width: 375, height: 812, name: 'mobile-375' },
    { width: 768, height: 1024, name: 'tablet-768' },
    { width: 1440, height: 900, name: 'desktop-1440' }
  ];

  let errors = [];
  let consoleLogs = [];

  for (const vp of viewports) {
    console.log(`\nTesting viewport: ${vp.name}`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleLogs.push(`[${vp.name}] Console ${msg.type()}: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      errors.push(`[${vp.name}] Page Error: ${error.message}`);
    });

    try {
      // 1. Homepage
      console.log('Navigating to Homepage...');
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `qa-screenshots/${vp.name}-home.png`, fullPage: true });

      // 2. Shop Page
      console.log('Navigating to Shop...');
      await page.goto('http://localhost:3001/shop');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `qa-screenshots/${vp.name}-shop.png`, fullPage: true });

      // 3. Product Detail Page
      console.log('Navigating to PDP...');
      await page.goto('http://localhost:3001/product/ivory-leaf-print-summer-suit-set');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `qa-screenshots/${vp.name}-pdp.png`, fullPage: true });

      // 4. Test Add to Cart & Drawer
      console.log('Testing Cart Drawer...');
      // Assuming size M is available. We might need to click the size selector.
      // Look for a size button containing 'M'
      const sizeM = page.locator('button:has-text("M")').first();
      if (await sizeM.isVisible()) {
        await sizeM.click();
      }
      
      const addToCartBtn = page.locator('button:has-text("Add to Cart")');
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await page.waitForTimeout(1000); // Wait for drawer to open
        await page.screenshot({ path: `qa-screenshots/${vp.name}-cart-drawer.png` });
      }

      // 5. Custom Fit Drawer
      const customFitBtn = page.locator('button:has-text("Add Custom Fit")');
      if (await customFitBtn.isVisible()) {
        await customFitBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `qa-screenshots/${vp.name}-tailoring-drawer.png` });
        
        // Close tailoring drawer if possible
        const closeBtn = page.locator('button[aria-label="Close"], .close-btn').first();
        if (await closeBtn.isVisible()) await closeBtn.click();
      }

      // 6. Checkout
      console.log('Navigating to Checkout...');
      await page.goto('http://localhost:3001/checkout');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `qa-screenshots/${vp.name}-checkout.png`, fullPage: true });

      // 7. Admin Smoke
      console.log('Navigating to Admin Products...');
      await page.goto('http://localhost:3001/admin/products');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: `qa-screenshots/${vp.name}-admin-products.png` });

    } catch (e) {
      errors.push(`[${vp.name}] Script Execution Error: ${e.message}`);
    }

    await context.close();
  }

  await browser.close();

  console.log('\n--- QA RESULTS ---');
  console.log('Console Logs/Warnings:', consoleLogs.length);
  consoleLogs.forEach(l => console.log(l));
  console.log('Errors:', errors.length);
  errors.forEach(e => console.error(e));
  console.log('Screenshots saved to qa-screenshots/');
}

if (!fs.existsSync('qa-screenshots')) {
  fs.mkdirSync('qa-screenshots');
}

runQA().catch(console.error);
