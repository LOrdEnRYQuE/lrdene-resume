import { BlogArchive } from "../../components/Blog/BlogArchive";
import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: "Journal | LOrdEnRYQuE",
    description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
    alternates: {
      canonical: toLocaleCanonical("/blog", locale),
      languages: getLanguageAlternates("/blog"),
    },
  };
}

export default function BlogPage() {
  return (
    <main>
      <BlogArchive />
    </main>
  );
}
