"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "⬡" },
  { href: "/admin/products", label: "Products", icon: "◈" },
  { href: "/admin/products/new", label: "Add Product", icon: "+" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ background: "#0D1512" }}>
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col border-r"
        style={{
          background: "linear-gradient(180deg, #0A1210 0%, #0D1512 100%)",
          borderColor: "rgba(167,111,77,0.18)",
        }}
      >
        {/* Logo */}
        <div
          className="px-8 py-8 border-b"
          style={{ borderColor: "rgba(167,111,77,0.15)" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-1"
            style={{ color: "#A76F4D", fontFamily: "var(--font-sans)" }}
          >
            Admin
          </p>
          <h1
            className="text-2xl font-light leading-none"
            style={{ fontFamily: "var(--font-serif)", color: "#F8F3EA" }}
          >
            Do Sakhi
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200"
                style={{
                  fontFamily: "var(--font-sans)",
                  background: active
                    ? "rgba(167,111,77,0.14)"
                    : "transparent",
                  color: active ? "#F8F3EA" : "#6E675F",
                  border: active
                    ? "1px solid rgba(167,111,77,0.25)"
                    : "1px solid transparent",
                  letterSpacing: "0.06em",
                }}
              >
                <span
                  className="text-base"
                  style={{ color: active ? "#A76F4D" : "#4A4540" }}
                >
                  {icon}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-8 py-6 border-t"
          style={{
            borderColor: "rgba(167,111,77,0.12)",
            color: "#3E3830",
            fontSize: "11px",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.06em",
          }}
        >
          DO SAKHI © 2025
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Development Warning Banner */}
        <div className="bg-red-900/40 border-b border-red-900/60 text-red-200 text-xs text-center py-2 px-4 uppercase tracking-wider">
          ⚠️ Development Admin Panel — Not protected for production deployment.
        </div>
        {children}
      </main>
    </div>
  );
}
