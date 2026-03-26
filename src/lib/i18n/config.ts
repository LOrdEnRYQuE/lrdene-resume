export const SUPPORTED_LOCALES = ["en", "de"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "lrdene-locale";
export const LOCALE_HEADER_NAME = "x-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && SUPPORTED_LOCALES.includes(value as Locale));
}
