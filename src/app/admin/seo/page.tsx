import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { SEOManager } from "../../../components/Admin/SEOManager";

export const metadata: Metadata = {
  title: "SEO Manager",
};

export default function AdminSEOPage() {
  return (
    <AdminPage>
      <SEOManager />
    </AdminPage>
  );
}
