"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getLocaleFromPathname } from "@/lib/i18n/path";

export function useLocale(): Locale {
  const pathname = usePathname();
  if (!pathname) return DEFAULT_LOCALE;
  return getLocaleFromPathname(pathname);
}
