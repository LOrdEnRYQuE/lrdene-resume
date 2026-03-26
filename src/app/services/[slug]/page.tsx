import type { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { ServiceDetail } from "@/components/Services/ServiceDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { resolveServiceLocationSlug } from "@/utils/serviceLocations";
import { getLanguageAlternates } from "@/lib/seo/alternates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const runtime = "edge";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let service = await fetchQuery(api.services.getBySlug, { slug });
  const locationResolution = !service ? resolveServiceLocationSlug(slug) : null;

  if (!service && locationResolution) {
    service = await fetchQuery(api.services.getBySlug, { slug: locationResolution.serviceSlug });
  }

  if (!service) {
    return {
      title: "Service Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = locationResolution
    ? `${service.title} in ${locationResolution.location.city}`
    : `${service.title} Services`;
  const description = locationResolution
    ? `${service.description} Delivery for ${locationResolution.location.city}, ${locationResolution.location.country}.`
    : service.description;
  const canonical = locationResolution
    ? `/services/${service.slug}-${locationResolution.location.slug}`
    : `/services/${service.slug}`;

  return {
    title,
    description,
    keywords: [service.category, service.title, "service", "digital solutions"],
    alternates: {
      canonical,
      languages: getLanguageAlternates(canonical),
    },
    openGraph: {
      title: `${service.title} | LOrdEnRYQuE`,
      description,
      url: `https://lrdene.com${canonical}`,
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
  const { slug } = await params;
  let service = await fetchQuery(api.services.getBySlug, { slug });
  const locationResolution = !service ? resolveServiceLocationSlug(slug) : null;

  if (!service && locationResolution) {
    service = await fetchQuery(api.services.getBySlug, { slug: locationResolution.serviceSlug });
  }

  if (!service) {
    notFound();
  }

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
        item: "https://lrdene.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://lrdene.com/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: locationResolution ? `${service.title} in ${locationResolution.location.city}` : service.title,
        item: `https://lrdene.com${canonicalPath}`,
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
      url: "https://lrdene.com",
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
    url: `https://lrdene.com${canonicalPath}`,
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
                href="/contact"
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
              href={`/blog/${post.slug}`}
              data-track-event="internal_link_click"
              data-track-label={`Service->Blog: ${post.title}`}
            >
              {post.title}
            </Link>
          ))}
          {relatedProjects.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug}`}
              data-track-event="internal_link_click"
              data-track-label={`Service->Project: ${project.title}`}
            >
              {project.title}
            </Link>
          ))}
          {relatedPosts.length === 0 && relatedProjects.length === 0 ? (
            <Link href="/blog">Read the latest implementation insights</Link>
          ) : null}
        </div>
      </section>
    </>
  );
}
