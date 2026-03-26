import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { ProjectManager } from "../../../components/Admin/ProjectManager";

export const metadata: Metadata = {
  title: "Projects",
};

export default function AdminProjectsPage() {
  return (
    <AdminPage>
      <ProjectManager />
    </AdminPage>
  );
}
