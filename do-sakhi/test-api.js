const http = require('http');

const runTest = async (name, url, options = {}) => {
  console.log(`\n--- Testing ${name} ---`);
  return new Promise((resolve) => {
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        try {
          const json = JSON.parse(data);
          console.log('Response:', JSON.stringify(json, null, 2).substring(0, 500) + (data.length > 500 ? '\n... (truncated)' : ''));
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          console.log('Response (text):', data);
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Request error: ${e.message}`);
      resolve(null);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('Waiting for server to start...');
  await delay(2000);

  const baseUrl = 'http://localhost:4000/api/v1';

  // 1. Health
  await runTest('1. GET /health', `${baseUrl}/health`);

  // 2. Products
  const productsRes = await runTest('2. GET /products', `${baseUrl}/products`);
  
  if (!productsRes || !productsRes.data || !productsRes.data.data || productsRes.data.data.length === 0) {
    console.error('No products found, skipping product-dependent tests.');
    return;
  }
  
  const product = productsRes.data.data[0];

  // 3. Product Details
  const productDetailsRes = await runTest('3. GET /products/:slug', `${baseUrl}/products/${product.slug}`);

  // 4. Create Cart
  const cartRes = await runTest('4. POST /cart', `${baseUrl}/cart`, { method: 'POST', body: {} });
  if (!cartRes || !cartRes.data || !cartRes.data.data) {
    console.error('Failed to create cart');
    return;
  }
  const cartId = cartRes.data.data.id;

  // 5. Add item to cart
  const variant = productDetailsRes.data.data.variants[0];
  const itemRes = await runTest('5. POST /cart/:cartId/items', `${baseUrl}/cart/${cartId}/items`, {
    method: 'POST',
    body: {
      productId: product.id,
      variantId: variant.id,
      quantity: 1
    }
  });

  if (!itemRes || !itemRes.data || !itemRes.data.data) {
    console.error('Failed to add item to cart');
    return;
  }
  const cartItemId = itemRes.data.data.id;

  // 6. Add tailoring
  await runTest('6. POST /cart/:cartId/items/:cartItemId/tailoring', `${baseUrl}/cart/${cartId}/items/${cartItemId}/tailoring`, {
    method: 'POST',
    body: {
      measurements: {
        chest: 38.5,
        waist: 32,
        hips: 40
      },
      instructions: 'Make it a bit loose on the waist'
    }
  });

  // 7. Checkout
  await runTest('7. POST /checkout', `${baseUrl}/checkout`, {
    method: 'POST',
    body: {
      cartId,
      customerEmail: 'test@example.com',
      customerPhone: '9876543210',
      shippingAddress: {
        addressLine1: '123 Test St',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      }
    }
  });

  console.log('\nAll API endpoints tested.');
  process.exit(0);
}

main();
