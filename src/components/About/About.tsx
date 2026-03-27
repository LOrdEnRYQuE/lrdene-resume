"use client";

import React, { useState } from "react";
import styles from "./About.module.css";
import { 
  Code2, 
  Palette, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Users, 
  FileDown,
  Layers,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useLocale } from "@/lib/i18n/useLocale";

const IconMap: Record<string, any> = {
  Cpu: <Cpu size={22} />,
  Palette: <Palette size={22} />,
  Layers: <Layers size={22} />,
  Code2: <Code2 size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
  Target: <Target size={28} />,
  Zap: <Zap size={28} />,
  Users: <Users size={28} />,
  Sparkles: <Sparkles size={14} />
};

const ABOUT_DE_TEXT_MAP: Record<string, string> = {
  "Professional Evolution": "Professionelle Entwicklung",
  "Scaling Logic with Taste.": "Logik mit Anspruch skalieren.",
  "Projects Built": "Projekte",
  "Years Active": "Jahre Aktiv",
  Delivered: "Lieferquote",
  "IT Foundations & Web Development": "IT Grundlagen & Webentwicklung",
  "Graphic Design & Digital Production": "Design & digitale Produktion",
  "AI Engineering & Modern Development": "KI Engineering & moderne Entwicklung",
  "Web Development": "Webentwicklung",
  "AI Engineering": "KI Engineering",
  "Conversion Focused": "Conversion Fokus",
  "Data Integrity": "Datenintegrität",
  "Scaling Ready": "Skalierbar",
  "Human Centric": "Menschzentriert",
};

function localizeAboutText(value: unknown, locale: "en" | "de") {
  if (typeof value !== "string") return value;
  if (locale !== "de") return value;
  return ABOUT_DE_TEXT_MAP[value] ?? value;
}

function localizeAboutData(raw: any, locale: "en" | "de") {
  if (!raw || locale !== "de") return raw;

  const hero = raw.hero
    ? {
        ...raw.hero,
        tagline: localizeAboutText(raw.hero.tagline, locale),
        title: localizeAboutText(raw.hero.title, locale),
        description: localizeAboutText(raw.hero.description, locale),
        stats: Array.isArray(raw.hero.stats)
          ? raw.hero.stats.map((s: any) => ({
              ...s,
              label: localizeAboutText(s?.label, locale),
              value: localizeAboutText(s?.value, locale),
            }))
          : raw.hero.stats,
      }
    : raw.hero;

  const evolution = Array.isArray(raw.evolution)
    ? raw.evolution.map((stage: any) => ({
        ...stage,
        period: localizeAboutText(stage?.period, locale),
        title: localizeAboutText(stage?.title, locale),
        desc: localizeAboutText(stage?.desc, locale),
        quote: localizeAboutText(stage?.quote, locale),
        tech: Array.isArray(stage?.tech)
          ? stage.tech.map((t: unknown) => localizeAboutText(t, locale))
          : stage.tech,
        activities: Array.isArray(stage?.activities)
          ? stage.activities.map((a: unknown) => localizeAboutText(a, locale))
          : stage.activities,
      }))
    : raw.evolution;

  const skills = Array.isArray(raw.skills)
    ? raw.skills.map((s: any) => ({
        ...s,
        title: localizeAboutText(s?.title, locale),
        skills: localizeAboutText(s?.skills, locale),
      }))
    : raw.skills;

  const values = Array.isArray(raw.values)
    ? raw.values.map((v: any) => ({
        ...v,
        title: localizeAboutText(v?.title, locale),
        desc: localizeAboutText(v?.desc, locale),
      }))
    : raw.values;

  const profileOffice = raw.profileOffice
    ? {
        whatIDo: Array.isArray(raw.profileOffice.whatIDo)
          ? raw.profileOffice.whatIDo.map((item: unknown) => localizeAboutText(item, locale))
          : raw.profileOffice.whatIDo,
        whatIOffer: Array.isArray(raw.profileOffice.whatIOffer)
          ? raw.profileOffice.whatIOffer.map((item: unknown) => localizeAboutText(item, locale))
          : raw.profileOffice.whatIOffer,
        skills: Array.isArray(raw.profileOffice.skills)
          ? raw.profileOffice.skills.map((item: any) => ({
              ...item,
              name: localizeAboutText(item?.name, locale),
              summary: localizeAboutText(item?.summary, locale),
              level: localizeAboutText(item?.level, locale),
            }))
          : raw.profileOffice.skills,
      }
    : raw.profileOffice;

  return {
    ...raw,
    hero,
    evolution,
    skills,
    values,
    profileOffice,
  };
}

