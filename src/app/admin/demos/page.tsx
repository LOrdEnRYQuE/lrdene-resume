import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { DemoManager } from "@/components/Admin/DemoManager";

export const metadata: Metadata = {
  title: "Demos",
};

export default function AdminDemosPage() {
  return (
    <AdminPage>
      <DemoManager />
    </AdminPage>
  );
}
