import { DEFAULT_LOCALE, type Locale, isLocale } from "@/lib/i18n/config";

export function getLocalePrefixFromPathname(pathname: string): Locale | null {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  if (isLocale(firstSegment)) return firstSegment;
  return null;
}

export function getLocaleFromPathname(pathname: string): Locale {
  return getLocalePrefixFromPathname(pathname) ?? DEFAULT_LOCALE;
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    const nextPath = `/${segments.slice(1).join("/")}`;
    return nextPath === "/" ? "/" : nextPath.replace(/\/$/, "") || "/";
  }
  return pathname || "/";
}

export function localizePath(pathname: string, locale: Locale): string {
  void locale;
  const normalized = stripLocalePrefix(pathname || "/");
  return normalized || "/";
}

export function localizeHref(href: string, locale: Locale): string {
  if (!href) return href;

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  ) {
    return href;
  }

  if (!href.startsWith("/")) return href;
  return localizePath(href, locale);
}
