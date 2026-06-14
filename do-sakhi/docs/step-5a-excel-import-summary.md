# Step 5A: Boutique Excel Inventory Import Summary

## Overview
The Excel Inventory Import system provides an intelligent backend pipeline (`/api/v1/admin/import/excel` & `commit`) and a user-friendly frontend UI (`/admin/import`) to safely batch-import products from the "Boutique_Inventory_Profit_Tracker.xlsx" source file into the Do Sakhi database.

## System Architecture

### 1. Parsing & Previewing (`/excel`)
- Uses `multer` for memory-safe multipart/form-data upload handling (Max 10MB, `.xls`/`.xlsx` only).
- Parses the inventory sheet using the `xlsx` package.
- Groups distinct rows into master products using the composite key: `Suit Code + Colour`.
- Trims and normalizes tricky Excel headers automatically.
- Dynamically infers the `product_type`, assigns `collectionSlugs`, and generates SEO-friendly titles and slugs.
- Returns a rich JSON array of structured product objects without modifying the database.

### 2. Committing (`/commit`)
- Receives the JSON payload of approved preview products.
- Uses PostgreSQL Transactions (`BEGIN` / `COMMIT` / `ROLLBACK`) via `pg` to ensure atomic inserts.
- **Safety First**: Implements active duplicate detection. If a `slug` or `sku` exists, it skips gracefully and logs a non-blocking warning rather than failing the batch or silently overwriting.
- Inserts products default as `draft` status.
- Skips media if no placeholder is available and tags the product with `import_status: needs_image` for future backfilling.
- Populates rich tags (e.g., `occasion: festive`, `style: quiet_luxury`) based on the inferred classification.

## Field Mappings

| Excel Column | Database Entity | Notes |
| :--- | :--- | :--- |
| `Suit Code` | `products.slug`, `variants.sku` | Extracted and normalized for unique identifiers. |
| `Colour` | `variants.color_name` | Mapped to title-cased names. |
| `Size` | `variants.size_label` | Defaults to 'Free Size' if empty. |
| `Quantity` | `variants.stock_quantity` | Parsed as integer. |
| `Purchase Price` | `variants.cost_price_inr` | Parsed as float. |
| `Selling Price` | `variants.price_inr` | Parsed as float. Used for global min/max price range. |
| `Firm Name` | `product_tags` | Added as `source` tag. |

## Execution Output
The system is fully stable and running.
- **Frontend Panel:** Available at `http://localhost:3001/admin/import`
- **Backend API:** Available at `http://localhost:4000/api/v1/admin/import/*`

No Step 5B features (Public Shop, PLP, PDP, Checkout) have been initiated.
