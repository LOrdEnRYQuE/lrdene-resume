import { BlogPost } from "../../../components/Blog/BlogPost";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";

export const runtime = "edge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) {
    return {
      title: "Post Not Found",
      robots: { index: false, follow: false },
    };
  }

  const basePath = `/blog/${post.slug}`;
  const locale = await getRequestLocale();
  const canonical = toLocaleCanonical(basePath, locale);

  return {
    title: `${post.title} | LOrdEnRYQuE`,
    description: post.excerpt,
    keywords: [post.category, ...(post.tags ?? [])],
    alternates: {
      canonical,
      languages: getLanguageAlternates(basePath),
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://lordenryque.com${canonical}`,
      images: [post.coverImage],
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      tags: post.tags ?? [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: post.author,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) notFound();

  const [allPosts, allProjects, allServices] = await Promise.all([
    fetchQuery(api.posts.list, { onlyPublished: true }),
    fetchQuery(api.projects.list, { category: undefined }),
    fetchQuery(api.services.list, {}),
  ]);

  const postTokens = [post.category, ...(post.tags ?? [])].map((token) => token.toLowerCase());
  const relatedPosts = allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .filter((candidate) => {
      const candidateTokens = [candidate.category, ...(candidate.tags ?? [])].map((token) => token.toLowerCase());
      return candidateTokens.some((token) => postTokens.includes(token));
    })
    .slice(0, 3);

  const relatedProjects = allProjects
    .filter((project) => postTokens.some((token) => project.category.toLowerCase().includes(token)))
    .slice(0, 3);
  const relatedServices = allServices
    .filter((service) => postTokens.some((token) => service.category.toLowerCase().includes(token)))
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
    },
    datePublished: new Date(post.date).toISOString(),
    mainEntityOfPage: `https://lordenryque.com/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://lordenryque.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://lordenryque.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://lordenryque.com/blog/${post.slug}` },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPost
        post={post}
        relatedPosts={relatedPosts}
        relatedProjects={relatedProjects}
        relatedServices={relatedServices}
      />
    </main>
  );
}
