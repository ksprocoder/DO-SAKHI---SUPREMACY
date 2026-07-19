const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3001';
const API_BASE = 'http://localhost:4000/api/v1';

async function runEnhancedQA() {
  console.log('🚀 Starting Enhanced QA Test...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const results = {
    pages: {},
    consoleErrors: [],
    networkErrors: [],
    networkRequests: [],
  };

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push(msg.text());
    }
  });

  // Capture page errors
  page.on('pageerror', err => {
    results.consoleErrors.push(`PageError: ${err.message}`);
  });

  // Capture network requests
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    if (url.includes('localhost:4000') || url.includes('api/v1') || url.includes('r2.dev')) {
      results.networkRequests.push({ url, status });
      if (status >= 400) {
        results.networkErrors.push({ url, status });
      }
    }
  });

  const screenshotDir = 'qa-screenshots';
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  // Helper: test a page
  async function testPage(name, url, checks = []) {
    console.log(`\n📄 Testing: ${name} (${url})`);
    const result = { url, status: 'unknown', title: '', checks: [], screenshot: '' };
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      result.status = response?.status() || 'unknown';
      result.title = await page.title();
      
      const screenshotPath = `${screenshotDir}/fresh-${name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      result.screenshot = screenshotPath;
      
      for (const check of checks) {
        try {
          const found = await page.locator(check.selector).isVisible({ timeout: 5000 }).catch(() => false);
          result.checks.push({ name: check.name, passed: found });
          console.log(`  ${found ? '✅' : '❌'} ${check.name}`);
        } catch(e) {
          result.checks.push({ name: check.name, passed: false, error: e.message });
          console.log(`  ❌ ${check.name}: ${e.message}`);
        }
      }
      console.log(`  ✅ Loaded: ${result.title} (HTTP ${result.status})`);
    } catch(e) {
      result.status = 'ERROR';
      result.error = e.message;
      console.log(`  ❌ FAILED: ${e.message}`);
    }
    results.pages[name] = result;
    return result;
  }

  // 1. Home Page
  await testPage('home', `${BASE}/`, [
    { selector: 'h1, h2', name: 'Has heading' },
    { selector: 'nav a', name: 'Has nav links' },
  ]);

  // 2. Shop Page
  await testPage('shop', `${BASE}/shop`, [
    { selector: 'main#shop-main', name: 'Shop main container' },
    { selector: '[aria-label="Shop Collection"]', name: 'Shop aria label' },
  ]);

  // Wait for products to load
  await page.waitForTimeout(3000);
  const productsLoaded = await page.locator('[data-product-card], .product-card, [data-testid="product-card"]').count().catch(() => 0);
  console.log(`  Products found: ${productsLoaded}`);
  results.pages['shop'].productsCount = productsLoaded;
  
  // Take shop screenshot after products load
  await page.screenshot({ path: `${screenshotDir}/fresh-shop-with-products.png`, fullPage: true });

  // 3. Find a product link and test it
  const productLinks = await page.locator('a[href^="/product/"]').all();
  let productSlug = 'ivory-leaf-print-summer-suit-set'; // fallback
  if (productLinks.length > 0) {
    const href = await productLinks[0].getAttribute('href');
    if (href) productSlug = href.replace('/product/', '');
  }
  console.log(`  Found ${productLinks.length} product links. Testing: ${productSlug}`);

  // 4. Product Detail Page
  const pdpResult = await testPage('pdp', `${BASE}/product/${productSlug}`, [
    { selector: 'button:has-text("Add to Cart"), button:has-text("Add to Bag")', name: 'Add to Cart button' },
    { selector: 'h1', name: 'Product title' },
  ]);

  // 5. Test Add to Cart
  console.log('\n🛒 Testing Add to Cart...');
  try {
    await page.goto(`${BASE}/product/${productSlug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Try to select a size
    const sizeBtn = page.locator('button:has-text("S"), button:has-text("M"), button:has-text("L")').first();
    const hasSizes = await sizeBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasSizes) {
      await sizeBtn.click();
      console.log('  ✅ Size selected');
    } else {
      console.log('  ℹ️ No size buttons visible');
    }
    
    const addToCart = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Bag"), button[aria-label*="cart" i]').first();
    const hasAddToCart = await addToCart.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasAddToCart) {
      await addToCart.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${screenshotDir}/fresh-cart-drawer.png` });
      
      // Check if cart drawer opened
      const cartOpen = await page.locator('[aria-label*="cart" i], [data-testid*="cart"], .cart-drawer').isVisible({ timeout: 3000 }).catch(() => false);
      results.pages['add-to-cart'] = { status: cartOpen ? 'SUCCESS' : 'DRAWER_NOT_OPENED' };
      console.log(`  ${cartOpen ? '✅' : '⚠️'} Cart drawer ${cartOpen ? 'opened' : 'did not open after add'}`);
    } else {
      results.pages['add-to-cart'] = { status: 'NO_ADD_BUTTON' };
      console.log('  ⚠️ Add to Cart button not found');
    }
  } catch(e) {
    results.pages['add-to-cart'] = { status: 'ERROR', error: e.message };
    console.log(`  ❌ Add to Cart error: ${e.message}`);
  }

  // 6. Cart Page
  await testPage('cart', `${BASE}/cart`, [
    { selector: 'h1, h2', name: 'Cart heading' },
    { selector: 'a[href="/shop"]', name: 'Continue shopping link' },
  ]);

  // 7. Checkout Page
  await testPage('checkout', `${BASE}/checkout`, [
    { selector: 'h1, h2', name: 'Checkout heading' },
    { selector: 'form, input[type="text"]', name: 'Form elements' },
  ]);

  // 8. Admin Page (redirects to /admin/products)
  await testPage('admin', `${BASE}/admin`, []);
  await testPage('admin-products', `${BASE}/admin/products`, [
    { selector: 'table, [data-testid="products-list"], h1, h2', name: 'Products table or heading' },
  ]);

  // 9. Test API health
  console.log('\n🌐 Testing API endpoints...');
  try {
    const apiRes = await page.goto(`${API_BASE}/products?limit=5`, { timeout: 10000 });
    results.networkRequests.push({ url: `${API_BASE}/products`, status: apiRes?.status() || 'unknown' });
    console.log(`  API /products: HTTP ${apiRes?.status()}`);
    const apiBody = await page.content();
    results.apiTest = { status: apiRes?.status(), bodyLength: apiBody.length };
  } catch(e) {
    results.apiTest = { status: 'ERROR', error: e.message };
    console.log(`  ❌ API test failed: ${e.message}`);
  }

  await browser.close();

  // Print summary
  console.log('\n\n══════════════════════════════════════');
  console.log('           QA RESULTS SUMMARY          ');
  console.log('══════════════════════════════════════');
  
  Object.entries(results.pages).forEach(([name, data]) => {
    const status = data.status === 200 || data.status === 'SUCCESS' ? '✅' : 
                   data.status === 'ERROR' ? '❌' : '⚠️';
    console.log(`${status} ${name}: ${data.status} - ${data.title || data.error || ''}`);
  });

  console.log(`\n📊 Network Requests to API: ${results.networkRequests.length}`);
  results.networkRequests.forEach(r => {
    const icon = r.status >= 400 ? '❌' : '✅';
    console.log(`  ${icon} ${r.status} ${r.url}`);
  });

  console.log(`\n🔴 Console Errors (${results.consoleErrors.length}):`);
  results.consoleErrors.forEach(e => console.log(`  - ${e}`));

  console.log(`\n🔴 Network Errors (${results.networkErrors.length}):`);
  results.networkErrors.forEach(e => console.log(`  - ${e.status} ${e.url}`));

  // Save JSON report
  fs.writeFileSync(`${screenshotDir}/qa-report.json`, JSON.stringify(results, null, 2));
  console.log('\n✅ Report saved to qa-screenshots/qa-report.json');
  
  return results;
}

runEnhancedQA().catch(console.error);
