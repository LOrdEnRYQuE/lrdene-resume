import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import DesignTokensRuntime from "@/components/DesignTokensRuntime";
import LocaleDocumentSync from "@/components/I18n/LocaleDocumentSync";
import DeferredEnhancements from "@/components/Runtime/DeferredEnhancements";
import AnalyticsTracker from "@/components/Analytics/AnalyticsTracker";
import CookieConsent from "@/components/Cookies/CookieConsent";
import { getPageContentCached, getSiteSettingsCached } from "@/lib/server/cachedQueries";
import { BUSINESS_PROFILE } from "@/lib/businessProfile";
import { SERVICE_LOCATIONS } from "@/utils/serviceLocations";
import { getRequestLocale } from "@/lib/seo/localeCanonical";

const DEFAULT_GA_ID = "G-R3P3P44GWT";
const ICON_VERSION = "20260327";
const GOOGLE_SITE_VERIFICATION =
  process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;

export const runtime = "edge";

function isValidGaId(value?: string | null) {
  if (!value) return false;
  return /^G-[A-Z0-9]{6,}$/.test(value.trim().toUpperCase());
}

export const metadata: Metadata = {
  metadataBase: new URL("https://lordenryque.com"),
  applicationName: "LOrdEnRYQuE",
  title: {
    template: "%s | LOrdEnRYQuE",
    default: "LOrdEnRYQuE | Advanced Digital Solution",
  },
  description: "Senior Full-Stack Engineer specializing in AI workflows, Next.js architecture, and high-performance systems.",
  keywords: ["AI Engineer", "Software Architect", "Next.js Developer", "React", "TypeScript", "Startups"],
  authors: [{ name: "Attila Lazar", url: "https://lordenryque.com" }],
  creator: "Attila Lazar",
  openGraph: {
    title: "LOrdEnRYQuE | Advanced Digital Solution",
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
    title: "LOrdEnRYQuE | Advanced Digital Solution",
    description: "Engineering AI products and highly scalable systems.",
    images: ["/assets/LOGO.png"],
  },
  icons: {
    icon: [
      { url: `/favicon.ico?v=${ICON_VERSION}`, sizes: "any" },
      { url: `/icon.png?v=${ICON_VERSION}`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `/favicon.ico?v=${ICON_VERSION}`,
    apple: `/apple-touch-icon.png?v=${ICON_VERSION}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "geo.region": "DE-BY",
    "geo.placename": "Landshut",
    "geo.position": "48.5442;12.1469",
    ICBM: "48.5442, 12.1469",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
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
  const settings = siteSettings as
    | {
        gaId?: string;
        socialLinks?: {
          github?: string;
          twitter?: string;
          linkedin?: string;
          instagram?: string;
          youtube?: string;
        };
      }
    | null;
  const settingsGaId = settings?.gaId?.trim();
  const envGaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  const gaId = isValidGaId(settingsGaId)
    ? settingsGaId!.toUpperCase()
    : isValidGaId(envGaId)
      ? envGaId!.toUpperCase()
      : DEFAULT_GA_ID;
  const sameAsLinks = Array.from(
    new Set(
      [
        settings?.socialLinks?.github,
        settings?.socialLinks?.twitter,
        settings?.socialLinks?.linkedin,
        settings?.socialLinks?.instagram,
        settings?.socialLinks?.youtube,
        "https://www.facebook.com/LOrdEnRYQuEit",
        "https://www.tiktok.com/@LOrdEnRYQuE",
      ].filter((value): value is string => Boolean(value && value.trim())),
    ),
  );
  const areaServed = [
    { "@type": "Country", name: "Germany" },
    { "@type": "Country", name: "Switzerland" },
    ...SERVICE_LOCATIONS.map((location) => ({
      "@type": "City",
      name: location.city,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.region,
      },
    })),
    { "@type": "Place", name: "Remote (online)" },
  ];
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
        sameAs: sameAsLinks,
      },
      {
        "@type": "WebSite",
        name: BUSINESS_PROFILE.name,
        url: "https://lordenryque.com",
        inLanguage: ["en", "de"],
        potentialAction: {
          "@type": "SearchAction",
          target: "https://lordenryque.com/blog?query={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "LocalBusiness",
        name: `${BUSINESS_PROFILE.name} | ${BUSINESS_PROFILE.brandLine}`,
        url: "https://lordenryque.com",
        image: "https://lordenryque.com/assets/LOGO.png",
        description: BUSINESS_PROFILE.description,
        telephone: "+49 1722620671",
        email: "lordenryque.dev@gmail.com",
        areaServed,
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
        sameAs: sameAsLinks,
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <ConvexClientProvider>
          <LocaleDocumentSync />
          <AnalyticsTracker />
          {gaId ? (
            <>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.__LRDENE_GA_ID=${JSON.stringify(gaId)};`,
                }}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "gtm.init_consent",
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', ${JSON.stringify(gaId)}, {
  send_page_view: false,
  anonymize_ip: true,
  allow_google_signals: false
});
                  `,
                }}
              />
              <Script
                id="lrdene-ga4-loader"
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
                strategy="afterInteractive"
              />
            </>
          ) : null}
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
