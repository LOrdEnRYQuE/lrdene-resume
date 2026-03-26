"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";

const SESSION_KEY = "lrdene_session_id";
const FIRST_TOUCH_KEY = "lrdene_first_touch";
const LAST_TOUCH_KEY = "lrdene_last_touch";
const LANDING_PAGE_KEY = "lrdene_landing_page";

export const useAnalytics = () => {
  const pathname = usePathname();
  const recordPageView = useMutation(api.analytics.recordPageView);
  const recordEvent = useMutation(api.analytics.recordEvent);

  useEffect(() => {
    // 1. Manage Session Identity
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    // 2. Extract Device Info
    const userAgent = window.navigator.userAgent;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
    const device = isMobile ? "mobile" : "desktop";

    // 3. Track Page View
    const campaign = getCampaignContext();
    const landingPage = ensureLandingPage(pathname);
    const firstTouch = readOrCreateTouchpoint(FIRST_TOUCH_KEY, campaign, pathname);
    const lastTouch = writeTouchpoint(LAST_TOUCH_KEY, campaign, pathname);
    recordPageView({
      route: pathname,
      referrer: document.referrer || undefined,
      device: device,
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      sessionId: sessionId as string,
    });

    if (campaign.source || campaign.term || campaign.medium || campaign.campaign) {
      recordEvent({
        type: ANALYTICS_EVENTS.ATTRIBUTION,
        label: formatEventLabel("Campaign context", {
          ...campaign,
          landing_page: landingPage,
          first_touch: firstTouch,
          last_touch: lastTouch,
        }),
        route: pathname,
        sessionId: sessionId as string,
      });
    }

    const routeEvent = getRouteEvent(pathname || "/");
    if (routeEvent) {
      recordEvent({
        type: routeEvent.type,
        label: formatEventLabel(routeEvent.label, {
          ...campaign,
          landing_page: landingPage,
          first_touch: firstTouch,
          last_touch: lastTouch,
        }),
        route: pathname,
        sessionId: sessionId as string,
      });
    }

    const handleTrackedClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trackable = target?.closest("[data-track-event]") as HTMLElement | null;
      if (!trackable) {
        return;
      }

      const eventType = trackable.getAttribute("data-track-event") || "click";
      const label = trackable.getAttribute("data-track-label") || trackable.textContent?.trim() || "unknown";
      const extraMeta = {
        source: campaign.source,
        term: campaign.term,
        medium: campaign.medium,
        campaign: campaign.campaign,
        landing_page: landingPage,
        first_touch: firstTouch,
        last_touch: lastTouch,
      };

      recordEvent({
        type: eventType,
        label: formatEventLabel(label, extraMeta),
        route: pathname,
        sessionId: sessionId as string,
      });
    };

    document.addEventListener("click", handleTrackedClick);
    return () => {
      document.removeEventListener("click", handleTrackedClick);
    };
  }, [pathname, recordPageView, recordEvent]);

  const trackEvent = (type: string, label: string, meta?: Record<string, string | number | undefined>) => {
    const sessionId = localStorage.getItem(SESSION_KEY) || "unknown";
    const campaign = getCampaignContext();
    const landingPage = localStorage.getItem(LANDING_PAGE_KEY) || pathname || "/";
    const firstTouch = localStorage.getItem(FIRST_TOUCH_KEY) || undefined;
    const lastTouch = localStorage.getItem(LAST_TOUCH_KEY) || undefined;
    recordEvent({
      type,
      label: formatEventLabel(label, {
        ...campaign,
        landing_page: landingPage,
        first_touch: firstTouch,
        last_touch: lastTouch,
        ...meta,
      }),
      route: pathname,
      sessionId,
    });
  };

  const trackConversion = (conversionType: string, value: number = 0) => {
    const sessionId = localStorage.getItem(SESSION_KEY) || "unknown";
    const campaign = getCampaignContext();
    const landingPage = localStorage.getItem(LANDING_PAGE_KEY) || pathname || "/";
    const firstTouch = localStorage.getItem(FIRST_TOUCH_KEY) || undefined;
    const lastTouch = localStorage.getItem(LAST_TOUCH_KEY) || undefined;
    recordEvent({
      type: ANALYTICS_EVENTS.CONVERSION,
      label: formatEventLabel(`Conversion: ${conversionType}`, {
        ...campaign,
        landing_page: landingPage,
        first_touch: firstTouch,
        last_touch: lastTouch,
      }),
      conversionType,
      value,
      route: pathname,
      sessionId,
    });
  };

  return { trackEvent, trackConversion };
};

// Helpers for simple device detection
function getBrowser(ua: string) {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Other";
}

function getOS(ua: string) {
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Linux/Other";
}

function getCampaignContext() {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const referrerHost = document.referrer ? new URL(document.referrer).hostname : undefined;

  return {
    source: params.get("utm_source") || referrerHost,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    term: params.get("utm_term") || undefined,
  };
}

function ensureLandingPage(pathname: string | null) {
  if (typeof window === "undefined") return pathname || "/";
  const existing = localStorage.getItem(LANDING_PAGE_KEY);
  if (existing) return existing;
  const landing = pathname || "/";
  localStorage.setItem(LANDING_PAGE_KEY, landing);
  return landing;
}

function readOrCreateTouchpoint(
  storageKey: string,
  campaign: ReturnType<typeof getCampaignContext>,
  pathname: string | null,
) {
  if (typeof window === "undefined") return "";
  const existing = localStorage.getItem(storageKey);
  if (existing) return existing;
  const fingerprint = buildTouchpoint(campaign, pathname);
  localStorage.setItem(storageKey, fingerprint);
  return fingerprint;
}

function writeTouchpoint(
  storageKey: string,
  campaign: ReturnType<typeof getCampaignContext>,
  pathname: string | null,
) {
  if (typeof window === "undefined") return "";
  const fingerprint = buildTouchpoint(campaign, pathname);
  localStorage.setItem(storageKey, fingerprint);
  return fingerprint;
}

function buildTouchpoint(campaign: ReturnType<typeof getCampaignContext>, pathname: string | null) {
  return [campaign.source || "direct", campaign.medium || "none", campaign.campaign || "none", pathname || "/"].join(">");
}

function getRouteEvent(pathname: string) {
  if (/^\/services\/[^/]+/.test(pathname)) {
    return { type: ANALYTICS_EVENTS.VIEW_SERVICE, label: "Service detail viewed" };
  }
  if (/^\/projects\/[^/]+/.test(pathname)) {
    return { type: ANALYTICS_EVENTS.VIEW_PROJECT, label: "Project detail viewed" };
  }
  if (/^\/demos\/[^/]+/.test(pathname)) {
    return { type: ANALYTICS_EVENTS.OPEN_DEMO, label: "Demo opened" };
  }
  return null;
}

function formatEventLabel(label: string, meta: Record<string, string | number | undefined>) {
  const tags = Object.entries(meta)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `${key}:${String(value)}`);

  if (tags.length === 0) {
    return label;
  }

  return `${label} | ${tags.join(" | ")}`;
}

function generateSessionId() {
  const c = typeof window !== "undefined" ? window.crypto : undefined;

  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }

  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  return `sid-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
