import { clearSession } from "@/lib/admin-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function POST(request: Request) {
  await clearSession();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
