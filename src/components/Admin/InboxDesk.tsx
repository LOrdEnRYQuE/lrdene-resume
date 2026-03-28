"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import styles from "./InboxDesk.module.css";
import {
  Download,
  FileText,
  Inbox,
  Megaphone,
  Paintbrush,
  Save,
  Send,
  Sparkles,
  Upload,
  Workflow,
} from "lucide-react";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

const THREAD_STATUS = ["all", "open", "waiting", "closed"] as const;
const TEMPLATE_CATEGORIES = ["follow_up", "proposal", "marketing", "sales_reply"] as const;
const CAMPAIGN_STAGES = ["all", "New", "Qualified", "Proposal", "Won", "Lost"] as const;
const TEMPLATE_PAGE_MARKER = "TPL_PAGE_V1::";

type EmailTemplatePage = {
  layoutStyle: TemplatePresetKey;
  logoUrl: string;
  heroImageUrl?: string;
  headerTitle: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  signatureName: string;
  signatureRole: string;
  signatureCompany: string;
  footerNote: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  showSocialLinks?: boolean;
  socialLinkedIn?: string;
  socialInstagram?: string;
  socialWebsite?: string;
  showOffer?: boolean;
  offerTitle?: string;
  offerText?: string;
  showFeatureCards?: boolean;
  feature1Title?: string;
  feature1Text?: string;
  feature2Title?: string;
  feature2Text?: string;
  feature3Title?: string;
  feature3Text?: string;
  showStats?: boolean;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
  stat3Label?: string;
  stat3Value?: string;
  showTestimonial?: boolean;
  testimonialQuote?: string;
  testimonialAuthor?: string;
  showFaq?: boolean;
  faqQuestion?: string;
  faqAnswer?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  blockOrder?: TemplateBlockKey[];
  brandKitName?: string;
};

type TemplatePresetKey = "minimal" | "corporate" | "luxury" | "flyer";
type TemplatePreviewDevice = "desktop" | "mobile";
type TemplatePreviewTheme = "dark" | "light";
type TemplateBlockKey = "hero" | "offer" | "features" | "stats" | "testimonial" | "faq" | "footer";

const TEMPLATE_BLOCKS: Array<{ key: TemplateBlockKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "offer", label: "Offer" },
  { key: "features", label: "Features" },
  { key: "stats", label: "Stats" },
  { key: "testimonial", label: "Testimonial" },
  { key: "faq", label: "FAQ" },
  { key: "footer", label: "Footer" },
];

const TEMPLATE_DEFAULT_BLOCK_ORDER: TemplateBlockKey[] = [
  "hero",
  "offer",
  "features",
  "stats",
  "testimonial",
  "faq",
  "footer",
];

const TEMPLATE_VARIABLES = ["{{firstName}}", "{{projectType}}", "{{company}}"] as const;

const TEMPLATE_PRESETS: Record<TemplatePresetKey, Partial<EmailTemplatePage> & { headerTitle: string; intro: string }> = {
  minimal: {
    headerTitle: "Quick update for {{firstName}}",
    intro: "Here is a clear summary for your {{projectType}} request with practical next steps.",
    ctaLabel: "Review Next Steps",
    ctaUrl: "https://lordenryque.com/contact",
    signatureRole: "Founder",
    signatureCompany: "LOrdEnRYQuE",
    footerNote: "You received this because you contacted LOrdEnRYQuE.",
    accentColor: "#f0f0f0",
    backgroundColor: "#0b0b0b",
    textColor: "#f4f4f4",
  },
  corporate: {
    headerTitle: "Project briefing for {{firstName}}",
    intro: "Thank you for your inquiry about {{projectType}}. This email outlines the scope, timeline, and execution path.",
    ctaLabel: "Schedule Strategy Call",
    ctaUrl: "https://lordenryque.com/contact",
    signatureRole: "Solutions Architect",
    signatureCompany: "LOrdEnRYQuE Studio",
    footerNote: "Confidential business communication intended for project planning.",
    accentColor: "#9ec5ff",
    backgroundColor: "#0a1424",
    textColor: "#e7edf8",
  },
  luxury: {
    headerTitle: "A premium proposal for {{firstName}}",
    intro: "Your {{projectType}} concept deserves meticulous execution. This message details a polished, high-conversion direction.",
    ctaLabel: "Reserve a Private Consultation",
    ctaUrl: "https://lordenryque.com/contact",
    signatureRole: "Creative & Technical Director",
    signatureCompany: "LOrdEnRYQuE Atelier",
    footerNote: "Premium advisory communication from LOrdEnRYQuE.",
    accentColor: "#e1c78f",
    backgroundColor: "#140f08",
    textColor: "#f5efe2",
  },
  flyer: {
    headerTitle: "{{firstName}}, your next high-converting website is ready",
    intro: "Limited build window for {{projectType}} clients. Fast launch, premium visuals, conversion-first structure.",
    ctaLabel: "Claim Your Slot",
    ctaUrl: "https://lordenryque.com/contact",
    signatureRole: "Creative Director",
    signatureCompany: "LOrdEnRYQuE Studio",
    footerNote: "Promotional communication from LOrdEnRYQuE.",
    accentColor: "#ffd166",
    backgroundColor: "#101010",
    textColor: "#fff8e7",
  },
};

function firstName(name?: string) {
  if (!name) {
    return "there";
  }
  return name.trim().split(" ")[0] ?? "there";
}

function applyTemplateVars(
  text: string,
  vars: { firstName: string; projectType: string; company: string },
) {
  return text
    .replaceAll("{{firstName}}", vars.firstName)
    .replaceAll("{{projectType}}", vars.projectType)
    .replaceAll("{{company}}", vars.company);
}

