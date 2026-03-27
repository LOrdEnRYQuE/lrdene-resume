export type ServiceLocation = {
  slug: string;
  city: string;
  region: string;
  country: string;
  proofPoint: string;
};

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    slug: "landshut",
    city: "Landshut",
    region: "Bavaria",
    country: "Germany",
    proofPoint: "Local-first delivery with fast communication loops, practical scope control, and measurable lead growth.",
  },
  {
    slug: "berlin",
    city: "Berlin",
    region: "Berlin",
    country: "Germany",
    proofPoint: "Fast-moving startup and SMB delivery with bilingual collaboration and tight sprint cycles.",
  },
  {
    slug: "munich",
    city: "Munich",
    region: "Bavaria",
    country: "Germany",
    proofPoint: "Enterprise-grade architecture and analytics workflows for regulated and high-precision teams.",
  },
  {
    slug: "zurich",
    city: "Zurich",
    region: "Zurich",
    country: "Switzerland",
    proofPoint: "Premium product quality, reliability, and performance standards for international clients.",
  },
];

export function getServiceLocationBySlug(slug: string): ServiceLocation | null {
  return SERVICE_LOCATIONS.find((location) => location.slug === slug) ?? null;
}

export function resolveServiceLocationSlug(fullSlug: string): { serviceSlug: string; location: ServiceLocation } | null {
  const matchingLocation = SERVICE_LOCATIONS.find((location) => fullSlug.endsWith(`-${location.slug}`));
  if (!matchingLocation) {
    return null;
  }

  const serviceSlug = fullSlug.slice(0, -(`-${matchingLocation.slug}`.length));
  if (!serviceSlug) {
    return null;
  }

  return { serviceSlug, location: matchingLocation };
}

const SERVICE_SLUG_ALIASES: Record<string, string[]> = {
  "web-development": ["web-development", "web-dev", "web-design", "web-development-services"],
  "web-dev": ["web-dev", "web-development", "web-design", "web-development-services"],
  "ai-automation": ["ai-automation", "ai-integration", "ai-tools", "ai-tooling"],
  "ai-integration": ["ai-integration", "ai-automation", "ai-tools", "ai-tooling"],
  "ai-tools": ["ai-tools", "ai-integration", "ai-automation", "ai-tooling"],
  "ai-tooling": ["ai-tooling", "ai-integration", "ai-automation", "ai-tools"],
  "ui-ux-design": ["ui-ux-design", "design", "ui-design", "ux-design"],
  "design": ["design", "ui-ux-design", "ui-design", "ux-design"],
  "e-commerce-development": ["e-commerce-development", "ecommerce-development", "e-commerce", "ecommerce"],
};

export function getServiceSlugCandidates(serviceSlug: string): string[] {
  const normalized = serviceSlug.trim().toLowerCase();
  const aliases = SERVICE_SLUG_ALIASES[normalized] ?? [];
  const candidates = [normalized, ...aliases];
  return Array.from(new Set(candidates));
}
