"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollLampEffect = dynamic(() => import("@/components/Effects/ScrollLampEffect"), {
  ssr: false,
});
const AIAgent = dynamic(() => import("@/components/AI/AIAgent"), {
  ssr: false,
});

const ENABLE_AI_AGENT = process.env.NEXT_PUBLIC_ENABLE_AI_AGENT === "true";

export default function DeferredEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | null = null;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const timeoutId = window.setTimeout(() => setReady(true), 1400);

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(() => setReady(true), { timeout: 1800 });
    }

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== null && typeof w.cancelIdleCallback === "function") {
        w.cancelIdleCallback(idleId);
      }
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <ScrollLampEffect />
      {ENABLE_AI_AGENT ? <AIAgent /> : null}
    </>
  );
}
