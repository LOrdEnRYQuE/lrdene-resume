import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { JournalManager } from "../../../components/Admin/JournalManager";

export const metadata: Metadata = {
  title: "Journal",
};

export default function AdminJournalPage() {
  return (
    <AdminPage>
      <JournalManager />
    </AdminPage>
  );
}
