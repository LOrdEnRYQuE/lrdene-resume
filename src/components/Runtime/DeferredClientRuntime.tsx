"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CookieConsent = dynamic(() => import("@/components/Cookies/CookieConsent"), {
  ssr: false,
});
const DeferredEnhancements = dynamic(() => import("@/components/Runtime/DeferredEnhancements"), {
  ssr: false,
});
const GtmLoader = dynamic(() => import("@/components/Analytics/GtmLoader"), {
  ssr: false,
});

export default function DeferredClientRuntime() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const timeoutId = window.setTimeout(() => setReady(true), 1200);

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(() => setReady(true), { timeout: 1600 });
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <GtmLoader />
      <CookieConsent />
      <DeferredEnhancements />
    </>
  );
}
