export type ServiceLocation = {
  slug: string;
  city: string;
  region: string;
  country: string;
  proofPoint: string;
};

export const SERVICE_LOCATIONS: ServiceLocation[] = [
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
