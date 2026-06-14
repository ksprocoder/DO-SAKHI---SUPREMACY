-- Collections
INSERT INTO collections (slug, title, collection_type, sort_order) VALUES
('new-arrivals', 'New Arrivals', 'manual', 1),
('suit-sets', 'Suit Sets', 'manual', 2),
('co-ord-sets', 'Co-ord Sets', 'manual', 3),
('festive-grace', 'Festive Grace', 'manual', 4),
('everyday-luxury', 'Everyday Luxury', 'manual', 5),
('the-summer-edit', 'The Summer Edit', 'manual', 6),
('bespoke-ready', 'Bespoke Ready', 'manual', 7);

-- Products
INSERT INTO products (
  title, slug, short_description, description, product_type, status, fulfillment_type, 
  is_ready_to_ship, is_made_to_order, custom_tailoring_available,
  fabric_type, fabric_composition, fabric_feel,
  care_instructions, fit_note, silhouette, neckline, sleeve_type, kurti_length, bottom_type,
  dupatta_included, pocket_available, lead_time_min_days, lead_time_max_days
) VALUES
('Ivory Leaf Print Summer Suit Set', 'ivory-leaf-print-summer-suit-set', 'A classic ivory leaf print suit set for summer days.', 'Detailed description of the ivory leaf print...', 'suit_set', 'active', 'ready_to_ship', true, false, true, 'cotton_blend', '80% Cotton, 20% Linen', 'Soft and breathable', 'Dry clean only', 'True to size', 'straight', 'v_neck', 'three_quarter', 'calf_length', 'palazzo', true, true, 2, 7),
('Emerald Jute Overlay Co-ord', 'emerald-jute-overlay-co-ord', 'Emerald green jute overlay co-ord set.', 'Detailed description of emerald jute co-ord...', 'co_ord_set', 'active', 'made_to_order', false, true, true, 'jute_blend', 'Jute and Silk', 'Textured but soft inside', 'Dry clean only', 'Relaxed fit', 'a_line', 'round_neck', 'sleeveless', 'short', 'trouser', false, true, 7, 14),
('Lemon Cream Cotton Kurta Set', 'lemon-cream-cotton-kurta-set', 'Fresh lemon cream cotton kurta set.', 'Detailed description of lemon cream cotton...', 'kurta_set', 'active', 'ready_to_ship', true, false, false, 'pure_cotton', '100% Cotton', 'Lightweight', 'Machine wash cold', 'Regular fit', 'straight', 'mandarin_collar', 'full_sleeve', 'knee_length', 'churidar', false, false, 2, 5),
('Rosewood Festive Chanderi Suit', 'rosewood-festive-chanderi-suit', 'Rich rosewood festive chanderi suit.', 'Detailed description of rosewood festive chanderi...', 'suit_set', 'active', 'custom_tailoring', false, false, true, 'chanderi', 'Chanderi Silk', 'Rich and slightly sheer', 'Dry clean only', 'Fitted at bust', 'anarkali', 'scoop_neck', 'half_sleeve', 'ankle_length', 'legging', true, true, 10, 20),
('Black Botanical Office Suit Set', 'black-botanical-office-suit-set', 'Sharp black botanical print office wear.', 'Detailed description of black botanical...', 'suit_set', 'active', 'ready_to_ship', true, false, true, 'muslin', 'Pure Muslin', 'Silky smooth', 'Hand wash', 'Straight fit', 'straight', 'collar_neck', 'three_quarter', 'calf_length', 'straight_pant', true, true, 2, 7),
('Sage Everyday Muslin Co-ord', 'sage-everyday-muslin-co-ord', 'Comfortable sage green everyday co-ord.', 'Detailed description of sage everyday muslin...', 'co_ord_set', 'active', 'ready_to_ship', true, false, true, 'muslin', 'Muslin Cotton', 'Soft and flowy', 'Machine wash cold', 'Relaxed fit', 'relaxed', 'v_neck', 'short_sleeve', 'hip_length', 'wide_leg_pant', false, true, 2, 7);

