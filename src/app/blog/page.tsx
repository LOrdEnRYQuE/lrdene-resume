import { BlogArchive } from "../../components/Blog/BlogArchive";
import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";

export const metadata: Metadata = {
  title: "Journal | LOrdEnRYQuE",
  description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
  alternates: {
    canonical: "/blog",
    languages: getLanguageAlternates("/blog"),
  },
};

export default function BlogPage() {
  return (
    <main>
      <BlogArchive />
    </main>
  );
}
