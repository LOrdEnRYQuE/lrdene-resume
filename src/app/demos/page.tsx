import Link from "next/link";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { ExternalLink, ArrowRight, Code2 } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import styles from "./Demos.module.css";

export const runtime = "edge";

const FALLBACK_DEMOS = [
  {
    _id: "fallback-restaurant",
    name: "LaMaison Fine Dining",
    slug: "restaurant",
    url: "/demos/restaurant",
    imageUrl: "/assets/restaurant-hero.jpg",
    featured: true,
    category: "Hospitality",
    description: "Modern booking + menu + admin flow. A complete hospitality ecosystem.",
    techStack: ["React", "CSS Modules", "Framer Motion"],
  },
  {
    _id: "fallback-salon",
    name: "TheGuild Grooming",
    slug: "salon",
    url: "/demos/salon",
    imageUrl: "/assets/salon-hero.jpg",
    featured: true,
    category: "Beauty & Wellness",
    description: "Appointment scheduling and service showcase for premium salons.",
    techStack: ["React", "CSS Modules", "Lucide"],
  },
  {
    _id: "fallback-real-estate",
    name: "Luxe Estate",
    slug: "real-estate",
    url: "/demos/real-estate",
    imageUrl: "/assets/realestate-hero.jpg",
    featured: true,
    category: "Real Estate",
    description: "Premium property listings and agent dashboards with advanced filters.",
    techStack: ["React", "Next.js", "CSS Modules"],
  },
  {
    _id: "fallback-lawyer",
    name: "LegalTrust Case Portal",
    slug: "lawyer",
    url: "/demos/lawyer",
    imageUrl: "/assets/lawyer-hero.jpg",
    featured: true,
    category: "Legal & Consulting",
    description: "Secure case management and client portals for law firms.",
    techStack: ["React", "Convex", "Framer Motion"],
  },
  {
    _id: "fallback-home-services",
    name: "ServicePro Tracker",
    slug: "home-services",
    url: "/demos/home-services",
    imageUrl: "/assets/homeservices-hero.jpg",
    featured: true,
    category: "Home Services",
    description: "Job tracking and invoice management for modern contractors.",
    techStack: ["React", "CSS Modules", "Lucide React"],
  },
  {
    _id: "fallback-ecommerce",
    name: "Vogue Retail",
    slug: "ecommerce",
    url: "/demos/ecommerce",
    imageUrl: "/assets/ecommerce-hero.jpg",
    featured: true,
    category: "E-commerce",
    description: "High-conversion product stores with integrated inventory tools.",
    techStack: ["React", "Framer Motion", "Stripe"],
  },
  {
    _id: "fallback-ai-dashboard",
    name: "NeuralNexus Admin",
    slug: "ai-dashboard",
    url: "/demos/ai-dashboard",
    imageUrl: "/assets/ai-dashboard-hero.png",
    featured: true,
    category: "AI & Analytics",
    description: "High-intelligence SaaS dashboard for monitoring AI workloads.",
    techStack: ["React", "Lucide", "CSS Modules"],
  },
  {
    _id: "fallback-ai-agents",
    name: "AI Agents & AI Bots",
    slug: "ai-agents",
    url: "/demos/ai-agents",
    imageUrl: "/assets/ai-agents-hero.png",
    featured: true,
    category: "AI & Neural Agencies",
    description: "Autonomous intelligence for customer support, data analysis, and workflow automation.",
    techStack: ["React", "Convex", "AI"],
  },
  {
    _id: "fallback-logistics",
    name: "RouteFlow Logistics",
    slug: "logistics",
    url: "/demos/logistics",
    imageUrl: "/assets/ai-dashboard-hero.png",
    featured: true,
    category: "Logistics",
    description: "Dispatch operations with route tracking, status workflows, and delivery visibility.",
    techStack: ["React", "Next.js", "Operations"],
  },
  {
    _id: "fallback-saas-landing",
    name: "SaaS Conversion System",
    slug: "saas-landing",
    url: "/demos/saas-landing",
    imageUrl: "/assets/ai-agents-hero.png",
    featured: true,
    category: "SaaS",
    description: "High-converting SaaS landing architecture with feature storytelling and lead capture.",
    techStack: ["React", "Framer Motion", "Copy Systems"],
  },
  {
    _id: "fallback-car-dealer",
    name: "Premium Auto Gallery",
    slug: "car-dealer",
    url: "/demos/car-dealer",
    imageUrl: "/assets/realestate-hero.jpg",
    featured: true,
    category: "Automotive",
    description: "Inventory-first dealership experience with modern detail pages and inquiry flow.",
    techStack: ["React", "Next.js", "Catalog UX"],
  },
  {
    _id: "fallback-car-detailing",
    name: "Elite Shine Detailing",
    slug: "car-detailing",
    url: "/demos/car-detailing",
    imageUrl: "/assets/salon-hero.jpg",
    featured: true,
    category: "Automotive Services",
    description: "Package booking and premium detailing presentation for local service growth.",
    techStack: ["React", "CSS Modules", "Booking UX"],
  },
  {
    _id: "fallback-broker",
    name: "Horizon Finance Broker",
    slug: "broker",
    url: "/demos/broker",
    imageUrl: "/assets/lawyer-hero.jpg",
    featured: true,
    category: "Finance",
    description: "Lead qualification and consultation funnels for brokers and advisors.",
    techStack: ["React", "Convex", "Forms"],
  },
  {
    _id: "fallback-architecture",
    name: "Studio Architecture",
    slug: "architecture",
    url: "/demos/architecture",
    imageUrl: "/assets/realestate-hero.jpg",
    featured: true,
    category: "Architecture",
    description: "Portfolio-led architecture site with project storytelling and inquiry conversion.",
    techStack: ["React", "Next.js", "Portfolio UX"],
  },
  {
    _id: "fallback-construction",
    name: "BuildTrack Construction",
    slug: "construction",
    url: "/demos/construction",
    imageUrl: "/assets/homeservices-hero.jpg",
    featured: true,
    category: "Construction",
    description: "Job-site visibility, quote intake, and operations dashboard for construction teams.",
    techStack: ["React", "Convex", "Dashboard"],
  },
  {
    _id: "fallback-green-eco",
    name: "EcoMarket",
    slug: "green-eco",
    url: "/demos/green-eco",
    imageUrl: "/assets/ecommerce-hero.jpg",
    featured: true,
    category: "Sustainability",
    description: "Green-first commerce MVP with sustainable product positioning and education.",
    techStack: ["React", "Ecommerce", "Brand UX"],
  },
  {
    _id: "fallback-ai-marketplace",
    name: "AgentHire Protocol",
    slug: "ai-marketplace",
    url: "/demos/ai-marketplace",
    imageUrl: "/assets/ai-agents-hero.png",
    featured: true,
    category: "AI Marketplace",
    description: "Marketplace framework for discovering, hiring, and orchestrating AI agents.",
    techStack: ["React", "AI", "Marketplace"],
  },
  {
    _id: "fallback-mental-health",
    name: "MindCare Cognitive Health",
    slug: "mental-health",
    url: "/demos/mental-health",
    imageUrl: "/assets/ai-dashboard-hero.png",
    featured: true,
    category: "HealthTech",
    description: "Patient-centered experience with journaling, insights, and therapy workflows.",
    techStack: ["React", "Healthcare UX", "Analytics"],
  },
  {
    _id: "fallback-car-selling",
    name: "AutoTrader AI Platform",
    slug: "car-selling",
    url: "/demos/car-selling",
    imageUrl: "/assets/realestate-hero.jpg",
    featured: true,
    category: "Automotive Sales",
    description: "Vehicle listing and AI-assisted selling workflows for private sellers and dealers.",
    techStack: ["React", "AI", "Marketplace"],
  },
  {
    _id: "fallback-ai-seo",
    name: "AI SEO Engine",
    slug: "ai-seo",
    url: "/demos/ai-seo",
    imageUrl: "/assets/ai-dashboard-hero.png",
    featured: true,
    category: "Marketing Tech",
    description: "SEO automation cockpit with content intelligence and ranking opportunity insights.",
    techStack: ["React", "SEO", "AI"],
  },
  {
    _id: "fallback-healthcare",
    name: "CareFlow Healthcare",
    slug: "healthcare",
    url: "/demos/healthcare",
    imageUrl: "/assets/ai-dashboard-hero.png",
    featured: true,
    category: "Healthcare",
    description: "Patient appointment and care-coordination journey designed for clinical teams.",
    techStack: ["React", "HealthTech", "Workflows"],
  },
  {
    _id: "fallback-course-platform",
    name: "Creator Course Platform",
    slug: "course-platform",
    url: "/demos/course-platform",
    imageUrl: "/assets/ai-agents-hero.png",
    featured: true,
    category: "EdTech",
    description: "Online course delivery MVP with lesson progression and creator monetization flow.",
    techStack: ["React", "EdTech", "SaaS"],
  },
  {
    _id: "fallback-ai-playground",
    name: "AI Playground",
    slug: "ai-playground",
    url: "/demos/ai-playground",
    imageUrl: "/assets/ai-agents-hero.png",
    featured: true,
    category: "AI Product",
    description: "Interactive AI sandbox for rapid prototyping of prompts, workflows, and agents.",
    techStack: ["React", "AI", "Rapid Prototyping"],
  },
];

