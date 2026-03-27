import { headers } from "next/headers";

import { LOCALE_HEADER_NAME, type Locale, isLocale } from "@/lib/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const localeHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  return isLocale(localeHeader) ? localeHeader : "en";
}

export function toLocaleCanonical(pathname: string, locale: Locale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}
