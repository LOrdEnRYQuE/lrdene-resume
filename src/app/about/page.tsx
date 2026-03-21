export const runtime = "edge";

import React from "react";
import { About } from "@/components/About/About";
import { Footer } from "@/components/Footer/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
};

export default function AboutPage() {
  return (
    <main style={{ marginTop: "80px" }}>
      <About />
      <Footer />
    </main>
  );
}
