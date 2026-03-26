"use client";

import { useCallback } from "react";
import { useMutation } from "convex/react";
import { fetchAdminToken } from "@/hooks/adminToken";

export function useAdminMutation(mutationRef: unknown) {
  const mutation = useMutation(mutationRef as never);

  return useCallback(
    async (args: Record<string, unknown> = {}) => {
      const adminToken = await fetchAdminToken();
      return mutation({ ...args, adminToken } as never);
    },
    [mutation],
  );
}
