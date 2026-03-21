import React from "react";
import { About } from "@/components/About/About";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Attila Lazar, the engineer and designer behind LOrdEnRYQuE.",
};

export default function AboutPage() {
  return (
    <main style={{ marginTop: "80px" }}>
      <About />
    </main>
  );
}
