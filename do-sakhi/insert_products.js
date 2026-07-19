const { Client } = require('pg');
require('dotenv').config();

const productsList = [
  {
    title: "Black Leaf Print Summer Suit Set",
    slug: "black-leaf-print-summer-suit-set",
    color_name: "Classic Black with Off-White Leaf Print",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 1250,
    image: "SUITS-BL938864    A104.jpeg",
    style_code: "A104",
    work_detail: "Off-white leaf print with matching straight pants and printed dupatta.",
    description: "An elegant black summer suit set designed with a graceful off-white leaf print, matching straight pants, and a printed dupatta. Lightweight, comfortable, and perfect for daily wear, office wear, casual outings, and small get-togethers."
  },
  {
    title: "Lemon Yellow Lace Detail Summer Co-ord Set",
    slug: "lemon-yellow-lace-detail-summer-co-ord-set",
    color_name: "Lemon Yellow",
    product_type: "co_ord_set",
    set_includes: "Top + Pant",
    price_inr: 1690,
    image: "COORD SETS  B201.jpeg",
    style_code: "B201",
    work_detail: "Lace detailing on sleeves and pants with delicate floral patch work on the top.",
    description: "A graceful lemon yellow summer co-ord set featuring delicate lace detailing on the sleeves and pants, finished with soft floral patch work on the top. Light, elegant, and comfortable for daily wear, brunch outings, office wear, kitty parties, and casual get-togethers."
  },
  {
    title: "Cream Lace Detail Summer Co-ord Set",
    slug: "cream-lace-detail-summer-co-ord-set",
    color_name: "Cream",
    product_type: "co_ord_set",
    set_includes: "Top + Pant",
    price_inr: 1690,
    image: "WhatsApp Image 2026-05-21 at 9.11.32 PM (2).jpeg",
    additional_image: "WhatsApp Image 2026-05-21 at 9.11.32 PM (1).jpeg",
    style_code: "CREAM-LACE",
    work_detail: "Lace detailing on sleeves and pants with delicate floral patch work on the top.",
    description: "A soft cream summer co-ord set crafted with refined lace detailing and delicate floral patch work. The relaxed silhouette and elegant finish make it ideal for everyday comfort, brunches, office wear, and graceful casual occasions."
  },
  {
    title: "Cream Embroidered Jute Overlay 3-Piece Co-ord Set",
    slug: "cream-embroidered-jute-overlay-3-piece-co-ord-set",
    color_name: "Cream / Off-White",
    product_type: "co_ord_set",
    set_includes: "Shirt + Jute Jacket + Pants",
    price_inr: 1780,
    image: "COORD SETS (3 PIECE)  B203.jpeg",
    style_code: "B203",
    work_detail: "Premium jute fabric embroidered jacket with floral embroidery, soft inner shirt, and wide-leg pants.",
    description: "An elegant cream/off-white 3-piece co-ord set featuring a soft inner shirt, premium embroidered jute jacket, and comfortable wide-leg pants. The delicate floral embroidery adds a fresh, classy, and stylish summer appeal, perfect for brunches, vacations, office wear, and day functions."
  },
  {
    title: "Bright Crimson Floral Print Suit Set",
    slug: "bright-crimson-floral-print-suit-set",
    color_name: "Bright Crimson Red with Off-White Floral Print",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 1100,
    image: "SUITS-BL155081  A103.jpeg",
    style_code: "A103",
    work_detail: "Off-white floral print all over the kurti with printed dupatta border.",
    description: "A bright crimson red suit set with an elegant off-white floral print, matching pants, and a printed dupatta. The graceful colour and smart straight-fit silhouette make it suitable for office wear, casual outings, kitty parties, family get-togethers, and everyday elegance."
  },
  {
    title: "Pista Green Embroidered Yoke Suit Set",
    slug: "pista-green-embroidered-yoke-suit-set",
    color_name: "Pista Green",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 2590,
    image: "SUITS  C301.jpeg",
    style_code: "C301",
    work_detail: "Embroidery on neckline and front yoke, soft gathers, side pocket, matching pants, and lightweight dupatta with delicate buti work.",
    description: "A beautiful pista green suit set designed with graceful embroidery on the neckline and front yoke. Soft gathers give the kurti a comfortable fall, while the matching straight pants and lightweight dupatta complete the elegant look. The kurti also includes a practical side pocket."
  },
  {
    title: "Cream Rust Motif Printed Co-ord Set",
    slug: "cream-rust-motif-printed-co-ord-set",
    color_name: "Soft Cream with Rust-Brown Ethnic Print",
    product_type: "co_ord_set",
    set_includes: "Kurti + Pant",
    price_inr: 970,
    image: "COORD SETS  B202.jpeg",
    style_code: "B202",
    work_detail: "All-over rust-brown ethnic motif print.",
    description: "A soft cream co-ord set featuring elegant rust-brown ethnic motifs printed all over. The straight-cut kurti and matching pants create a smart, sophisticated, and contemporary look for office wear, casual outings, travel, shopping, and everyday elegance."
  },
  {
    title: "Olive Green Floral Applique Suit Set",
    slug: "olive-green-floral-applique-suit-set",
    color_name: "Olive Green with Multicolor Floral Applique",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 2648,
    image: "SUITS-BL514459  A101.jpeg",
    style_code: "A101",
    work_detail: "Multicolor floral applique work on the kurti with matching embellished dupatta.",
    description: "A designer olive green suit set featuring vibrant multicolor floral applique work on the kurti, paired with coordinated pants and a delicate dupatta. The fresh floral detailing gives this piece an elegant, premium look for family functions, festive gatherings, kitty parties, brunches, and special occasions."
  },
  {
    title: "Teal Blue Minimal Floral Co-ord Set",
    slug: "teal-blue-minimal-floral-co-ord-set",
    color_name: "Teal Blue with Floral Embroidery",
    product_type: "co_ord_set",
    set_includes: "Kurti + Pant",
    price_inr: 1750,
    image: "COORD SETS-BL236642    A105.jpeg",
    style_code: "A105",
    work_detail: "Minimal floral embroidery with smart collared neckline and straight-fit pants.",
    description: "An elegant teal blue co-ord set featuring minimal floral embroidery and a smart collared neckline. Paired with comfortable straight-fit pants, this piece offers a chic and graceful look for office wear, brunch outings, travel, daily wear, and semi-formal gatherings."
  },
  {
    title: "Black Traditional Embroidered Suit Set",
    slug: "black-traditional-embroidered-suit-set",
    color_name: "Classic Black with Multicolor Traditional Embroidery",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 1550,
    image: "SUITS-BL945508   A102.jpeg",
    style_code: "A102",
    work_detail: "Traditional multicolor embroidery on neckline, sleeves, hemline, pants, and dupatta border.",
    description: "A premium black ethnic suit set designed with intricate multicolor traditional embroidery across the neckline, sleeves, hemline, pants, and dupatta border. Rich detailing and timeless black make it ideal for festive gatherings, family functions, dinner parties, and special occasions."
  },
  {
    title: "Rose Pink Floral Printed Kurti",
    slug: "rose-pink-floral-printed-kurti",
    color_name: "Rose Pink with Beige Floral Motifs",
    product_type: "kurti",
    set_includes: "Kurti",
    price_inr: 715,
    image: "KURTIS-BL061859   A106.jpeg",
    style_code: "A106",
    work_detail: "All-over beige floral print with embroidered V-neckline.",
    description: "A beautiful rose pink floral printed kurti featuring elegant beige floral motifs and a stylish embroidered V-neckline. Soft, breathable, and comfortable, this piece is perfect for daily wear, office, college, casual outings, and family gatherings."
  },
  {
    title: "Lemon Yellow Black Embroidered Designer Suit Set",
    slug: "lemon-yellow-black-embroidered-designer-suit-set",
    color_name: "Lemon Yellow with Black Embroidered Detailing",
    product_type: "suit_set",
    set_includes: "Kurti + Pant + Dupatta",
    price_inr: 2300,
    image: "SUITS  C302.jpeg",
    style_code: "C302",
    work_detail: "Black embroidered detailing, vertical lace accents, embroidered pants, and contrast border chiffon dupatta.",
    description: "A designer lemon yellow suit set featuring elegant black embroidery, vertical lace accents, embroidered pants, and a graceful chiffon dupatta with contrast border. The rich detailing makes it perfect for festive gatherings, family functions, kitty parties, office events, and semi-formal celebrations."
  }
];

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    for (const p of productsList) {
      // 1. Check for duplicates (by slug or title)
      const existing = await client.query("SELECT id FROM products WHERE slug = $1 OR title = $2", [p.slug, p.title]);
      let productId = null;

      const fullDescription = p.description + "\n\nSet Includes: " + p.set_includes;
      const hasDupatta = p.set_includes.toLowerCase().includes("dupatta");

      if (existing.rows.length > 0) {
        // Update existing product
        productId = existing.rows[0].id;
        console.log("Updating product: " + p.title + " (" + productId + ")");
        await client.query(
          "UPDATE products SET short_description = $1, description = $2, product_type = $3, status = $4, dupatta_included = $5 WHERE id = $6",
          [p.work_detail, fullDescription, p.product_type, "draft", hasDupatta, productId]
        );
        createdCount++;
      } else {
        // Create new product
        console.log("Creating product: " + p.title);
        const res = await client.query(
          "INSERT INTO products (title, slug, short_description, description, product_type, status, dupatta_included) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          [p.title, p.slug, p.work_detail, fullDescription, p.product_type, "draft", hasDupatta]
        );
        productId = res.rows[0].id;
        createdCount++;
      }

      // 2. Handle Variants (Safe Placeholder)
      const sku = p.style_code ? p.style_code + "-PENDING" : p.slug.substring(0, 10).toUpperCase() + "-PENDING";
      
      const existingVariant = await client.query("SELECT id FROM product_variants WHERE sku = $1", [sku]);
      let variantId = null;
      if (existingVariant.rows.length > 0) {
        variantId = existingVariant.rows[0].id;
        await client.query(
          "UPDATE product_variants SET color_name = $1, price_inr = $2, is_active = false, stock_quantity = 0 WHERE id = $3",
          [p.color_name, p.price_inr, variantId]
        );
      } else {
        const varRes = await client.query(
          "INSERT INTO product_variants (product_id, sku, color_name, size_label, price_inr, stock_quantity, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
          [productId, sku, p.color_name, "PENDING", p.price_inr, 0, false]
        );
        variantId = varRes.rows[0].id;
      }

      // 3. Handle Images
      // Delete existing media to refresh
      await client.query("DELETE FROM product_media WHERE product_id = $1", [productId]);
      
      const imageUrl = "/images/products/" + encodeURIComponent(p.image);
      await client.query(
        "INSERT INTO product_media (product_id, media_type, media_role, url, position, is_primary, alt_text) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [productId, "image", "front", imageUrl, 1, true, p.title + " Front View"]
      );

      if (p.additional_image) {
        const additionalImageUrl = "/images/products/" + encodeURIComponent(p.additional_image);
        await client.query(
          "INSERT INTO product_media (product_id, media_type, media_role, url, position, is_primary, alt_text) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [productId, "image", "side", additionalImageUrl, 2, false, p.title + " Additional View"]
        );
      }
    }
  } catch (err) {
    console.error("Error during upload:", err);
    errorCount++;
  } finally {
    console.log("Finished. Updated/Created: " + createdCount + ", Skipped: " + skippedCount + ", Errors: " + errorCount);
    await client.end();
  }
}

run();
