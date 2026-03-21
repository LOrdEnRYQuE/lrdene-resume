import { BlogPost } from "../../../components/Blog/BlogPost";
import { Footer } from "../../../components/Footer/Footer";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await fetchQuery(api.posts.getBySlug, { slug: params.slug });
  if (!post) return {};

  return {
    title: `${post.title} | LOrdEnRYQuE`,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await fetchQuery(api.posts.getBySlug, { slug: params.slug });
  if (!post) notFound();

  return (
    <main>
      <BlogPost post={post} />
      <Footer />
    </main>
  );
}
