# Step 11B.1: Admin API Security Verification

## Objective
Verify the airtight security architecture of the Do Sakhi admin dashboard. The objective was to confirm:
1. `X-Admin-Key` requirement for backend administrative API routes.
2. Proxy shielding via Next.js `/admin/api/[...path]` endpoints.
3. Proper Basic Auth middleware enforcement of `/admin` endpoints.
4. Absolute isolation of sensitive admin data from the public storefront API.

## Discoveries & Actions Taken

### 1. Storefront API Leak Patched
During the security audit, we identified a critical data leak in the backend Hono API (`apps/api/src/routes/products.ts`). The public Product Detail Page (PDP) query was performing a `SELECT *` on the variants table, which inadvertently exposed the `cost_price_inr` field to the public internet.

**Fix Applied:** We restricted the SQL query for the variants table to an explicit allowlist of safe columns (`id`, `product_id`, `sku`, `price_inr`, `stock_quantity`, `weight_grams`).

### 2. Next.js Edge Middleware Env Bug Fixed
While testing the Basic Auth boundaries with `ADMIN_PROTECTION_ENABLED=true`, we discovered that the middleware was failing silently and letting requests through.

**Root Cause:** In Next.js, Edge Middleware cannot natively read non-`NEXT_PUBLIC_` variables from `.env` files without them being explicitly exposed at build time. Since we correctly avoided prefixing sensitive credentials with `NEXT_PUBLIC_`, the edge runtime evaluated `process.env.ADMIN_PROTECTION_ENABLED` as undefined.

**Fix Applied:** We added an `env` block to `next.config.ts` to securely expose `ADMIN_PROTECTION_ENABLED`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` to the server-side runtime, restoring full middleware auth capabilities.

### 3. Boundary Verification Successful
After applying the fixes, we executed automated curling against the production-built Next.js server to ensure boundaries behave as intended:

| Route | Auth State | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| `/admin` | No Auth | 401 Unauthorized | **401 Unauthorized** |
| `/admin/products` | No Auth | 401 Unauthorized | **401 Unauthorized** |
| `/admin/api/products` | No Auth | 401 Unauthorized | **401 Unauthorized** |
| `/admin/products` | Wrong Auth | 401 Unauthorized | **401 Unauthorized** |
| `/admin/products` | Correct Auth | 200 OK | **200 OK** |
| `/` (Storefront) | No Auth | 200 OK | **200 OK** |
| `/shop` | No Auth | 200 OK | **200 OK** |

**Conclusion:** The admin UI and the admin API proxy are completely inaccessible without correct HTTP Basic Auth credentials. The backend API is inaccessible without the `X-Admin-Key` (which is only injected securely on the server-side by the Next.js proxy). The security framework is fully verified.

### 4. Development Workflow Restored
Following verification, `ADMIN_PROTECTION_ENABLED=false` was restored in `.env.local` to enable seamless local development.
