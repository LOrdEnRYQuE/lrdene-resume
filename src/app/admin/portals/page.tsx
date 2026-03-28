import React from "react";
import type { Metadata } from "next";
import AdminPage from "@/components/Admin/AdminPage";
import { PortalManager } from "@/components/Admin/PortalManager";

export const metadata: Metadata = {
  title: "Portal Architect",
};

export default function AdminPortalsPage() {
  return (
    <AdminPage>
      <PortalManager />
    </AdminPage>
  );
}
