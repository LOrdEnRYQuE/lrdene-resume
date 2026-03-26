"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { stripLocalePrefix } from "@/lib/i18n/path";
import AdminSidebar from "./AdminSidebar";
import styles from "@/app/admin/layout.module.css";
import { Menu, ShieldCheck } from "lucide-react";

const PAGE_LABELS: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Overview", subtitle: "Performance, pipeline, and execution health in one place." },
  "/admin/analytics": { title: "Analytics", subtitle: "Traffic quality, funnels, and conversion intelligence." },
  "/admin/seo": { title: "SEO Manager", subtitle: "Metadata, schema, and programmatic SEO controls." },
  "/admin/health": { title: "System Health", subtitle: "Operational checks and delivery readiness." },
  "/admin/leads": { title: "Leads", subtitle: "Lead triage, status flow, and close-priority tracking." },
  "/admin/inbox": { title: "Inbox", subtitle: "Inbound conversations, templates, and campaigns." },
  "/admin/portals": { title: "Portals", subtitle: "Client spaces, access control, and collaboration state." },
  "/admin/media": { title: "Media", subtitle: "Asset library, alt-text hygiene, and governance." },
  "/admin/projects": { title: "Projects", subtitle: "Case studies, status, and showcase pipeline." },
  "/admin/demos": { title: "Demos", subtitle: "Demo inventory and niche positioning." },
  "/admin/about": { title: "About", subtitle: "Personal brand, story, and trust profile." },
  "/admin/contact": { title: "Contact", subtitle: "Form structure, message intent, and conversion quality." },
  "/admin/journal": { title: "Journal", subtitle: "Editorial production and publication operations." },
  "/admin/services": { title: "Services", subtitle: "Service catalog, offers, and positioning." },
  "/admin/store": { title: "Digital Store", subtitle: "Productized offers, assets, and pricing flow." },
  "/admin/site": { title: "Site Control", subtitle: "Global CMS controls and presentation governance." },
  "/admin/settings": { title: "Settings", subtitle: "Environment-level controls and platform defaults." },
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalizedPathname = stripLocalePrefix(pathname || "/");
  const isLoginPage = normalizedPathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);
  const pageMeta = PAGE_LABELS[normalizedPathname] ?? {
    title: "Admin",
    subtitle: "Control panel",
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [normalizedPathname]);

  if (isLoginPage) {
    return <main className={`${styles.main} admin-main`}>{children}</main>;
  }

  return (
    <div className={styles.layout}>
      <button
        type="button"
        className={`${styles.menuFab} navLink`}
        aria-label="Open admin navigation"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>
      <AdminSidebar
        mobileOpen={mobileOpen}
        onNavigate={() => setMobileOpen(false)}
        onClose={() => setMobileOpen(false)}
      />
      <div
        className={styles.backdrop}
        data-open={mobileOpen ? "true" : "false"}
        role="button"
        aria-label="Close admin navigation"
        onClick={() => setMobileOpen(false)}
      />
      <main className={`${styles.main} admin-main`}>
        <header className={styles.topbar}>
          <div>
            <p className={styles.topbarEyebrow}>
              <ShieldCheck size={14} />
              Portfolio OS
            </p>
            <h1 className={styles.topbarTitle}>{pageMeta.title}</h1>
            <p className={styles.topbarSubtitle}>{pageMeta.subtitle}</p>
          </div>
        </header>
        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
