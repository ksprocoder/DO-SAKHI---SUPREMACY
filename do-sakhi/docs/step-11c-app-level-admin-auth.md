# Step 11C Artifact — Proper App-Level Admin Auth

## 1. Executive Summary
This step established a robust, server-side session authentication system for the Do Sakhi admin panel. After removing the unsafe Basic Auth middleware in Step 11B.2, this step properly secures all admin application routes without exposing credentials in the Edge runtime, `next.config.ts`, or the browser bundle.

## 2. Why This Step Was Needed
The application needed secure authentication for the admin panel routes (`/admin/*`) because the previous Basic Auth approach relied on Next.js Edge Middleware, which inadvertently exposed secrets to the build output. A new architecture using Node.js Server Components and Server Actions was required to keep secrets strictly server-side.

## 3. Auth Architecture
- **Login Action:** `apps/web/src/app/(admin)/admin/login/actions.ts` uses Node's native `crypto.scryptSync` and `crypto.timingSafeEqual` to securely verify passwords against a salted hash without leaking timing vulnerabilities.
- **Session Cookie Design:** Upon successful login, an `httpOnly`, `secure` (in production), `sameSite=lax` cookie is generated. It is signed with an HMAC-SHA256 signature using `ADMIN_SESSION_SECRET` and bound to the `/admin` path to prevent it from leaking to public storefront requests.
- **Route Protection:** A new route group `apps/web/src/app/(admin)/admin/(protected)` was created. The `layout.tsx` for this group forces authentication on all pages within it by invoking `requireAdminAuth()`.
- **API Proxy Protection:** `apps/web/src/app/(admin)/admin/api/[...path]/route.ts` was updated to explicitly verify the session before injecting the backend `X-Admin-Key`.

## 4. Environment Variables Required
The system now uses strictly server-only variables:
```env
ADMIN_AUTH_ENABLED=true
ADMIN_USERNAME=replace_with_admin_username
ADMIN_PASSWORD_HASH=replace_with_secure_password_hash
ADMIN_SESSION_SECRET=replace_with_long_random_session_secret
ADMIN_API_KEY=replace_with_server_side_admin_api_key
```

## 5. Protected Admin Routes
The following routes require a valid session. Unauthenticated requests instantly redirect to `/admin/login`:
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/import`

## 6. Protected Admin API Proxy
The proxy route `/admin/api/*` verifies the session before forwarding requests. Unauthenticated requests return `401 Unauthorized` in JSON format without redirecting or exposing the `X-Admin-Key`.

## 7. Public Storefront Verification
Public routes remain completely open. A `curl` check against `/shop` returned HTTP 200 without a session. The `/admin` session cookie is strictly scoped to `path=/admin`, meaning it is not sent to the storefront endpoints. The `cost_price_inr` and internal admin data remain hidden on the frontend.

## 8. Backend X-Admin-Key Verification
Direct backend routes in the Hono API (e.g., `http://localhost:4000/api/v1/admin/*`) remain protected by the raw `X-Admin-Key`. The proxy successfully manages this key injection post-authentication.

## 9. Secret Scan Result
After building the Next.js application, a `grep` search for the test session secret, test API key, and test password hashes across the `.next/static` folder and browser bundles returned 0 results. No secrets are bundled.

## 10. Build & Typecheck
`npm run typecheck` and `npm run build` completed successfully with zero errors. Next.js App Router correctly statically rendered the public pages while keeping the admin dashboard dynamic.

## 11. Files Modified / Created
- `apps/web/src/lib/admin-auth.ts` (NEW)
- `apps/web/scripts/hash-password.js` (NEW)
- `apps/web/src/app/(admin)/admin/login/page.tsx` (NEW)
- `apps/web/src/app/(admin)/admin/login/actions.ts` (NEW)
- `apps/web/src/app/(admin)/admin/logout/route.ts` (NEW)
- `apps/web/src/app/(admin)/admin/(protected)/layout.tsx` (NEW)
- `apps/web/src/app/(admin)/admin/api/[...path]/route.ts` (MODIFIED)
- `apps/web/.env.local` & `.env.example` (MODIFIED)

## 12. Strict Boundary Confirmation
- Vercel SSO was NOT disabled.
- Production was NOT made public.
- Razorpay was NOT touched.
- No products (fake or real) were uploaded.

## 13. Known Limitations
- Vercel SSO remains active over the deployment as a primary defense-in-depth measure. The app-level authentication handles in-app routing safely.
- If deployed without Vercel SSO in the future, the app relies entirely on this server-side session logic.

## 14. Final Recommendation
Step 11C is fully implemented. The Do Sakhi admin dashboard now operates securely with robust session management and zero secret leakage.
