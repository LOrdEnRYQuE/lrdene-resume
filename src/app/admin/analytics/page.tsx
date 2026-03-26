import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { AnalyticsDashboard } from "../../../components/Admin/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AdminAnalyticsPage() {
  return (
    <AdminPage>
      <AnalyticsDashboard />
    </AdminPage>
  );
}
