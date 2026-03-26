import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { LeadPipeline } from "../../../components/Admin/LeadPipeline";

export const metadata: Metadata = {
  title: "Leads",
};

export default function AdminLeadsPage() {
  return (
    <AdminPage>
      <LeadPipeline />
    </AdminPage>
  );
}
