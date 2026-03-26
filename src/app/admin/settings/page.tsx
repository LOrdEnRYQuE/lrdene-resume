import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { SettingsManager } from "@/components/Admin/SettingsManager";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <AdminPage>
      <SettingsManager />
    </AdminPage>
  );
}
