import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import SiteEditor from "@/components/Admin/Editors/SiteEditor";

export const metadata: Metadata = {
  title: "Site Control",
};

export default function SiteAdminPage() {
  return (
    <AdminPage>
      <SiteEditor />
    </AdminPage>
  );
}
