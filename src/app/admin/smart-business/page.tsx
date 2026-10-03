import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { SmartBusinessManager } from "@/components/Admin/SmartBusinessManager";

export const metadata: Metadata = {
  title: "Smart Business",
};

export default function AdminSmartBusinessPage() {
  return (
    <AdminPage density="wide">
      <SmartBusinessManager />
    </AdminPage>
  );
}
