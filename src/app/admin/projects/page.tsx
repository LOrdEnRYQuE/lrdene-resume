import { ProjectManager } from "../../../components/Admin/ProjectManager";

export const metadata = {
  title: "Admin | Project Manager",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProjectsPage() {
  return (
    <main className="admin-page">
      <ProjectManager />
    </main>
  );
}