-- Variants (M, L, XL, XXL) for each product
INSERT INTO product_variants (product_id, sku, color_name, color_hex, size_label, size_numeric, price_inr, cost_price_inr, stock_quantity)
SELECT id, 'DS-IVLEAF-IVORY-M', 'Ivory', '#FFFFF0', 'M', '38', 4500.00, 2000.00, 10 FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'DS-IVLEAF-IVORY-L', 'Ivory', '#FFFFF0', 'L', '40', 4500.00, 2000.00, 15 FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'DS-IVLEAF-IVORY-XL', 'Ivory', '#FFFFF0', 'XL', '42', 4500.00, 2000.00, 8 FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'DS-IVLEAF-IVORY-XXL', 'Ivory', '#FFFFF0', 'XXL', '44', 4500.00, 2000.00, 5 FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL

SELECT id, 'DS-EMJUTE-EMERALD-M', 'Emerald', '#50C878', 'M', '38', 6500.00, 3000.00, 10 FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'DS-EMJUTE-EMERALD-L', 'Emerald', '#50C878', 'L', '40', 6500.00, 3000.00, 10 FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'DS-EMJUTE-EMERALD-XL', 'Emerald', '#50C878', 'XL', '42', 6500.00, 3000.00, 10 FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'DS-EMJUTE-EMERALD-XXL', 'Emerald', '#50C878', 'XXL', '44', 6500.00, 3000.00, 10 FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL

SELECT id, 'DS-LMCRM-LEMON-M', 'Lemon Cream', '#FFFDD0', 'M', '38', 3500.00, 1500.00, 20 FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'DS-LMCRM-LEMON-L', 'Lemon Cream', '#FFFDD0', 'L', '40', 3500.00, 1500.00, 25 FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'DS-LMCRM-LEMON-XL', 'Lemon Cream', '#FFFDD0', 'XL', '42', 3500.00, 1500.00, 12 FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'DS-LMCRM-LEMON-XXL', 'Lemon Cream', '#FFFDD0', 'XXL', '44', 3500.00, 1500.00, 8 FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL

SELECT id, 'DS-RSWD-ROSE-M', 'Rosewood', '#65000B', 'M', '38', 8500.00, 4000.00, 5 FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'DS-RSWD-ROSE-L', 'Rosewood', '#65000B', 'L', '40', 8500.00, 4000.00, 5 FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'DS-RSWD-ROSE-XL', 'Rosewood', '#65000B', 'XL', '42', 8500.00, 4000.00, 5 FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'DS-RSWD-ROSE-XXL', 'Rosewood', '#65000B', 'XXL', '44', 8500.00, 4000.00, 2 FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL

SELECT id, 'DS-BKBOT-BLACK-M', 'Black', '#000000', 'M', '38', 4200.00, 1800.00, 15 FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'DS-BKBOT-BLACK-L', 'Black', '#000000', 'L', '40', 4200.00, 1800.00, 20 FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'DS-BKBOT-BLACK-XL', 'Black', '#000000', 'XL', '42', 4200.00, 1800.00, 15 FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'DS-BKBOT-BLACK-XXL', 'Black', '#000000', 'XXL', '44', 4200.00, 1800.00, 10 FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL

SELECT id, 'DS-SGMUS-SAGE-M', 'Sage', '#9DC183', 'M', '38', 3800.00, 1600.00, 18 FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'DS-SGMUS-SAGE-L', 'Sage', '#9DC183', 'L', '40', 3800.00, 1600.00, 22 FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'DS-SGMUS-SAGE-XL', 'Sage', '#9DC183', 'XL', '42', 3800.00, 1600.00, 15 FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'DS-SGMUS-SAGE-XXL', 'Sage', '#9DC183', 'XXL', '44', 3800.00, 1600.00, 10 FROM products WHERE slug = 'sage-everyday-muslin-co-ord';

