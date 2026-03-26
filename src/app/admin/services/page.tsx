import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { ServiceManager } from "@/components/Admin/ServiceManager";

export const metadata: Metadata = {
  title: "Services",
};

export default function AdminServicesPage() {
  return (
    <AdminPage>
      <ServiceManager />
    </AdminPage>
  );
}
