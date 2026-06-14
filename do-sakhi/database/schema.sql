CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE product_status AS ENUM (
  'draft',
  'active',
  'archived'
);

CREATE TYPE fulfillment_type AS ENUM (
  'ready_to_ship',
  'made_to_order',
  'custom_tailoring'
);

CREATE TYPE order_status AS ENUM (
  'pending',
  'stock_locked',
  'payment_initiated',
  'paid',
  'confirmed',
  'tailoring_pending',
  'tailoring_approved',
  'tailoring_started',
  'packed',
  'dispatched',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'authorized',
  'captured',
  'failed',
  'refunded'
);

CREATE TYPE payment_gateway AS ENUM (
  'razorpay',
  'stripe',
  'cod'
);

CREATE TYPE tailoring_status AS ENUM (
  'not_required',
  'pending_measurements',
  'pending_approval',
  'approved',
  'in_progress',
  'completed',
  'rejected'
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,

  product_type VARCHAR(80) NOT NULL,
  status product_status NOT NULL DEFAULT 'draft',

  fulfillment_type fulfillment_type NOT NULL DEFAULT 'ready_to_ship',
  is_ready_to_ship BOOLEAN NOT NULL DEFAULT TRUE,
  is_made_to_order BOOLEAN NOT NULL DEFAULT FALSE,
  custom_tailoring_available BOOLEAN NOT NULL DEFAULT FALSE,

  fabric_type VARCHAR(120),
  fabric_composition VARCHAR(255),
  fabric_feel VARCHAR(255),
  care_instructions TEXT,
  fit_note TEXT,

  silhouette VARCHAR(120),
  neckline VARCHAR(120),
  sleeve_type VARCHAR(120),
  kurti_length VARCHAR(80),
  bottom_type VARCHAR(80),

  dupatta_included BOOLEAN DEFAULT FALSE,
  pocket_available BOOLEAN DEFAULT FALSE,
  embroidery_detail TEXT,
  print_detail TEXT,

  lead_time_min_days INT NOT NULL DEFAULT 2,
  lead_time_max_days INT NOT NULL DEFAULT 7,

  seo_title VARCHAR(255),
  seo_description TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_fabric ON products(fabric_type);
CREATE INDEX idx_products_silhouette ON products(silhouette);
CREATE INDEX idx_products_fulfillment_type ON products(fulfillment_type);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  sku VARCHAR(100) UNIQUE NOT NULL,

  color_name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(20),

  size_label VARCHAR(20) NOT NULL,
  size_numeric VARCHAR(20),

  price_inr NUMERIC(10,2) NOT NULL,
  compare_at_price_inr NUMERIC(10,2),
  cost_price_inr NUMERIC(10,2),

  stock_quantity INT NOT NULL DEFAULT 0,
  reserved_quantity INT NOT NULL DEFAULT 0,
  low_stock_threshold INT NOT NULL DEFAULT 2,

  weight_grams INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,

  collection_type VARCHAR(80) DEFAULT 'manual',
  hero_image_url TEXT,
  hero_video_url TEXT,

  sort_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  seo_title VARCHAR(255),
  seo_description TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_collection_mapping (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  position INT DEFAULT 0,

  PRIMARY KEY (product_id, collection_id)
);

CREATE INDEX idx_collection_slug ON collections(slug);
CREATE INDEX idx_product_collection_collection ON product_collection_mapping(collection_id);
CREATE INDEX idx_product_collection_product ON product_collection_mapping(product_id);

CREATE TABLE product_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  tag_type VARCHAR(50) NOT NULL,
  tag_value VARCHAR(100) NOT NULL
);

CREATE INDEX idx_product_tags_product ON product_tags(product_id);
CREATE INDEX idx_product_tags_type_value ON product_tags(tag_type, tag_value);

CREATE TABLE product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,

  media_type VARCHAR(20) NOT NULL,
  media_role VARCHAR(80) NOT NULL,

  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,

  width INT,
  height INT,
  duration_seconds INT,

  position INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_media_product ON product_media(product_id);
CREATE INDEX idx_product_media_variant ON product_media(variant_id);
CREATE INDEX idx_product_media_role ON product_media(media_role);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  full_name VARCHAR(255),

  password_hash TEXT,

  whatsapp_opt_in BOOLEAN DEFAULT FALSE,
  marketing_opt_in BOOLEAN DEFAULT FALSE,

  loyalty_tier VARCHAR(80) DEFAULT 'sakhi_circle',
  lifetime_spend_inr NUMERIC(12,2) DEFAULT 0,
  completed_order_count INT DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  session_token TEXT UNIQUE NOT NULL,

  email VARCHAR(255),
  phone VARCHAR(30),

  cart_snapshot JSONB,
  measurement_snapshot JSONB,

  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_guest_session_token ON guest_sessions(session_token);