const TIMELINE_PRESETS = {
  en: [
    {
      period: "2010 — 2017",
      title: "IT Foundations & Web Development",
      desc: "Built websites from scratch, configured servers, and handled real client deployments across early CMS ecosystems.",
      tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
      activities: [
        "Building and maintaining websites",
        "Server setup and hosting operations",
        "CMS customization and plugin integration",
        "Database setup and content architecture",
      ],
      quote: "This chapter created a strong technical baseline for reliable delivery.",
      impact: ["First client projects", "Infrastructure discipline", "Backend fundamentals"],
      icon: "Cpu",
      color: "rgba(180, 200, 229, 0.15)",
    },
    {
      period: "2017 — 2023",
      title: "Design, Branding & Product Experience",
      desc: "Expanded into visual identity, UX systems, and brand communication to connect product quality with conversion.",
      tech: ["Branding", "UI/UX", "Visual Design", "Digital Production"],
      activities: [
        "Brand identity and logo systems",
        "High-conversion landing and interface design",
        "Creative assets for digital channels",
        "Design consistency across product surfaces",
      ],
      quote: "Design and engineering together turned projects into polished products.",
      impact: ["Premium visual direction", "Higher trust perception", "Stronger product positioning"],
      icon: "Palette",
      color: "rgba(229, 228, 226, 0.12)",
    },
    {
      period: "2023 — Present",
      title: "AI Engineering & Modern Product Delivery",
      desc: "Focused on Next.js, TypeScript, and AI-powered systems to build scalable products with measurable business outcomes.",
      tech: ["TypeScript", "Next.js", "Node.js", "AI APIs", "Automation"],
      activities: [
        "AI workflow integration in business products",
        "Full-stack SaaS and admin platforms",
        "Performance-focused architecture and release cycles",
        "Data-driven iteration and conversion improvements",
      ],
      quote: "The mission now is speed, quality, and business impact at the same time.",
      impact: ["Faster delivery", "Operational automation", "Client-ready MVP systems"],
      icon: "Layers",
      color: "rgba(229, 228, 226, 0.1)",
    },
  ],
  de: [
    {
      period: "2010 — 2017",
      title: "IT Grundlagen & Webentwicklung",
      desc: "Websites von Grund auf aufgebaut, Server konfiguriert und reale Kundenprojekte in produktiven Umgebungen umgesetzt.",
      tech: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
      activities: [
        "Websites entwickeln und betreiben",
        "Server Setup und Hosting Betrieb",
        "CMS Anpassungen und Plugin-Integrationen",
        "Datenbanken und Content-Strukturen aufbauen",
      ],
      quote: "Dieses Kapitel hat das technische Fundament für zuverlässige Delivery geschaffen.",
      impact: ["Erste Kundenprojekte", "Infrastruktur-Disziplin", "Backend-Basis"],
      icon: "Cpu",
      color: "rgba(180, 200, 229, 0.15)",
    },
    {
      period: "2017 — 2023",
      title: "Design, Branding & Produkterlebnis",
      desc: "Fokus auf visuelle Identität, UX-Systeme und Markenwirkung, um Produktqualität direkt mit Conversion zu verbinden.",
      tech: ["Branding", "UI/UX", "Visual Design", "Digitale Produktion"],
      activities: [
        "Brand Identity und Logo-Systeme",
        "Conversion-starke Landingpages und Interfaces",
        "Kreative Assets für digitale Kanäle",
        "Konsistentes Design über alle Produktflächen",
      ],
      quote: "Design und Engineering zusammen machen aus Projekten echte Produkte.",
      impact: ["Premium Look & Feel", "Mehr Vertrauen", "Stärkere Positionierung"],
      icon: "Palette",
      color: "rgba(229, 228, 226, 0.12)",
    },
    {
      period: "2023 — Heute",
      title: "KI Engineering & moderne Produktentwicklung",
      desc: "Mit Next.js, TypeScript und KI-gestützten Systemen entstehen skalierbare Produkte mit messbarem Business-Impact.",
      tech: ["TypeScript", "Next.js", "Node.js", "AI APIs", "Automation"],
      activities: [
        "KI-Workflows in Business-Produkte integrieren",
        "Full-Stack SaaS und Admin-Plattformen aufbauen",
        "Performance-fokussierte Architektur und Releases",
        "Datengetriebene Iteration für bessere Conversion",
      ],
      quote: "Das Ziel ist heute: Geschwindigkeit, Qualität und Business-Wirkung gleichzeitig.",
      impact: ["Schnellere Delivery", "Mehr Automatisierung", "Client-ready MVP Systeme"],
      icon: "Layers",
      color: "rgba(229, 228, 226, 0.1)",
    },
  ],
} as const;

function enrichEvolution(evolution: any[], locale: "en" | "de") {
  const presets = TIMELINE_PRESETS[locale];
  const source = Array.isArray(evolution) ? evolution : [];
  const enriched = presets.map((preset, index) => {
    const candidate = source[index];
    if (!candidate) return preset;

    const descTooShort = typeof candidate.desc !== "string" || candidate.desc.trim().length < 45;
    const activitiesTooShort = !Array.isArray(candidate.activities) || candidate.activities.length < 3;
    const techTooShort = !Array.isArray(candidate.tech) || candidate.tech.length < 3;
    const quoteTooShort = typeof candidate.quote !== "string" || candidate.quote.trim().length < 30;

    return {
      ...preset,
      ...candidate,
      desc: descTooShort ? preset.desc : candidate.desc,
      activities: activitiesTooShort ? preset.activities : candidate.activities,
      tech: techTooShort ? preset.tech : candidate.tech,
      quote: quoteTooShort ? preset.quote : candidate.quote,
      impact: Array.isArray(candidate.impact) && candidate.impact.length > 0 ? candidate.impact : preset.impact,
    };
  });

  return enriched;
}

