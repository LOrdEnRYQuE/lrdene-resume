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

  return {
    title: "Journal | LOrdEnRYQuE",
    description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
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
      title: "Journal | LOrdEnRYQuE",
      description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
      url: `https://lordenryque.com${canonical}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Journal | LOrdEnRYQuE",
      description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
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
