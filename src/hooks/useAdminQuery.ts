"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { fetchAdminToken } from "@/hooks/adminToken";

export function useAdminQuery(queryRef: unknown, args: Record<string, unknown> | "skip" = {}) {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const refreshToken = async () => {
      try {
        const token = await fetchAdminToken();
        if (active) {
          setAdminToken(token);
        }
      } catch {
        if (active) {
          setAdminToken(null);
        }
      }
    };

    void refreshToken();

    const interval = window.setInterval(() => {
      void refreshToken();
    }, 60_000);

    const onVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        void refreshToken();
      }
    };

    window.addEventListener("focus", onVisibilityOrFocus);
    document.addEventListener("visibilitychange", onVisibilityOrFocus);

    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onVisibilityOrFocus);
      document.removeEventListener("visibilitychange", onVisibilityOrFocus);
    };
  }, []);

  const queryArgs =
    args === "skip"
      ? "skip"
      : adminToken
        ? ({ ...args, adminToken } as Record<string, unknown>)
        : "skip";

  return useQuery(queryRef as any, queryArgs as any) as any;
}
