// export const runtime = "edge";

import React from "react";
import { Contact } from "@/components/Contact/Contact";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "Contact",
    description: `Get in touch with ${BUSINESS_PROFILE.name} for ${BUSINESS_PROFILE.description}. Remote-first delivery from Germany (${BUSINESS_PROFILE.timezone}).`,
    alternates: {
      canonical: toLocaleCanonical("/contact", locale),
      languages: getLanguageAlternates("/contact"),
    },
  };
}

export default function ContactPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <Contact />
    </main>
  );
}