export const About = () => {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const locale = useLocale();
  const content = useQuery(api.pages.getPageContent, { key: "about", locale, fallbackToEnglish: false });
  const copy =
    locale === "de"
      ? {
          loading: "Professionelle Engine wird geladen...",
          yearsExp: "Jahre Erfahrung",
          available: "Verfügbar für Projekte",
          cv: "CV Herunterladen",
          contact: "Kontakt",
          chapters: "Karriere Kapitel",
          journey: "Der Weg",
          philosophyTitle: "Engineering Philosophie",
          philosophyQuote:
            "Technologie sollte einem klaren Zweck dienen: verlässliche, skalierbare Produkte für reale Probleme.",
          philosophyDesc:
            "Meine Arbeit verbindet Software Engineering, Design Thinking und KI, um Systeme zu bauen, die funktional und intuitiv sind.",
          signature: "— Attila Lazar",
          skillStack: "Skill Stack",
          triangle: "Power Dreieck",
          triangleDesc:
            "IT Infrastruktur → Web Engineering → Design → KI Systeme → QR/NFC Solutions. Dieser Stack ermöglicht komplette Produkte von Idee bis Deployment inklusive editierbarer QR-Erlebnisse.",
          trianglePillars: [
            {
              title: "IT & Infrastruktur",
              desc: "Stabile Foundation für Hosting, Sicherheit, Performance und Betriebsstabilität.",
            },
            {
              title: "Web Engineering",
              desc: "Skalierbare Frontend/Backend-Architektur mit klarem Fokus auf Delivery und Wartbarkeit.",
            },
            {
              title: "Design & KI",
              desc: "Visuelle Qualität plus intelligente Workflows, die Nutzererlebnis und Conversion steigern.",
            },
            {
              title: "QR & Digital Card Layer",
              desc: "Virtuelle digitale Business Card fürs Smartphone, verknüpft über einen QR-Code, dessen Inhalte jederzeit ohne Neudruck aktualisiert werden können.",
            },
            {
              title: "Automation & Integrationen",
              desc: "Anbindung von CRM, Form- und Messaging-Flows, damit Lead-Prozesse ohne manuelle Reibung laufen.",
            },
            {
              title: "Analytics & Conversion Tracking",
              desc: "Events, Funnel-Metriken und QR-Scans sauber erfassen, um Entscheidungen datenbasiert zu steuern.",
            },
            {
              title: "Operations & Delivery",
              desc: "Strukturierte Releases, Monitoring und Wartung, damit Produkte im Alltag stabil und ausbaubar bleiben.",
            },
          ],
          triangleOutcomes: [
            "Schnellere Go-Live-Zeiten",
            "Höhere Produktqualität",
            "Messbare Business-Ergebnisse",
            "Einmal QR drucken, Inhalte jederzeit live ändern",
          ],
          triangleFlowTitle: "Wie der Triangle in Projekten wirkt",
          triangleFlow: [
            {
              step: "Diagnose",
              desc: "Business-Ziele, Engpässe und Conversion-Pfade werden zuerst klar definiert.",
            },
            {
              step: "System Design",
              desc: "Architektur, UX und Delivery-Roadmap werden zu einem umsetzbaren Plan zusammengeführt.",
            },
            {
              step: "Execution",
              desc: "Iterative Umsetzung mit Fokus auf Stabilität, Geschwindigkeit und Wachstum.",
            },
            {
              step: "QR Lifecycle",
              desc: "Ein statischer Print-QR verweist auf dynamische Ziele: Links, Angebote, Kontaktdaten und Inhalte bleiben jederzeit editierbar.",
            },
          ],
          engagementTitle: "Zusammenarbeits-Modelle",
          engagementModes: [
            "Projektbasiert (klarer Scope + Milestones)",
            "Retainer (kontinuierliche Produktentwicklung)",
            "Advisory (Architektur & technische Entscheidungen)",
          ],
          guaranteesTitle: "Mein Delivery-Standard",
          guarantees: [
            "Transparente Kommunikation und klare Prioritäten",
            "Dokumentierte Architekturentscheidungen",
            "Performance- und Qualitätsfokus in jedem Sprint",
          ],
          proofTitle: "Nachweisbare Ergebnisse",
          proofMetrics: [
            { label: "Gelieferte Projekte", value: "50+" },
            { label: "Durchschnittlicher Launch-Zyklus", value: "4-8 Wochen" },
            { label: "Wiederkehrende Kunden", value: "70%+" },
            { label: "Fokus auf messbare KPIs", value: "100%" },
            { label: "Discovery bis Go-Live", value: "2-4 Sprints" },
            { label: "Technische Dokumentation", value: "Jede Phase" },
            { label: "Release-Rhythmus", value: "Wöchentlich" },
            { label: "Post-Launch Support", value: "Optional Retainer" },
          ],
          principles: "Kernprinzipien",
          excellence: "Engineered for Excellence",
          ctaEyebrow: "Bereit, etwas Großes zu bauen?",
          ctaTitle: "Lass uns deine Vision entwickeln.",
          ctaDesc:
            "Von KI-Plattformen bis zu ausgereiften SaaS-Produkten — ich bringe den kompletten Stack mit.",
          startProject: "Projekt Starten",
          viewServices: "Leistungen Ansehen",
          profileEyebrow: "Mein Profil",
          profileTitle: "Womit ich Kunden unterstütze",
          whatIDo: "Was ich mache",
          whatIOffer: "Was ich anbiete",
          coreSkills: "Kernkompetenzen",
          executionPlaybookTitle: "Execution Playbook",
          executionPlaybook: [
            "Discovery Workshop: Ziele, Constraints, KPIs und Verantwortlichkeiten klären.",
            "Technisches Blueprinting: Architektur, Datenmodell und API-Schnittstellen definieren.",
            "Sprint Delivery: Iterative Releases mit klaren Milestones und transparentem Scope.",
            "QA + Stabilität: Performance, Edge Cases und Übergabequalität systematisch absichern.",
            "Go-Live + Iteration: Nach Launch messen, priorisieren und gezielt optimieren.",
          ],
          projectFitTitle: "Typische Projektformate",
          projectFit: [
            "KI-gestützte SaaS-Produkte mit Admin-Dashboard und Workflows",
            "Service-Plattformen mit Lead-Erfassung und Conversion-Fokus",
            "QR/NFC-Produkte für Marketing, Sales und digitale Profile",
            "Migration/Modernisierung bestehender Systeme auf moderne Stacks",
            "MVPs mit schnellem Marktstart und sauberer Skalierungsbasis",
          ],
          collaborationDefaultsTitle: "Zusammenarbeit im Alltag",
          collaborationDefaults: [
            "Wöchentliche Status-Updates mit klaren nächsten Schritten",
            "Entscheidungsprotokolle für Architektur und Priorisierung",
            "Risiko-Transparenz statt späte Überraschungen im Projekt",
            "Messbare Akzeptanzkriterien pro Delivery-Phase",
            "Klare Verantwortlichkeiten auf Business- und Tech-Seite",
          ],
        }
      : {
          loading: "Loading Professional Engine...",
          yearsExp: "Years Exp",
          available: "Available for Projects",
          cv: "Download CV",
          contact: "Get in Touch",
          chapters: "Career Chapters",
          journey: "The Journey",
          philosophyTitle: "Engineering Philosophy",
          philosophyQuote:
            "Technology should serve a clear purpose: building reliable, scalable digital products that solve real problems.",
          philosophyDesc:
            "My work combines software engineering, design thinking, and artificial intelligence to create systems that are not only functional but also intuitive and efficient.",
          signature: "— Attila Lazar",
          skillStack: "Skill Stack",
          triangle: "The Power Triangle",
          triangleDesc:
            "IT infrastructure → Web engineering → Design → AI systems → QR/NFC solutions. This stack enables complete digital products, including editable QR experiences from concept to live operations.",
          trianglePillars: [
            {
              title: "IT & Infrastructure",
              desc: "Solid foundations for hosting, security, performance, and operational reliability.",
            },
            {
              title: "Web Engineering",
              desc: "Scalable frontend/backend architecture focused on delivery speed and maintainability.",
            },
            {
              title: "Design & AI",
              desc: "Visual quality combined with intelligent workflows to improve UX and conversion.",
            },
            {
              title: "QR & Digital Card Layer",
              desc: "Virtual digital business cards for smartphones, connected through one printed QR code that can be updated anytime without reprinting.",
            },
            {
              title: "Automation & Integrations",
              desc: "Connect CRM, forms, and messaging flows so lead operations run with minimal manual friction.",
            },
            {
              title: "Analytics & Conversion Tracking",
              desc: "Track events, funnels, and QR scans with clarity to drive product decisions from real data.",
            },
            {
              title: "Operations & Delivery",
              desc: "Structured releases, monitoring, and maintenance so products stay stable and scalable in daily use.",
            },
          ],
          triangleOutcomes: [
            "Faster time to launch",
            "Higher product quality",
            "Measurable business outcomes",
            "Print once, update QR destinations anytime",
          ],
          triangleFlowTitle: "How the triangle works in projects",
          triangleFlow: [
            {
              step: "Diagnosis",
              desc: "Business goals, bottlenecks, and conversion paths are defined first.",
            },
            {
              step: "System Design",
              desc: "Architecture, UX, and delivery roadmap are merged into one executable plan.",
            },
            {
              step: "Execution",
              desc: "Iterative implementation focused on stability, speed, and growth.",
            },
            {
              step: "QR Lifecycle",
              desc: "One printed QR points to dynamic destinations, so links, offers, and profile data stay editable without new print runs.",
            },
          ],
          engagementTitle: "Engagement Models",
          engagementModes: [
            "Project-based (clear scope + milestones)",
            "Retainer (continuous product development)",
            "Advisory (architecture and technical decisions)",
          ],
          guaranteesTitle: "My Delivery Standard",
          guarantees: [
            "Transparent communication and clear priorities",
            "Documented architecture decisions",
            "Performance and quality focus in every sprint",
          ],
          proofTitle: "Proof Signals",
          proofMetrics: [
            { label: "Projects delivered", value: "50+" },
            { label: "Average launch cycle", value: "4-8 weeks" },
            { label: "Repeat client ratio", value: "70%+" },
            { label: "Focus on measurable KPIs", value: "100%" },
            { label: "Discovery to go-live", value: "2-4 sprints" },
            { label: "Technical documentation", value: "Every phase" },
            { label: "Release cadence", value: "Weekly" },
            { label: "Post-launch support", value: "Optional retainer" },
          ],
          principles: "Core Principles",
          excellence: "Engineered for Excellence",
          ctaEyebrow: "Ready to build something great?",
          ctaTitle: "Let's engineer your vision.",
          ctaDesc:
            "From AI-powered platforms to polished SaaS products — I bring the full stack to the table.",
          startProject: "Start a Project",
          viewServices: "View Services",
          profileEyebrow: "My Profile",
          profileTitle: "How I support clients",
          whatIDo: "What I Do",
          whatIOffer: "What I Offer",
          coreSkills: "Core Skills",
          executionPlaybookTitle: "Execution Playbook",
          executionPlaybook: [
            "Discovery workshop to align goals, constraints, KPIs, and ownership.",
            "Technical blueprinting for architecture, data model, and API contracts.",
            "Sprint-based delivery with iterative releases and clear milestones.",
            "QA and reliability checks focused on performance and edge cases.",
            "Go-live and iteration cycles driven by real usage and outcome data.",
          ],
          projectFitTitle: "Typical Project Formats",
          projectFit: [
            "AI-enabled SaaS products with admin dashboards and business workflows",
            "Service platforms with lead capture and conversion-focused funnels",
            "QR/NFC products for marketing, sales enablement, and digital profiles",
            "Modernization of legacy systems into maintainable modern stacks",
            "MVP programs designed for fast launch with scalable foundations",
          ],
          collaborationDefaultsTitle: "How Collaboration Runs",
          collaborationDefaults: [
            "Weekly status updates with explicit next actions",
            "Documented technical and product decisions",
            "Risk transparency early instead of surprises late",
            "Measurable acceptance criteria for each delivery phase",
            "Clear ownership boundaries between business and engineering",
          ],
        };

  const defaultData =
    locale === "de"
      ? {
          hero: {
            tagline: "Professionelle Entwicklung",
            title: "Logik mit Anspruch skalieren.",
            description:
              "Von IT-Infrastruktur zu moderner KI-Entwicklung. Ein kontinuierlicher Weg aus komplementären Skills für digitale Produkte, die konvertieren.",
            stats: [
              { label: "Projekte", value: "50+" },
              { label: "Jahre Aktiv", value: "14+" },
              { label: "Lieferquote", value: "100%" },
            ],
          },
          evolution: [
            {
              period: "2010 — 2017",
              title: "IT Grundlagen & Webentwicklung",
              desc: "Aufbau erster Websites, CMS-Systeme, Hosting und Backend-Logik im Realbetrieb.",
              tech: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
              activities: ["Websites bauen", "Server Setup", "CMS Anpassungen", "DB Management"],
              quote: "Diese Phase hat ein stabiles Fundament für Architektur und Delivery gelegt.",
              icon: "Cpu",
              color: "rgba(180, 200, 229, 0.15)",
            },
            {
              period: "2017 — 2023",
              title: "Design & digitale Produktion",
              desc: "Erweiterung in Branding, Visual Design und UI-Layouts für starke digitale Marken.",
              tech: ["Photoshop", "Illustrator", "UI / UX"],
              activities: ["Branding", "Logo-Design", "Digital Assets", "UI Layouts"],
              quote: "Design und Engineering zusammen machen Produkte überzeugend und konsistent.",
              icon: "Palette",
              color: "rgba(229, 228, 226, 0.12)",
            },
            {
              period: "2023 — Heute",
              title: "KI Engineering & moderne Entwicklung",
              desc: "Fokus auf Next.js, TypeScript und KI-basierte Produktsysteme für reale Business Cases.",
              tech: ["TypeScript", "Next.js", "Node.js", "AI APIs"],
              activities: ["AI Apps", "SaaS Plattformen", "Automationen", "Produkt-Architektur"],
              quote: "Ziel ist die Kombination aus hoher Qualität, Tempo und messbarem Business-Impact.",
              icon: "Layers",
              color: "rgba(229, 228, 226, 0.1)",
            },
          ],
          skills: [
            { title: "Webentwicklung", skills: "PHP, JavaScript, TypeScript, HTML, CSS", icon: "Code2" },
            { title: "Frontend", skills: "React, Next.js, UI Architektur, Responsive Design", icon: "Palette" },
            { title: "Backend", skills: "Node.js, APIs, Datenbanken, Infrastruktur", icon: "ShieldCheck" },
            { title: "KI Engineering", skills: "AI APIs, Automationen, Prompt Engineering", icon: "Cpu" },
            { title: "Design", skills: "Branding, UI/UX, visuelle Systeme", icon: "Layers" },
            { title: "Cloud & DevOps", skills: "CI/CD, Deployment Pipelines, Monitoring, Runtime-Stabilität", icon: "ShieldCheck" },
            { title: "Daten & Analytics", skills: "Tracking Setup, Funnel-Analyse, KPI Dashboards", icon: "Target" },
            { title: "E-Commerce", skills: "Produktkataloge, Checkout-Flows, Conversion-Optimierung", icon: "Zap" },
            { title: "Technische SEO", skills: "Core Web Vitals, Crawlability, strukturierte Informationsarchitektur", icon: "Code2" },
          ],
          values: [
            {
              icon: "Target",
              title: "Conversion Fokus",
              desc: "Jeder Screen und jeder Flow werden für messbare Ergebnisse gebaut.",
            },
            {
              icon: "ShieldCheck",
              title: "Datenintegrität",
              desc: "Saubere Architektur für sichere, belastbare und wartbare Systeme.",
            },
            {
              icon: "Zap",
              title: "Skalierbar",
              desc: "Produkte mit Struktur, die mit dem Business mitwachsen.",
            },
            {
              icon: "Users",
              title: "Menschzentriert",
              desc: "Komplexe Technik wird in klare Benutzererlebnisse übersetzt.",
            },
            {
              icon: "ShieldCheck",
              title: "Qualität vor Tempo",
              desc: "Schnelle Umsetzung ohne Architekturkompromisse oder technische Schulden.",
            },
            {
              icon: "Layers",
              title: "Systemisches Denken",
              desc: "Produkte werden als ganzheitliches System aus UX, Daten und Business-Logik geplant.",
            },
            {
              icon: "Cpu",
              title: "Technologische Tiefe",
              desc: "Von Infrastruktur bis KI-Workflow: Entscheidungen basieren auf technischer Substanz.",
            },
            {
              icon: "Code2",
              title: "Saubere Delivery",
              desc: "Klare Priorisierung, nachvollziehbare Umsetzung und stabile Releases in jeder Phase.",
            },
          ],
          profileOffice: {
            whatIDo: [
              "Ich entwickle performante Websites und Web-Apps mit klarer Architektur.",
              "Ich integriere KI-Workflows in reale Geschäftsprozesse.",
              "Ich entwickle QR-/NFC-Plattformen wie uTraLink (utralink.com) mit dynamischen QR-Modulen, Design-Varianten und kampagnenfähigen Flows.",
              "Ich baue virtuelle digitale Visitenkarten, die auf Smartphones sofort teilbar und aktualisierbar sind.",
              "Ich implementiere dynamische QR-Ziele, damit ein einziger gedruckter Code langfristig nutzbar bleibt.",
              "Ich verbinde Design und Engineering für nutzerzentrierte Produkte.",
              "Ich analysiere bestehende Plattformen und identifiziere Wachstumsengpässe.",
              "Ich strukturiere Informationsarchitektur für bessere Auffindbarkeit und Conversion.",
              "Ich optimiere Performance, Stabilität und technische Qualität in Live-Systemen.",
            ],
            whatIOffer: [
              "End-to-end Projektumsetzung von Konzept bis Launch.",
              "Technische Beratung für Skalierung, Performance und SEO.",
              "Spezialisierte QR-Produktentwicklung für Marketing, Lead-Erfassung und Omnichannel-Kampagnen (inklusive uTraLink-Erfahrung).",
              "Realtime-Update-Fähigkeit für QR-Inhalte (Angebote, Links, Kontaktdaten) ohne Neudruckkosten.",
              "QR-Analytics-Setup für Scans, Kampagnenleistung und Conversion-Tracking.",
              "Mehrzweck-QR-Flows (Website, VCard, WhatsApp, Formulare, Menüs, Produktkataloge) in einer skalierbaren Struktur.",
              "Langfristige Produktbegleitung mit Iteration und Optimierung.",
              "Produkt-Roadmaps mit klaren Milestones und Prioritäten.",
              "Setup für Admin-Workflows, Content-Management und Betriebsprozesse.",
              "Hands-on Umsetzung statt reiner Strategiepräsentationen.",
            ],
            skills: [
              {
                name: "Web Development",
                summary: "PHP, JavaScript, TypeScript, React, Next.js",
                level: "Expert",
              },
              {
                name: "Backend & APIs",
                summary: "Node.js, REST APIs, Datenmodellierung, Integrationen",
                level: "Expert",
              },
              {
                name: "AI & Automation",
                summary: "LLM APIs, Agent-Flows, Prozessautomatisierung",
                level: "Advanced",
              },
              {
                name: "UI/UX Systems",
                summary: "Design Systems, Responsive UX, Conversion-Optimierung",
                level: "Advanced",
              },
              {
                name: "Delivery & Architecture",
                summary: "Struktur, Skalierung, Performance, Wartbarkeit",
                level: "Expert",
              },
              {
                name: "E-Commerce Systems",
                summary: "Produktkataloge, Checkout-Flows, Conversion-Optimierung",
                level: "Advanced",
              },
              {
                name: "SEO & Performance",
                summary: "Core Web Vitals, technische SEO, saubere Informationsarchitektur",
                level: "Advanced",
              },
              {
                name: "Admin Dashboards",
                summary: "Operations-Panels, Datensteuerung, Content-Workflows",
                level: "Advanced",
              },
              {
                name: "Cloud & Deployment",
                summary: "CI/CD, Hosting-Strategien, Monitoring, Runtime-Stabilität",
                level: "Advanced",
              },
            ],
          },
        }
      : {
          hero: {
            tagline: "Professional Evolution",
            title: "Scaling Logic with Taste.",
            description:
              "From early IT infrastructure to modern AI engineering. A continuous journey of stacking complementary skills to build complete digital products that convert.",
            stats: [
              { label: "Projects Built", value: "50+" },
              { label: "Years Active", value: "14+" },
              { label: "Delivered", value: "100%" },
            ],
          },
          evolution: [
            {
              period: "2010 — 2017",
              title: "IT Foundations & Web Development",
              desc: "Began building websites and learning web technologies through hands-on experimentation.",
              tech: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
              activities: ["Building websites", "Server setup", "CMS customization", "Database management"],
              quote: "This phase built a strong understanding of web architecture and backend logic.",
              icon: "Cpu",
              color: "rgba(180, 200, 229, 0.15)",
            },
            {
              period: "2017 — 2023",
              title: "Graphic Design & Digital Production",
              desc: "Expanded into branding, visual design, and digital production to support products.",
              tech: ["Photoshop", "Illustrator", "UI / UX"],
              activities: ["Brand identity", "Logo design", "Digital assets", "UI layouts"],
              quote: "Design and engineering together produce premium product experiences.",
              icon: "Palette",
              color: "rgba(229, 228, 226, 0.12)",
            },
            {
              period: "2023 — Present",
              title: "AI Engineering & Modern Development",
              desc: "Focused on AI-powered systems with modern full-stack architecture.",
              tech: ["TypeScript", "Next.js", "Node.js", "AI APIs"],
              activities: ["AI apps", "SaaS systems", "Automation", "Product architecture"],
              quote: "The goal is speed, quality, and measurable business outcomes.",
              icon: "Layers",
              color: "rgba(229, 228, 226, 0.1)",
            },
          ],
          skills: [
            { title: "Web Development", skills: "PHP, JavaScript, TypeScript, HTML, CSS", icon: "Code2" },
            { title: "Frontend", skills: "React, Next.js, UI architecture, responsive design", icon: "Palette" },
            { title: "Backend", skills: "Node.js, APIs, databases, infrastructure", icon: "ShieldCheck" },
            { title: "AI Engineering", skills: "AI APIs, automation, prompt engineering", icon: "Cpu" },
            { title: "Design", skills: "Branding, UI/UX, visual systems", icon: "Layers" },
            { title: "Cloud & DevOps", skills: "CI/CD, deployment pipelines, monitoring, runtime reliability", icon: "ShieldCheck" },
            { title: "Data & Analytics", skills: "Tracking setup, funnel analysis, KPI dashboards", icon: "Target" },
            { title: "E-Commerce", skills: "Product catalogs, checkout flows, conversion optimization", icon: "Zap" },
            { title: "Technical SEO", skills: "Core Web Vitals, crawlability, structured information architecture", icon: "Code2" },
          ],
          values: [
            {
              icon: "Target",
              title: "Conversion Focused",
              desc: "Every screen and workflow is built for measurable outcomes.",
            },
            {
              icon: "ShieldCheck",
              title: "Data Integrity",
              desc: "Clean architecture for secure, reliable, and maintainable systems.",
            },
            {
              icon: "Zap",
              title: "Scaling Ready",
              desc: "Products built with structure that grows with your business.",
            },
            {
              icon: "Users",
              title: "Human Centric",
              desc: "Complex technology translated into clear user experiences.",
            },
            {
              icon: "ShieldCheck",
              title: "Quality Before Speed",
              desc: "Fast execution without sacrificing architecture quality or long-term maintainability.",
            },
            {
              icon: "Layers",
              title: "Systems Thinking",
              desc: "Products are designed as connected systems across UX, data, and business logic.",
            },
            {
              icon: "Cpu",
              title: "Technical Depth",
              desc: "From infrastructure to AI workflows, decisions are made on technical substance.",
            },
            {
              icon: "Code2",
              title: "Clean Delivery",
              desc: "Clear priorities, traceable implementation, and stable releases in every phase.",
            },
          ],
          profileOffice: {
            whatIDo: [
              "I build high-performance websites and web apps with clean architecture.",
              "I integrate AI workflows into real business operations.",
              "I build QR/NFC platforms like uTraLink (utralink.com), including dynamic QR modules, design variations, and campaign-ready flows.",
              "I build virtual digital business cards that are instantly shareable and updateable on smartphones.",
              "I implement dynamic QR destinations so one printed code stays useful long-term.",
              "I combine design and engineering to deliver user-centric products.",
              "I audit existing platforms and identify growth bottlenecks.",
              "I structure information architecture for better discoverability and conversion.",
              "I optimize performance, stability, and technical quality in live systems.",
            ],
            whatIOffer: [
              "End-to-end product delivery from concept to launch.",
              "Technical consulting for scaling, performance, and SEO.",
              "Specialized QR product development for marketing, lead capture, and omnichannel campaigns (including uTraLink experience).",
              "Real-time QR content updates (offers, links, contact data) without reprint costs.",
              "QR analytics setup for scan behavior, campaign performance, and conversion tracking.",
              "Multi-purpose QR flows (website, vCard, WhatsApp, forms, menus, product catalogs) inside one scalable system.",
              "Long-term product support with iteration and optimization.",
              "Product roadmaps with clear milestones and priorities.",
              "Admin workflow setup for content and operational management.",
              "Hands-on implementation, not just slide-deck strategy.",
            ],
            skills: [
              {
                name: "Web Development",
                summary: "PHP, JavaScript, TypeScript, React, Next.js",
                level: "Expert",
              },
              {
                name: "Backend & APIs",
                summary: "Node.js, REST APIs, data modeling, integrations",
                level: "Expert",
              },
              {
                name: "AI & Automation",
                summary: "LLM APIs, agent workflows, process automation",
                level: "Advanced",
              },
              {
                name: "UI/UX Systems",
                summary: "Design systems, responsive UX, conversion optimization",
                level: "Advanced",
              },
              {
                name: "Delivery & Architecture",
                summary: "Structure, scaling, performance, maintainability",
                level: "Expert",
              },
              {
                name: "E-Commerce Systems",
                summary: "Product catalogs, checkout flows, conversion optimization",
                level: "Advanced",
              },
              {
                name: "SEO & Performance",
                summary: "Core Web Vitals, technical SEO, clean information architecture",
                level: "Advanced",
              },
              {
                name: "Admin Dashboards",
                summary: "Operations panels, data control, content workflows",
                level: "Advanced",
              },
              {
                name: "Cloud & Deployment",
                summary: "CI/CD, hosting strategy, monitoring, runtime reliability",
                level: "Advanced",
              },
            ],
          },
        };

  const data = localizeAboutData(content?.data ?? defaultData, locale);

  const { hero, skills, values } = data;
  const evolution = enrichEvolution(data.evolution, locale);
  const profileOfficeRaw = data.profileOffice ?? defaultData.profileOffice;
  const profileOffice = {
    ...profileOfficeRaw,
    whatIDo: Array.from(
      new Set([...(profileOfficeRaw?.whatIDo ?? []), ...(defaultData.profileOffice?.whatIDo ?? [])]),
    ),
    whatIOffer: Array.from(
      new Set([...(profileOfficeRaw?.whatIOffer ?? []), ...(defaultData.profileOffice?.whatIOffer ?? [])]),
    ),
  };
  const extraPrinciples =
    locale === "de"
      ? [
          {
            icon: "ShieldCheck",
            title: "Qualität vor Tempo",
            desc: "Schnelle Umsetzung ohne Architekturkompromisse oder technische Schulden.",
          },
          {
            icon: "Layers",
            title: "Systemisches Denken",
            desc: "Produkte werden als ganzheitliches System aus UX, Daten und Business-Logik geplant.",
          },
          {
            icon: "Cpu",
            title: "Technologische Tiefe",
            desc: "Von Infrastruktur bis KI-Workflow: Entscheidungen basieren auf technischer Substanz.",
          },
          {
            icon: "Code2",
            title: "Saubere Delivery",
            desc: "Klare Priorisierung, nachvollziehbare Umsetzung und stabile Releases in jeder Phase.",
          },
        ]
      : [
          {
            icon: "ShieldCheck",
            title: "Quality Before Speed",
            desc: "Fast execution without sacrificing architecture quality or long-term maintainability.",
          },
          {
            icon: "Layers",
            title: "Systems Thinking",
            desc: "Products are designed as connected systems across UX, data, and business logic.",
          },
          {
            icon: "Cpu",
            title: "Technical Depth",
            desc: "From infrastructure to AI workflows, decisions are made on technical substance.",
          },
          {
            icon: "Code2",
            title: "Clean Delivery",
            desc: "Clear priorities, traceable implementation, and stable releases in every phase.",
          },
        ];
  const mergedValues = [
    ...(Array.isArray(values) ? values : []),
    ...extraPrinciples,
  ].filter(
    (value, index, arr) =>
      arr.findIndex((item) => item?.title === value?.title) === index,
  );
  const mergedSkills = [
    ...(Array.isArray(skills) ? skills : []),
    ...(Array.isArray(defaultData.skills) ? defaultData.skills : []),
  ].filter(
    (skill, index, arr) =>
      arr.findIndex((item) => item?.title === skill?.title) === index,
  );


  return (
    <section className={styles.about} id="about">
      {/* Ambient Background */}
      <div className={styles.ambientBg}>
        <div className={styles.ambientGlow} />
        <div className={styles.ambientGlow2} />
      </div>

      <div className="container">

        {/* ── Hero Section ─────────────────────────────────────── */}
        <div className={styles.heroGrid}>
          <div className={styles.portraitArea}>
            <div className={styles.portraitFrame}>
              <div className={styles.portraitGlow} />
              <div className={styles.portrait}>
                <Image
                  src="/assets/Profile.jpg"
                  alt="Attila Lazar"
                  fill
                  className={styles.portraitImage}
                  loading="lazy"
                />
                {/* Overlay shimmer */}
                <div className={styles.portraitOverlay} />
              </div>
            </div>

            {/* Floating badge */}
            <div className={styles.experienceBadge}>
              <span className={styles.years}>14+</span>
              <span className={styles.expLabel}>{copy.yearsExp}</span>
            </div>

            {/* Status pill */}
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              {copy.available}
            </div>
          </div>

          <div className={styles.introArea}>
            <span className={styles.tagline}>
              <span className={styles.inlineLogoBadge} aria-hidden="true">
                <span className={styles.inlineLogoRing} />
                <Image
                  src="/assets/LOGO.png"
                  alt="LOrdEnRYQuE"
                  width={14}
                  height={14}
                  className={styles.inlineLogoImage}
                />
              </span>
              {hero.tagline}
            </span>
            <h1 className={styles.title}>
              {locale === "en" && hero.title.includes("Logic") ? (
                <>Scaling <span className="platinum-text">Logic</span><br />with Taste.</>
              ) : hero.title}
            </h1>
            <p className={styles.description}>
              {hero.description}
            </p>

            {/* Stat row */}
            <div className={styles.statRow}>
              {hero.stats.map((s: any, i: number) => (
                <React.Fragment key={i}>
                  <div className={styles.statItem}>
                    <span className={styles.statNum}>{s.value}</span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                  {i < hero.stats.length - 1 && <div className={styles.statDivider} />}
                </React.Fragment>
              ))}
            </div>

            <div className={styles.ctaRow}>
              <a
                href="/assets/Attila_Lazar_Resume_Portfolio.pdf"
                className={styles.resumeBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileDown size={18} /> {copy.cv}
              </a>
              <LocaleLink href="/contact" className={styles.secondaryCta}>
                {copy.contact} <ArrowRight size={16} />
              </LocaleLink>
            </div>
          </div>
        </div>

        {/* ── Timeline Section ──────────────────────────────────── */}
        <div className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>{copy.chapters}</span>
            <h2 className={styles.sectionTitle}>{copy.journey}</h2>
          </div>
          <div className={styles.timeline}>
            {evolution.map((stage: any, index: number) => (
              <div
                key={stage.title}
                className={`${styles.timelineItem} ${activeStage === index ? styles.activeItem : ""}`}
                onClick={() => setActiveStage(activeStage === index ? null : index)}
              >
                {/* Left visual column */}
                <div className={styles.timeLineVisual}>
                  <div className={styles.iconCircle} style={{ background: stage.color }}>
                    {IconMap[stage.icon as string] || <Cpu size={22} />}
                  </div>
                  {index !== evolution.length - 1 && <div className={styles.connector} />}
                </div>

                {/* Content */}
                <div className={styles.timeLineContent}>
                  <div className={styles.timelineCard}>
                    <div className={styles.cardTopRow}>
                      <span className={styles.period}>{stage.period}</span>
                    </div>
                    <h3>{stage.title}</h3>
                    <p>{stage.desc}</p>

                    <div className={styles.techList}>
                      {stage.tech.map((t: string) => (
                        <span key={t} className={styles.techTag}>{t}</span>
                      ))}
                    </div>

                    <ul className={styles.activityList}>
                      {stage.activities.map((a: string) => (
                        <li key={a}>
                          <CheckCircle2 size={14} className={styles.checkIcon} />
                          {a}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.impactRow}>
                      {(stage.impact || []).map((item: string) => (
                        <span key={item} className={styles.impactBadge}>{item}</span>
                      ))}
                    </div>

                    <blockquote className={styles.quote}>"{stage.quote}"</blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Philosophy + Skills ───────────────────────────────── */}
        <div className={styles.gridSection}>
          <div className={styles.philosophyBox}>
            <div className={styles.philosophyIcon}>
              <span className={styles.philosophyLogoBadge} aria-hidden="true">
                <span className={styles.philosophyLogoRing} />
                <Image
                  src="/assets/LOGO.png"
                  alt="LOrdEnRYQuE"
                  width={24}
                  height={24}
                  className={styles.philosophyLogoImage}
                />
              </span>
            </div>
            <h3 className={styles.philosophyTitle}>{copy.philosophyTitle}</h3>
            <p className={styles.largeText}>
              "{copy.philosophyQuote}"
            </p>
            <p className={styles.subText}>
              {copy.philosophyDesc}
            </p>
            <div className={styles.signature}>{copy.signature}</div>
          </div>

          <div className={styles.triangleBox}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionEyebrow}>{copy.skillStack}</span>
              <h2 className={styles.sectionTitle} style={{ fontSize: "1.75rem" }}>{copy.triangle}</h2>
            </div>
            <p className={styles.triangleDesc}>
              {copy.triangleDesc}
            </p>
            <div className={styles.trianglePillarGrid}>
              {copy.trianglePillars.map((pillar) => (
                <div key={pillar.title} className={styles.trianglePillarCard}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              ))}
            </div>
            <div className={styles.outcomeRow}>
              {copy.triangleOutcomes.map((outcome) => (
                <span key={outcome} className={styles.outcomeBadge}>
                  <CheckCircle2 size={13} className={styles.checkIcon} />
                  {outcome}
                </span>
              ))}
            </div>
            <div className={styles.triangleFlowBlock}>
              <h3>{copy.triangleFlowTitle}</h3>
              <div className={styles.triangleFlowGrid}>
                {copy.triangleFlow.map((flow) => (
                  <article key={flow.step} className={styles.triangleFlowItem}>
                    <span className={styles.flowStep}>{flow.step}</span>
                    <p>{flow.desc}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.triangleSupportGrid}>
              <article className={styles.triangleSupportCard}>
                <h3>{copy.engagementTitle}</h3>
                <ul className={styles.profileList}>
                  {copy.engagementModes.map((mode) => (
                    <li key={mode}>
                      <CheckCircle2 size={14} className={styles.checkIcon} />
                      <span>{mode}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className={styles.triangleSupportCard}>
                <h3>{copy.guaranteesTitle}</h3>
                <ul className={styles.profileList}>
                  {copy.guarantees.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={14} className={styles.checkIcon} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
            <div className={styles.proofStrip}>
              <h3>{copy.proofTitle}</h3>
              <div className={styles.proofGrid}>
                {copy.proofMetrics.map((metric) => (
                  <div key={metric.label} className={styles.proofCard}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.skillGrid}>
              {mergedSkills.map((s: any) => (
                <div
                  key={s.title}
                  className={styles.skillCard}
                >
                  <div className={styles.skillIcon}>{IconMap[s.icon as string] || <Code2 size={20} />}</div>
                  <h4>{s.title}</h4>
                  <p>{s.skills}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Values Section ────────────────────────────────────── */}
        <div className={styles.valuesSection}>
          <div className={styles.sectionHeader} style={{ textAlign: "center", alignItems: "center" }}>
            <span className={styles.sectionEyebrow}>{copy.principles}</span>
            <h2 className={styles.centerTitle}>{copy.excellence}</h2>
          </div>
          <div className={styles.valuesGrid}>
            {mergedValues.map((v: any) => (
              <div
                key={v.title}
                className={styles.valueCard}
              >
                <div className={styles.valueIconWrap}>
                  {IconMap[v.icon as string] || <Target size={28} />}
                </div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Profile Office ─────────────────────────────────────── */}
        <section className={styles.profileOfficeSection}>
          <div className={styles.sectionHeader} style={{ alignItems: "center", textAlign: "center" }}>
            <span className={styles.sectionEyebrow}>{copy.profileEyebrow}</span>
            <h2 className={styles.sectionTitle}>{copy.profileTitle}</h2>
          </div>

          <div className={styles.profileOfficeGrid}>
            <article className={styles.profileCard}>
              <h3>{copy.whatIDo}</h3>
              <ul className={styles.profileList}>
                {profileOffice.whatIDo?.map((item: string) => (
                  <li key={item}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.profileCard}>
              <h3>{copy.whatIOffer}</h3>
              <ul className={styles.profileList}>
                {profileOffice.whatIOffer?.map((item: string) => (
                  <li key={item}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.profileCard}>
              <h3>{copy.coreSkills}</h3>
              <div className={styles.skillBadgeGrid}>
                {profileOffice.skills?.map((item: { name: string; summary?: string; level: string }) => (
                  <div key={`${item.name}-${item.level}`} className={styles.skillBadge}>
                    <div className={styles.skillBadgeText}>
                      <span>{item.name}</span>
                      {item.summary ? <small>{item.summary}</small> : null}
                    </div>
                    <strong>{item.level}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* ── Additional Information ──────────────────────────── */}
        <section className={styles.profileOfficeSection}>
          <div className={styles.sectionHeader} style={{ alignItems: "center", textAlign: "center" }}>
            <span className={styles.sectionEyebrow}>{copy.profileEyebrow}</span>
            <h2 className={styles.sectionTitle}>{copy.excellence}</h2>
          </div>

          <div className={styles.profileOfficeGrid}>
            <article className={styles.profileCard}>
              <h3>{copy.executionPlaybookTitle}</h3>
              <ul className={styles.profileList}>
                {copy.executionPlaybook.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.profileCard}>
              <h3>{copy.projectFitTitle}</h3>
              <ul className={styles.profileList}>
                {copy.projectFit.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.profileCard}>
              <h3>{copy.collaborationDefaultsTitle}</h3>
              <ul className={styles.profileList}>
                {copy.collaborationDefaults.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} className={styles.checkIcon} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaBannerGlow} />
          <div className={styles.ctaBannerContent}>
            <span className={styles.ctaBannerEyebrow}>{copy.ctaEyebrow}</span>
            <h2 className={styles.ctaBannerTitle}>{copy.ctaTitle}</h2>
            <p className={styles.ctaBannerDesc}>
              {copy.ctaDesc}
            </p>
            <div className={styles.ctaBannerBtns}>
              <LocaleLink href="/contact" className={styles.resumeBtn}>
                {copy.startProject} <ArrowRight size={18} />
              </LocaleLink>
              <LocaleLink href="/services" className={styles.secondaryCta}>
                {copy.viewServices}
              </LocaleLink>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
