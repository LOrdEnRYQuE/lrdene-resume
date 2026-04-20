const STRONG_BLOG_SLUGS = new Set([
  "how-i-build-premium-sites",
  "web-dev-vs-graphic-design",
  "ai-workflows-that-move-revenue",
  "a-guide-to-custom-web-design-for-modern-businesses",
  "template-vs-custom-website-which-is-right-for-you",
  "the-web-design-process-from-concept-to-launch",
]);

const NOINDEX_SERVICE_SLUGS = new Set(["ui-ux-design"]);

export function shouldIndexBlogPost(slug: string) {
  return STRONG_BLOG_SLUGS.has(slug);
}

export function shouldIndexServicePage({
  slug,
  hasLocationVariant,
}: {
  slug: string;
  hasLocationVariant: boolean;
}) {
  if (hasLocationVariant) return false;
  return !NOINDEX_SERVICE_SLUGS.has(slug);
}

export function getStrongBlogSlugs() {
  return STRONG_BLOG_SLUGS;
}
