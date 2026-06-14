# Database Summary

## Tables
1. **products**: Stores base product information.
2. **product_variants**: Stores SKUs, sizes, prices, and stock inventory.
3. **collections**: Stores curated collections.
4. **product_collection_mapping**: Many-to-many relationship for collections and products.
5. **product_tags**: Key-value tags for filtering.
6. **product_media**: Images and videos for products and variants.
7. **users**: Registered users and atelier clients.
8. **guest_sessions**: Anonymous users with cart and measurement snapshots.
9. **addresses**: Shipping and billing addresses.
10. **carts**: Shopping carts.
11. **cart_items**: Items inside carts, with tailoring payload.
12. **orders**: Main order records.
13. **order_items**: Line items locked at checkout.
14. **custom_tailoring_details**: Detailed measurements linked 1-to-1 with order items.
15. **payment_events**: Webhook events from Razorpay/Stripe (idempotency key on event_id).
16. **whatsapp_notifications**: Outbound notification queue.

## Relationships
- A `product` has many `product_variants`, `product_tags`, and `product_media`.
- A `collection` has many `products` via `product_collection_mapping`.
- An `order` belongs to a `user` or `guest_session`, and has many `order_items`.
- An `order_item` links to a `product` and `variant`, and can have ONE `custom_tailoring_details`.
- A `payment_events` record links to an `order`.
- A `whatsapp_notifications` record links to an `order` and `user`.

## Core Models

### Stock Model
The `product_variants` table has `stock_quantity` and `reserved_quantity`. Stock is locked by incrementing `reserved_quantity` during checkout and confirming it upon payment. Constraints ensure reservations don't exceed stock and stock is never negative.

### Tailoring Model
Orders have a `tailoring_status` to track flow. Each `order_item` that requires tailoring gets a row in `custom_tailoring_details` capturing 10+ specific measurements, a reference image, and internal notes.

### Payment Webhook Idempotency
`payment_events` stores the `event_id` and `gateway`. A unique constraint on `(gateway, event_id)` prevents duplicate webhook processing, ensuring idempotent order state updates.

### WhatsApp Notification Queue
`whatsapp_notifications` stores messages in a `queued` status. A background worker can pick these up, send them, and update status to `sent` or `failed`, handling retries.

## Seed Data Summary
- **Collections**: 7
- **Products**: 6
- **Variants**: 24
- **Media Records**: 42
- **Tags**: 4
- **Users**: 2
- **Guest Sessions**: 1
- **Carts/Items**: 1 Cart, 2 Items
- **Orders/Items**: 1 Order, 2 Items
- **Tailoring Records**: 1
- **Payment Events**: 1
- **WhatsApp Notifications**: 3

## Validation Results
The database scripts were successfully executed against the live Supabase PostgreSQL database using a Node.js script.

### Live Query Results

- **Table Creation**: All 16 tables were successfully created in the `public` schema.
- **Record Counts**:
  - `product_count`: 6
  - `variant_count`: 24
  - `collection_count`: 7
  - `media_count`: 42
  - `tailoring_count`: 1

### Live Stock Levels
All 24 variants for the 6 custom fashion products were initialized with standard luxury inventory quantities (ranging from 2 to 25) and `reserved_quantity = 0`.

### Live Orders and Tailoring
One active order (`DS-ORD-0001`) was placed by user `atelier.client@example.com` containing:
- 1 standard item (`Black Botanical Office Suit Set`, `M`, fulfillment `ready_to_ship`, tailoring `not_required`).
- 1 tailored item (`Rosewood Festive Chanderi Suit`, `L`, fulfillment `custom_tailoring`, tailoring `pending_measurements`), which is correctly linked to its custom tailoring details record (status: `pending_approval`).

