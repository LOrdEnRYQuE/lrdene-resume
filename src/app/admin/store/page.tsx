import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { ProductManager } from "@/components/Admin/ProductManager";

export const metadata: Metadata = {
  title: "Store",
};

export default function AdminStorePage() {
  return (
    <AdminPage>
      <ProductManager />
    </AdminPage>
  );
}