CREATE INDEX idx_guest_session_expires ON guest_sessions(expires_at);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE,

  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL,

  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,

  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
CREATE INDEX idx_addresses_guest ON addresses(guest_session_id);

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE CASCADE,

  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(30) NOT NULL DEFAULT 'active',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),

  quantity INT NOT NULL DEFAULT 1,

  tailoring_requested BOOLEAN NOT NULL DEFAULT FALSE,
  tailoring_payload JSONB,

  unit_price_inr NUMERIC(10,2) NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_number VARCHAR(50) UNIQUE NOT NULL,

  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,

  status order_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  payment_gateway payment_gateway,

  subtotal_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_inr NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_inr NUMERIC(10,2) NOT NULL DEFAULT 0,

  customer_email VARCHAR(255),
  customer_phone VARCHAR(30),

  shipping_address JSONB NOT NULL,
  billing_address JSONB,

  stock_lock_expires_at TIMESTAMPTZ,

  payment_reference_id VARCHAR(255),
  gateway_order_id VARCHAR(255),
  gateway_payment_id VARCHAR(255),

  whatsapp_opt_in BOOLEAN DEFAULT FALSE,

  tracking_provider VARCHAR(100),
  tracking_number VARCHAR(120),
  tracking_url TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_gateway_order ON orders(gateway_order_id);
CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID NOT NULL REFERENCES product_variants(id),

  product_title VARCHAR(255) NOT NULL,
  variant_title VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL,

  quantity INT NOT NULL DEFAULT 1,

  unit_price_inr NUMERIC(10,2) NOT NULL,
  line_total_inr NUMERIC(10,2) NOT NULL,

  fulfillment_type fulfillment_type NOT NULL,
  tailoring_status tailoring_status NOT NULL DEFAULT 'not_required',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT order_item_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

CREATE TABLE custom_tailoring_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_item_id UUID NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,

  tailoring_type VARCHAR(80) NOT NULL,

  bust_inches NUMERIC(5,2),
  waist_inches NUMERIC(5,2),
  hip_inches NUMERIC(5,2),
  shoulder_inches NUMERIC(5,2),
  armhole_inches NUMERIC(5,2),
  sleeve_length_inches NUMERIC(5,2),
  kurti_length_inches NUMERIC(5,2),
  pant_waist_inches NUMERIC(5,2),
  pant_length_inches NUMERIC(5,2),
  height_inches NUMERIC(5,2),

  custom_request TEXT,
  reference_image_url TEXT,

  status tailoring_status NOT NULL DEFAULT 'pending_measurements',

  stylist_notes TEXT,

  customer_approved_at TIMESTAMPTZ,
  tailoring_started_at TIMESTAMPTZ,
  tailoring_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT measurement_bust_range CHECK (bust_inches IS NULL OR bust_inches BETWEEN 24 AND 60),
  CONSTRAINT measurement_waist_range CHECK (waist_inches IS NULL OR waist_inches BETWEEN 20 AND 56),
  CONSTRAINT measurement_hip_range CHECK (hip_inches IS NULL OR hip_inches BETWEEN 26 AND 64),
  CONSTRAINT measurement_shoulder_range CHECK (shoulder_inches IS NULL OR shoulder_inches BETWEEN 10 AND 24),
  CONSTRAINT measurement_height_range CHECK (height_inches IS NULL OR height_inches BETWEEN 48 AND 78)
);

CREATE INDEX idx_tailoring_order_item ON custom_tailoring_details(order_item_id);
CREATE INDEX idx_tailoring_status ON custom_tailoring_details(status);

CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  gateway payment_gateway NOT NULL,
  event_id VARCHAR(255) NOT NULL,
  event_type VARCHAR(255) NOT NULL,

  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

  gateway_order_id VARCHAR(255),
  gateway_payment_id VARCHAR(255),

  raw_payload JSONB NOT NULL,

  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processing_error TEXT,

  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(gateway, event_id)
);

CREATE INDEX idx_payment_events_order ON payment_events(order_id);
CREATE INDEX idx_payment_events_processed ON payment_events(processed);
CREATE INDEX idx_payment_events_gateway_order ON payment_events(gateway_order_id);

CREATE TABLE whatsapp_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  phone VARCHAR(30) NOT NULL,

  template_name VARCHAR(120) NOT NULL,
  template_params JSONB,

  status VARCHAR(50) NOT NULL DEFAULT 'queued',
  provider_message_id VARCHAR(255),

  retry_count INT NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,

  sent_at TIMESTAMPTZ,
  failed_reason TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_status ON whatsapp_notifications(status);
CREATE INDEX idx_whatsapp_order ON whatsapp_notifications(order_id);
CREATE INDEX idx_whatsapp_next_retry ON whatsapp_notifications(next_retry_at);