export default async function DemosPage() {
  let demos: Array<{
    _id: string;
    name: string;
    slug: string;
    url?: string;
    imageUrl?: string;
    featured?: boolean;
    category?: string;
    description?: string;
    techStack?: string[];
  }> = [];
  try {
    demos = (await fetchQuery(api.demos.list, {})) as typeof demos;
  } catch {
    demos = [];
  }
  const demosToRender = demos.length > 0 ? demos : FALLBACK_DEMOS;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Interactive <span>Showcase</span>
        </h1>
        <p className={styles.subtitle}>
          Explore production-ready MVPs and experimental digital products.
        </p>
      </header>

      <div className={styles.grid}>
        {demosToRender.length > 0 ? (
          demosToRender.map((demo, idx) => (
            <article key={demo._id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={demo.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"}
                  alt={demo.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx < 2}
                />
                {demo.featured && (
                  <div className={styles.featuredLogoBadge} aria-label="Featured demo">
                    <span className={styles.featuredLogoRing} />
                    <Image
                      src="/assets/LOGO.png"
                      alt="LOrdEnRYQuE"
                      width={30}
                      height={30}
                      className={styles.featuredLogoImage}
                    />
                  </div>
                )}
                <div className={styles.imageOverlay}>
                  <Link href={`/demos/${demo.slug}`} className={styles.viewBtn}>
                    View Case Study <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.category}>{demo.category}</div>
                <h3 className={styles.demoName}>{demo.name}</h3>
                <p className={styles.description}>{demo.description}</p>

                <div className={styles.techStack}>
                  {(demo.techStack || []).map((tech, i) => (
                    <span key={`${demo._id}-${tech}-${i}`} className={styles.techTag}>
                      <Code2 size={10} /> {tech}
                    </span>
                  ))}
                </div>

                <div className={styles.footer}>
                  <Link href={demo.url || "#"} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                    Live Demo <ExternalLink size={14} />
                  </Link>
                  <Link href={`/demos/${demo.slug}`} className={styles.detailsLink}>
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className={styles.empty}>
            <p className="platinum-text">No demos found. Please synchronize the portfolio in the Admin Panel.</p>
          </div>
        )}
      </div>
    </main>
  );
}
