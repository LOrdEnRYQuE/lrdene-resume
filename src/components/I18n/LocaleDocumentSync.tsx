"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/useLocale";

export default function LocaleDocumentSync() {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
