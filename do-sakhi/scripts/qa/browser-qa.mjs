import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  console.log('Fetching a product from API...');
  const prodRes = await fetch('http://localhost:4000/api/v1/products');
  const prods = await prodRes.json();
  
  // Find a product that has stock
  let targetProduct = null;
  let targetVariant = null;
  
  for (const p of prods.data) {
    const detailRes = await fetch(`http://localhost:4000/api/v1/products/${p.slug}`);
    const detail = await detailRes.json();
    if (detail.data.variants) {
      for (const v of detail.data.variants) {
        if (v.stock_quantity > 0) {
          targetProduct = detail.data;
          targetVariant = v;
          break;
        }
      }
    }
    if (targetProduct) break;
  }
  
  if (!targetProduct) {
    console.log('No product with stock found!');
    await browser.close();
    process.exit(1);
  }
  
  console.log(`Testing with product: ${targetProduct.slug}, Size: ${targetVariant.size_label}`);
  await page.goto(`http://localhost:3001/product/${targetProduct.slug}`);
  
  // wait for the size button
  console.log(`Waiting for size button: ${targetVariant.size_label}`);
  await page.waitForSelector(`button:has-text("${targetVariant.size_label}")`);
  await page.click(`button:has-text("${targetVariant.size_label}")`);

  console.log('Waiting for Add to Cart button...');
  await page.waitForSelector('button:has-text("Add to Cart")');
  await page.click('button:has-text("Add to Cart")');
  console.log('Added to cart.');
  
  // Wait a second for cart drawer or state update
  await page.waitForTimeout(1000);
  
  console.log('Navigating to checkout...');
  await page.goto('http://localhost:3001/checkout');
  
  // Fill details
  console.log('Filling checkout form...');
  await page.waitForSelector('input[name="contact-fullName"]');
  await page.fill('input[name="contact-fullName"]', 'Test User');
  await page.fill('input[name="contact-email"]', 'test@example.com');
  await page.fill('input[name="contact-mobile"]', '9999999999');
  
  await page.fill('input[name="addr-line1"]', '123 Test St');
  await page.fill('input[name="addr-city"]', 'Mumbai');
  await page.selectOption('select[name="addr-state"]', 'Maharashtra');
  await page.fill('input[name="addr-pin"]', '400001');
  
  console.log('Clicking Continue to Payment...');
  
  // Listen for the create-payment-order API request
  const [request] = await Promise.all([
    page.waitForRequest(req => req.url().includes('create-payment-order') && req.method() === 'POST'),
    page.locator('button:has-text("Continue to Payment") >> visible=true').click()
  ]);
  
  console.log('create-payment-order request sent!');
  const postData = JSON.parse(request.postData());
  console.log('Payload contains items:', !!postData.items);
  console.log('Payload contains NO frontend subtotal:', postData.subtotal === undefined);

  // Check the response from create-payment-order
  const response = await request.response();
  const resBody = await response.json();
  console.log('create-payment-order response status:', response.status());
  console.log('create-payment-order response body:', resBody);

  await page.waitForTimeout(3000);
  
  // See if razorpay iframe exists (it won't because keys are invalid, but let's check)
  const rzpFrame = await page.$('iframe.razorpay-checkout-frame');
  if (rzpFrame) {
    console.log('Razorpay modal opened successfully!');
  } else {
    console.log('Razorpay modal did not open. (Expected if dummy keys are invalid)');
  }

  // See if we have an error modal displayed
  const modalText = await page.textContent('body');
  if (modalText.includes('We could not prepare the payment securely') || modalText.includes('could not connect securely') || modalText.includes('payment_error')) {
    console.log('Frontend correctly shows error modal or error text for invalid gateway keys.');
  } else {
    console.log('Frontend did not show standard error modal, or error was different.');
  }
  
  await browser.close();
  
  // Test Signature Verification Backend directly
  console.log('\n--- Backend API QA ---');
  
  console.log('Testing Verify Payment with invalid signature...');
  const verifyRes = await fetch('http://localhost:4000/api/v1/checkout/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: resBody.data?.orderId || 'b7b752b7-0cd8-4226-ae0e-7d8487b33333',
      razorpay_order_id: resBody.data?.gateway_order_id || 'order_dummy123',
      razorpay_payment_id: 'pay_dummy456',
      razorpay_signature: 'invalid_signature_hash'
    })
  });
  
  const verifyBody = await verifyRes.json();
  console.log('Verify Response:', verifyBody);
  
  console.log('QA Script Completed.');
})();
