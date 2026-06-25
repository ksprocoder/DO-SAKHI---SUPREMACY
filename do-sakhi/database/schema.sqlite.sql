













CREATE TABLE products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,

  product_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',

  fulfillment_type TEXT NOT NULL DEFAULT 'ready_to_ship',
  is_ready_to_ship INTEGER NOT NULL DEFAULT 1,
  is_made_to_order INTEGER NOT NULL DEFAULT 0,
  custom_tailoring_available INTEGER NOT NULL DEFAULT 0,

  fabric_type TEXT,
  fabric_composition TEXT,
  fabric_feel TEXT,
  care_instructions TEXT,
  fit_note TEXT,

  silhouette TEXT,
  neckline TEXT,
  sleeve_type TEXT,
  kurti_length TEXT,
  bottom_type TEXT,

  dupatta_included INTEGER DEFAULT 0,
  pocket_available INTEGER DEFAULT 0,
  embroidery_detail TEXT,
  print_detail TEXT,

  lead_time_min_days INT NOT NULL DEFAULT 2,
  lead_time_max_days INT NOT NULL DEFAULT 7,

  seo_title TEXT,
  seo_description TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_fabric ON products(fabric_type);
CREATE INDEX idx_products_silhouette ON products(silhouette);
CREATE INDEX idx_products_fulfillment ON products(fulfillment_type);

CREATE TABLE product_variants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  sku TEXT UNIQUE NOT NULL,

  color_name TEXT NOT NULL,
  color_hex TEXT,

  size_label TEXT NOT NULL,
  size_numeric TEXT,

  price_inr REAL NOT NULL,
  compare_at_price_inr REAL,
  cost_price_inr REAL,

  stock_quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 2,

  weight_grams INT,
  is_active INTEGER NOT NULL DEFAULT 1,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT stock_non_negative CHECK (stock_quantity >= 0),
  CONSTRAINT reserved_non_negative CHECK (reserved_quantity >= 0),
  CONSTRAINT reserved_not_more_than_stock CHECK (reserved_quantity <= stock_quantity)
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_size ON product_variants(size_label);
CREATE INDEX idx_variants_color ON product_variants(color_name);
CREATE INDEX idx_variants_active ON product_variants(is_active);

