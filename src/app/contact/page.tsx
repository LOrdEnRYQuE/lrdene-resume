// export const runtime = "edge";

import React from "react";
import { Contact } from "@/components/Contact/Contact";
import { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with LOrdEnRYQuE for premium AI engineering and digital architecture.",
  alternates: {
    canonical: "/contact",
    languages: getLanguageAlternates("/contact"),
  },
};

export default function ContactPage() {
  return (
    <main style={{ marginTop: "clamp(88px, 12vw, 140px)" }}>
      <Contact />
    </main>
  );
}
