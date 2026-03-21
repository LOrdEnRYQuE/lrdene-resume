export const runtime = "edge";

import { Hero } from "@/components/Hero/Hero";
import { FeaturedProjects } from "@/components/Projects/FeaturedProjects";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { TrustStrip } from "@/components/TrustStrip/TrustStrip";
import { DemoBranches } from "@/components/DemoBranches/DemoBranches";
import { ServicesGrid } from "@/components/ServicesGrid/ServicesGrid";
import { ProcessSection } from "@/components/ProcessSection/ProcessSection";
import { FinalCTA } from "@/components/FinalCTA/FinalCTA";
import { BlogPreview } from "@/components/Blog/BlogPreview";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <DemoBranches />
      <ServicesGrid />
      <FeaturedProjects />
      <About />
      <ProcessSection />
      <BlogPreview />
      <Contact />
      <FinalCTA />
      <Footer />
    </main>
  );
}
