"use client";

import dynamic from "next/dynamic";

const AnalyticsTracker = dynamic(() => import("@/components/Analytics/AnalyticsTracker"), {
  ssr: false,
});
const DeferredClientRuntime = dynamic(() => import("@/components/Runtime/DeferredClientRuntime"), {
  ssr: false,
});

export default function ClientRuntimeMount() {
  return (
    <>
      <AnalyticsTracker />
      <DeferredClientRuntime />
    </>
  );
}