-- Product Media
INSERT INTO product_media (
  product_id, media_type, media_role, url, alt_text, width, height, duration_seconds, thumbnail_url, position, is_primary
)
-- Ivory Leaf
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/ivory-leaf/front.webp', 'Ivory Leaf Print Summer Suit Set Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/ivory-leaf/side.webp', 'Ivory Leaf Print Summer Suit Set Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/ivory-leaf/back.webp', 'Ivory Leaf Print Summer Suit Set Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/ivory-leaf/fabric-closeup.webp', 'Ivory Leaf Print Summer Suit Set Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'image', 'pocket_detail', 'https://cdn.dosakhi.local/products/ivory-leaf/detail.webp', 'Ivory Leaf Print Summer Suit Set Pocket Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/ivory-leaf/drape.webm', 'Ivory Leaf Print Summer Suit Set Drape Video', 1080, 1350, 6, 'https://cdn.dosakhi.local/products/ivory-leaf/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/ivory-leaf/lifestyle.webp', 'Ivory Leaf Print Summer Suit Set Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL

-- Emerald Jute
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/emerald-jute/front.webp', 'Emerald Jute Overlay Co-ord Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/emerald-jute/side.webp', 'Emerald Jute Overlay Co-ord Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/emerald-jute/back.webp', 'Emerald Jute Overlay Co-ord Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/emerald-jute/fabric-closeup.webp', 'Emerald Jute Overlay Co-ord Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'image', 'embroidery_detail', 'https://cdn.dosakhi.local/products/emerald-jute/detail.webp', 'Emerald Jute Overlay Co-ord Embroidery Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/emerald-jute/drape.webm', 'Emerald Jute Overlay Co-ord Drape Video', 1080, 1350, 7, 'https://cdn.dosakhi.local/products/emerald-jute/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/emerald-jute/lifestyle.webp', 'Emerald Jute Overlay Co-ord Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'emerald-jute-overlay-co-ord' UNION ALL

-- Lemon Cream
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/lemon-cream/front.webp', 'Lemon Cream Cotton Kurta Set Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/lemon-cream/side.webp', 'Lemon Cream Cotton Kurta Set Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/lemon-cream/back.webp', 'Lemon Cream Cotton Kurta Set Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/lemon-cream/fabric-closeup.webp', 'Lemon Cream Cotton Kurta Set Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'image', 'pocket_detail', 'https://cdn.dosakhi.local/products/lemon-cream/detail.webp', 'Lemon Cream Cotton Kurta Set Pocket Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/lemon-cream/drape.webm', 'Lemon Cream Cotton Kurta Set Drape Video', 1080, 1350, 5, 'https://cdn.dosakhi.local/products/lemon-cream/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/lemon-cream/lifestyle.webp', 'Lemon Cream Cotton Kurta Set Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'lemon-cream-cotton-kurta-set' UNION ALL

-- Rosewood Festive
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/rosewood-festive/front.webp', 'Rosewood Festive Chanderi Suit Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/rosewood-festive/side.webp', 'Rosewood Festive Chanderi Suit Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/rosewood-festive/back.webp', 'Rosewood Festive Chanderi Suit Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/rosewood-festive/fabric-closeup.webp', 'Rosewood Festive Chanderi Suit Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'image', 'embroidery_detail', 'https://cdn.dosakhi.local/products/rosewood-festive/detail.webp', 'Rosewood Festive Chanderi Suit Embroidery Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/rosewood-festive/drape.webm', 'Rosewood Festive Chanderi Suit Drape Video', 1080, 1350, 8, 'https://cdn.dosakhi.local/products/rosewood-festive/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/rosewood-festive/lifestyle.webp', 'Rosewood Festive Chanderi Suit Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL

-- Black Botanical
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/black-botanical/front.webp', 'Black Botanical Office Suit Set Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/black-botanical/side.webp', 'Black Botanical Office Suit Set Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/black-botanical/back.webp', 'Black Botanical Office Suit Set Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/black-botanical/fabric-closeup.webp', 'Black Botanical Office Suit Set Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'image', 'pocket_detail', 'https://cdn.dosakhi.local/products/black-botanical/detail.webp', 'Black Botanical Office Suit Set Pocket Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/black-botanical/drape.webm', 'Black Botanical Office Suit Set Drape Video', 1080, 1350, 6, 'https://cdn.dosakhi.local/products/black-botanical/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/black-botanical/lifestyle.webp', 'Black Botanical Office Suit Set Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'black-botanical-office-suit-set' UNION ALL

