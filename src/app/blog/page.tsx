import { BlogArchive } from "../../components/Blog/BlogArchive";
import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { FALLBACK_POSTS } from "@/lib/postsFallback";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical("/blog", locale);
  const isDe = locale === "de";
  const title = isDe ? "KI-, Web- & Growth-Insights Blog" : "AI, Web & Growth Insights Blog";
  const description = isDe
    ? "Praxisnahe Insights zu KI-Systemen, Next.js-Architektur, SEO/GEO-Strategie und Produktwachstum."
    : "Actionable insights on AI systems, Next.js architecture, SEO/GEO strategy, and product growth execution.";
  const socialTitle = `${title} | LOrdEnRYQuE`;

  return {
    title,
    description,
    keywords: [
      "AI insights blog",
      "Next.js architecture articles",
      "digital product strategy",
      "software engineering journal",
      "SEO and GEO strategy",
    ],
    alternates: {
      canonical,
      languages: getLanguageAlternates("/blog"),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: `https://lordenryque.com${canonical}`,
      type: "website",
      siteName: "LOrdEnRYQuE",
      images: ["/assets/ai-seo-hero.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: ["/assets/ai-seo-hero.png"],
    },
  };
}

export default async function BlogPage() {
  let posts: Array<{
    _id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    coverImage: string;
    readTime: string;
    date: number;
  }> = [];

  try {
    posts = (await fetchQuery(api.posts.list, { onlyPublished: true })) as typeof posts;
  } catch {
    posts = [];
  }

  const initialPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  return (
    <main>
      <BlogArchive initialPosts={initialPosts} />
    </main>
  );
}
