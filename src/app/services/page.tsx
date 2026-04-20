import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { ServicesPageClient } from "@/components/Services/ServicesPageClient";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { FALLBACK_SERVICES } from "@/lib/servicesFallback";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/services", locale);
  const isDe = locale === "de";
  const title = isDe ? "Webentwicklungsleistungen" : "Web Development Services";
  const description = isDe
    ? "Individuelle Website-Entwicklung, webbasierte Business-Tools und KI-fähige digitale Produkte für Unternehmen, die schneller starten und professioneller auftreten wollen."
    : "Custom website development, web-based business tools, and AI-ready digital products designed to help businesses launch faster and look more professional online.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "AI development services",
      "custom website development",
      "web-based business tools",
      "client portal development",
      "custom web app development",
      "business website developer",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/services"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/homeservices-hero.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/homeservices-hero.jpg"],
    },
  };
}

export default async function ServicesPage() {
  const servicesRaw = await fetchQuery(api.services.list, {});
  const services = servicesRaw.length > 0 ? servicesRaw : FALLBACK_SERVICES;

  return (
    <ServicesPageClient services={services} />
  );
}
