"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1512] px-6">
      <div 
        className="w-full max-w-md p-10 rounded-lg shadow-2xl relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)",
          border: "1px solid rgba(167,111,77,0.15)",
        }}
      >
        {/* Subtle decorative top border */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, rgba(167,111,77,0) 0%, rgba(167,111,77,0.6) 50%, rgba(167,111,77,0) 100%)"
          }}
        />

        <div className="text-center mb-10">
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#A76F4D", fontFamily: "var(--font-sans)" }}
          >
            Atelier Access
          </p>
          <h1
            className="text-4xl font-light mb-2"
            style={{ fontFamily: "var(--font-serif)", color: "#F8F3EA", lineHeight: 1 }}
          >
            Do Sakhi
          </h1>
          <p
            className="text-sm mt-3"
            style={{ color: "#8B8476", fontFamily: "var(--font-sans)" }}
          >
            Enter your admin credentials to continue.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color: "#8B8476", fontFamily: "var(--font-sans)" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(167,111,77,0.3)] px-4 py-3 text-sm text-[#F8F3EA] focus:outline-none focus:border-[#A76F4D] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] mb-2" style={{ color: "#8B8476", fontFamily: "var(--font-sans)" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full bg-[rgba(0,0,0,0.2)] border border-[rgba(167,111,77,0.3)] px-4 py-3 text-sm text-[#F8F3EA] focus:outline-none focus:border-[#A76F4D] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
              autoComplete="current-password"
            />
          </div>

          {state?.error && (
            <div className="p-4 bg-[rgba(167,111,77,0.1)] border border-[rgba(167,111,77,0.3)] text-center">
              <p className="text-sm text-[#D47E73]" style={{ fontFamily: "var(--font-sans)" }}>
                {state.error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full mt-4 bg-[#073F34] hover:bg-[#0A4F42] border border-[rgba(167,111,77,0.4)] text-[#F8F3EA] py-3.5 px-4 text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {pending ? "Verifying..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
