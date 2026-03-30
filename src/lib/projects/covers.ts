const BROKEN_PROJECT_COVERS = new Set([
  "/assets/cybershield.jpg",
  "/assets/luxestay.jpg",
  "/assets/ecostream.jpg",
]);

const PROJECT_SLUG_FALLBACKS: Record<string, string> = {
  "cybershield-identity": "/assets/ai-seo-hero.png",
  "luxestay-booking": "/assets/realestate-hero.jpg",
  "ecostream-dashboard": "/assets/ai-dashboard-hero.png",
};

export function getProjectCoverFallback(slug?: string) {
  if (!slug) return "/assets/realestate-hero.jpg";
  return PROJECT_SLUG_FALLBACKS[slug] ?? "/assets/realestate-hero.jpg";
}

export function resolveProjectCover(slug?: string, coverImage?: string) {
  if (!coverImage) {
    return getProjectCoverFallback(slug);
  }

  if (BROKEN_PROJECT_COVERS.has(coverImage)) {
    return getProjectCoverFallback(slug);
  }

  return coverImage;
}