CREATE TABLE collections (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  collection_type TEXT DEFAULT 'manual',
  hero_image_url TEXT,
  hero_video_url TEXT,

  sort_order INT DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,

  seo_title TEXT,
  seo_description TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_collection_mapping (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id TEXT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  position INT DEFAULT 0,

  PRIMARY KEY (product_id, collection_id)
);

CREATE INDEX idx_collection_slug ON collections(slug);
CREATE INDEX idx_product_collection_collection ON product_collection_mapping(collection_id);
CREATE INDEX idx_product_collection_product ON product_collection_mapping(product_id);

CREATE TABLE product_tags (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  tag_type TEXT NOT NULL,
  tag_value TEXT NOT NULL
);

CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_type_value ON product_tags(tag_type, tag_value);

CREATE TABLE product_media (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id TEXT REFERENCES product_variants(id) ON DELETE SET NULL,

  media_type TEXT NOT NULL,
  media_role TEXT NOT NULL,

  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,

  width INT,
  height INT,
  duration_seconds INT,

  position INT NOT NULL DEFAULT 0,
  is_primary INTEGER DEFAULT 0,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_media_product ON product_media(product_id);
CREATE INDEX idx_product_media_variant ON product_media(variant_id);
CREATE INDEX idx_product_media_role ON product_media(media_role);

CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT,

  password_hash TEXT,

  whatsapp_opt_in INTEGER DEFAULT 0,
  marketing_opt_in INTEGER DEFAULT 0,

  loyalty_tier TEXT DEFAULT 'sakhi_circle',
  lifetime_spend_inr REAL DEFAULT 0,
  completed_order_count INT DEFAULT 0,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  session_token TEXT UNIQUE NOT NULL,

  email TEXT,
  phone TEXT,

  cart_snapshot TEXT,
  measurement_snapshot TEXT,

  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guest_session_token ON guest_sessions(session_token);
CREATE INDEX idx_guest_session_expires ON guest_sessions(expires_at);

CREATE TABLE addresses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id TEXT REFERENCES guest_sessions(id) ON DELETE CASCADE,

  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,

  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,

  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_guest ON addresses(guest_session_id);

CREATE TABLE carts (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id TEXT REFERENCES guest_sessions(id) ON DELETE CASCADE,

  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'active',

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT NOT NULL REFERENCES product_variants(id),

  quantity INT NOT NULL DEFAULT 1,

  tailoring_requested INTEGER NOT NULL DEFAULT 0,
  tailoring_payload TEXT,

  unit_price_inr REAL NOT NULL,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);

CREATE TABLE orders (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  order_number TEXT UNIQUE NOT NULL,

  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  guest_session_id TEXT REFERENCES guest_sessions(id) ON DELETE SET NULL,

  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_gateway TEXT,

  subtotal_inr REAL NOT NULL DEFAULT 0,
  shipping_inr REAL NOT NULL DEFAULT 0,
  discount_inr REAL NOT NULL DEFAULT 0,
  total_inr REAL NOT NULL DEFAULT 0,

  customer_email TEXT,
  customer_phone TEXT,

  shipping_address TEXT NOT NULL,
  billing_address TEXT,

  stock_lock_expires_at TEXT,

  payment_reference_id TEXT,
  gateway_order_id TEXT,
  gateway_payment_id TEXT,

  whatsapp_opt_in INTEGER DEFAULT 0,

  tracking_provider TEXT,
  tracking_number TEXT,
  tracking_url TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_gateway_order ON orders(gateway_order_id);
CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  variant_id TEXT NOT NULL REFERENCES product_variants(id),

  product_title TEXT NOT NULL,
  variant_title TEXT NOT NULL,
  sku TEXT NOT NULL,

  quantity INT NOT NULL DEFAULT 1,

  unit_price_inr REAL NOT NULL,
  line_total_inr REAL NOT NULL,

  fulfillment_type TEXT NOT NULL,
  tailoring_status TEXT NOT NULL DEFAULT 'not_required',

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT order_item_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

CREATE TABLE custom_tailoring_details (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  order_item_id TEXT NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,

  tailoring_type TEXT NOT NULL,

  bust_inches REAL,
  waist_inches REAL,
  hip_inches REAL,
  shoulder_inches REAL,
  armhole_inches REAL,
  sleeve_length_inches REAL,
  kurti_length_inches REAL,
  pant_waist_inches REAL,
  pant_length_inches REAL,
  height_inches REAL,

  custom_request TEXT,
  reference_image_url TEXT,

  status TEXT NOT NULL DEFAULT 'pending_measurements',

  stylist_notes TEXT,

  customer_approved_at TEXT,
  tailoring_started_at TEXT,
  tailoring_completed_at TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT measurement_bust_range CHECK (bust_inches IS NULL OR bust_inches BETWEEN 24 AND 60),
  CONSTRAINT measurement_waist_range CHECK (waist_inches IS NULL OR waist_inches BETWEEN 20 AND 56),
  CONSTRAINT measurement_hip_range CHECK (hip_inches IS NULL OR hip_inches BETWEEN 26 AND 64),
  CONSTRAINT measurement_shoulder_range CHECK (shoulder_inches IS NULL OR shoulder_inches BETWEEN 10 AND 24),
  CONSTRAINT measurement_height_range CHECK (height_inches IS NULL OR height_inches BETWEEN 48 AND 78)
);

CREATE INDEX idx_tailoring_order_item ON custom_tailoring_details(order_item_id);
CREATE INDEX idx_tailoring_status ON custom_tailoring_details(status);

CREATE TABLE payment_events (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  gateway TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,

  order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,

  gateway_order_id TEXT,
  gateway_payment_id TEXT,

  raw_payload TEXT NOT NULL,

  processed INTEGER NOT NULL DEFAULT 0,
  processing_error TEXT,

  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(gateway, event_id)
);

CREATE INDEX idx_payment_events_order ON payment_events(order_id);
CREATE INDEX idx_payment_events_processed ON payment_events(processed);
CREATE INDEX idx_payment_events_gateway_order ON payment_events(gateway_order_id);

CREATE TABLE whatsapp_notifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6)))),

  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,

  phone TEXT NOT NULL,

  template_name TEXT NOT NULL,
  template_params TEXT,

  status TEXT NOT NULL DEFAULT 'queued',
  provider_message_id TEXT,

  retry_count INT NOT NULL DEFAULT 0,
  next_retry_at TEXT,

  sent_at TEXT,
  failed_reason TEXT,

  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_status ON whatsapp_notifications(status);
CREATE INDEX idx_whatsapp_order ON whatsapp_notifications(order_id);
CREATE INDEX idx_whatsapp_next_retry ON whatsapp_notifications(next_retry_at);