-- Sage Everyday
SELECT id, 'image', 'front', 'https://cdn.dosakhi.local/products/sage-everyday/front.webp', 'Sage Everyday Muslin Co-ord Front View', 1200, 1500, NULL::INT, NULL::TEXT, 1, true FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'image', 'side', 'https://cdn.dosakhi.local/products/sage-everyday/side.webp', 'Sage Everyday Muslin Co-ord Side View', 1200, 1500, NULL::INT, NULL::TEXT, 2, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'image', 'back', 'https://cdn.dosakhi.local/products/sage-everyday/back.webp', 'Sage Everyday Muslin Co-ord Back View', 1200, 1500, NULL::INT, NULL::TEXT, 3, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'image', 'fabric_closeup', 'https://cdn.dosakhi.local/products/sage-everyday/fabric-closeup.webp', 'Sage Everyday Muslin Co-ord Fabric Closeup', 1200, 1500, NULL::INT, NULL::TEXT, 4, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'image', 'pocket_detail', 'https://cdn.dosakhi.local/products/sage-everyday/detail.webp', 'Sage Everyday Muslin Co-ord Pocket Detail', 1200, 1500, NULL::INT, NULL::TEXT, 5, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'video', 'drape_video', 'https://cdn.dosakhi.local/products/sage-everyday/drape.webm', 'Sage Everyday Muslin Co-ord Drape Video', 1080, 1350, 7, 'https://cdn.dosakhi.local/products/sage-everyday/video-thumbnail.jpg', 6, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord' UNION ALL
SELECT id, 'image', 'lifestyle', 'https://cdn.dosakhi.local/products/sage-everyday/lifestyle.webp', 'Sage Everyday Muslin Co-ord Lifestyle View', 1200, 1500, NULL::INT, NULL::TEXT, 7, false FROM products WHERE slug = 'sage-everyday-muslin-co-ord';


-- Product Tags
INSERT INTO product_tags (product_id, tag_type, tag_value)
SELECT id, 'occasion', 'summer' FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'style', 'quiet_luxury' FROM products WHERE slug = 'ivory-leaf-print-summer-suit-set' UNION ALL
SELECT id, 'occasion', 'festive' FROM products WHERE slug = 'rosewood-festive-chanderi-suit' UNION ALL
SELECT id, 'occasion', 'office' FROM products WHERE slug = 'black-botanical-office-suit-set';

-- Product Collection Mapping
INSERT INTO product_collection_mapping (product_id, collection_id)
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'ivory-leaf-print-summer-suit-set' AND c.slug IN ('new-arrivals', 'the-summer-edit') UNION ALL
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'emerald-jute-overlay-co-ord' AND c.slug IN ('new-arrivals', 'co-ord-sets') UNION ALL
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'lemon-cream-cotton-kurta-set' AND c.slug IN ('suit-sets', 'everyday-luxury') UNION ALL
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'rosewood-festive-chanderi-suit' AND c.slug IN ('festive-grace', 'bespoke-ready') UNION ALL
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'black-botanical-office-suit-set' AND c.slug IN ('suit-sets', 'everyday-luxury') UNION ALL
SELECT p.id, c.id FROM products p, collections c WHERE p.slug = 'sage-everyday-muslin-co-ord' AND c.slug IN ('co-ord-sets', 'everyday-luxury');

-- Users
INSERT INTO users (email, phone, full_name, whatsapp_opt_in, loyalty_tier) VALUES
('sakhi.user@example.com', '+919876543210', 'Sakhi Customer', true, 'sakhi_circle'),
('atelier.client@example.com', '+919876543211', 'Atelier Client', true, 'atelier');

-- Guest Sessions
INSERT INTO guest_sessions (session_token, email, expires_at, cart_snapshot) VALUES
('guest_token_123', 'guest@example.com', NOW() + INTERVAL '1 day', '{"items": 2}');

