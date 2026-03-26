import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { SystemHealth } from "../../../components/Admin/SystemHealth";

export const metadata: Metadata = {
  title: "System Health",
};

export default function AdminHealthPage() {
  return (
    <AdminPage>
      <SystemHealth />
    </AdminPage>
  );
}
