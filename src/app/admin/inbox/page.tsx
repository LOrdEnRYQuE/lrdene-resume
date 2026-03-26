import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { InboxDesk } from "@/components/Admin/InboxDesk";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function AdminInboxPage() {
  return (
    <AdminPage density="wide">
      <InboxDesk />
    </AdminPage>
  );
}
