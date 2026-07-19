import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const SESSION_COOKIE = "do_sakhi_admin_session";
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 1 day

/**
 * Creates a signed session token.
 */
export function createSessionToken(username: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET");

  const expiresAt = Date.now() + SESSION_EXPIRY_MS;
  const payload = `${username}.${expiresAt}`;
  
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const signature = hmac.digest("hex");

  return `${payload}.${signature}`;
}

/**
 * Verifies a signed session token using timing-safe comparison.
 * Returns true if valid and not expired.
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [username, expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);

  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const payload = `${username}.${expiresAt}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  // Timing safe comparison requires equal length buffers
  try {
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const actualBuffer = Buffer.from(signature, "hex");
    if (expectedBuffer.length !== actualBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
  } catch (e) {
    return false;
  }
}

/**
 * Gets the current auth status from the request cookies.
 */
export async function getIsAdminAuthenticated(): Promise<boolean> {
  if (process.env.ADMIN_AUTH_ENABLED !== "true") {
    // If not enabled, fail closed. We must strictly enforce auth if it's supposed to be on.
    return false;
  }
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  return verifySessionToken(sessionToken);
}

/**
 * Protects a page server component. Redirects to /admin/login if not authenticated.
 */
export async function requireAdminAuth() {
  const isAuthenticated = await getIsAdminAuthenticated();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

/**
 * Clears the session cookie.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: SESSION_COOKIE,
    path: "/admin",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  });
}

/**
 * Creates the session cookie.
 */
export async function createSession(username: string) {
  const token = createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_EXPIRY_MS / 1000,
  });
}
