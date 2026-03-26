"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { fetchAdminToken } from "@/hooks/adminToken";

export function useAdminQuery(queryRef: unknown, args: Record<string, unknown> | "skip" = {}) {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAdminToken()
      .then((token) => {
        if (active) setAdminToken(token);
      })
      .catch(() => {
        if (active) setAdminToken(null);
      });
    return () => {
      active = false;
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
