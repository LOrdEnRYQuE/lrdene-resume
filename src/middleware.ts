import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  isLocale,
} from "@/lib/i18n/config";
import { getLocalePrefixFromPathname, stripLocalePrefix } from "@/lib/i18n/path";
import {
  getAdminCredentials,
  getAdminCookieName,
  readAdminTokenFromCookieHeader,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";

const LEGACY_PATH_REDIRECTS = new Map<string, string>([
  ["/portfolio", "/projects"],
  ["/work", "/projects"],
  ["/case-study", "/projects"],
  ["/case-studies", "/projects"],
  ["/articles", "/blog"],
  ["/posts", "/blog"],
  ["/solution", "/services"],
  ["/solutions", "/services"],
  ["/demo", "/demos"],
  ["/showcase", "/demos"],
]);

const DEMO_SLUG_ALIASES: Record<string, string> = {
  realestate: "real-estate",
  home_services: "home-services",
  homeservices: "home-services",
  aiseo: "ai-seo",
  aiagents: "ai-agents",
  aimarketplace: "ai-marketplace",
  aiplayground: "ai-playground",
  courseplatform: "course-platform",
  cardealer: "car-dealer",
  cardetailing: "car-detailing",
  carselling: "car-selling",
  saaslanding: "saas-landing",
  mentalhealth: "mental-health",
  greenco: "green-eco",
  greeneco: "green-eco",
};

function normalizePathForMatching(pathname: string) {
  const lowered = pathname.toLowerCase();
  if (lowered.length > 1 && lowered.endsWith("/")) return lowered.slice(0, -1);
  return lowered || "/";
}

function resolveLegacyPathRedirect(pathname: string): string | null {
  const normalized = normalizePathForMatching(pathname);
  const staticRedirect = LEGACY_PATH_REDIRECTS.get(normalized);
  if (staticRedirect) return staticRedirect;

  const demoAliasMatch = normalized.match(/^\/demos\/([^/]+)$/);
  if (demoAliasMatch) {
    const currentSlug = demoAliasMatch[1];
    const canonicalSlug = DEMO_SLUG_ALIASES[currentSlug];
    if (canonicalSlug && canonicalSlug !== currentSlug) {
      return `/demos/${canonicalSlug}`;
    }
  }

  return null;
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https: wss:; font-src 'self' data: https:; form-action 'self'; upgrade-insecure-requests",
  );
  return response;
}

function withRouteHeaders(response: NextResponse, normalizedPathname?: string) {
  if (normalizedPathname?.startsWith("/demos/")) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }
  return withSecurityHeaders(response);
}

function continueWithOptionalLocaleRewrite(
  request: NextRequest,
  localeInPath: string | null,
  normalizedPathname: string,
) {
  if (!localeInPath) {
    return withRouteHeaders(NextResponse.next(), normalizedPathname);
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = normalizedPathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER_NAME, localeInPath);
  const response = NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
  response.cookies.set(LOCALE_COOKIE_NAME, localeInPath, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return withRouteHeaders(response, normalizedPathname);
}

function resolvePreferredLocaleFromAcceptLanguage(headerValue: string | null): string {
  if (!headerValue) return DEFAULT_LOCALE;
  const lower = headerValue.toLowerCase();
  if (lower.includes("de")) return "de";
  if (lower.includes("en")) return "en";
  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host")?.toLowerCase();
  if (hostHeader === "www.lordenryque.com") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.host = "lordenryque.com";
    return withRouteHeaders(NextResponse.redirect(canonicalUrl, 301), request.nextUrl.pathname);
  }

  const pathname = request.nextUrl.pathname;
  if (pathname === "/icon" || pathname === "/apple-icon") {
    const iconUrl = request.nextUrl.clone();
    iconUrl.pathname = "/favicon.ico";
    return withRouteHeaders(NextResponse.redirect(iconUrl, 307), pathname);
  }
  const localeInPath = getLocalePrefixFromPathname(pathname);
  const normalizedPathname = localeInPath ? stripLocalePrefix(pathname) : pathname;

  if (localeInPath) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = normalizedPathname;
    const response = NextResponse.redirect(redirectUrl, 301);
    response.cookies.set(LOCALE_COOKIE_NAME, localeInPath, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return withRouteHeaders(response, normalizedPathname);
  }

  const legacyRedirectPath = resolveLegacyPathRedirect(normalizedPathname);

  if (legacyRedirectPath && !normalizedPathname.startsWith("/admin") && !normalizedPathname.startsWith("/api/admin")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = legacyRedirectPath;
    return withRouteHeaders(NextResponse.redirect(redirectUrl, 301), normalizedPathname);
  }

  if (normalizedPathname.startsWith("/api/admin")) {
    if (normalizedPathname === "/api/admin/login" || normalizedPathname === "/api/admin/logout") {
      return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
    }
    const creds = getAdminCredentials();
    if (!creds) {
      return withRouteHeaders(
        NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 }),
        normalizedPathname,
      );
    }
    const token = readAdminTokenFromCookieHeader(request.headers.get("cookie"));
    const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
    if (!valid) {
      return withRouteHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), normalizedPathname);
    }
    return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
  }

  if (normalizedPathname.startsWith("/admin")) {
    const isLoginPath = normalizedPathname === "/admin/login";
    const creds = getAdminCredentials();
    const loginPath = "/admin/login";
    const adminHomePath = "/admin";
    if (!creds) {
      if (isLoginPath) return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
      return withRouteHeaders(NextResponse.redirect(new URL(loginPath, request.url)), normalizedPathname);
    }
    const token = request.cookies.get(getAdminCookieName())?.value;
    const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
    if (!valid && !isLoginPath) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("next", normalizedPathname);
      return withRouteHeaders(NextResponse.redirect(loginUrl), normalizedPathname);
    }
    if (valid && isLoginPath) {
      return withRouteHeaders(NextResponse.redirect(new URL(adminHomePath, request.url)), normalizedPathname);
    }
    return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
  }
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const preferredLocale = resolvePreferredLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const locale = isLocale(cookieLocale) ? cookieLocale : preferredLocale;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER_NAME, locale);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  if (!isLocale(cookieLocale)) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return withRouteHeaders(response, normalizedPathname);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\..*).*)",
  ],
};
