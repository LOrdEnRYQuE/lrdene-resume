import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import AboutEditor from "@/components/Admin/Editors/AboutEditor";

export const metadata: Metadata = {
  title: "About",
};

export default function AdminAboutPage() {
  return (
    <AdminPage>
      <AboutEditor />
    </AdminPage>
  );
}
