"use client";

import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ComponentProps } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/path";
import { useLocale } from "@/lib/i18n/useLocale";

type Props = Omit<ComponentProps<typeof Link>, "href"> &
  Pick<LinkProps, "replace" | "scroll" | "prefetch"> & {
    href: LinkProps["href"];
    localeOverride?: Locale;
  };

export default function LocaleLink({ href, localeOverride, ...props }: Props) {
  const locale = useLocale();
  const targetLocale = localeOverride ?? locale;
  const localizedHref = typeof href === "string" ? localizeHref(href, targetLocale) : href;

  return <Link href={localizedHref} {...props} />;
}
