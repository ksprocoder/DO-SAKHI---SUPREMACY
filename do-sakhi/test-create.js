fetch('http://localhost:4000/api/v1/admin/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "QA Test Product",
    slug: "qa-test-product",
    productType: "suit_set",
    variants: [
      {
        sku: "QA-TEST-01",
        colorName: "Red",
        sizeLabel: "M",
        priceInr: 2500,
        stockQuantity: 10
      }
    ],
    media: [
      {
        mediaType: "image",
        mediaRole: "front",
        url: "https://example.com/image.jpg"
      }
    ],
    tags: [
      { tagType: "color", tagValue: "red" }
    ],
    collectionSlugs: []
  })
}).then(res => res.json()).then(console.log).catch(console.error);
