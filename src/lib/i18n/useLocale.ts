"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type Locale, isLocale } from "@/lib/i18n/config";

function resolveLocaleFromDocument(): Locale {
  if (typeof document !== "undefined") {
    const docLang = document.documentElement.lang?.trim().toLowerCase();
    if (isLocale(docLang)) return docLang;
  }
  if (typeof document !== "undefined") {
    const cookieEntry = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(`${LOCALE_COOKIE_NAME}=`));
    const cookieValue = cookieEntry?.split("=")[1];
    if (isLocale(cookieValue)) return cookieValue;
  }
  return DEFAULT_LOCALE;
}

export function useLocale(): Locale {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>(() => resolveLocaleFromDocument());

  useEffect(() => {
    setLocale(resolveLocaleFromDocument());
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent<Locale | undefined>;
      const nextLocale = customEvent.detail;
      if (isLocale(nextLocale)) {
        setLocale(nextLocale);
      }
    };
    window.addEventListener("lrdene:locale-change", handleLocaleChange);
    return () => window.removeEventListener("lrdene:locale-change", handleLocaleChange);
  }, []);

  return locale;
}
