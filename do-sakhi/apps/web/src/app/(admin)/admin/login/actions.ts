"use server";

import crypto from "crypto";
import { createSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  
  if (!username || !password) {
    return { error: "These details could not be verified." };
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedHashFormat = process.env.ADMIN_PASSWORD_HASH; // format "salt:hash"

  if (!expectedUsername || !expectedHashFormat) {
    // If not configured, fail securely without exposing why
    return { error: "These details could not be verified." };
  }

  // Use timing-safe username comparison to avoid leaking if username exists
  const isUsernameValid = crypto.timingSafeEqual(
    Buffer.from(username.padEnd(64)), 
    Buffer.from(expectedUsername.padEnd(64))
  ) && username === expectedUsername;

  const [salt, expectedHash] = expectedHashFormat.split(":");
  if (!salt || !expectedHash) {
    return { error: "These details could not be verified." };
  }

  // Hash the provided password
  const derivedKey = crypto.scryptSync(password, salt, 64);
  const actualHash = derivedKey.toString("hex");

  let isPasswordValid = false;
  try {
    const expectedBuffer = Buffer.from(expectedHash, "hex");
    const actualBuffer = Buffer.from(actualHash, "hex");
    if (expectedBuffer.length === actualBuffer.length) {
      isPasswordValid = crypto.timingSafeEqual(expectedBuffer, actualBuffer);
    }
  } catch (e) {
    // Ignore buffer errors safely
  }

  if (!isUsernameValid || !isPasswordValid) {
    return { error: "These details could not be verified." };
  }

  await createSession(username);
  
  // Safe internal redirect
  redirect("/admin/products");
}
