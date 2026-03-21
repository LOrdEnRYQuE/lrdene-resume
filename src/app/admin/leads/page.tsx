import { LeadPipeline } from "../../../components/Admin/LeadPipeline";

export const metadata = {
  title: "Admin | Lead Pipeline",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLeadsPage() {
  return (
    <main className="admin-page">
      <LeadPipeline />
    </main>
  );
}
