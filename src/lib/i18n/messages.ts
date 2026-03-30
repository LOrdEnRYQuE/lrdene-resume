import type { Locale } from "@/lib/i18n/config";

type LocaleMessages = {
  navbar: {
    ctaText: string;
    links: Record<string, string>;
  };
  footer: {
    brandText: string;
    sectionNavigation: string;
    sectionServices: string;
    sectionSocial: string;
    rightsReserved: string;
    privacyPolicy: string;
    termsOfService: string;
    imprint: string;
    cookiePolicy: string;
    labels: Record<string, string>;
  };
  localeSwitcherLabel: string;
};

export const messages: Record<Locale, LocaleMessages> = {
  en: {
    navbar: {
      ctaText: "Start a Project",
      links: {
        Services: "Services",
        Demos: "Demos",
        Projects: "Projects",
        Partners: "Partners",
        "QR Solutions": "QR Solutions",
        About: "About",
        Blog: "Blog",
        Contact: "Contact",
      },
    },
    footer: {
      brandText: "Engineering the future of AI & Digital Architecture.",
      sectionNavigation: "Navigation",
      sectionServices: "Services",
      sectionSocial: "Social",
      rightsReserved: "All rights reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      imprint: "Imprint",
      cookiePolicy: "Cookie Policy",
      labels: {
        Projects: "Projects",
        Partners: "Partners",
        Journal: "Journal",
        About: "About",
        Contact: "Contact",
        "Web Dev": "Web Dev",
        "AI Tools": "AI Tools",
        Design: "Design",
      },
    },
    localeSwitcherLabel: "Language",
  },
  de: {
    navbar: {
      ctaText: "Projekt Starten",
      links: {
        Services: "Leistungen",
        Demos: "Demos",
        Projects: "Projekte",
        Partners: "Partner",
        "QR Solutions": "QR Lösungen",
        About: "Über Mich",
        Blog: "Blog",
        Contact: "Kontakt",
      },
    },
    footer: {
      brandText: "Engineering der Zukunft von KI und digitaler Architektur.",
      sectionNavigation: "Navigation",
      sectionServices: "Leistungen",
      sectionSocial: "Social",
      rightsReserved: "Alle Rechte vorbehalten.",
      privacyPolicy: "Datenschutz",
      termsOfService: "Nutzungsbedingungen",
      imprint: "Impressum",
      cookiePolicy: "Cookie-Richtlinie",
      labels: {
        Projects: "Projekte",
        Partners: "Partner",
        Journal: "Journal",
        About: "Über Mich",
        Contact: "Kontakt",
        "Web Dev": "Webentwicklung",
        "AI Tools": "KI Tools",
        Design: "Design",
      },
    },
    localeSwitcherLabel: "Sprache",
  },
};
