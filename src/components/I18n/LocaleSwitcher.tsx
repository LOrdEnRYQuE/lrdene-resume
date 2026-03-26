"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { localizePath, stripLocalePrefix } from "@/lib/i18n/path";
import { useLocale } from "@/lib/i18n/useLocale";
import styles from "./LocaleSwitcher.module.css";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const basePath = stripLocalePrefix(pathname || "/");
  const query = searchParams.toString();

  return (
    <div className={styles.switcher}>
      {SUPPORTED_LOCALES.map((nextLocale) => {
        const isActive = locale === nextLocale;
        return (
          <button
            key={nextLocale}
            type="button"
            className={`${styles.button} ${isActive ? styles.active : ""}`}
            onClick={() => {
              const path = localizePath(basePath, nextLocale);
              router.push(query ? `${path}?${query}` : path);
            }}
          >
            {nextLocale.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
