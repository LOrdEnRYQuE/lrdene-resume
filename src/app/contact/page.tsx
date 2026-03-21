import React from "react";
import { Contact } from "@/components/Contact/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for premium product builds, AI integrations, and brand design.",
};

export default function ContactPage() {
  return (
    <main style={{ marginTop: "80px" }}>
      <Contact />
    </main>
  );
}
