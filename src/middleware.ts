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

function continueWithOptionalLocaleRewrite(
  request: NextRequest,
  localeInPath: string | null,
  normalizedPathname: string,
) {
  if (!localeInPath) {
    return withSecurityHeaders(NextResponse.next());
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
  return withSecurityHeaders(response);
}

export async function middleware(request: NextRequest) {
  const hostHeader = request.headers.get("host")?.toLowerCase();
  if (hostHeader === "www.lordenryque.com") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.host = "lordenryque.com";
    return withSecurityHeaders(NextResponse.redirect(canonicalUrl, 301));
  }

  const pathname = request.nextUrl.pathname;
  const localeInPath = getLocalePrefixFromPathname(pathname);
  const normalizedPathname = localeInPath ? stripLocalePrefix(pathname) : pathname;
  const localePrefix = localeInPath ? `/${localeInPath}` : "";

  if (normalizedPathname.startsWith("/api/admin")) {
    if (normalizedPathname === "/api/admin/login" || normalizedPathname === "/api/admin/logout") {
      return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
    }
    const creds = getAdminCredentials();
    if (!creds) {
      return withSecurityHeaders(NextResponse.json({ error: "Admin auth is not configured." }, { status: 500 }));
    }
    const token = readAdminTokenFromCookieHeader(request.headers.get("cookie"));
    const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
    if (!valid) {
      return withSecurityHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    }
    return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
  }

  if (normalizedPathname.startsWith("/admin")) {
    const isLoginPath = normalizedPathname === "/admin/login";
    const creds = getAdminCredentials();
    const loginPath = `${localePrefix}/admin/login`;
    const adminHomePath = `${localePrefix}/admin`;
    if (!creds) {
      if (isLoginPath) return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
      return withSecurityHeaders(NextResponse.redirect(new URL(loginPath, request.url)));
    }
    const token = request.cookies.get(getAdminCookieName())?.value;
    const valid = await verifyAdminSessionToken(token, creds.sessionSecret, creds.username);
    if (!valid && !isLoginPath) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set("next", normalizedPathname);
      return withSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    if (valid && isLoginPath) {
      return withSecurityHeaders(NextResponse.redirect(new URL(adminHomePath, request.url)));
    }
    return continueWithOptionalLocaleRewrite(request, localeInPath, normalizedPathname);
  }

  if (localeInPath) {
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
    return withSecurityHeaders(response);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return withSecurityHeaders(NextResponse.redirect(redirectUrl));
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
