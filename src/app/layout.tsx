import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | LOrdEnRYQuE",
    default: "LOrdEnRYQuE | Generative AI & Architecture",
  },
  description: "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
  keywords: ["AI Engineer", "Software Architect", "Next.js Developer", "React", "TypeScript", "Startups"],
  authors: [{ name: "Attila Lazar", url: "https://lrdene.com" }],
  creator: "Attila Lazar",
  openGraph: {
    title: "LOrdEnRYQuE | Generative AI & Architecture",
    description: "Premium Portfolio & Insights. Engineering AI products and highly scalable systems.",
    url: "https://lrdene.com",
    siteName: "LOrdEnRYQuE Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LOrdEnRYQuE | Generative AI",
    description: "Engineering AI products and highly scalable systems.",
  },
  alternates: {
    canonical: "https://lrdene.com",
  },
  icons: {
    icon: "/assets/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <Navbar />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}

