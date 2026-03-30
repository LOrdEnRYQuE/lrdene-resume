"use client";

import React, { Suspense, useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import LocaleSwitcher from "@/components/I18n/LocaleSwitcher";
import { useLocale } from "@/lib/i18n/useLocale";
import { messages } from "@/lib/i18n/messages";
import { stripLocalePrefix } from "@/lib/i18n/path";

type NavbarCmsData = {
  logo?: string;
  ctaText?: string;
  links?: Array<{ name: string; href: string; hasMega?: boolean }>;
};

type NavbarProps = {
  cmsContent?: Partial<Record<"en" | "de", unknown>>;
};

export const Navbar = ({ cmsContent }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const normalizedPathname = stripLocalePrefix(pathname || "/");
  
  const localeCmsData = (cmsContent?.[locale] as NavbarCmsData | null | undefined) ?? null;

  const navData = React.useMemo(
    () => ({
      logo: "/assets/LOGO.png",
      ctaText: "Start a Project",
      links: [
        { name: "Services", href: "/services", hasMega: true },
        { name: "Demos", href: "/demos", hasMega: true },
        { name: "Projects", href: "/projects" },
        { name: "Partners", href: "/partners" },
        { name: "QR Solutions", href: "/qr-solutions" },
        { name: "About", href: "/about" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
      ],
      ...(localeCmsData ? localeCmsData : {}),
    }),
    [localeCmsData],
  );

  // All hooks must run before any conditional return (Rules of Hooks)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [normalizedPathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  // Routes that ship with their own dedicated navigation
  const STANDALONE_ROUTES = [
    "/admin",
    "/demos/restaurant", 
    "/demos/salon",
    "/demos/real-estate",
    "/demos/lawyer",
    "/demos/home-services",
    "/demos/ecommerce",
    "/demos/ai-dashboard",
    "/demos/course-platform",
    "/demos/healthcare",
    "/demos/logistics",
    "/demos/saas-landing",
    "/demos/car-dealer",
    "/demos/car-detailing",
    "/demos/broker",
    "/demos/architecture",
    "/demos/ai-agents",
    "/demos/construction",
    '/demos/green-eco',
    '/demos/ai-marketplace',
    '/demos/mental-health',
    '/demos/car-selling',
    '/demos/ai-seo'
  ];
  if (STANDALONE_ROUTES.some((route) => normalizedPathname.startsWith(route))) return null;

  const localeMessages = messages[locale].navbar;
  const localizedCtaText =
    navData.ctaText === "Start a Project" ? localeMessages.ctaText : navData.ctaText;

  type NavLink = { name: string; href: string; hasMega?: boolean; displayName: string };
  const navLinks = [...(Array.isArray(navData.links) ? navData.links : [])];
  const hasQrSolutions = navLinks.some((link) => link?.href === "/qr-solutions" || link?.name === "QR Solutions");
  if (!hasQrSolutions) {
    navLinks.splice(Math.min(3, navLinks.length), 0, { name: "QR Solutions", href: "/qr-solutions" });
  }

  const localizedLinks: NavLink[] = navLinks.map((link: { name: string; href: string; hasMega?: boolean }) => ({
    ...link,
    displayName: localeMessages.links[link.name] || link.name,
  }));

  const leftLinks: NavLink[] = localizedLinks.filter(
    (l: NavLink) => l.hasMega || ["Projects", "Partners", "QR Solutions"].includes(l.name)
  );
  const rightLinks: NavLink[] = localizedLinks.filter(
    (l: NavLink) => !l.hasMega && !["Projects", "Partners", "QR Solutions"].includes(l.name)
  );

  const isActiveLink = (href: string) => {
    if (href === "/") return normalizedPathname === "/";
    return normalizedPathname === href || normalizedPathname.startsWith(`${href}/`);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.navContainer} container`}>
        <div className={styles.leftNav}>
          {leftLinks.map((link: NavLink) => (
            <div key={link.name} className={styles.navItemWrapper}>
              <LocaleLink
                href={link.href}
                className={`${styles.navLink} ${isActiveLink(link.href) ? styles.activeLink : ""}`}
              >
                {link.displayName}
              </LocaleLink>
            </div>
          ))}
        </div>
        
        <LocaleLink href="/" className={styles.logo}>
          <Image 
            src={navData.logo} 
            alt="LOrdEnRYQuE Logo" 
            width={120} 
            height={52} 
            className={styles.logoImage}
          />
        </LocaleLink>
        <button
          type="button"
          className={styles.mobileHamburger}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        
        <div className={styles.rightNav}>
          <div className={styles.rightLinksGroup}>
            {rightLinks.map((link: NavLink) => (
              <LocaleLink
                key={link.name}
                href={link.href}
                className={`${styles.navLink} ${isActiveLink(link.href) ? styles.activeLink : ""}`}
              >
                {link.displayName}
              </LocaleLink>
            ))}
          </div>
          <div className={styles.rightActions}>
            <Suspense fallback={null}>
              <LocaleSwitcher />
            </Suspense>
            <LocaleLink href="/#contact" className={styles.ctaAction}>
              {localizedCtaText}
            </LocaleLink>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <>
          <button
            type="button"
            className={styles.mobileBackdrop}
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className={styles.mobileMenu}>
            <div className={styles.mobileLinks}>
              {localizedLinks.map((link: NavLink) => (
                <LocaleLink
                  key={`mobile-${link.name}`}
                  href={link.href}
                  className={`${styles.mobileLink} ${isActiveLink(link.href) ? styles.mobileLinkActive : ""}`}
                >
                  {link.displayName}
                </LocaleLink>
              ))}
            </div>
            <div className={styles.mobileActions}>
              <Suspense fallback={null}>
                <LocaleSwitcher />
              </Suspense>
              <LocaleLink href="/#contact" className={styles.mobileCta}>
                {localizedCtaText}
              </LocaleLink>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
