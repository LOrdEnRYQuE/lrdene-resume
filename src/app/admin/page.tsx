import AdminPageLayout from "@/components/Admin/AdminPage";
import { AdminDashboard } from "@/components/Admin/AdminDashboard";

export default function AdminPage() {
  return (
    <AdminPageLayout>
      <AdminDashboard />
    </AdminPageLayout>
  );
}
