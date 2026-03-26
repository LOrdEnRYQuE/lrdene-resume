"use client";

import React from "react";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";
import { messages } from "@/lib/i18n/messages";
import { stripLocalePrefix } from "@/lib/i18n/path";

type FooterCmsData = {
  brandText?: string;
  pillars?: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
};

type SiteSettings = {
  siteName?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
} | null;

type FooterProps = {
  cmsContent?: Partial<Record<"en" | "de", unknown>>;
  siteSettings?: unknown;
};

export const Footer = ({ cmsContent, siteSettings }: FooterProps) => {
  const pathname = usePathname();
  const locale = useLocale();
  const normalizedPathname = stripLocalePrefix(pathname || "/");
  const currentYear = new Date().getFullYear();
  const localeMessages = messages[locale].footer;
  const localeCmsData = (cmsContent?.[locale] as FooterCmsData | null | undefined) ?? null;
  const settings = (siteSettings as SiteSettings) ?? null;

  const footerData = React.useMemo(
    () => ({
      brandText: localeMessages.brandText,
      pillars: [
        {
          title: "Navigation",
          links: [
            { label: "Projects", href: "/projects" },
            { label: "Journal", href: "/blog" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" }
          ]
        },
        {
          title: "Services",
          links: [
            { label: "Web Dev", href: "/services/web-development" },
            { label: "AI Tools", href: "/services/ai-integration" },
            { label: "Design", href: "/services/ui-ux-design" }
          ]
        }
      ]
      ,
      ...(localeCmsData ? localeCmsData : {}),
    }),
    [localeCmsData, localeMessages.brandText],
  );

  if (normalizedPathname.startsWith("/admin")) return null;

  const siteName = settings?.siteName || "LOrdEnRYQuE";
  const logoSrc = "/assets/LOGO.png";
  const brandLine = "LOrdEnRYQuE | Advanced Digital Solution";
  const socialLinks = {
    github: settings?.socialLinks?.github || "https://github.com/LOrdEnRYQuE",
    twitter: settings?.socialLinks?.twitter || "",
    linkedin: settings?.socialLinks?.linkedin || "https://www.linkedin.com/in/LOrdEnRQuE",
    facebook: "https://www.facebook.com/LOrdEnRYQuEit",
    tiktok: "https://www.tiktok.com/@LOrdEnRYQuE",
    whatsapp: "https://wa.me/491722620671",
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <LocaleLink href="/" className={styles.brandLogoOrb} aria-label="LOrdEnRYQuE Home">
              <Image
                src={logoSrc}
                alt="LOrdEnRYQuE Logo"
                width={71}
                height={31}
                className={styles.brandLogo}
              />
            </LocaleLink>
            <p className={styles.brandLine}>{brandLine}</p>
          </div>

          
          <div className={styles.linksGrid}>
            {footerData.pillars.map((pillar: any, idx: number) => (
              <div key={idx} className={styles.column}>
                <h4>
                  {pillar.title === "Navigation"
                    ? localeMessages.sectionNavigation
                    : pillar.title === "Services"
                      ? localeMessages.sectionServices
                      : pillar.title}
                </h4>
                {pillar.links.map((link: any, lIdx: number) => (
                  <LocaleLink key={lIdx} href={link.href}>
                    {localeMessages.labels[link.label] || link.label}
                  </LocaleLink>
                ))}
              </div>
            ))}

            <div className={styles.column}>
              <h4>{localeMessages.sectionSocial}</h4>
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn <ArrowUpRight size={14} />
                </a>
              )}
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                Facebook <ArrowUpRight size={14} />
              </a>
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                TikTok <ArrowUpRight size={14} />
              </a>
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                WhatsApp <ArrowUpRight size={14} />
              </a>
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                  Github <ArrowUpRight size={14} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter / X <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} {siteName}. {localeMessages.rightsReserved}</p>
          <div className={styles.legal}>
            <LocaleLink href="/privacy">{localeMessages.privacyPolicy}</LocaleLink>
            <div className={styles.divider} />
            <LocaleLink href="/terms">{localeMessages.termsOfService}</LocaleLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
