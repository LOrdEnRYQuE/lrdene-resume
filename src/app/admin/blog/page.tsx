import { BlogManager } from "../../../components/Admin/BlogManager";

export const metadata = {
  title: "Admin | Journal Manager",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminBlogPage() {
  return (
    <main className="admin-page">
      <BlogManager />
    </main>
  );
}
