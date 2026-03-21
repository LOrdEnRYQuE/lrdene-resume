import React from "react";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with LOrdEnRYQuE for premium AI engineering and digital architecture.",
};

export default function ContactPage() {
  return (
    <main style={{ marginTop: "80px" }}>
      <Contact />
      <Footer />
    </main>
  );
}
