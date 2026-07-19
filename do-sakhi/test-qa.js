const http = require('http');

const ADMIN_API_KEY = 'local_admin_api_key_123';
const API_URL = 'http://localhost:4000/api/v1';
const WEB_URL = 'http://localhost:3001';

const delay = ms => new Promise(r => setTimeout(r, ms));

async function fetchReq(url, options = {}) {
  return new Promise((resolve, reject) => {
    const { URL } = require('url');
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  console.log('--- Step 1: Uploading Product via Admin API ---');
  const productData = {
    title: 'Emerald Jute Overlay Co-ord B204',
    slug: 'emerald-jute-overlay-co-ord-b204',
    shortDescription: 'A beautiful, premium coord set for all occasions.',
    description: 'A beautiful, premium coord set for all occasions.',
    productType: 'co_ord_set',
    status: 'active',
    fulfillmentType: 'ready_to_ship',
    isReadyToShip: true,
    customTailoringAvailable: true,
    fabricComposition: 'Jute and Silk',
    variants: [
      {
        sku: 'COORD-B204-M',
        colorName: 'Emerald',
        sizeLabel: 'M',
        priceInr: 6500,
        stockQuantity: 10,
        lowStockThreshold: 2
      },
      {
        sku: 'COORD-B204-L',
        colorName: 'Emerald',
        sizeLabel: 'L',
        priceInr: 6500,
        stockQuantity: 10,
        lowStockThreshold: 2
      }
    ],
    media: [
      {
        mediaType: 'image',
        mediaRole: 'front',
        url: 'https://cdn.dosakhi.local/products/emerald-jute/front.webp',
        isPrimary: true,
        position: 0
      }
    ],
    tags: []
  };

  const createRes = await fetchReq(`${API_URL}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_API_KEY
    },
    body: JSON.stringify(productData)
  });

  console.log('Create Status:', createRes.status);
  console.log('Create Response:', createRes.data);
  const created = JSON.parse(createRes.data);
  if (createRes.status !== 201) {
    console.error('Failed to create product');
    return;
  }
  const productId = created.productId;
  
  console.log('\n--- Step 2: Verify in Admin Product List ---');
  const listRes = await fetchReq(`${API_URL}/admin/products`, {
    headers: { 'x-admin-key': ADMIN_API_KEY }
  });
  console.log('List Status:', listRes.status);
  const products = JSON.parse(listRes.data).data;
  const found = products.find(p => p.id === productId);
  if (found) {
    console.log(`Product found in list: ${found.title} (${found.status})`);
  } else {
    console.error('Product not found in list!');
  }

  console.log('\n--- Step 3: Verify Edit Page API Data ---');
  const editRes = await fetchReq(`${API_URL}/admin/products/${productId}`, {
    headers: { 'x-admin-key': ADMIN_API_KEY }
  });
  console.log('Edit Status:', editRes.status);

  console.log('\n--- Step 4: Verify Shop Page (Public API) ---');
  const shopRes = await fetchReq(`${API_URL}/products`);
  console.log('Shop Status:', shopRes.status);
  const shopData = JSON.parse(shopRes.data).data;
  const shopFound = shopData.find(p => p.slug === 'emerald-jute-overlay-co-ord-b204');
  if (shopFound) {
    console.log(`Product found on shop page: ${shopFound.title}`);
  } else {
    console.error('Product NOT found on shop page!');
  }

  console.log('\n--- Step 5: Verify Product Detail Page (Public API) ---');
  const pdpRes = await fetchReq(`${API_URL}/products/emerald-jute-overlay-co-ord-b204`);
  console.log('PDP Status:', pdpRes.status);
  if (pdpRes.status === 200) {
    const pdp = JSON.parse(pdpRes.data).data;
    console.log(`PDP loaded: ${pdp.title}`);
  }

  console.log('\n--- Step 6: Verify Cart ---');
  const cartRes = await fetchReq(`${API_URL}/cart`, { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json'} });
  console.log('Cart Create Status:', cartRes.status);
  if (cartRes.status === 201) {
    const cartId = JSON.parse(cartRes.data).data.id;
    const pdp = JSON.parse(pdpRes.data).data;
    const itemRes = await fetchReq(`${API_URL}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: pdp.id,
        variantId: pdp.variants[0].id,
        quantity: 1
      })
    });
    console.log('Add Item Status:', itemRes.status);
  }

  console.log('\n--- Checking Frontend Pages HTML Status ---');
  const frontendShop = await fetchReq(`${WEB_URL}/shop`);
  console.log('Frontend /shop:', frontendShop.status);
  const frontendPdp = await fetchReq(`${WEB_URL}/product/emerald-jute-overlay-co-ord-b204`);
  console.log('Frontend PDP:', frontendPdp.status);
  const frontendCart = await fetchReq(`${WEB_URL}/cart`);
  console.log('Frontend /cart:', frontendCart.status);
  const frontendCheckout = await fetchReq(`${WEB_URL}/checkout`);
  console.log('Frontend /checkout:', frontendCheckout.status);

  console.log('\nQA completed successfully.');
}

main().catch(console.error);
