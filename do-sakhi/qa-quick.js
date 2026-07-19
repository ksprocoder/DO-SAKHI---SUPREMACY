const { chromium } = require('playwright');
const fs = require('fs');

const BASE = 'http://localhost:3001';
const SCREENSHOT_DIR = 'qa-screenshots';

async function quickTest() {
  console.log('🚀 Quick Playwright Test (domcontentloaded wait)...\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const networkErrors = [];
  const apiCalls = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(`PageError: ${err.message}`));
  page.on('response', res => {
    const url = res.url();
    if (url.includes('4000') || url.includes('api/v1') || url.includes('r2.dev') || url.includes('supabase')) {
      apiCalls.push({ url, status: res.status() });
      if (res.status() >= 400) networkErrors.push({ url, status: res.status() });
    }
  });

  if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

  const results = {};

  const pages = [
    { name: 'home', url: `${BASE}/` },
    { name: 'shop', url: `${BASE}/shop` },
    { name: 'pdp', url: `${BASE}/product/ivory-leaf-print-summer-suit-set` },
    { name: 'cart', url: `${BASE}/cart` },
    { name: 'checkout', url: `${BASE}/checkout` },
    { name: 'admin', url: `${BASE}/admin` },
    { name: 'admin-products', url: `${BASE}/admin/products` },
  ];

  for (const p of pages) {
    console.log(`\n📄 ${p.name}: ${p.url}`);
    try {
      const response = await page.goto(p.url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 45000 
      });
      // Extra wait to let JS render
      await page.waitForTimeout(4000);
      
      const ss = `${SCREENSHOT_DIR}/test-${p.name}.png`;
      await page.screenshot({ path: ss, fullPage: true });
      const title = await page.title();
      results[p.name] = { status: response?.status(), title, screenshot: ss, ok: true };
      console.log(`  ✅ HTTP ${response?.status()} — "${title}"`);
    } catch(e) {
      const ss = `${SCREENSHOT_DIR}/test-${p.name}-error.png`;
      try { await page.screenshot({ path: ss }); } catch {}
      results[p.name] = { status: 'ERROR', error: e.message, ok: false };
      console.log(`  ❌ ERROR: ${e.message.split('\n')[0]}`);
    }
  }

  // Test add-to-cart on PDP
  console.log('\n🛒 Testing Add to Cart on PDP...');
  try {
    await page.goto(`${BASE}/product/ivory-leaf-print-summer-suit-set`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    
    const sizeBtn = page.locator('button:has-text("M")').first();
    const hasSize = await sizeBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasSize) {
      await sizeBtn.click();
      console.log('  ✅ Clicked size M');
    }

    const atcBtn = page.locator('button:has-text("Add to Cart")').first();
    const hasATC = await atcBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (hasATC) {
      await atcBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${SCREENSHOT_DIR}/test-add-to-cart.png` });
      const drawerOpen = await page.locator('[aria-label*="cart" i], .cart-drawer, [data-testid="cart-drawer"]').isVisible({ timeout: 3000 }).catch(() => false);
      console.log(`  ${hasATC ? '✅' : '❌'} Add to Cart clicked`);
      console.log(`  ${drawerOpen ? '✅' : '⚠️'} Cart drawer ${drawerOpen ? 'opened' : 'state unknown'}`);
      results['add-to-cart'] = { atcFound: hasATC, drawerOpened: drawerOpen };
    } else {
      console.log('  ⚠️ Add to Cart button not found — product may be loading still');
      results['add-to-cart'] = { atcFound: false };
    }
  } catch(e) {
    console.log(`  ❌ ATC test error: ${e.message.split('\n')[0]}`);
    results['add-to-cart'] = { error: e.message };
  }

  await browser.close();

  console.log('\n\n══════════ SUMMARY ══════════');
  Object.entries(results).forEach(([name, r]) => {
    const ok = r.ok !== false && r.status !== 'ERROR' ? '✅' : '❌';
    console.log(`${ok} ${name}: ${r.status || ''} ${r.title || r.error?.split('\n')[0] || ''}`);
  });

  console.log(`\nConsole Errors: ${consoleErrors.length}`);
  consoleErrors.slice(0, 10).forEach(e => console.log(`  - ${e}`));

  console.log(`\nAPI Calls Captured: ${apiCalls.length}`);
  apiCalls.forEach(c => console.log(`  ${c.status >= 400 ? '❌' : '✅'} ${c.status} ${c.url}`));

  console.log(`\nNetwork Errors: ${networkErrors.length}`);
  networkErrors.forEach(e => console.log(`  ❌ ${e.status} ${e.url}`));

  // Save report
  const report = { results, consoleErrors, networkErrors, apiCalls, timestamp: new Date().toISOString() };
  fs.writeFileSync(`${SCREENSHOT_DIR}/qa-report-fresh.json`, JSON.stringify(report, null, 2));
  console.log('\n✅ Report saved to qa-screenshots/qa-report-fresh.json');
}

quickTest().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
