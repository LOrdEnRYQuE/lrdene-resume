import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import DemoDetailClient from "./DemoDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const demo = await fetchQuery(api.demos.getBySlug, { slug });

  if (!demo) {
    return {
      title: "Demo Not Found",
      robots: { index: false, follow: false },
    };
  }

  const locale = await getRequestLocale();
  const basePath = `/demos/${demo.slug}`;
  const canonical = toLocaleCanonical(basePath, locale);
  const shareImage =
    demo.imageUrl || "https://lordenryque.com/assets/LOGO.png";

  return {
    title: `${demo.name} Demo`,
    description: demo.description,
    keywords: [demo.category, ...demo.techStack, "interactive demo", "portfolio showcase"],
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: `${demo.name} Demo | LOrdEnRYQuE`,
      description: demo.description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${demo.name} Demo | LOrdEnRYQuE`,
      description: demo.description,
      images: [shareImage],
    },
  };
}

export default async function DemoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <DemoDetailClient slug={slug} />;
}
