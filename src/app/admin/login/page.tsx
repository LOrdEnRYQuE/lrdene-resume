"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearCachedAdminToken } from "@/hooks/adminToken";
import { useLocale } from "@/lib/i18n/useLocale";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nextPath, setNextPath] = useState("/admin");
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const requestedNext = new URLSearchParams(window.location.search).get("next");
    if (requestedNext && requestedNext.startsWith("/admin")) {
      setNextPath(requestedNext);
    }
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      clearCachedAdminToken();
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(payload.error || "Login failed");
        return;
      }
      const localizedNext = nextPath.startsWith("/admin") ? `/${locale}${nextPath}` : `/${locale}/admin`;
      router.replace(localizedNext);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem" }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 14,
          padding: "1.2rem",
          display: "grid",
          gap: "0.8rem",
        }}
      >
        <h1 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Admin Login</h1>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#b0b0b0" }}>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "#0a0a0a", color: "#fff" }}
          />
        </label>
        <label style={{ display: "grid", gap: "0.3rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#b0b0b0" }}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{ padding: "0.7rem", borderRadius: 8, border: "1px solid rgba(255,255,255,0.18)", background: "#0a0a0a", color: "#fff" }}
          />
        </label>
        {error ? (
          <p style={{ color: "#ff9a9a", fontSize: "0.85rem", border: "1px solid rgba(255,90,90,0.3)", borderRadius: 8, padding: "0.55rem" }}>
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={isLoading} style={{ minHeight: 42, borderRadius: 999, fontWeight: 800 }}>
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