-- Carts and Items
DO $$
DECLARE
  v_user_id UUID;
  v_cart_id UUID;
  v_product1_id UUID;
  v_variant1_id UUID;
  v_product2_id UUID;
  v_variant2_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE email = 'atelier.client@example.com';
  
  INSERT INTO carts (user_id, status) VALUES (v_user_id, 'active') RETURNING id INTO v_cart_id;
  
  SELECT p.id, v.id INTO v_product1_id, v_variant1_id FROM products p JOIN product_variants v ON p.id = v.product_id WHERE p.slug = 'black-botanical-office-suit-set' AND v.size_label = 'M';
  SELECT p.id, v.id INTO v_product2_id, v_variant2_id FROM products p JOIN product_variants v ON p.id = v.product_id WHERE p.slug = 'rosewood-festive-chanderi-suit' AND v.size_label = 'L';
  
  INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, tailoring_requested, unit_price_inr)
  VALUES (v_cart_id, v_product1_id, v_variant1_id, 1, false, 4200.00);
  
  INSERT INTO cart_items (cart_id, product_id, variant_id, quantity, tailoring_requested, unit_price_inr)
  VALUES (v_cart_id, v_product2_id, v_variant2_id, 1, true, 8500.00);
END $$;

-- Orders, Items, Tailoring, Payment, WhatsApp
DO $$
DECLARE
  v_user_id UUID;
  v_order_id UUID;
  v_order_item1_id UUID;
  v_order_item2_id UUID;
  v_product1_id UUID;
  v_variant1_id UUID;
  v_product2_id UUID;
  v_variant2_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE email = 'atelier.client@example.com';
  
  INSERT INTO orders (
    order_number, user_id, status, payment_status, payment_gateway,
    subtotal_inr, total_inr, customer_email, customer_phone, shipping_address
  ) VALUES (
    'DS-ORD-0001', v_user_id, 'tailoring_pending', 'captured', 'razorpay',
    12700.00, 12700.00, 'atelier.client@example.com', '+919876543211', '{"line1": "123 Elite Street", "city": "Mumbai", "state": "MH"}'
  ) RETURNING id INTO v_order_id;
  
  SELECT p.id, v.id INTO v_product1_id, v_variant1_id FROM products p JOIN product_variants v ON p.id = v.product_id WHERE p.slug = 'black-botanical-office-suit-set' AND v.size_label = 'M';
  SELECT p.id, v.id INTO v_product2_id, v_variant2_id FROM products p JOIN product_variants v ON p.id = v.product_id WHERE p.slug = 'rosewood-festive-chanderi-suit' AND v.size_label = 'L';
  
  INSERT INTO order_items (
    order_id, product_id, variant_id, product_title, variant_title, sku,
    quantity, unit_price_inr, line_total_inr, fulfillment_type, tailoring_status
  ) VALUES (
    v_order_id, v_product1_id, v_variant1_id, 'Black Botanical Office Suit Set', 'Black / M', 'DS-BKBOT-BLACK-M',
    1, 4200.00, 4200.00, 'ready_to_ship', 'not_required'
  ) RETURNING id INTO v_order_item1_id;
  
  INSERT INTO order_items (
    order_id, product_id, variant_id, product_title, variant_title, sku,
    quantity, unit_price_inr, line_total_inr, fulfillment_type, tailoring_status
  ) VALUES (
    v_order_id, v_product2_id, v_variant2_id, 'Rosewood Festive Chanderi Suit', 'Rosewood / L', 'DS-RSWD-ROSE-L',
    1, 8500.00, 8500.00, 'custom_tailoring', 'pending_measurements'
  ) RETURNING id INTO v_order_item2_id;
  
  INSERT INTO custom_tailoring_details (
    order_item_id, tailoring_type, bust_inches, waist_inches, hip_inches, height_inches, status
  ) VALUES (
    v_order_item2_id, 'full_suit', 36.5, 30.0, 40.0, 65.0, 'pending_approval'
  );
  
  INSERT INTO payment_events (
    gateway, event_id, event_type, order_id, raw_payload, processed
  ) VALUES (
    'razorpay', 'evt_12345', 'payment.captured', v_order_id, '{"amount": 1270000}', true
  );
  
  INSERT INTO whatsapp_notifications (
    order_id, user_id, phone, template_name, status
  ) VALUES 
  (v_order_id, v_user_id, '+919876543211', 'order_confirmed', 'sent'),
  (v_order_id, v_user_id, '+919876543211', 'measurements_received', 'sent'),
  (v_order_id, v_user_id, '+919876543211', 'tailoring_started', 'queued');
END $$;
