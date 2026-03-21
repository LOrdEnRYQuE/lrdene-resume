import { BlogArchive } from "../../components/Blog/BlogArchive";
import { Footer } from "../../components/Footer/Footer";

export const metadata = {
  title: "Journal | LOrdEnRYQuE",
  description: "Insights on product architecture, design evolution, and business-focused AI by Attila Lazar.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogArchive />
      <Footer />
    </main>
  );
}