function formatTimestamp(timestamp: number) {
  return `${new Date(timestamp).toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function serializeTemplatePage(page: EmailTemplatePage) {
  return `${TEMPLATE_PAGE_MARKER}${JSON.stringify(page)}`;
}

function parseTemplatePage(body: string): EmailTemplatePage | null {
  if (!body.startsWith(TEMPLATE_PAGE_MARKER)) {
    return null;
  }
  const payload = body.slice(TEMPLATE_PAGE_MARKER.length);
  try {
    return JSON.parse(payload) as EmailTemplatePage;
  } catch {
    return null;
  }
}

function renderTemplatePageText(page: EmailTemplatePage, vars: { firstName: string; projectType: string; company: string }) {
  return [
    applyTemplateVars(page.headerTitle, vars),
    "",
    applyTemplateVars(page.intro, vars),
    "",
    `${page.signatureName}`,
    `${page.signatureRole}, ${page.signatureCompany}`,
  ].join("\n");
}

function renderTemplatePageHtml(
  page: EmailTemplatePage,
  vars: { firstName: string; projectType: string; company: string },
  subject: string,
) {
  const headerTitle = escapeHtml(applyTemplateVars(page.headerTitle, vars));
  const intro = escapeHtml(applyTemplateVars(page.intro, vars)).replaceAll("\n", "<br/>");
  const safeSubject = escapeHtml(applyTemplateVars(subject, vars));
  const safeCtaLabel = escapeHtml(applyTemplateVars(page.ctaLabel, vars));
  const safeCtaUrl = escapeHtml(applyTemplateVars(page.ctaUrl, vars));
  const safeSignatureName = escapeHtml(applyTemplateVars(page.signatureName, vars));
  const safeSignatureRole = escapeHtml(applyTemplateVars(page.signatureRole, vars));
  const safeSignatureCompany = escapeHtml(applyTemplateVars(page.signatureCompany, vars));
  const safeFooter = escapeHtml(applyTemplateVars(page.footerNote, vars));
  const heroImageUrl = page.heroImageUrl?.trim() ? escapeHtml(page.heroImageUrl) : "";
  const showSocialLinks = Boolean(page.showSocialLinks);
  const showFeatureCards = Boolean(page.showFeatureCards);
  const showStats = Boolean(page.showStats);
  const showTestimonial = Boolean(page.showTestimonial);
  const showFaq = Boolean(page.showFaq);
  const showOffer = page.showOffer ?? true;
  const socialLinkedIn = page.socialLinkedIn?.trim() ? escapeHtml(page.socialLinkedIn) : "";
  const socialInstagram = page.socialInstagram?.trim() ? escapeHtml(page.socialInstagram) : "";
  const socialWebsite = page.socialWebsite?.trim() ? escapeHtml(page.socialWebsite) : "";
  const feature1Title = escapeHtml(applyTemplateVars(page.feature1Title?.trim() || "Fast delivery", vars));
  const feature1Text = escapeHtml(applyTemplateVars(page.feature1Text?.trim() || "Launch in short cycles with transparent milestones.", vars));
  const feature2Title = escapeHtml(applyTemplateVars(page.feature2Title?.trim() || "Client-ready quality", vars));
  const feature2Text = escapeHtml(applyTemplateVars(page.feature2Text?.trim() || "Designed to convert and to scale.", vars));
  const feature3Title = escapeHtml(applyTemplateVars(page.feature3Title?.trim() || "Growth-focused", vars));
  const feature3Text = escapeHtml(applyTemplateVars(page.feature3Text?.trim() || "Built around lead generation and retention.", vars));
  const stat1Label = escapeHtml(applyTemplateVars(page.stat1Label?.trim() || "Launch time", vars));
  const stat1Value = escapeHtml(applyTemplateVars(page.stat1Value?.trim() || "2-4 weeks", vars));
  const stat2Label = escapeHtml(applyTemplateVars(page.stat2Label?.trim() || "Client satisfaction", vars));
  const stat2Value = escapeHtml(applyTemplateVars(page.stat2Value?.trim() || "98%", vars));
  const stat3Label = escapeHtml(applyTemplateVars(page.stat3Label?.trim() || "Support response", vars));
  const stat3Value = escapeHtml(applyTemplateVars(page.stat3Value?.trim() || "< 24h", vars));
  const testimonialQuote = escapeHtml(applyTemplateVars(page.testimonialQuote?.trim() || "The new site increased qualified inquiries in the first month.", vars));
  const testimonialAuthor = escapeHtml(applyTemplateVars(page.testimonialAuthor?.trim() || "Satisfied client", vars));
  const faqQuestion = escapeHtml(applyTemplateVars(page.faqQuestion?.trim() || "How quickly can we start?", vars));
  const faqAnswer = escapeHtml(applyTemplateVars(page.faqAnswer?.trim() || "After a short discovery call, onboarding starts immediately.", vars));
  const secondaryCtaLabel = page.secondaryCtaLabel?.trim()
    ? escapeHtml(applyTemplateVars(page.secondaryCtaLabel, vars))
    : "";
  const secondaryCtaUrl = page.secondaryCtaUrl?.trim()
    ? escapeHtml(applyTemplateVars(page.secondaryCtaUrl, vars))
    : "";
  const offerTitle = escapeHtml(applyTemplateVars(page.offerTitle?.trim() || "Limited availability", vars));
  const offerText = escapeHtml(
    applyTemplateVars(
      page.offerText?.trim() || "Reply or click below to reserve your implementation slot.",
      vars,
    ),
  );
  const socialLinks = [
    socialLinkedIn ? `<a href="${socialLinkedIn}" style="color:${escapeHtml(page.accentColor)};text-decoration:none;">LinkedIn</a>` : "",
    socialInstagram ? `<a href="${socialInstagram}" style="color:${escapeHtml(page.accentColor)};text-decoration:none;">Instagram</a>` : "",
    socialWebsite ? `<a href="${socialWebsite}" style="color:${escapeHtml(page.accentColor)};text-decoration:none;">Website</a>` : "",
  ]
    .filter(Boolean)
    .join(' <span style="opacity:0.5;">|</span> ');
  const logoHtml = page.logoUrl.trim()
    ? `<img src="${escapeHtml(page.logoUrl)}" alt="Logo" style="height:48px;width:auto;display:block;margin-bottom:16px;" />`
    : "";
  const heroHtml = heroImageUrl
    ? `<img src="${heroImageUrl}" alt="Email hero image" style="display:block;width:100%;height:auto;border-radius:12px;margin:0 0 18px;" />`
    : "";
  const socialHtml =
    showSocialLinks && socialLinks
      ? `<div style="margin:14px 0 0;font-size:12px;line-height:1.45;">${socialLinks}</div>`
      : "";
  const featuresHtml = showFeatureCards
    ? `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 18px;">
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px;">
          <strong style="display:block;font-size:13px;margin-bottom:4px;">${feature1Title}</strong>
          <span style="font-size:12px;opacity:0.86;">${feature1Text}</span>
        </div>
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px;">
          <strong style="display:block;font-size:13px;margin-bottom:4px;">${feature2Title}</strong>
          <span style="font-size:12px;opacity:0.86;">${feature2Text}</span>
        </div>
        <div style="border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:10px;">
          <strong style="display:block;font-size:13px;margin-bottom:4px;">${feature3Title}</strong>
          <span style="font-size:12px;opacity:0.86;">${feature3Text}</span>
        </div>
      </div>`
    : "";
  const statsHtml = showStats
    ? `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 18px;">
        <div style="padding:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);text-align:center;">
          <strong style="display:block;font-size:18px;">${stat1Value}</strong><span style="font-size:12px;opacity:0.84;">${stat1Label}</span>
        </div>
        <div style="padding:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);text-align:center;">
          <strong style="display:block;font-size:18px;">${stat2Value}</strong><span style="font-size:12px;opacity:0.84;">${stat2Label}</span>
        </div>
        <div style="padding:10px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);text-align:center;">
          <strong style="display:block;font-size:18px;">${stat3Value}</strong><span style="font-size:12px;opacity:0.84;">${stat3Label}</span>
        </div>
      </div>`
    : "";
  const testimonialHtml = showTestimonial
    ? `<blockquote style="margin:0 0 16px;padding:12px 14px;border-left:3px solid ${escapeHtml(page.accentColor)};background:rgba(255,255,255,0.03);font-size:14px;line-height:1.6;">
        “${testimonialQuote}”
        <div style="margin-top:6px;font-size:12px;opacity:0.8;">${testimonialAuthor}</div>
      </blockquote>`
    : "";
  const faqHtml = showFaq
    ? `<div style="margin:0 0 16px;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);">
        <strong style="display:block;margin-bottom:6px;font-size:13px;">${faqQuestion}</strong>
        <span style="font-size:13px;opacity:0.9;line-height:1.5;">${faqAnswer}</span>
      </div>`
    : "";
  const secondaryCtaHtml =
    secondaryCtaLabel && secondaryCtaUrl
      ? `<a href="${secondaryCtaUrl}" style="display:inline-block;margin-left:10px;padding:11px 18px;border-radius:10px;text-decoration:none;border:1px solid ${escapeHtml(page.accentColor)};color:${escapeHtml(page.accentColor)};font-weight:700;">${secondaryCtaLabel}</a>`
      : "";
  const offerHtml = showOffer
    ? `<div style="padding:12px 14px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);margin-bottom:18px;">
        <strong style="display:block;margin-bottom:4px;color:${escapeHtml(page.accentColor)};font-size:13px;">${offerTitle}</strong>
        <span style="font-size:12px;opacity:0.86;line-height:1.55;">${offerText}</span>
      </div>`
    : "";
  const footerHtml = `<div style="margin-top:22px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.2);font-size:14px;line-height:1.5;">
      <strong>${safeSignatureName}</strong><br/>
      ${safeSignatureRole}<br/>
      ${safeSignatureCompany}
      ${socialHtml}
      <p style="margin:12px 0 0;font-size:12px;opacity:0.72;">${safeFooter}</p>
    </div>`;
  const orderedBlockKeys =
    page.blockOrder && page.blockOrder.length > 0
      ? page.blockOrder.filter((key): key is TemplateBlockKey =>
          TEMPLATE_BLOCKS.some((block) => block.key === key),
        )
      : TEMPLATE_DEFAULT_BLOCK_ORDER;
  const blockHtml: Record<TemplateBlockKey, string> = {
    hero: heroHtml,
    offer: offerHtml,
    features: featuresHtml,
    stats: statsHtml,
    testimonial: testimonialHtml,
    faq: faqHtml,
    footer: footerHtml,
  };
  const orderedBlocksHtml = orderedBlockKeys.map((key) => blockHtml[key] ?? "").join("");

  if (page.layoutStyle === "minimal") {
    return `
    <div style="font-family:Inter,Arial,sans-serif;background:${escapeHtml(page.backgroundColor)};padding:28px;color:${escapeHtml(page.textColor)};">
      <div style="max-width:680px;margin:0 auto;background:rgba(255,255,255,0.01);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.12);">
        ${logoHtml}
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.72;margin:0 0 12px;">${safeSubject}</div>
        <h1 style="margin:0 0 10px;font-size:28px;line-height:1.2;color:${escapeHtml(page.accentColor)};">${headerTitle}</h1>
        <p style="margin:0 0 18px;line-height:1.62;font-size:16px;">${intro}</p>
        ${orderedBlocksHtml}
        <a href="${safeCtaUrl}" style="display:inline-block;padding:11px 18px;border-radius:10px;text-decoration:none;background:${escapeHtml(page.accentColor)};color:#111;font-weight:700;">${safeCtaLabel}</a>
        ${secondaryCtaHtml}
      </div>
    </div>`;
  }

  if (page.layoutStyle === "corporate") {
    return `
    <div style="font-family:Inter,Arial,sans-serif;background:${escapeHtml(page.backgroundColor)};padding:22px;color:${escapeHtml(page.textColor)};">
      <div style="max-width:700px;margin:0 auto;border:1px solid rgba(255,255,255,0.14);border-radius:14px;overflow:hidden;background:rgba(255,255,255,0.02);">
        <div style="padding:16px 24px;background:rgba(0,0,0,0.25);border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:10px;">${logoHtml || ""}</div>
          <div style="font-size:12px;opacity:0.72;">${safeSubject}</div>
        </div>
        <div style="padding:24px;">
          <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.72;margin-bottom:10px;">Strategy Brief</div>
          <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:${escapeHtml(page.accentColor)};">${headerTitle}</h1>
          <p style="margin:0 0 20px;line-height:1.62;">${intro}</p>
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-bottom:16px;">
            <div style="padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);">
              <strong style="display:block;margin-bottom:5px;font-size:13px;">Scope Alignment</strong>
              <span style="font-size:12px;opacity:0.9;">Refine priorities and define conversion-focused outcomes.</span>
            </div>
            <div style="padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);">
              <strong style="display:block;margin-bottom:5px;font-size:13px;">Delivery Plan</strong>
              <span style="font-size:12px;opacity:0.9;">Set timeline, checkpoints, and ownership from day one.</span>
            </div>
          </div>
          ${orderedBlocksHtml}
          <div style="padding:14px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);margin-bottom:18px;background:rgba(255,255,255,0.02);">
            <strong style="display:block;margin-bottom:6px;">Recommended Next Step</strong>
            <span style="font-size:14px;opacity:0.9;">Book a planning call to lock strategy, budget range, and launch date.</span>
          </div>
          <a href="${safeCtaUrl}" style="display:inline-block;padding:10px 18px;border-radius:999px;text-decoration:none;background:${escapeHtml(page.accentColor)};color:#111;font-weight:700;">${safeCtaLabel}</a>
          ${secondaryCtaHtml}
        </div>
      </div>
    </div>`;
  }

  if (page.layoutStyle === "flyer") {
    return `
    <div style="font-family:'Arial Black', Impact, Arial, sans-serif;background:${escapeHtml(page.backgroundColor)};padding:22px;color:${escapeHtml(page.textColor)};">
      <div style="max-width:700px;margin:0 auto;border:2px solid ${escapeHtml(page.accentColor)};border-radius:16px;overflow:hidden;background:linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));">
        <div style="padding:14px 20px;background:${escapeHtml(page.accentColor)};color:#111;display:flex;align-items:center;justify-content:space-between;">
          <strong style="font-size:12px;letter-spacing:0.09em;text-transform:uppercase;">Flyer Campaign</strong>
          <span style="font-size:12px;">${safeSubject}</span>
        </div>
        <div style="padding:24px;">
          ${logoHtml}
          <h1 style="margin:0 0 10px;font-size:34px;line-height:1.06;text-transform:uppercase;letter-spacing:0.01em;">${headerTitle}</h1>
          <p style="margin:0 0 16px;font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.6;">${intro}</p>
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0 0 16px;font-family:Inter,Arial,sans-serif;">
            <div style="padding:11px;border:1px dashed ${escapeHtml(page.accentColor)};border-radius:10px;font-size:13px;">Offer: Strategy + design + development</div>
            <div style="padding:11px;border:1px dashed ${escapeHtml(page.accentColor)};border-radius:10px;font-size:13px;">Timeline: fast execution with clear milestones</div>
            <div style="padding:11px;border:1px dashed ${escapeHtml(page.accentColor)};border-radius:10px;font-size:13px;">Bonus: SEO-ready structure from day one</div>
            <div style="padding:11px;border:1px dashed ${escapeHtml(page.accentColor)};border-radius:10px;font-size:13px;">Outcome: more qualified leads and calls</div>
          </div>
          ${orderedBlocksHtml}
          <a href="${safeCtaUrl}" style="display:inline-block;padding:12px 20px;border-radius:10px;text-decoration:none;background:${escapeHtml(page.accentColor)};color:#111;font-weight:800;letter-spacing:0.03em;text-transform:uppercase;">${safeCtaLabel}</a>
          ${secondaryCtaHtml}
        </div>
      </div>
    </div>`;
  }

  return `
  <div style="font-family:Georgia,'Times New Roman',serif;background:radial-gradient(circle at top right, rgba(255,210,140,0.14), transparent 50%), ${escapeHtml(page.backgroundColor)};padding:28px;color:${escapeHtml(page.textColor)};">
    <div style="max-width:700px;margin:0 auto;border:1px solid rgba(225,199,143,0.4);border-radius:18px;overflow:hidden;background:linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));box-shadow:0 16px 36px rgba(0,0,0,0.35);">
      <div style="padding:28px 28px 20px;">
        ${logoHtml}
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.72;margin-bottom:10px;">Exclusive Offer</div>
        <h1 style="margin:0 0 12px;font-size:33px;line-height:1.15;color:${escapeHtml(page.accentColor)};">${headerTitle}</h1>
        <p style="margin:0;line-height:1.74;font-size:17px;">${intro}</p>
      </div>
      <div style="padding:0 28px 24px;">
        <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 16px;">
          <div style="padding:10px;border:1px solid rgba(225,199,143,0.35);border-radius:10px;font-size:13px;line-height:1.45;">Premium UI direction</div>
          <div style="padding:10px;border:1px solid rgba(225,199,143,0.35);border-radius:10px;font-size:13px;line-height:1.45;">Full conversion strategy</div>
          <div style="padding:10px;border:1px solid rgba(225,199,143,0.35);border-radius:10px;font-size:13px;line-height:1.45;">Concierge-level execution</div>
        </div>
        ${orderedBlocksHtml}
        <a href="${safeCtaUrl}" style="display:inline-block;padding:12px 22px;border-radius:999px;text-decoration:none;background:${escapeHtml(page.accentColor)};color:#111;font-weight:700;">${safeCtaLabel}</a>
        ${secondaryCtaHtml}
      </div>
    </div>
  </div>`;
}

export function InboxDesk() {
  const [activePane, setActivePane] = useState<"incoming" | "templates" | "campaigns" | "events">("incoming");
  const [mobileShowThreads, setMobileShowThreads] = useState(true);
  const [mobileShowConversation, setMobileShowConversation] = useState(true);
  const [mobileComposerOpen, setMobileComposerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [threadStatus, setThreadStatus] = useState<(typeof THREAD_STATUS)[number]>("all");
  const [queueFilter, setQueueFilter] = useState<"all" | "unread" | "followup">("all");
  const [queueSort, setQueueSort] = useState<"recent" | "priority" | "name">("priority");
  const [selectedThreadId, setSelectedThreadId] = useState<Id<"emailThreads"> | null>(null);
  const [showCampaignLab, setShowCampaignLab] = useState(false);

  const [composerTo, setComposerTo] = useState("");
  const [composerSubject, setComposerSubject] = useState("");
  const [composerBody, setComposerBody] = useState("");
  const [composerHtml, setComposerHtml] = useState("");
  const [composerTemplateBlockSignature, setComposerTemplateBlockSignature] = useState("");
  const [composerFontFamily, setComposerFontFamily] = useState("Inter, system-ui, sans-serif");
  const [composerFontColor, setComposerFontColor] = useState("#f5f5f5");
  const [selectedTemplateId, setSelectedTemplateId] = useState<Id<"emailTemplates"> | null>(null);
  const [isSending, setIsSending] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  const [templateDraftId, setTemplateDraftId] = useState<Id<"emailTemplates"> | null>(null);
  const [templateKey, setTemplateKey] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState<(typeof TEMPLATE_CATEGORIES)[number]>("follow_up");
  const [templateSubject, setTemplateSubject] = useState("");
  const [templateActive, setTemplateActive] = useState(true);
  const [templateLogoUrl, setTemplateLogoUrl] = useState("");
  const [templateHeroImageUrl, setTemplateHeroImageUrl] = useState("");
  const [templateLayoutStyle, setTemplateLayoutStyle] = useState<TemplatePresetKey>("minimal");
  const [templateHeaderTitle, setTemplateHeaderTitle] = useState("Premium update for {{firstName}}");
  const [templateIntro, setTemplateIntro] = useState("Thanks for your interest in {{projectType}}. Here is your tailored overview and next steps.");
  const [templateCtaLabel, setTemplateCtaLabel] = useState("Book a Call");
  const [templateCtaUrl, setTemplateCtaUrl] = useState("https://lordenryque.com/contact");
  const [templateSignatureName, setTemplateSignatureName] = useState("Attila Lazar");
  const [templateSignatureRole, setTemplateSignatureRole] = useState("Founder");
  const [templateSignatureCompany, setTemplateSignatureCompany] = useState("LOrdEnRYQuE");
  const [templateFooterNote, setTemplateFooterNote] = useState("You are receiving this email because you contacted LOrdEnRYQuE.");
  const [templateAccentColor, setTemplateAccentColor] = useState("#e5e4e2");
  const [templateBackgroundColor, setTemplateBackgroundColor] = useState("#0a0a0a");
  const [templateTextColor, setTemplateTextColor] = useState("#f2f2f2");
  const [templateShowSocialLinks, setTemplateShowSocialLinks] = useState(false);
  const [templateSocialLinkedIn, setTemplateSocialLinkedIn] = useState("");
  const [templateSocialInstagram, setTemplateSocialInstagram] = useState("");
  const [templateSocialWebsite, setTemplateSocialWebsite] = useState("");
  const [templateShowOffer, setTemplateShowOffer] = useState(true);
  const [templateOfferTitle, setTemplateOfferTitle] = useState("Limited availability");
  const [templateOfferText, setTemplateOfferText] = useState("Reply or click below to reserve your implementation slot.");
  const [templateShowFeatureCards, setTemplateShowFeatureCards] = useState(true);
  const [templateFeature1Title, setTemplateFeature1Title] = useState("Fast delivery");
  const [templateFeature1Text, setTemplateFeature1Text] = useState("Launch in short cycles with transparent milestones.");
  const [templateFeature2Title, setTemplateFeature2Title] = useState("Client-ready quality");
  const [templateFeature2Text, setTemplateFeature2Text] = useState("Designed to convert and to scale.");
  const [templateFeature3Title, setTemplateFeature3Title] = useState("Growth-focused");
  const [templateFeature3Text, setTemplateFeature3Text] = useState("Built around lead generation and retention.");
  const [templateShowStats, setTemplateShowStats] = useState(true);
  const [templateStat1Label, setTemplateStat1Label] = useState("Launch time");
  const [templateStat1Value, setTemplateStat1Value] = useState("2-4 weeks");
  const [templateStat2Label, setTemplateStat2Label] = useState("Client satisfaction");
  const [templateStat2Value, setTemplateStat2Value] = useState("98%");
  const [templateStat3Label, setTemplateStat3Label] = useState("Support response");
  const [templateStat3Value, setTemplateStat3Value] = useState("< 24h");
  const [templateShowTestimonial, setTemplateShowTestimonial] = useState(false);
  const [templateTestimonialQuote, setTemplateTestimonialQuote] = useState("The new site increased qualified inquiries in the first month.");
  const [templateTestimonialAuthor, setTemplateTestimonialAuthor] = useState("Satisfied client");
  const [templateShowFaq, setTemplateShowFaq] = useState(false);
  const [templateFaqQuestion, setTemplateFaqQuestion] = useState("How quickly can we start?");
  const [templateFaqAnswer, setTemplateFaqAnswer] = useState("After a short discovery call, onboarding starts immediately.");
  const [templateSecondaryCtaLabel, setTemplateSecondaryCtaLabel] = useState("");
  const [templateSecondaryCtaUrl, setTemplateSecondaryCtaUrl] = useState("");
  const [templateBlockOrder, setTemplateBlockOrder] = useState<TemplateBlockKey[]>(TEMPLATE_DEFAULT_BLOCK_ORDER);
  const [draggingBlock, setDraggingBlock] = useState<TemplateBlockKey | null>(null);
  const [templatePreviewDevice, setTemplatePreviewDevice] = useState<TemplatePreviewDevice>("desktop");
  const [templatePreviewTheme, setTemplatePreviewTheme] = useState<TemplatePreviewTheme>("dark");
  const [templateVariableTarget, setTemplateVariableTarget] = useState("templateIntro");
  const [templateTestRecipient, setTemplateTestRecipient] = useState("");
  const [isSendingTemplateTest, setIsSendingTemplateTest] = useState(false);
  const [brandKitName, setBrandKitName] = useState("");
  const [brandKits, setBrandKits] = useState<Array<{ name: string; page: EmailTemplatePage }>>([]);
  const [templateAssets, setTemplateAssets] = useState<string[]>([]);
  const [isTemplateAssetUploading, setIsTemplateAssetUploading] = useState(false);
  const templateLogoUploadInputRef = useRef<HTMLInputElement | null>(null);
  const templateHeroUploadInputRef = useRef<HTMLInputElement | null>(null);

  const [campaignName, setCampaignName] = useState("");
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignBody, setCampaignBody] = useState("");
  const [campaignStageFilter, setCampaignStageFilter] = useState<(typeof CAMPAIGN_STAGES)[number]>("all");
  const [campaignWorkflowStatus, setCampaignWorkflowStatus] = useState<"draft" | "review" | "scheduled">("draft");
  const [campaignScheduledAt, setCampaignScheduledAt] = useState("");
  const [isCampaignSending, setIsCampaignSending] = useState<string | null>(null);
  const [isDispatchingDueCampaigns, setIsDispatchingDueCampaigns] = useState(false);
  const [assetTagsDraft, setAssetTagsDraft] = useState<Record<string, string>>({});
  const [adminActionToken, setAdminActionToken] = useState<string | null>(null);

  const threads = useAdminQuery(api.communications.listThreads, {
    search: search.trim() ? search.trim() : undefined,
    status: threadStatus,
  }) as any[] | undefined;
  const selectedThreadData = useAdminQuery(
    api.communications.getThreadMessages,
    selectedThreadId ? { threadId: selectedThreadId } : "skip",
  ) as { thread: any; messages: any[] } | undefined;
  const selectedThreadEvents = useAdminQuery(
    api.communications.getThreadEvents,
    selectedThreadId ? { threadId: selectedThreadId } : "skip",
  ) as any[] | undefined;
  const templates = useAdminQuery(api.communications.listTemplates) as any[] | undefined;
  const campaigns = useAdminQuery(api.communications.listCampaigns) as any[] | undefined;
  const templateRevisions = useAdminQuery(
    api.communications.listTemplateRevisions,
    templateDraftId ? { templateId: templateDraftId } : "skip",
  ) as any[] | undefined;
  const templatePerformance = useAdminQuery(api.communications.getTemplatePerformance, {
    templateKey: templateKey.trim() || undefined,
  }) as any[] | undefined;
  const assetGovernance = useAdminQuery(api.communications.listAssetGovernance) as any[] | undefined;
  const settings = useAdminQuery(api.settings.getAdmin);

  const markThreadRead = useAdminMutation(api.communications.markThreadRead);
  const syncLeadThreads = useAdminMutation(api.communications.syncLeadThreads);
  const seedDefaultTemplates = useAdminMutation(api.communications.seedDefaultTemplates);
  const upsertTemplate = useAdminMutation(api.communications.upsertTemplate);
  const deleteTemplate = useAdminMutation(api.communications.deleteTemplate);
  const restoreTemplateRevision = useAdminMutation(api.communications.restoreTemplateRevision);
  const createCampaign = useAdminMutation(api.communications.createCampaign);
  const updateCampaignWorkflow = useAdminMutation(api.communications.updateCampaignWorkflow);
  const upsertAssetGovernance = useAdminMutation(api.communications.upsertAssetGovernance);

  const sendThreadEmail = useAction(api.communications.sendThreadEmail);
  const sendCampaignNow = useAction(api.communications.sendCampaignNow);
  const dispatchDueCampaigns = useAction(api.communications.dispatchDueCampaigns);

  useEffect(() => {
    if (!selectedThreadId && threads && threads.length > 0) {
      setSelectedThreadId(threads[0]._id);
    }
  }, [selectedThreadId, threads]);

  const resolveAdminActionToken = async () => {
    if (adminActionToken) {
      return adminActionToken;
    }
    const response = await fetch("/api/admin/convex-token", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error || "Unable to fetch admin action token.");
    }
    const payload = (await response.json()) as { token?: string };
    if (!payload.token) {
      throw new Error("Missing admin action token.");
    }
    setAdminActionToken(payload.token);
    return payload.token;
  };

  const loadTemplateAssets = async () => {
    try {
      const response = await fetch("/api/admin/assets", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = (await response.json()) as { assets?: string[] };
      setTemplateAssets(data.assets ?? []);
    } catch {
      setTemplateAssets([]);
    }
  };

  useEffect(() => {
    void loadTemplateAssets();
  }, []);

  useEffect(() => {
    if (!assetGovernance) {
      return;
    }
    const next: Record<string, string> = {};
    for (const item of assetGovernance) {
      next[item.assetPath] = item.tags.join(", ");
    }
    setAssetTagsDraft((prev) => ({ ...next, ...prev }));
  }, [assetGovernance]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_email_brand_kits_v1");
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Array<{ name: string; page: EmailTemplatePage }>;
      if (Array.isArray(parsed)) {
        setBrandKits(parsed);
      }
    } catch {
      setBrandKits([]);
    }
  }, []);

  const persistBrandKits = (kits: Array<{ name: string; page: EmailTemplatePage }>) => {
    setBrandKits(kits);
    localStorage.setItem("admin_email_brand_kits_v1", JSON.stringify(kits));
  };

  const selectedThread = selectedThreadData?.thread ?? null;
  const selectedMessages = useMemo(() => selectedThreadData?.messages ?? [], [selectedThreadData]);
  const threadEvents = selectedThreadEvents ?? [];

  useEffect(() => {
    if (!selectedThread) {
      return;
    }
    setComposerTo(selectedThread.participantEmail);
    if (!composerSubject) {
      setComposerSubject(selectedThread.subject);
    }
    if (selectedThread.unreadCount > 0) {
      void markThreadRead({ threadId: selectedThread._id });
    }
  }, [composerSubject, markThreadRead, selectedThread]);

  const dueFollowUps = useMemo(
    () => (threads ?? []).filter((t) => t.status !== "closed" && t.latestDirection === "incoming").length,
    [threads],
  );
  const unreadThreads = useMemo(
    () => (threads ?? []).filter((thread) => thread.unreadCount > 0).length,
    [threads],
  );
  const queueThreads = useMemo(() => {
    const filtered = (threads ?? []).filter((thread) => {
      if (queueFilter === "unread") return thread.unreadCount > 0;
      if (queueFilter === "followup") return thread.status !== "closed" && thread.latestDirection === "incoming";
      return true;
    });
    const score = (thread: any) => {
      const unreadWeight = Math.min(thread.unreadCount || 0, 6) * 30;
      const waitingWeight = thread.status === "waiting" ? 18 : thread.status === "open" ? 10 : 0;
      const followupWeight = thread.status !== "closed" && thread.latestDirection === "incoming" ? 24 : 0;
      const freshness = Math.floor(((thread.lastMessageAt || 0) / 1000) % 97);
      return unreadWeight + waitingWeight + followupWeight + freshness;
    };
    return [...filtered].sort((a, b) => {
      if (queueSort === "name") return (a.participantName ?? a.participantEmail).localeCompare(b.participantName ?? b.participantEmail);
      if (queueSort === "recent") return (b.lastMessageAt || 0) - (a.lastMessageAt || 0);
      return score(b) - score(a);
    });
  }, [queueFilter, queueSort, threads]);

  const activeTemplate = useMemo(
    () => (templates ?? []).find((template) => template._id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId],
  );

  const selectedThreadVars = useMemo(() => {
    const latestLeadMessage = selectedMessages.find((msg) => msg.direction === "incoming");
    const guessedProjectType = latestLeadMessage?.subject?.replace("New inquiry: ", "") ?? "your project";
    return {
      firstName: firstName(selectedThread?.participantName),
      projectType: guessedProjectType,
      company: "your team",
    };
  }, [selectedMessages, selectedThread]);

  const applyTemplateToComposer = () => {
    if (!activeTemplate) {
      return;
    }
    const templatePage = parseTemplatePage(activeTemplate.body);
    if (templatePage) {
      const renderedSubject = applyTemplateVars(activeTemplate.subject, selectedThreadVars);
      setComposerSubject(renderedSubject);
      setComposerBody(renderTemplatePageText(templatePage, selectedThreadVars));
      setComposerHtml(renderTemplatePageHtml(templatePage, selectedThreadVars, activeTemplate.subject));
      setComposerTemplateBlockSignature((templatePage.blockOrder ?? TEMPLATE_DEFAULT_BLOCK_ORDER).join(">"));
      return;
    }
    setComposerSubject(applyTemplateVars(activeTemplate.subject, selectedThreadVars));
    setComposerBody(applyTemplateVars(activeTemplate.body, selectedThreadVars));
    setComposerHtml("");
    setComposerTemplateBlockSignature("");
  };

  const resetTemplateDraft = () => {
    setTemplateDraftId(null);
    setTemplateKey("");
    setTemplateName("");
    setTemplateCategory("follow_up");
    setTemplateSubject("");
    setTemplateActive(true);
    setTemplateLogoUrl("");
    setTemplateHeroImageUrl("");
    setTemplateLayoutStyle("minimal");
    setTemplateHeaderTitle("Premium update for {{firstName}}");
    setTemplateIntro("Thanks for your interest in {{projectType}}. Here is your tailored overview and next steps.");
    setTemplateCtaLabel("Book a Call");
    setTemplateCtaUrl("https://lordenryque.com/contact");
    setTemplateSignatureName("Attila Lazar");
    setTemplateSignatureRole("Founder");
    setTemplateSignatureCompany("LOrdEnRYQuE");
    setTemplateFooterNote("You are receiving this email because you contacted LOrdEnRYQuE.");
    setTemplateAccentColor("#e5e4e2");
    setTemplateBackgroundColor("#0a0a0a");
    setTemplateTextColor("#f2f2f2");
    setTemplateShowSocialLinks(false);
    setTemplateSocialLinkedIn("");
    setTemplateSocialInstagram("");
    setTemplateSocialWebsite("");
    setTemplateShowOffer(true);
    setTemplateOfferTitle("Limited availability");
    setTemplateOfferText("Reply or click below to reserve your implementation slot.");
    setTemplateShowFeatureCards(true);
    setTemplateFeature1Title("Fast delivery");
    setTemplateFeature1Text("Launch in short cycles with transparent milestones.");
    setTemplateFeature2Title("Client-ready quality");
    setTemplateFeature2Text("Designed to convert and to scale.");
    setTemplateFeature3Title("Growth-focused");
    setTemplateFeature3Text("Built around lead generation and retention.");
    setTemplateShowStats(true);
    setTemplateStat1Label("Launch time");
    setTemplateStat1Value("2-4 weeks");
    setTemplateStat2Label("Client satisfaction");
    setTemplateStat2Value("98%");
    setTemplateStat3Label("Support response");
    setTemplateStat3Value("< 24h");
    setTemplateShowTestimonial(false);
    setTemplateTestimonialQuote("The new site increased qualified inquiries in the first month.");
    setTemplateTestimonialAuthor("Satisfied client");
    setTemplateShowFaq(false);
    setTemplateFaqQuestion("How quickly can we start?");
    setTemplateFaqAnswer("After a short discovery call, onboarding starts immediately.");
    setTemplateSecondaryCtaLabel("");
    setTemplateSecondaryCtaUrl("");
    setTemplateBlockOrder(TEMPLATE_DEFAULT_BLOCK_ORDER);
    setBrandKitName("");
  };

  const loadTemplateDraft = (template: Doc<"emailTemplates">) => {
    setTemplateDraftId(template._id);
    setTemplateKey(template.key);
    setTemplateName(template.name);
    setTemplateCategory(
      TEMPLATE_CATEGORIES.includes(template.category as (typeof TEMPLATE_CATEGORIES)[number])
        ? (template.category as (typeof TEMPLATE_CATEGORIES)[number])
        : "follow_up",
    );
    setTemplateSubject(template.subject);
    setTemplateActive(template.active);
    const templatePage = parseTemplatePage(template.body);
    if (!templatePage) {
      resetTemplateDraft();
      setTemplateDraftId(template._id);
      setTemplateKey(template.key);
      setTemplateName(template.name);
      setTemplateCategory(
        TEMPLATE_CATEGORIES.includes(template.category as (typeof TEMPLATE_CATEGORIES)[number])
          ? (template.category as (typeof TEMPLATE_CATEGORIES)[number])
          : "follow_up",
      );
      setTemplateSubject(template.subject);
      setTemplateActive(template.active);
      setTemplateHeaderTitle(template.name);
      setTemplateIntro(template.body);
      return;
    }
    applyTemplatePageState(templatePage);
  };

  const handleSend = async () => {
    if (!composerTo.trim() || !composerSubject.trim() || !composerBody.trim()) {
      alert("Recipient, subject and body are required.");
      return;
    }

    setIsSending(true);
    try {
      const adminToken = await resolveAdminActionToken();
      const result = await sendThreadEmail({
        adminToken,
        threadId: selectedThread?._id,
        leadId: selectedThread?.leadId,
        to: composerTo.trim(),
        participantName: selectedThread?.participantName,
        subject: composerSubject.trim(),
        body: composerBody.trim(),
        html: composerHtml || undefined,
        templateKey: activeTemplate?.key,
        templateBlockSignature: composerTemplateBlockSignature || undefined,
      });
      if (!result.success) {
        alert(`Failed to send: ${result.error ?? "Unknown error"}`);
        return;
      }
      setComposerBody("");
      setComposerHtml("");
      setComposerTemplateBlockSignature("");
      alert("Email sent.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateKey.trim() || !templateName.trim() || !templateSubject.trim()) {
      alert("Template key, name and subject are required.");
      return;
    }

    const templatePage: EmailTemplatePage = currentTemplatePage();

    await upsertTemplate({
      id: templateDraftId ?? undefined,
      key: templateKey.trim(),
      name: templateName.trim(),
      category: templateCategory,
      subject: templateSubject.trim(),
      body: serializeTemplatePage(templatePage),
      active: templateActive,
    });
    resetTemplateDraft();
  };

  const applyTemplatePreset = (presetKey: TemplatePresetKey) => {
    const preset = TEMPLATE_PRESETS[presetKey];
    setTemplateLayoutStyle(presetKey);
    setTemplateHeaderTitle(preset.headerTitle);
    setTemplateIntro(preset.intro);
    setTemplateCtaLabel(preset.ctaLabel || "Book a Call");
    setTemplateCtaUrl(preset.ctaUrl || "https://lordenryque.com/contact");
    setTemplateSignatureRole(preset.signatureRole || "Founder");
    setTemplateSignatureCompany(preset.signatureCompany || "LOrdEnRYQuE");
    setTemplateFooterNote(preset.footerNote || "You are receiving this email because you contacted LOrdEnRYQuE.");
    setTemplateAccentColor(preset.accentColor || "#e5e4e2");
    setTemplateBackgroundColor(preset.backgroundColor || "#0a0a0a");
    setTemplateTextColor(preset.textColor || "#f2f2f2");
    setTemplateShowSocialLinks(false);
    setTemplateSocialLinkedIn("");
    setTemplateSocialInstagram("");
    setTemplateSocialWebsite("");
    setTemplateShowOffer(true);
    setTemplateOfferTitle("Limited availability");
    setTemplateOfferText("Reply or click below to reserve your implementation slot.");
    setTemplateShowFeatureCards(true);
    setTemplateShowStats(true);
    setTemplateShowTestimonial(false);
    setTemplateShowFaq(false);
    setTemplateSecondaryCtaLabel("");
    setTemplateSecondaryCtaUrl("");
    setTemplateBlockOrder(TEMPLATE_DEFAULT_BLOCK_ORDER);
    setBrandKitName("");
  };

  const handleCreateCampaign = async () => {
    if (!campaignName.trim() || !campaignSubject.trim() || !campaignBody.trim()) {
      alert("Campaign name, subject and body are required.");
      return;
    }
    const stageFilters = campaignStageFilter === "all" ? undefined : [campaignStageFilter];
    const scheduledAt =
      campaignWorkflowStatus === "scheduled" && campaignScheduledAt
        ? new Date(campaignScheduledAt).getTime()
        : undefined;
    await createCampaign({
      name: campaignName.trim(),
      subject: campaignSubject.trim(),
      body: campaignBody.trim(),
      stageFilter: campaignStageFilter === "all" ? undefined : campaignStageFilter,
      stageFilters,
      status: campaignWorkflowStatus,
      scheduledAt,
    });
    setCampaignName("");
    setCampaignSubject("");
    setCampaignBody("");
    setCampaignStageFilter("all");
    setCampaignWorkflowStatus("draft");
    setCampaignScheduledAt("");
  };

  const handleSendCampaign = async (campaignId: Id<"emailCampaigns">) => {
    setIsCampaignSending(campaignId);
    try {
      const adminToken = await resolveAdminActionToken();
      const result = await sendCampaignNow({ campaignId, adminToken });
      if (!result.success) {
        alert(`Campaign failed: ${result.error ?? "Unknown error"}`);
        return;
      }
      alert(`Campaign sent. Sent ${result.sent ?? 0}/${result.recipients ?? 0}.`);
    } finally {
      setIsCampaignSending(null);
    }
  };

  const handleUpdateCampaignWorkflow = async (
    campaignId: Id<"emailCampaigns">,
    status: "draft" | "review" | "scheduled",
    scheduledAt?: number,
  ) => {
    await updateCampaignWorkflow({
      campaignId,
      status,
      scheduledAt,
    });
  };

  const handleDispatchDueCampaigns = async () => {
    setIsDispatchingDueCampaigns(true);
    try {
      const adminToken = await resolveAdminActionToken();
      const result = await dispatchDueCampaigns({ adminToken });
      alert(`Dispatched ${result.dispatched ?? 0} scheduled campaigns.`);
    } finally {
      setIsDispatchingDueCampaigns(false);
    }
  };

  const handleSaveAssetTags = async (assetPath: string) => {
    const raw = assetTagsDraft[assetPath] ?? "";
    const tags = raw
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);
    await upsertAssetGovernance({
      assetPath,
      tags,
    });
  };

  const handleUploadAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setComposerBody((prev) => `${prev}\n\n[Attachment ready: ${file.name} (${Math.round(file.size / 1024)} KB)]`.trim());
    setComposerHtml("");
    setComposerTemplateBlockSignature("");
    event.target.value = "";
  };

  const handleTemplateAssetUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    target: "logo" | "hero",
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsTemplateAssetUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/assets", {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        alert("Asset upload failed.");
        return;
      }
      const data = (await response.json()) as { asset?: string };
      if (data.asset) {
        if (target === "logo") {
          setTemplateLogoUrl(data.asset);
        } else {
          setTemplateHeroImageUrl(data.asset);
        }
      }
      await loadTemplateAssets();
    } finally {
      setIsTemplateAssetUploading(false);
      event.target.value = "";
    }
  };

  const handleDownloadDraft = () => {
    const draft = [
      `To: ${composerTo}`,
      `Subject: ${composerSubject}`,
      "",
      composerBody,
    ].join("\n");
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `inbox-draft-${Date.now()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const applyTemplatePageState = (templatePage: EmailTemplatePage) => {
    setTemplateLayoutStyle(templatePage.layoutStyle || "minimal");
    setTemplateLogoUrl(templatePage.logoUrl ?? "");
    setTemplateHeroImageUrl(templatePage.heroImageUrl ?? "");
    setTemplateHeaderTitle(templatePage.headerTitle ?? "");
    setTemplateIntro(templatePage.intro ?? "");
    setTemplateCtaLabel(templatePage.ctaLabel ?? "");
    setTemplateCtaUrl(templatePage.ctaUrl ?? "");
    setTemplateSignatureName(templatePage.signatureName ?? "");
    setTemplateSignatureRole(templatePage.signatureRole ?? "");
    setTemplateSignatureCompany(templatePage.signatureCompany ?? "");
    setTemplateFooterNote(templatePage.footerNote ?? "");
    setTemplateAccentColor(templatePage.accentColor ?? "#e5e4e2");
    setTemplateBackgroundColor(templatePage.backgroundColor ?? "#0a0a0a");
    setTemplateTextColor(templatePage.textColor ?? "#f2f2f2");
    setTemplateShowSocialLinks(Boolean(templatePage.showSocialLinks));
    setTemplateSocialLinkedIn(templatePage.socialLinkedIn ?? "");
    setTemplateSocialInstagram(templatePage.socialInstagram ?? "");
    setTemplateSocialWebsite(templatePage.socialWebsite ?? "");
    setTemplateShowOffer(templatePage.showOffer ?? true);
    setTemplateOfferTitle(templatePage.offerTitle ?? "Limited availability");
    setTemplateOfferText(templatePage.offerText ?? "Reply or click below to reserve your implementation slot.");
    setTemplateShowFeatureCards(templatePage.showFeatureCards ?? true);
    setTemplateFeature1Title(templatePage.feature1Title ?? "Fast delivery");
    setTemplateFeature1Text(templatePage.feature1Text ?? "Launch in short cycles with transparent milestones.");
    setTemplateFeature2Title(templatePage.feature2Title ?? "Client-ready quality");
    setTemplateFeature2Text(templatePage.feature2Text ?? "Designed to convert and to scale.");
    setTemplateFeature3Title(templatePage.feature3Title ?? "Growth-focused");
    setTemplateFeature3Text(templatePage.feature3Text ?? "Built around lead generation and retention.");
    setTemplateShowStats(templatePage.showStats ?? true);
    setTemplateStat1Label(templatePage.stat1Label ?? "Launch time");
    setTemplateStat1Value(templatePage.stat1Value ?? "2-4 weeks");
    setTemplateStat2Label(templatePage.stat2Label ?? "Client satisfaction");
    setTemplateStat2Value(templatePage.stat2Value ?? "98%");
    setTemplateStat3Label(templatePage.stat3Label ?? "Support response");
    setTemplateStat3Value(templatePage.stat3Value ?? "< 24h");
    setTemplateShowTestimonial(Boolean(templatePage.showTestimonial));
    setTemplateTestimonialQuote(templatePage.testimonialQuote ?? "The new site increased qualified inquiries in the first month.");
    setTemplateTestimonialAuthor(templatePage.testimonialAuthor ?? "Satisfied client");
    setTemplateShowFaq(Boolean(templatePage.showFaq));
    setTemplateFaqQuestion(templatePage.faqQuestion ?? "How quickly can we start?");
    setTemplateFaqAnswer(templatePage.faqAnswer ?? "After a short discovery call, onboarding starts immediately.");
    setTemplateSecondaryCtaLabel(templatePage.secondaryCtaLabel ?? "");
    setTemplateSecondaryCtaUrl(templatePage.secondaryCtaUrl ?? "");
    setTemplateBlockOrder(
      templatePage.blockOrder && templatePage.blockOrder.length > 0
        ? templatePage.blockOrder
        : TEMPLATE_DEFAULT_BLOCK_ORDER,
    );
    setBrandKitName(templatePage.brandKitName ?? "");
  };

  const currentTemplatePage = (): EmailTemplatePage => ({
    layoutStyle: templateLayoutStyle,
    logoUrl: templateLogoUrl,
    heroImageUrl: templateHeroImageUrl,
    headerTitle: templateHeaderTitle,
    intro: templateIntro,
    ctaLabel: templateCtaLabel,
    ctaUrl: templateCtaUrl,
    signatureName: templateSignatureName,
    signatureRole: templateSignatureRole,
    signatureCompany: templateSignatureCompany,
    footerNote: templateFooterNote,
    accentColor: templateAccentColor,
    backgroundColor: templateBackgroundColor,
    textColor: templateTextColor,
    showSocialLinks: templateShowSocialLinks,
    socialLinkedIn: templateSocialLinkedIn,
    socialInstagram: templateSocialInstagram,
    socialWebsite: templateSocialWebsite,
    showOffer: templateShowOffer,
    offerTitle: templateOfferTitle,
    offerText: templateOfferText,
    showFeatureCards: templateShowFeatureCards,
    feature1Title: templateFeature1Title,
    feature1Text: templateFeature1Text,
    feature2Title: templateFeature2Title,
    feature2Text: templateFeature2Text,
    feature3Title: templateFeature3Title,
    feature3Text: templateFeature3Text,
    showStats: templateShowStats,
    stat1Label: templateStat1Label,
    stat1Value: templateStat1Value,
    stat2Label: templateStat2Label,
    stat2Value: templateStat2Value,
    stat3Label: templateStat3Label,
    stat3Value: templateStat3Value,
    showTestimonial: templateShowTestimonial,
    testimonialQuote: templateTestimonialQuote,
    testimonialAuthor: templateTestimonialAuthor,
    showFaq: templateShowFaq,
    faqQuestion: templateFaqQuestion,
    faqAnswer: templateFaqAnswer,
    secondaryCtaLabel: templateSecondaryCtaLabel,
    secondaryCtaUrl: templateSecondaryCtaUrl,
    blockOrder: templateBlockOrder,
    brandKitName: brandKitName || undefined,
  });

  const handleBlockDrop = (target: TemplateBlockKey) => {
    if (!draggingBlock || draggingBlock === target) {
      return;
    }
    const next = [...templateBlockOrder];
    const fromIndex = next.indexOf(draggingBlock);
    const toIndex = next.indexOf(target);
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, draggingBlock);
    setTemplateBlockOrder(next);
    setDraggingBlock(null);
  };

  const appendTemplateVariable = (variable: (typeof TEMPLATE_VARIABLES)[number]) => {
    const append = (value: string) => (value ? `${value} ${variable}` : variable);
    switch (templateVariableTarget) {
      case "templateSubject":
        setTemplateSubject(append(templateSubject));
        return;
      case "templateHeaderTitle":
        setTemplateHeaderTitle(append(templateHeaderTitle));
        return;
      case "templateIntro":
        setTemplateIntro(append(templateIntro));
        return;
      case "templateCtaLabel":
        setTemplateCtaLabel(append(templateCtaLabel));
        return;
      case "templateOfferTitle":
        setTemplateOfferTitle(append(templateOfferTitle));
        return;
      case "templateOfferText":
        setTemplateOfferText(append(templateOfferText));
        return;
      case "templateFeature1Text":
        setTemplateFeature1Text(append(templateFeature1Text));
        return;
      case "templateFeature2Text":
        setTemplateFeature2Text(append(templateFeature2Text));
        return;
      case "templateFeature3Text":
        setTemplateFeature3Text(append(templateFeature3Text));
        return;
      case "templateTestimonialQuote":
        setTemplateTestimonialQuote(append(templateTestimonialQuote));
        return;
      case "templateFaqAnswer":
        setTemplateFaqAnswer(append(templateFaqAnswer));
        return;
      default:
        setTemplateIntro(append(templateIntro));
    }
  };

  const templateVariableWarnings = useMemo(() => {
    const source = [
      templateSubject,
      templateHeaderTitle,
      templateIntro,
      templateOfferTitle,
      templateOfferText,
      templateFeature1Text,
      templateFeature2Text,
      templateFeature3Text,
      templateTestimonialQuote,
      templateFaqAnswer,
      templateFooterNote,
    ].join("\n");
    const matches = source.match(/{{\s*[^}]+\s*}}/g) ?? [];
    const normalizeToken = (token: string) => `{{${token.replaceAll("{", "").replaceAll("}", "").trim()}}}`;
    const unknown = [
      ...new Set(
        matches
          .map((token) => normalizeToken(token))
          .filter((token) => !TEMPLATE_VARIABLES.includes(token as (typeof TEMPLATE_VARIABLES)[number])),
      ),
    ];
    return unknown;
  }, [
    templateFaqAnswer,
    templateFeature1Text,
    templateFeature2Text,
    templateFeature3Text,
    templateFooterNote,
    templateHeaderTitle,
    templateIntro,
    templateOfferText,
    templateOfferTitle,
    templateSubject,
    templateTestimonialQuote,
  ]);

  const handleSendTemplateTest = async () => {
    if (!templateTestRecipient.trim()) {
      alert("Add a test recipient email.");
      return;
    }
    setIsSendingTemplateTest(true);
    try {
      const adminToken = await resolveAdminActionToken();
      const page = currentTemplatePage();
      const subject = applyTemplateVars(templateSubject || "Template Test", selectedThreadVars);
      const body = renderTemplatePageText(page, selectedThreadVars);
      const html = renderTemplatePageHtml(page, selectedThreadVars, templateSubject || "Template Test");
      const result = await sendThreadEmail({
        adminToken,
        to: templateTestRecipient.trim(),
        subject,
        body,
        html,
        participantName: "Template Test",
      });
      if (!result.success) {
        alert(`Test email failed: ${result.error ?? "Unknown error"}`);
        return;
      }
      alert("Test email sent.");
    } finally {
      setIsSendingTemplateTest(false);
    }
  };

  const handleSaveBrandKit = () => {
    const name = brandKitName.trim();
    if (!name) {
      alert("Set a brand kit name first.");
      return;
    }
    const page = currentTemplatePage();
    const next = [...brandKits.filter((kit) => kit.name !== name), { name, page }];
    persistBrandKits(next);
  };

  const handleApplyBrandKit = (name: string) => {
    const kit = brandKits.find((item) => item.name === name);
    if (!kit) {
      return;
    }
    applyTemplatePageState(kit.page);
  };

  const templatePreviewHtml = renderTemplatePageHtml(
    currentTemplatePage(),
    selectedThreadVars,
    templateSubject || "Template Subject",
  );

  return (
    <div className={styles.container}>
      <div className={styles.workspace}>
        <aside className={styles.navRail}>
          <h1 className={styles.railTitle}>Inbox OS</h1>
          <p className={styles.meta}>Follow-up due: {dueFollowUps}</p>
          <button
            type="button"
            className={`${styles.railBtn} ${activePane === "incoming" ? styles.railBtnActive : ""}`}
            onClick={() => setActivePane("incoming")}
          >
            <Inbox size={14} /> Incoming
          </button>
          <button
            type="button"
            className={`${styles.railBtn} ${activePane === "templates" ? styles.railBtnActive : ""}`}
            onClick={() => setActivePane("templates")}
          >
            <FileText size={14} /> Templates
          </button>
          <button
            type="button"
            className={`${styles.railBtn} ${activePane === "campaigns" ? styles.railBtnActive : ""}`}
            onClick={() => setActivePane("campaigns")}
          >
            <Megaphone size={14} /> Campaigns
          </button>
          <button
            type="button"
            className={`${styles.railBtn} ${activePane === "events" ? styles.railBtnActive : ""}`}
            onClick={() => setActivePane("events")}
          >
            <Workflow size={14} /> Events
          </button>
          <div className={styles.railActions}>
            <button type="button" className={styles.ghostBtn} onClick={() => void syncLeadThreads({ limit: 80 })}>
              <Workflow size={14} /> Sync Leads
            </button>
            <button type="button" className={styles.ghostBtn} onClick={() => void seedDefaultTemplates({})}>
              <Sparkles size={14} /> Seed Templates
            </button>
          </div>
        </aside>

        <section className={styles.mainPane}>
          {activePane === "incoming" ? (
            <>
              <div className={styles.incomingMetrics}>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>Threads</span>
                  <strong>{(threads ?? []).length}</strong>
                </article>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>Unread</span>
                  <strong>{unreadThreads}</strong>
                </article>
                <article className={styles.metricCard}>
                  <span className={styles.metricLabel}>Follow-up Due</span>
                  <strong>{dueFollowUps}</strong>
                </article>
              </div>
              <div className={styles.mobileToolbar}>
                <button
                  type="button"
                  className={`${styles.ghostBtn} ${mobileShowThreads ? styles.railBtnActive : ""}`}
                  onClick={() => setMobileShowThreads((value) => !value)}
                >
                  {mobileShowThreads ? "Hide Threads" : "Show Threads"}
                </button>
                <button
                  type="button"
                  className={`${styles.ghostBtn} ${mobileShowConversation ? styles.railBtnActive : ""}`}
                  onClick={() => setMobileShowConversation((value) => !value)}
                >
                  {mobileShowConversation ? "Hide Conversation" : "Show Conversation"}
                </button>
              </div>
              <div className={styles.mainToolbar}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search contact, email, subject..."
                />
                <select
                  value={threadStatus}
                  onChange={(e) => setThreadStatus(e.target.value as (typeof THREAD_STATUS)[number])}
                >
                  {THREAD_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.queueToolbar}>
                <div className={styles.queueChips}>
                  <button
                    type="button"
                    className={`${styles.queueChip} ${queueFilter === "all" ? styles.queueChipActive : ""}`}
                    onClick={() => setQueueFilter("all")}
                  >
                    All ({(threads ?? []).length})
                  </button>
                  <button
                    type="button"
                    className={`${styles.queueChip} ${queueFilter === "unread" ? styles.queueChipActive : ""}`}
                    onClick={() => setQueueFilter("unread")}
                  >
                    Unread ({unreadThreads})
                  </button>
                  <button
                    type="button"
                    className={`${styles.queueChip} ${queueFilter === "followup" ? styles.queueChipActive : ""}`}
                    onClick={() => setQueueFilter("followup")}
                  >
                    Follow-up ({dueFollowUps})
                  </button>
                </div>
                <select value={queueSort} onChange={(e) => setQueueSort(e.target.value as typeof queueSort)}>
                  <option value="priority">Sort: Triage priority</option>
                  <option value="recent">Sort: Most recent</option>
                  <option value="name">Sort: Contact name</option>
                </select>
              </div>
              <div className={styles.incomingLayout}>
                <aside className={`${styles.listPane} ${!mobileShowThreads ? styles.mobileCollapsed : ""}`}>
                  <div className={styles.paneHeader}>
                    <strong>Triage Queue</strong>
                    <span className={styles.meta}>{queueThreads.length} threads</span>
                  </div>
                  {queueThreads.length === 0 ? (
                    <p className={styles.empty}>No threads yet. Run Sync Leads to initialize from form submissions.</p>
                  ) : (
                    queueThreads.map((thread) => (
                      <button
                        key={thread._id}
                        type="button"
                        className={`${styles.threadItem} ${selectedThreadId === thread._id ? styles.active : ""}`}
                        onClick={() => setSelectedThreadId(thread._id)}
                      >
                        <div className={styles.threadTop}>
                          <strong className={styles.threadName}>{thread.participantName ?? thread.participantEmail}</strong>
                          {thread.unreadCount > 0 ? <span className={styles.badge}>{thread.unreadCount} new</span> : null}
                        </div>
                        <span className={styles.threadEmail}>{thread.participantEmail}</span>
                        <span className={styles.threadSubject}>{thread.subject}</span>
                        <span className={styles.preview}>{thread.preview}</span>
                      </button>
                    ))
                  )}
                </aside>
                <article className={`${styles.detailPane} ${!mobileShowConversation ? styles.mobileCollapsed : ""}`}>
                  <div className={styles.paneHeader}>
                    <strong>Conversation</strong>
                    <span className={styles.meta}>{selectedMessages.length} messages</span>
                  </div>
                  {!selectedThread ? (
                    <p className={styles.empty}>Select a thread to open the timeline.</p>
                  ) : (
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div>
                          <h3>{selectedThread.participantName ?? selectedThread.participantEmail}</h3>
                          <p className={styles.sub}>{selectedThread.participantEmail}</p>
                        </div>
                        <span className={styles.meta}>{selectedThread.status}</span>
                      </div>
                      <div className={styles.timeline}>
                        {selectedMessages.length === 0 ? (
                          <p className={styles.empty}>No messages in this thread yet.</p>
                        ) : (
                          selectedMessages
                            .slice()
                            .reverse()
                            .map((message) => (
                              <article
                                key={message._id}
                                className={`${styles.messageRow} ${
                                  message.direction === "outgoing" ? styles.outgoing : styles.incoming
                                }`}
                              >
                                <div className={styles.messageTop}>
                                  <span className={styles.direction}>{message.direction}</span>
                                  <span className={styles.meta}>{message.status}</span>
                                </div>
                                <strong>{message.subject}</strong>
                                <p className={styles.messageBody}>{message.body}</p>
                                <span className={styles.noteTime}>{formatTimestamp(message.createdAt)}</span>
                              </article>
                            ))
                        )}
                      </div>
                    </div>
                  )}
                </article>
              </div>
            </>
          ) : null}

          {activePane === "templates" ? (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <strong>Template Studio</strong>
                <button type="button" className={styles.ghostBtn} onClick={resetTemplateDraft}>
                  New
                </button>
              </div>
              <div className={styles.templateGrid}>
                <input value={templateKey} onChange={(e) => setTemplateKey(e.target.value)} placeholder="key" />
                <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="name" />
                <select
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value as (typeof TEMPLATE_CATEGORIES)[number])}
                >
                  {TEMPLATE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={templateActive ? "active" : "inactive"}
                  onChange={(e) => setTemplateActive(e.target.value === "active")}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                <select
                  value={templateLayoutStyle}
                  onChange={(e) => setTemplateLayoutStyle(e.target.value as TemplatePresetKey)}
                >
                  <option value="minimal">Layout: Minimal</option>
                  <option value="corporate">Layout: Corporate</option>
                  <option value="luxury">Layout: Luxury</option>
                  <option value="flyer">Layout: Flyer</option>
                </select>
              </div>
              <div className={styles.templatePresets}>
                <span className={styles.meta}>Style Packs:</span>
                <button type="button" className={styles.ghostBtn} onClick={() => applyTemplatePreset("minimal")}>
                  Minimal
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => applyTemplatePreset("corporate")}>
                  Corporate
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => applyTemplatePreset("luxury")}>
                  Luxury
                </button>
                <button type="button" className={styles.ghostBtn} onClick={() => applyTemplatePreset("flyer")}>
                  Flyer
                </button>
              </div>
              <div className={styles.templateGrid}>
                <input
                  value={brandKitName}
                  onChange={(e) => setBrandKitName(e.target.value)}
                  placeholder="Brand kit name"
                />
                <div className={styles.inlineActions}>
                  <button type="button" className={styles.ghostBtn} onClick={handleSaveBrandKit}>
                    <Save size={14} /> Save Brand Kit
                  </button>
                  <select value="" onChange={(e) => e.target.value && handleApplyBrandKit(e.target.value)}>
                    <option value="">Apply saved brand kit</option>
                    {brandKits.map((kit) => (
                      <option key={kit.name} value={kit.name}>
                        {kit.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>Variables target</label>
                <select value={templateVariableTarget} onChange={(e) => setTemplateVariableTarget(e.target.value)}>
                  <option value="templateSubject">Subject</option>
                  <option value="templateHeaderTitle">Header</option>
                  <option value="templateIntro">Intro</option>
                  <option value="templateCtaLabel">CTA label</option>
                  <option value="templateOfferTitle">Offer title</option>
                  <option value="templateOfferText">Offer text</option>
                  <option value="templateFeature1Text">Feature 1</option>
                  <option value="templateFeature2Text">Feature 2</option>
                  <option value="templateFeature3Text">Feature 3</option>
                  <option value="templateTestimonialQuote">Testimonial</option>
                  <option value="templateFaqAnswer">FAQ answer</option>
                </select>
                <div className={styles.inlineActions}>
                  {TEMPLATE_VARIABLES.map((token) => (
                    <button key={token} type="button" className={styles.ghostBtn} onClick={() => appendTemplateVariable(token)}>
                      {token}
                    </button>
                  ))}
                </div>
              </div>
              {templateVariableWarnings.length > 0 ? (
                <span className={styles.sub}>Unknown variables: {templateVariableWarnings.join(", ")}</span>
              ) : (
                <span className={styles.sub}>Variables valid.</span>
              )}
              <input value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} placeholder="Template subject" />
              <div className={styles.templateGrid}>
                <input
                  value={templateLogoUrl}
                  onChange={(e) => setTemplateLogoUrl(e.target.value)}
                  placeholder="Logo URL (/assets/...)"
                />
                <div className={styles.inlineActions}>
                  <select value={templateLogoUrl} onChange={(e) => setTemplateLogoUrl(e.target.value)}>
                    <option value="">Select logo from /public/assets</option>
                    {templateAssets.map((assetPath) => (
                      <option key={`logo-${assetPath}`} value={assetPath}>
                        {assetPath}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => templateLogoUploadInputRef.current?.click()}
                    disabled={isTemplateAssetUploading}
                  >
                    <Upload size={14} /> {isTemplateAssetUploading ? "Uploading..." : "Upload Logo"}
                  </button>
                </div>
                <input
                  value={templateHeroImageUrl}
                  onChange={(e) => setTemplateHeroImageUrl(e.target.value)}
                  placeholder="Hero image URL (/assets/...)"
                />
                <div className={styles.inlineActions}>
                  <select value={templateHeroImageUrl} onChange={(e) => setTemplateHeroImageUrl(e.target.value)}>
                    <option value="">Select hero from /public/assets</option>
                    {templateAssets.map((assetPath) => (
                      <option key={`hero-${assetPath}`} value={assetPath}>
                        {assetPath}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => templateHeroUploadInputRef.current?.click()}
                    disabled={isTemplateAssetUploading}
                  >
                    <Upload size={14} /> {isTemplateAssetUploading ? "Uploading..." : "Upload Hero"}
                  </button>
                </div>
              </div>
              <input
                value={templateHeaderTitle}
                onChange={(e) => setTemplateHeaderTitle(e.target.value)}
                placeholder="Header title"
              />
              <textarea
                value={templateIntro}
                onChange={(e) => setTemplateIntro(e.target.value)}
                rows={4}
                placeholder="Email description / body text"
              />
              <div className={styles.templateGrid}>
                <input
                  value={templateCtaLabel}
                  onChange={(e) => setTemplateCtaLabel(e.target.value)}
                  placeholder="CTA label"
                />
                <input
                  value={templateCtaUrl}
                  onChange={(e) => setTemplateCtaUrl(e.target.value)}
                  placeholder="CTA URL"
                />
                <input
                  value={templateSignatureName}
                  onChange={(e) => setTemplateSignatureName(e.target.value)}
                  placeholder="Signature name"
                />
                <input
                  value={templateSignatureRole}
                  onChange={(e) => setTemplateSignatureRole(e.target.value)}
                  placeholder="Signature role"
                />
                <input
                  value={templateSignatureCompany}
                  onChange={(e) => setTemplateSignatureCompany(e.target.value)}
                  placeholder="Signature company"
                />
                <input
                  value={templateFooterNote}
                  onChange={(e) => setTemplateFooterNote(e.target.value)}
                  placeholder="Footer note"
                />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowSocialLinks}
                    onChange={(e) => setTemplateShowSocialLinks(e.target.checked)}
                  />
                  Show social links
                </label>
                <input
                  value={templateSocialLinkedIn}
                  onChange={(e) => setTemplateSocialLinkedIn(e.target.value)}
                  placeholder="LinkedIn URL (optional)"
                />
                <input
                  value={templateSocialInstagram}
                  onChange={(e) => setTemplateSocialInstagram(e.target.value)}
                  placeholder="Instagram URL (optional)"
                />
                <input
                  value={templateSocialWebsite}
                  onChange={(e) => setTemplateSocialWebsite(e.target.value)}
                  placeholder="Website URL (optional)"
                />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowOffer}
                    onChange={(e) => setTemplateShowOffer(e.target.checked)}
                  />
                  Offer block
                </label>
                <input
                  value={templateOfferTitle}
                  onChange={(e) => setTemplateOfferTitle(e.target.value)}
                  placeholder="Offer title"
                />
                <input
                  value={templateOfferText}
                  onChange={(e) => setTemplateOfferText(e.target.value)}
                  placeholder="Offer text"
                />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowFeatureCards}
                    onChange={(e) => setTemplateShowFeatureCards(e.target.checked)}
                  />
                  Feature cards
                </label>
                <input
                  value={templateFeature1Title}
                  onChange={(e) => setTemplateFeature1Title(e.target.value)}
                  placeholder="Feature 1 title"
                />
                <input
                  value={templateFeature1Text}
                  onChange={(e) => setTemplateFeature1Text(e.target.value)}
                  placeholder="Feature 1 text"
                />
                <input
                  value={templateFeature2Title}
                  onChange={(e) => setTemplateFeature2Title(e.target.value)}
                  placeholder="Feature 2 title"
                />
                <input
                  value={templateFeature2Text}
                  onChange={(e) => setTemplateFeature2Text(e.target.value)}
                  placeholder="Feature 2 text"
                />
                <input
                  value={templateFeature3Title}
                  onChange={(e) => setTemplateFeature3Title(e.target.value)}
                  placeholder="Feature 3 title"
                />
                <input
                  value={templateFeature3Text}
                  onChange={(e) => setTemplateFeature3Text(e.target.value)}
                  placeholder="Feature 3 text"
                />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowStats}
                    onChange={(e) => setTemplateShowStats(e.target.checked)}
                  />
                  Stats strip
                </label>
                <input value={templateStat1Label} onChange={(e) => setTemplateStat1Label(e.target.value)} placeholder="Stat 1 label" />
                <input value={templateStat1Value} onChange={(e) => setTemplateStat1Value(e.target.value)} placeholder="Stat 1 value" />
                <input value={templateStat2Label} onChange={(e) => setTemplateStat2Label(e.target.value)} placeholder="Stat 2 label" />
                <input value={templateStat2Value} onChange={(e) => setTemplateStat2Value(e.target.value)} placeholder="Stat 2 value" />
                <input value={templateStat3Label} onChange={(e) => setTemplateStat3Label(e.target.value)} placeholder="Stat 3 label" />
                <input value={templateStat3Value} onChange={(e) => setTemplateStat3Value(e.target.value)} placeholder="Stat 3 value" />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowTestimonial}
                    onChange={(e) => setTemplateShowTestimonial(e.target.checked)}
                  />
                  Testimonial block
                </label>
                <input
                  value={templateTestimonialQuote}
                  onChange={(e) => setTemplateTestimonialQuote(e.target.value)}
                  placeholder="Testimonial quote"
                />
                <input
                  value={templateTestimonialAuthor}
                  onChange={(e) => setTemplateTestimonialAuthor(e.target.value)}
                  placeholder="Testimonial author"
                />
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  <input
                    type="checkbox"
                    checked={templateShowFaq}
                    onChange={(e) => setTemplateShowFaq(e.target.checked)}
                  />
                  FAQ block
                </label>
                <input
                  value={templateFaqQuestion}
                  onChange={(e) => setTemplateFaqQuestion(e.target.value)}
                  placeholder="FAQ question"
                />
                <input
                  value={templateFaqAnswer}
                  onChange={(e) => setTemplateFaqAnswer(e.target.value)}
                  placeholder="FAQ answer"
                />
                <input
                  value={templateSecondaryCtaLabel}
                  onChange={(e) => setTemplateSecondaryCtaLabel(e.target.value)}
                  placeholder="Secondary CTA label"
                />
                <input
                  value={templateSecondaryCtaUrl}
                  onChange={(e) => setTemplateSecondaryCtaUrl(e.target.value)}
                  placeholder="Secondary CTA URL"
                />
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>Blocks Library</strong>
                  <span className={styles.meta}>drag to reorder</span>
                </div>
                <div className={styles.templateList}>
                  {templateBlockOrder.map((blockKey) => {
                    const block = TEMPLATE_BLOCKS.find((item) => item.key === blockKey);
                    if (!block) {
                      return null;
                    }
                    return (
                      <button
                        key={block.key}
                        type="button"
                        draggable
                        className={styles.threadItem}
                        onDragStart={() => setDraggingBlock(block.key)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => handleBlockDrop(block.key)}
                      >
                        {block.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className={styles.templateGrid}>
                <label className={styles.toolLabel}>
                  Accent
                  <input type="color" value={templateAccentColor} onChange={(e) => setTemplateAccentColor(e.target.value)} />
                </label>
                <label className={styles.toolLabel}>
                  Background
                  <input
                    type="color"
                    value={templateBackgroundColor}
                    onChange={(e) => setTemplateBackgroundColor(e.target.value)}
                  />
                </label>
                <label className={styles.toolLabel}>
                  Text
                  <input type="color" value={templateTextColor} onChange={(e) => setTemplateTextColor(e.target.value)} />
                </label>
              </div>
              <button type="button" className={styles.primaryBtn} onClick={handleSaveTemplate}>
                <Save size={14} /> Save Template
              </button>

              <div className={styles.templatePreview}>
                <div className={styles.inlineActions}>
                  <label className={styles.toolLabel}>
                    Preview
                    <select value={templatePreviewDevice} onChange={(e) => setTemplatePreviewDevice(e.target.value as TemplatePreviewDevice)}>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
                    </select>
                  </label>
                  <label className={styles.toolLabel}>
                    Theme
                    <select value={templatePreviewTheme} onChange={(e) => setTemplatePreviewTheme(e.target.value as TemplatePreviewTheme)}>
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </label>
                  <input
                    value={templateTestRecipient}
                    onChange={(e) => setTemplateTestRecipient(e.target.value)}
                    placeholder="send test to email"
                  />
                  <button type="button" className={styles.ghostBtn} onClick={() => void handleSendTemplateTest()} disabled={isSendingTemplateTest}>
                    <Send size={14} /> {isSendingTemplateTest ? "Sending..." : "Send Test"}
                  </button>
                </div>
                <div
                  className={styles.templatePreviewInner}
                  style={{
                    width: templatePreviewDevice === "mobile" ? "390px" : "100%",
                    margin: "0 auto",
                    background: templatePreviewTheme === "light" ? "#f5f5f5" : "rgba(255,255,255,0.01)",
                    padding: "0.5rem",
                    borderRadius: "10px",
                  }}
                  dangerouslySetInnerHTML={{ __html: templatePreviewHtml }}
                />
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>Revision History</strong>
                  <span className={styles.meta}>{templateRevisions?.length ?? 0} revisions</span>
                </div>
                {!templateDraftId ? (
                  <p className={styles.empty}>Load a saved template to view and restore revisions.</p>
                ) : (templateRevisions ?? []).length === 0 ? (
                  <p className={styles.empty}>No revisions yet.</p>
                ) : (
                  <div className={styles.templateList}>
                    {(templateRevisions ?? []).map((revision) => (
                      <div key={revision._id} className={styles.templateItem}>
                        <div>
                          <strong>{revision.name}</strong>
                          <p className={styles.sub}>{formatTimestamp(revision.createdAt)}</p>
                        </div>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          onClick={() =>
                            void restoreTemplateRevision({
                              templateId: templateDraftId,
                              revisionId: revision._id,
                            })
                          }
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>Template Performance</strong>
                </div>
                {(templatePerformance ?? []).length === 0 ? (
                  <p className={styles.empty}>No performance data yet for this template.</p>
                ) : (
                  <div className={styles.templateList}>
                    {(templatePerformance ?? []).map((row) => (
                      <div key={`${row.templateKey}-${row.blockSignature}`} className={styles.templateItem}>
                        <div>
                          <strong>{row.templateKey}</strong>
                          <p className={styles.sub}>blocks: {row.blockSignature}</p>
                        </div>
                        <p className={styles.sub}>
                          sent {row.sent} · open {row.opened} · click {row.clicked} · reply {row.replied} · fail {row.failed}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>Asset Governance</strong>
                </div>
                {templateAssets.length === 0 ? (
                  <p className={styles.empty}>No assets found in /public/assets.</p>
                ) : (
                  <div className={styles.templateList}>
                    {templateAssets.map((assetPath) => {
                      const row = (assetGovernance ?? []).find((item) => item.assetPath === assetPath);
                      return (
                        <div key={assetPath} className={styles.templateItem}>
                          <div>
                            <strong>{assetPath}</strong>
                            <p className={styles.sub}>used by templates: {row?.usedByTemplates ?? 0}</p>
                          </div>
                          <div className={styles.inlineActions}>
                            <input
                              value={assetTagsDraft[assetPath] ?? row?.tags.join(", ") ?? ""}
                              onChange={(e) => setAssetTagsDraft((prev) => ({ ...prev, [assetPath]: e.target.value }))}
                              placeholder="tags: logo, hero, promo"
                            />
                            <button type="button" className={styles.ghostBtn} onClick={() => void handleSaveAssetTags(assetPath)}>
                              Save Tags
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={styles.templateList}>
                {(templates ?? []).map((template) => (
                  <div key={template._id} className={styles.templateItem}>
                    <button type="button" className={styles.templateBtn} onClick={() => loadTemplateDraft(template)}>
                      <strong>{template.name}</strong>
                      <span className={styles.sub}>
                        {template.category} · {template.active ? "active" : "inactive"}
                      </span>
                    </button>
                    <button type="button" className={styles.deleteBtn} onClick={() => void deleteTemplate({ id: template._id })}>
                      delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activePane === "campaigns" ? (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <strong>Campaign Lab</strong>
                <button type="button" className={styles.ghostBtn} onClick={() => setShowCampaignLab((v) => !v)}>
                  <Megaphone size={14} /> {showCampaignLab ? "Hide" : "Show"}
                </button>
              </div>
              {showCampaignLab ? (
                <div className={styles.campaignLayout}>
                  <article className={styles.card}>
                    <div className={styles.cardHeader}>
                      <strong>Campaign Composer</strong>
                      <button
                        type="button"
                        className={styles.ghostBtn}
                        onClick={() => void handleDispatchDueCampaigns()}
                        disabled={isDispatchingDueCampaigns}
                      >
                        {isDispatchingDueCampaigns ? "Dispatching..." : "Dispatch Due"}
                      </button>
                    </div>
                    <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Campaign name" />
                    <select
                      value={campaignWorkflowStatus}
                      onChange={(e) => setCampaignWorkflowStatus(e.target.value as "draft" | "review" | "scheduled")}
                    >
                      <option value="draft">Workflow: Draft</option>
                      <option value="review">Workflow: Review</option>
                      <option value="scheduled">Workflow: Scheduled</option>
                    </select>
                    {campaignWorkflowStatus === "scheduled" ? (
                      <input
                        type="datetime-local"
                        value={campaignScheduledAt}
                        onChange={(e) => setCampaignScheduledAt(e.target.value)}
                      />
                    ) : null}
                    <select
                      value={campaignStageFilter}
                      onChange={(e) => setCampaignStageFilter(e.target.value as (typeof CAMPAIGN_STAGES)[number])}
                    >
                      {CAMPAIGN_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          Stage: {stage}
                        </option>
                      ))}
                    </select>
                    <input
                      value={campaignSubject}
                      onChange={(e) => setCampaignSubject(e.target.value)}
                      placeholder="Subject (supports {{firstName}}, {{projectType}}, {{company}})"
                    />
                    <textarea
                      value={campaignBody}
                      onChange={(e) => setCampaignBody(e.target.value)}
                      rows={6}
                      placeholder="Campaign body..."
                    />
                    <button type="button" className={styles.primaryBtn} onClick={handleCreateCampaign}>
                      <Save size={14} /> Save Campaign Draft
                    </button>
                  </article>

                  <article className={styles.card}>
                    <div className={styles.cardHeader}>
                      <strong>Campaign Queue</strong>
                    </div>
                    {(campaigns ?? []).length === 0 ? (
                      <p className={styles.empty}>No campaigns yet.</p>
                    ) : (
                      <div className={styles.campaignList}>
                        {(campaigns ?? []).map((campaign) => (
                          <div key={campaign._id} className={styles.campaignItem}>
                            <div>
                              <strong>{campaign.name}</strong>
                              <p className={styles.sub}>
                                {campaign.status} · recipients: {campaign.recipients} · sent: {campaign.sent} · failed: {campaign.failed}
                              </p>
                              {campaign.scheduledAt ? (
                                <p className={styles.sub}>scheduled: {formatTimestamp(campaign.scheduledAt)}</p>
                              ) : null}
                            </div>
                            <div className={styles.inlineActions}>
                              <button
                                type="button"
                                className={styles.ghostBtn}
                                onClick={() => void handleUpdateCampaignWorkflow(campaign._id, "draft")}
                              >
                                Draft
                              </button>
                              <button
                                type="button"
                                className={styles.ghostBtn}
                                onClick={() => void handleUpdateCampaignWorkflow(campaign._id, "review")}
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                className={styles.ghostBtn}
                                onClick={() =>
                                  void handleUpdateCampaignWorkflow(
                                    campaign._id,
                                    "scheduled",
                                    Date.now() + 60 * 60 * 1000,
                                  )
                                }
                              >
                                +1h
                              </button>
                              <button
                                type="button"
                                className={styles.primaryBtn}
                                onClick={() => void handleSendCampaign(campaign._id)}
                                disabled={isCampaignSending === campaign._id || campaign.status === "sending"}
                              >
                                <Send size={14} />
                                {isCampaignSending === campaign._id ? "Sending..." : "Send Now"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                </div>
              ) : (
                <p className={styles.empty}>Campaign tools are available here when needed.</p>
              )}
            </div>
          ) : null}

          {activePane === "events" ? (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <strong>Thread Events</strong>
                <span className={styles.meta}>{threadEvents.length} records</span>
              </div>
              {threadEvents.length === 0 ? (
                <p className={styles.empty}>No provider events yet for this thread.</p>
              ) : (
                <div className={styles.eventList}>
                  {threadEvents.map((event) => (
                    <div key={event._id} className={styles.eventItem}>
                      <div className={styles.messageTop}>
                        <strong>{event.eventType}</strong>
                        <span className={styles.meta}>{formatTimestamp(event.createdAt)}</span>
                      </div>
                      <span className={styles.sub}>
                        {event.provider}
                        {event.status ? ` · ${event.status}` : ""}
                        {event.to ? ` · to: ${event.to}` : ""}
                      </span>
                      {event.subject ? <span className={styles.sub}>{event.subject}</span> : null}
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <strong>Webhook Setup</strong>
                </div>
                <span className={styles.sub}>
                  Endpoint: <code>/webhooks/resend</code>
                </span>
                <span className={styles.sub}>
                  Secret source: <code>RESEND_WEBHOOK_SECRET</code> env or Settings → System & API.
                </span>
                <span className={styles.sub}>
                  Sender fallback:{" "}
                  {settings?.emailConfig?.senderEmail
                    ? `${settings.emailConfig.senderName || "Portfolio OS"} <${settings.emailConfig.senderEmail}>`
                    : "EMAIL_FROM env or default notifications@lrdene.dev"}
                </span>
              </div>
            </div>
          ) : null}
        </section>
      </div>

      <input
        ref={uploadInputRef}
        type="file"
        className={styles.hiddenInput}
        onChange={handleUploadAttachment}
      />
      <input
        ref={templateLogoUploadInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(event) => void handleTemplateAssetUpload(event, "logo")}
      />
      <input
        ref={templateHeroUploadInputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(event) => void handleTemplateAssetUpload(event, "hero")}
      />

      <section className={styles.composerDock}>
          <div className={styles.cardHeader}>
            <strong>Email Composer</strong>
            <div className={styles.inlineActions}>
              <button
                type="button"
                className={`${styles.ghostBtn} ${styles.mobileOnly}`}
                onClick={() => setMobileComposerOpen((value) => !value)}
              >
                {mobileComposerOpen ? "Hide Composer" : "Open Composer"}
              </button>
              <select
                value={selectedTemplateId ?? ""}
                onChange={(e) => setSelectedTemplateId((e.target.value || null) as Id<"emailTemplates"> | null)}
              >
                <option value="">Templates</option>
                {(templates ?? []).map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button type="button" className={styles.ghostBtn} onClick={applyTemplateToComposer}>
                Apply
              </button>
            </div>
          </div>
          <div className={`${styles.composerBody} ${!mobileComposerOpen ? styles.composerBodyCollapsed : ""}`}>
          <div className={styles.composerTools}>
            <button type="button" className={styles.ghostBtn} onClick={() => uploadInputRef.current?.click()}>
              <Upload size={14} /> Upload
            </button>
            <button type="button" className={styles.ghostBtn} onClick={handleDownloadDraft}>
              <Download size={14} /> Download
            </button>
            <label className={styles.toolLabel}>
              <Paintbrush size={13} />
              <select value={composerFontFamily} onChange={(e) => setComposerFontFamily(e.target.value)}>
                <option value="Inter, system-ui, sans-serif">Inter</option>
                <option value="'Times New Roman', serif">Times</option>
                <option value="'Georgia', serif">Georgia</option>
                <option value="'Courier New', monospace">Courier</option>
              </select>
            </label>
            <label className={styles.toolLabel}>
              Color
              <input
                type="color"
                value={composerFontColor}
                onChange={(e) => setComposerFontColor(e.target.value)}
              />
            </label>
          </div>
          <input value={composerTo} onChange={(e) => setComposerTo(e.target.value)} placeholder="Recipient" />
          <input value={composerSubject} onChange={(e) => setComposerSubject(e.target.value)} placeholder="Subject" />
          <textarea
            value={composerBody}
            onChange={(e) => {
              setComposerBody(e.target.value);
              setComposerHtml("");
              setComposerTemplateBlockSignature("");
            }}
            rows={8}
            placeholder="Write your email..."
            style={{ fontFamily: composerFontFamily, color: composerFontColor }}
          />
          <button type="button" className={styles.primaryBtn} onClick={handleSend} disabled={isSending}>
            <Send size={14} />
            {isSending ? "Sending..." : "Send Email"}
          </button>
          </div>
      </section>
    </div>
  );
}
