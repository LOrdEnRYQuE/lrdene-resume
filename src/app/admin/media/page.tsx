import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { MediaLibrary } from "../../../components/Admin/MediaLibrary";

export const metadata: Metadata = {
  title: "Media Library",
};

export default function AdminMediaPage() {
  return (
    <AdminPage>
      <MediaLibrary />
    </AdminPage>
  );
}
