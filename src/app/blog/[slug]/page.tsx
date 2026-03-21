import { BlogPost } from "../../../components/Blog/BlogPost";
import { Footer } from "../../../components/Footer/Footer";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export const runtime = "edge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) return {};

  return {
    title: `${post.title} | LOrdEnRYQuE`,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchQuery(api.posts.getBySlug, { slug });
  if (!post) notFound();

  return (
    <main>
      <BlogPost post={post} />
      <Footer />
    </main>
  );
}
