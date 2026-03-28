"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AdminSidebar.module.css";
import {
  BarChart3,
  Activity,
  Users,
  MessageSquare,
  Home,
  Inbox,
  PenTool,
  LogOut,
  Briefcase,
  FileText,
  Globe,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Layout,
  Sliders,
  Image as ImageIcon,
  FolderLock,
  X,
  PanelLeftClose,
} from "lucide-react";
import { motion } from "framer-motion";
import LocaleLink from "@/components/I18n/LocaleLink";
import { stripLocalePrefix } from "@/lib/i18n/path";
import { useLocale } from "@/lib/i18n/useLocale";
import { clearCachedAdminToken } from "@/hooks/adminToken";

const NAV_ITEMS = [
  { section: "Core", label: "Overview", icon: BarChart3, href: "/admin" },
  { section: "Core", label: "Analytics", icon: Activity, href: "/admin/analytics" },
  { section: "Core", label: "SEO Manager", icon: Globe, href: "/admin/seo" },
  { section: "Core", label: "System Health", icon: ShieldCheck, href: "/admin/health" },
  { section: "CRM", label: "Leads", icon: Users, href: "/admin/leads" },
  { section: "CRM", label: "Inbox", icon: Inbox, href: "/admin/inbox" },
  { section: "CRM", label: "Portals", icon: FolderLock, href: "/admin/portals" },
  { section: "Content", label: "Media", icon: ImageIcon, href: "/admin/media" },
  { section: "Content", label: "Projects", icon: Briefcase, href: "/admin/projects" },
  { section: "Content", label: "Demos", icon: Layout, href: "/admin/demos" },
  { section: "Content", label: "About", icon: PenTool, href: "/admin/about" },
  { section: "Content", label: "Contact", icon: MessageSquare, href: "/admin/contact" },
  { section: "Content", label: "Blog", href: "/admin/journal", icon: FileText },
  { section: "Offerings", label: "Services", href: "/admin/services", icon: Zap },
  { section: "Offerings", label: "Digital Store", href: "/admin/store", icon: ShoppingBag },
  { section: "Platform", label: "Site Control", href: "/admin/site", icon: Globe },
  { section: "Platform", label: "Settings", href: "/admin/settings", icon: Sliders },
];

export default function AdminSidebar({
  mobileOpen = false,
  collapsed = false,
  onToggleCollapsed,
  onNavigate,
  onClose,
}: {
  mobileOpen?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const normalizedPathname = stripLocalePrefix(pathname || "/");
  const labels =
    locale === "de"
      ? {
          Overview: "Übersicht",
          Analytics: "Analytics",
          "SEO Manager": "SEO Manager",
          "System Health": "Systemstatus",
          Leads: "Leads",
          Inbox: "Inbox",
          Portals: "Portale",
          Media: "Medien",
          Projects: "Projekte",
          Demos: "Demos",
          About: "Über Mich",
          Contact: "Kontakt",
          Blog: "Blog",
          Services: "Leistungen",
          "Digital Store": "Digital Store",
          "Site Control": "Site Control",
          Settings: "Einstellungen",
          adminControl: "Admin Steuerung",
          sectionCore: "Core",
          sectionCRM: "CRM",
          sectionContent: "Content",
          sectionOfferings: "Angebote",
          sectionPlatform: "Plattform",
          exit: "Zur Website",
          logout: "Abmelden",
        }
      : {
          Overview: "Overview",
          Analytics: "Analytics",
          "SEO Manager": "SEO Manager",
          "System Health": "System Health",
          Leads: "Leads",
          Inbox: "Inbox",
          Portals: "Portals",
          Media: "Media",
          Projects: "Projects",
          Demos: "Demos",
          About: "About",
          Contact: "Contact",
          Blog: "Blog",
          Services: "Services",
          "Digital Store": "Digital Store",
          "Site Control": "Site Control",
          Settings: "Settings",
          adminControl: "Control Center",
          sectionCore: "Core",
          sectionCRM: "CRM",
          sectionContent: "Content",
          sectionOfferings: "Offerings",
          sectionPlatform: "Platform",
          exit: "Exit to Site",
          logout: "Logout",
        };

  const sectionLabels: Record<string, string> = {
    Core: labels.sectionCore,
    CRM: labels.sectionCRM,
    Content: labels.sectionContent,
    Offerings: labels.sectionOfferings,
    Platform: labels.sectionPlatform,
  };

  const groupedItems = NAV_ITEMS.reduce<Record<string, typeof NAV_ITEMS>>((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Image
            src="/assets/LOGO.png"
            alt="L.E.A.D.S logo"
            width={28}
            height={28}
            className={styles.logoImage}
          />
        </div>
        <div className={styles.logoText}>
          <h2>L.E.A.D.S</h2>
          <span>{labels.adminControl}</span>
        </div>
        <button
          type="button"
          className={styles.mobileClose}
          aria-label="Close navigation"
          onClick={onClose}
        >
          <X size={16} />
        </button>
        <button
          type="button"
          className={styles.desktopCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={onToggleCollapsed}
        >
          <PanelLeftClose size={14} />
        </button>
      </div>

      <nav className={styles.nav}>
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className={styles.navSection}>
            <p className={styles.navSectionTitle}>{sectionLabels[section] || section}</p>
            {items.map((item) => {
              const isActive = normalizedPathname === item.href;
              return (
                <LocaleLink 
                  key={item.href} 
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                  onClick={onNavigate}
                  title={labels[item.label as keyof typeof labels] || item.label}
                >
                  <item.icon size={20} />
                  <span>{labels[item.label as keyof typeof labels] || item.label}</span>

                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className={styles.activeIndicator}
                    />
                  )}
                </LocaleLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <LocaleLink href="/" className={styles.footerLink} onClick={onNavigate}>
          <Home size={18} />
          <span>{labels.exit}</span>
        </LocaleLink>
        <button
          className={styles.logoutBtn}
          onClick={async () => {
            clearCachedAdminToken();
            try {
              await fetch("/api/admin/logout", {
                method: "POST",
                cache: "no-store",
                credentials: "same-origin",
              });
            } catch {
              // Ignore network failures and continue with client-side logout redirect.
            }
            onNavigate?.();
            router.replace(`/${locale}/admin/login`);
            router.refresh();
          }}
        >
          <LogOut size={18} />
          <span>{labels.logout}</span>
        </button>
      </div>
    </aside>
  );
}
