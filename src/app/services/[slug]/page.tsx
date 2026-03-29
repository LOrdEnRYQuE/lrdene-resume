import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ServiceDetail } from "@/components/Services/ServiceDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceSlugCandidates, resolveServiceLocationSlug } from "@/utils/serviceLocations";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getRequestLocale, toLocaleCanonical } from "@/lib/seo/localeCanonical";
import { TOPIC_CLUSTERS } from "@/lib/seo/topicClusters";
import { findFallbackServiceBySlug } from "@/lib/servicesFallback";
import { localizeHref } from "@/lib/i18n/path";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const runtime = "edge";

async function getServiceBySlugCandidates(initialSlug: string) {
  const candidates = getServiceSlugCandidates(initialSlug);

  for (const candidate of candidates) {
    const service = await fetchQuery(api.services.getBySlug, { slug: candidate });
    if (service) {
      return service;
    }
  }

  for (const candidate of candidates) {
    const fallback = findFallbackServiceBySlug(candidate);
    if (fallback) {
      return fallback;
    }
  }

  return null;
}

function normalizeSlugParam(value: string) {
  return decodeURIComponent(value.split("?")[0] || value).trim().toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlugParam(rawSlug);
  let service = await getServiceBySlugCandidates(slug);
  const locationResolution = !service ? resolveServiceLocationSlug(slug) : null;

  if (!service && locationResolution) {
    service = await getServiceBySlugCandidates(locationResolution.serviceSlug);
  }

  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = locationResolution
    ? `${service.title} in ${locationResolution.location.city} | Strategy & Delivery`
    : `${service.title} Services | Strategy & Delivery`;
  const description = locationResolution
    ? `${service.description} Delivery for ${locationResolution.location.city}, ${locationResolution.location.country}.`
    : service.description;
  const locale = await getRequestLocale();
  const canonical = locationResolution
    ? `/services/${service.slug}-${locationResolution.location.slug}`
    : `/services/${service.slug}`;
  const localeCanonical = toLocaleCanonical(canonical, locale);

  const keywordSet = [
    service.category,
    service.title,
    `${service.title} service`,
    `${service.category} consulting`,
    "digital solutions",
    "business growth",
    locationResolution ? `${service.title} ${locationResolution.location.city}` : null,
    locationResolution ? `${service.category} ${locationResolution.location.country}` : null,
  ].filter((value): value is string => Boolean(value));

  return {
    title,
    description,
    keywords: keywordSet,
    alternates: {
      canonical: localeCanonical,
      languages: getLanguageAlternates(canonical),
    },
    openGraph: {
      title: `${service.title} | LOrdEnRYQuE`,
      description,
      url: `https://lordenryque.com${localeCanonical}`,
      type: "article",
      tags: [service.category, service.title],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | LOrdEnRYQuE`,
      description,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = normalizeSlugParam(rawSlug);
  let service = await getServiceBySlugCandidates(slug);
  const locationResolution = !service ? resolveServiceLocationSlug(slug) : null;

  if (!service && locationResolution) {
    service = await getServiceBySlugCandidates(locationResolution.serviceSlug);
  }

  if (!service) {
    notFound();
  }
  const locale = await getRequestLocale();

  const [posts, projects, serviceSections] = await Promise.all([
    fetchQuery(api.posts.list, { onlyPublished: true }),
    fetchQuery(api.projects.list, { category: undefined }),
    fetchQuery(api.pages.getPageSections, { page: "services" }),
  ]);

  const relatedPosts = posts
    .filter((post) => post.category.toLowerCase() === service.category.toLowerCase())
    .slice(0, 3);
  const relatedProjects = projects
    .filter((project) => project.category.toLowerCase() === service.category.toLowerCase())
    .slice(0, 3);
  const serviceTokens = [service.slug, service.title, service.category]
    .join(" ")
    .toLowerCase();
  const tokenMatchers = [
    "web",
    "develop",
    "ai",
    "automat",
    "ecom",
    "commerce",
    "seo",
    "analytics",
  ].filter((token) => serviceTokens.includes(token));
  const topicMatcherRegex =
    tokenMatchers.length > 0 ? new RegExp(tokenMatchers.join("|"), "i") : null;

  const relatedTopicLinks = TOPIC_CLUSTERS.flatMap((cluster) =>
    cluster.topics
      .filter((topic) =>
        topicMatcherRegex
          ? Boolean(
        [cluster.slug, topic.slug, topic.title, ...(topic.intentKeywords ?? [])]
          .join(" ")
          .toLowerCase()
          .match(topicMatcherRegex),
            )
          : false,
      )
      .slice(0, 2)
      .map((topic) => ({
        href: `/insights/${cluster.slug}/${topic.slug}`,
        label: topic.title,
      })),
  ).slice(0, 4);

  const canonicalPath = locationResolution
    ? `/services/${service.slug}-${locationResolution.location.slug}`
    : `/services/${service.slug}`;

  const locationSection = locationResolution
    ? serviceSections.find(
        (section) => section.sectionKey === `location-${service.slug}-${locationResolution.location.slug}`,
      )
    : null;
  const locationData = (locationSection?.data ?? {}) as {
    headline?: string;
    intro?: string;
    proofPoint?: string;
    testimonial?: string;
    faqQuestion?: string;
    faqAnswer?: string;
    ctaText?: string;
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://lordenryque.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://lordenryque.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: locationResolution ? `${service.title} in ${locationResolution.location.city}` : service.title,
        item: `https://lordenryque.com${canonicalPath}`,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: locationResolution ? `${service.title} in ${locationResolution.location.city}` : service.title,
    description: locationData.intro || service.description,
    provider: {
      "@type": "Organization",
      name: "LOrdEnRYQuE",
      url: "https://lordenryque.com",
    },
    areaServed: locationResolution
      ? {
          "@type": "City",
          name: locationResolution.location.city,
        }
      : {
          "@type": "Country",
          name: "Germany",
        },
    url: `https://lordenryque.com${canonicalPath}`,
  };

  const faqItems = locationData.faqQuestion && locationData.faqAnswer
    ? [
        {
          q: locationData.faqQuestion,
          a: locationData.faqAnswer,
        },
      ]
    : [];

  const faqJsonLd = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <ServiceDetail
        title={
          locationResolution
            ? locationData.headline || `${service.title} in ${locationResolution.location.city}`
            : service.title
        }
        description={
          locationResolution
            ? `${locationData.intro || service.description} ${locationData.proofPoint || locationResolution.location.proofPoint}`
            : service.description
        }
        features={service.features}
        process={service.process}
        iconName={service.iconName}
      />
      <section className="container" style={{ marginTop: "3rem", marginBottom: "5rem" }}>
        {locationResolution ? (
          <div
            style={{
              border: "1px solid var(--glass-border)",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.2rem",
            }}
          >
            <p style={{ marginBottom: "0.45rem" }}>
              <strong>Client Proof:</strong>{" "}
              {locationData.testimonial ||
                "Delivery quality and communication standards built long-term confidence and faster launches."}
            </p>
            {faqItems.length > 0 ? (
              <p>
                <strong>{faqItems[0].q}</strong> {faqItems[0].a}
              </p>
            ) : null}
            <div style={{ marginTop: "0.9rem" }}>
              <Link
                href={localizeHref("/contact", locale)}
                data-track-event="click_cta"
                data-track-label={`Service location CTA: ${service.title} ${locationResolution.location.city}`}
              >
                {locationData.ctaText || "Book a discovery call"}
              </Link>
            </div>
          </div>
        ) : null}
        <h2 style={{ marginBottom: "1rem" }}>Related Insights</h2>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {relatedPosts.map((post) => (
            <Link
              key={post._id}
              href={localizeHref(`/blog/${post.slug}`, locale)}
              data-track-event="internal_link_click"
              data-track-label={`Service->Blog: ${post.title}`}
            >
              {post.title}
            </Link>
          ))}
          {relatedProjects.map((project) => (
            <Link
              key={project._id}
              href={localizeHref(`/projects/${project.slug}`, locale)}
              data-track-event="internal_link_click"
              data-track-label={`Service->Project: ${project.title}`}
            >
              {project.title}
            </Link>
          ))}
          {relatedPosts.length === 0 && relatedProjects.length === 0 ? (
            <Link href={localizeHref("/blog", locale)}>Read the latest implementation insights</Link>
          ) : null}
          {relatedTopicLinks.map((topic) => (
            <Link
              key={topic.href}
              href={localizeHref(topic.href, locale)}
              data-track-event="internal_link_click"
              data-track-label={`Service->Insights: ${service.title} ${topic.label}`}
            >
              {topic.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
