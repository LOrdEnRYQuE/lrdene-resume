import { MediaLibrary } from "../../../components/Admin/MediaLibrary";

export const metadata = {
  title: "Admin | Media Library",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminMediaPage() {
  return (
    <main className="admin-page">
      <MediaLibrary />
    </main>
  );
}
