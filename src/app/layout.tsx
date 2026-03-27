import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import DesignTokensRuntime from "@/components/DesignTokensRuntime";
import LocaleDocumentSync from "@/components/I18n/LocaleDocumentSync";
import DeferredEnhancements from "@/components/Runtime/DeferredEnhancements";
import CookieConsent from "@/components/Cookies/CookieConsent";
import { getPageContentCached, getSiteSettingsCached } from "@/lib/server/cachedQueries";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";

export const metadata: Metadata = {
  metadataBase: new URL("https://lordenryque.com"),
  title: {
    template: "%s | LOrdEnRYQuE",
    default: "LOrdEnRYQuE | Generative AI & Architecture",
  },
  description: "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
  keywords: ["AI Engineer", "Software Architect", "Next.js Developer", "React", "TypeScript", "Startups"],
  authors: [{ name: "Attila Lazar", url: "https://lordenryque.com" }],
  creator: "Attila Lazar",
  openGraph: {
    title: "LOrdEnRYQuE | Generative AI & Architecture",
    description: "Premium Portfolio & Insights. Engineering AI products and highly scalable systems.",
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
      name: BUSINESS_PROFILE.name,
      url: "https://lordenryque.com",
      logo: "https://lordenryque.com/assets/LOGO.png",
      description: BUSINESS_PROFILE.description,
      slogan: BUSINESS_PROFILE.brandLine,
      knowsAbout: BUSINESS_PROFILE.services,
      sameAs: [
        "https://github.com/LOrdEnRYQuE",
        "https://www.linkedin.com/in/LOrdEnRQuE",
        "https://www.facebook.com/LOrdEnRYQuEit",
        "https://www.tiktok.com/@LOrdEnRYQuE",
      ],
    },
    {
      "@type": "WebSite",
      name: BUSINESS_PROFILE.name,
      url: "https://lordenryque.com",
      inLanguage: "en",
    },
    {
      "@type": "LocalBusiness",
      name: `${BUSINESS_PROFILE.name} | ${BUSINESS_PROFILE.brandLine}`,
      url: "https://lordenryque.com",
      image: "https://lordenryque.com/assets/LOGO.png",
      description: BUSINESS_PROFILE.description,
      telephone: "+49 1722620671",
      email: "lordenryque.dev@gmail.com",
      areaServed: [
        { "@type": "Country", name: "Germany" },
        { "@type": "Place", name: "Remote (online)" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: BUSINESS_PROFILE.hours.days,
          opens: BUSINESS_PROFILE.hours.opens,
          closes: BUSINESS_PROFILE.hours.closes,
        },
      ],
      serviceType: BUSINESS_PROFILE.services,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Core Services",
        itemListElement: BUSINESS_PROFILE.services.map((service, index) => ({
          "@type": "Offer",
          position: index + 1,
          itemOffered: {
            "@type": "Service",
            name: service,
          },
        })),
      },
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
    {
      "@type": "FAQPage",
      mainEntity: BUSINESS_PROFILE.faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: entry.a,
        },
      })),
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
          <CookieConsent />
          <DeferredEnhancements />
          <Navbar cmsContent={navbarCms} />
          {children}
          <Footer cmsContent={footerCms} siteSettings={siteSettings as unknown} />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
