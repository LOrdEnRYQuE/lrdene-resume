import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import ContactEditor from "@/components/Admin/Editors/ContactEditor";

export const metadata: Metadata = {
  title: "Contact",
};

export default function AdminContactPage() {
  return (
    <AdminPage>
      <ContactEditor />
    </AdminPage>
  );
}
