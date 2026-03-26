import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import DesignTokensRuntime from "@/components/DesignTokensRuntime";
import LocaleDocumentSync from "@/components/I18n/LocaleDocumentSync";
import DeferredEnhancements from "@/components/Runtime/DeferredEnhancements";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getPageContentCached, getSiteSettingsCached } from "@/lib/server/cachedQueries";

export const metadata: Metadata = {
  metadataBase: new URL("https://lrdene.com"),
  title: {
    template: "%s | LOrdEnRYQuE",
    default: "LOrdEnRYQuE | Generative AI & Architecture",
  },
  description: "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
  keywords: ["AI Engineer", "Software Architect", "Next.js Developer", "React", "TypeScript", "Startups"],
  authors: [{ name: "Attila Lazar", url: "https://lrdene.com" }],
  creator: "Attila Lazar",
  alternates: {
    canonical: "/en",
    languages: getLanguageAlternates("/"),
  },
  openGraph: {
    title: "LOrdEnRYQuE | Generative AI & Architecture",
    description: "Premium Portfolio & Insights. Engineering AI products and highly scalable systems.",
    url: "https://lrdene.com",
    siteName: "LOrdEnRYQuE Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/LOGO.png",
        width: 1200,
        height: 630,
        alt: "LOrdEnRYQuE Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOrdEnRYQuE | Generative AI",
    description: "Engineering AI products and highly scalable systems.",
    images: ["/assets/LOGO.png"],
  },
  icons: {
    icon: "/assets/LOGO.png",
  }
};

const globalStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
      url: "https://lrdene.com",
      logo: "https://lrdene.com/assets/LOGO.png",
      sameAs: [
        "https://github.com/LOrdEnRYQuE",
        "https://www.linkedin.com/in/LOrdEnRQuE",
        "https://www.facebook.com/LOrdEnRYQuEit",
        "https://www.tiktok.com/@LOrdEnRYQuE",
      ],
    },
    {
      "@type": "WebSite",
      name: "LOrdEnRYQuE",
      url: "https://lrdene.com",
      inLanguage: "en",
    },
    {
      "@type": "LocalBusiness",
      name: "LOrdEnRYQuE | Advanced Digital Solution",
      url: "https://lrdene.com",
      image: "https://lrdene.com/assets/LOGO.png",
      telephone: "+49 1722620671",
      email: "lordenryque.dev@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nahensteig 188E",
        postalCode: "84028",
        addressLocality: "Landshut",
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
      sameAs: [
        "https://www.linkedin.com/in/LOrdEnRQuE",
        "https://www.facebook.com/LOrdEnRYQuEit",
        "https://www.tiktok.com/@LOrdEnRYQuE",
      ],
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navbarEn, navbarDe, footerEn, footerDe, siteSettings] = await Promise.all([
    getPageContentCached("navbar", "en", true),
    getPageContentCached("navbar", "de", true),
    getPageContentCached("footer", "en", true),
    getPageContentCached("footer", "de", true),
    getSiteSettingsCached(),
  ]);

  const navbarCms = {
    en: (navbarEn?.data ?? null) as unknown,
    de: (navbarDe?.data ?? null) as unknown,
  };
  const footerCms = {
    en: (footerEn?.data ?? null) as unknown,
    de: (footerDe?.data ?? null) as unknown,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <LocaleDocumentSync />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(globalStructuredData) }}
          />
          <DesignTokensRuntime />
          <DeferredEnhancements />
          <Navbar cmsContent={navbarCms} />
          {children}
          <Footer cmsContent={footerCms} siteSettings={siteSettings as unknown} />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
