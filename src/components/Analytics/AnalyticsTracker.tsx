"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsTracker() {
  // The hook handles the side effects of tracking on mount and route change
  useAnalytics();
  
  // This component doesn't render anything visible
  return null;
}
