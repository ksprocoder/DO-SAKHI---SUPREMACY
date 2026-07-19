const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/Users/naveensaini/.gemini/antigravity/brain/4afcf28f-254c-44c8-a5f8-3b0c6a7c9c02';

async function runQA() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const logs = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  const failedRequests = [];
  page.on('requestfailed', request => {
    failedRequests.push(request.url());
  });

  page.on('response', response => {
    if (response.status() >= 400 && response.request().resourceType() === 'image') {
      failedRequests.push(`Image 404/500: ${response.url()}`);
    }
  });

  try {
    console.log('1. Opening /shop...');
    await page.goto('http://localhost:3001/shop', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'shop.png'), fullPage: true });
    console.log('Shop screenshot saved.');

    console.log('2. Opening PDP...');
    await page.goto('http://localhost:3001/product/emerald-jute-overlay-co-ord-b204', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUT_DIR, 'pdp.png'), fullPage: true });
    console.log('PDP screenshot saved.');

    console.log('3. Checking API response for data exposure...');
    const apiRes = await page.evaluate(async () => {
      const r = await fetch('http://localhost:4000/api/v1/products/emerald-jute-overlay-co-ord-b204');
      return await r.json();
    });
    fs.writeFileSync(path.join(OUT_DIR, 'api-exposure.json'), JSON.stringify(apiRes, null, 2));

    console.log('4. Adding to cart...');
    // Add to cart button might be named different things or requires size selection
    try {
      const sizeBtn = page.locator('button:text-is("M")').first();
      await sizeBtn.click({ timeout: 5000 });
      console.log('Clicked Size M');
    } catch (e) {
      console.log('Could not click size M, trying L...');
      const sizeBtnL = page.locator('button:text-is("L")').first();
      await sizeBtnL.click({ timeout: 5000 }).catch(() => console.log('Could not click size L either'));
    }

    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("ADD TO CART")').first();
    try {
      await addToCartBtn.click({ timeout: 5000 });
      console.log('Clicked Add to Cart');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(OUT_DIR, 'cart.png') });
      console.log('Cart screenshot saved.');
      
      console.log('5. Proceeding to checkout...');
      const checkoutBtn = page.locator('button:has-text("Checkout"), a[href="/checkout"], button:has-text("CHECKOUT")').first();
      await checkoutBtn.click({ timeout: 5000 });
      console.log('Clicked Checkout');
      await page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(OUT_DIR, 'checkout.png'), fullPage: true });
      console.log('Checkout screenshot saved.');
    } catch (e) {
      console.log('Failed to interact with cart/checkout:', e.message);
    }

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    console.log('\n--- Console Logs ---');
    console.log(logs.join('\n') || 'None');
    console.log('\n--- Failed Requests ---');
    console.log(failedRequests.join('\n') || 'None');
    await browser.close();
  }
}

runQA();
