"use client";

import { useState } from "react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";
import styles from "./QRSolutionsPage.module.css";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, useScroll, useTransform } from "framer-motion";

const PRIVACY_CONSENT_VERSION = "qr_solutions_form_v1";

export default function QRSolutionsPage() {
  const locale = useLocale();
  const de = locale === "de";

  const copy = de
    ? {
        eyebrow: "QR & NFC Lösungen",
        title: "QR Code Lösungen, die Business-Prozesse messbar verbessern.",
        subtitle:
          "Ich entwickle dynamische QR-Systeme für Lead-Erfassung, digitale Visitenkarten, Kampagnensteuerung und Omnichannel-Kommunikation. Ein QR-Code wird einmal gedruckt, Inhalte bleiben jederzeit editierbar.",
        heroMetrics: [
          { value: "1x", label: "Print Setup" },
          { value: "∞", label: "Content Updates" },
          { value: "24/7", label: "Mobile Access" },
          { value: "Live", label: "Campaign Control" },
        ],
        cards: [
          {
            title: "Virtuelle Business Card",
            text: "Digitale Visitenkarte fürs Smartphone mit sofortigem Zugriff auf Kontakt, Website, WhatsApp und Social Links.",
          },
          {
            title: "Print Once. Update Anytime.",
            text: "Statischer Print-QR mit dynamischem Ziel: Angebote, Links und Inhalte ändern ohne Neudruck.",
          },
          {
            title: "uTraLink Erfahrungs-Stack",
            text: "Praxis aus realen QR/NFC Plattformen wie utralink.com für skalierbare Business-Anwendungen.",
          },
        ],
        benefitTitle: "Wie das deinem Business hilft",
        benefits: [
          "Mehr Leads über scanbare Touchpoints auf Print, Packaging, Storefront und Events.",
          "Schnellere Kampagnen-Iteration, weil Ziele ohne Druckkosten aktualisiert werden.",
          "Bessere Conversion durch mobile-first Landing-Flows und klare CTAs.",
          "Messbarkeit über Scan-Daten, Kampagnen-Performance und Conversion-Ereignisse.",
          "Einheitlicher Admin-Workflow für mehrere QR-Anwendungsfälle in einem System.",
        ],
        useCasesTitle: "Typische Use Cases",
        useCases: [
          "Smart Business Card & Team Profiles",
          "Produkt- und Angebots-QRs",
          "WhatsApp / Booking / Lead Form QR",
          "Restaurant Menü, Event, Standort oder Review QR",
          "NFC + QR Kombination für Vertrieb und Vor-Ort-Kommunikation",
        ],
        ctaPrimary: "Projekt Starten",
        ctaSecondary: "Kontakt Aufnehmen",
        showcaseTitle: "Visual Showcase",
        showcaseItems: [
          {
            title: "VCard Landing",
            text: "Smartphone-ready Profilseiten für schnellen Kontaktaufbau direkt nach dem Scan.",
          },
          {
            title: "BioLink Hub",
            text: "Mehrere Business-Links in einem QR-Ziel für Kampagnen, Social und Vertrieb.",
          },
          {
            title: "Business Profile",
            text: "Unternehmensprofil mit Services, CTA und Kontaktpunkten für lokale Conversion.",
          },
        ],
        emulatorTitle: "Mobile Frame Emulator",
        emulatorDesc:
          "Drei unterschiedliche Mobile-Frames zeigen, wie deine QR-Ziele als VCard, BioLink und Business Profile auf echten Smartphones wirken.",
        emulatorLoadPreview: "Live-Vorschau laden",
        frames: [
          {
            title: "vCard Experience",
            subtitle: "Kontakt speichern in 1 Tap",
            points: ["Name, Rolle, Firma", "Telefon, E-Mail, WhatsApp", "Direktes vCard Export-Verhalten"],
            sampleUrl: "https://utralink.com/lrdene1",
            urls: [
              "https://utralink.com/lrdene1",
              "https://utralink.com/v5xucn",
              "https://utralink.com/kws83v",
              "https://utralink.com/cnhgdb",
              "https://utralink.com/ou7htj",
              "https://utralink.com/lrdene",
            ],
          },
          {
            title: "BioLink Experience",
            subtitle: "Alle wichtigen Links an einem Ort",
            points: ["Website, Angebote, Booking", "Social + Messenger Touchpoints", "Kampagnenfähige CTA-Reihenfolge"],
            sampleUrl: "https://utralink.com/BioLink",
            urls: [
              "https://utralink.com/BioLink",
              "https://utralink.com/bio2",
              "https://utralink.com/sj5gnd",
              "https://utralink.com/enciso",
            ],
          },
          {
            title: "Business Profile",
            subtitle: "Markenauftritt im Mobile-Format",
            points: ["Services und Highlights", "Standort, Öffnungszeiten, CTA", "Updatebar ohne QR-Neudruck"],
            sampleUrl: "https://utralink.com/rest",
            urls: [
              "https://utralink.com/rest",
              "https://utralink.com/Barber",
              "https://utralink.com/poqy9t",
              "https://utralink.com/resume",
              "https://utralink.com/kgiatg",
            ],
          },
        ],
        liveTitle: "Live uTraLink Beispiele",
        workflowTitle: "Delivery Workflow für QR Systeme",
        workflowSteps: [
          { step: "01", title: "Use-Case Mapping", text: "Kundenreise, Touchpoints und gewünschte Conversion-Ziele definieren." },
          { step: "02", title: "QR Architecture", text: "Dynamische Zielstruktur, Tracking-Parameter und Admin-Logik aufsetzen." },
          { step: "03", title: "Mobile Experiences", text: "VCard, BioLink und Business Profile als conversion-optimierte Flows designen." },
          { step: "04", title: "Launch & Optimize", text: "Live schalten, KPI-Daten auswerten und Inhalte kontinuierlich optimieren." },
        ],
        comparisonTitle: "Static vs Dynamic QR Value",
        comparisonRows: [
          { area: "Printed Material", staticMode: "Neu drucken bei jeder Änderung", dynamicMode: "Einmal drucken, Inhalte live anpassen" },
          { area: "Campaign Agility", staticMode: "Langsame Iteration", dynamicMode: "Schnelle Updates in Minuten" },
          { area: "Lead Capture", staticMode: "Begrenzt", dynamicMode: "Form-, WhatsApp-, Booking- und Profile-Flows" },
          { area: "Analytics", staticMode: "Kaum messbar", dynamicMode: "Scans, Verhalten und Conversion trackbar" },
          { area: "Operations", staticMode: "Fragmentierte Prozesse", dynamicMode: "Zentraler Admin-Workflow" },
        ],
        testimonialsTitle: "Client Impact",
        testimonials: [
          {
            quote: "Ein QR für unsere Printmaterialien, aber wöchentliche Angebots-Updates ohne Neudruck. Das hat Kosten und Zeit massiv reduziert.",
            name: "Retail Operations Lead",
            role: "Multi-Location Business",
          },
          {
            quote: "Die digitale Business Card hat Networking auf Events vereinfacht. Kontakte werden jetzt direkt in den Funnel überführt.",
            name: "Founder",
            role: "B2B Services",
          },
          {
            quote: "Mit den dynamischen QR-Flows sehen wir endlich, welche Kampagnen wirklich Leads bringen.",
            name: "Marketing Manager",
            role: "Local Brand",
          },
        ],
        leadTitle: "Start Your QR Solution Project",
        leadDesc: "Share your use case and I will propose a practical rollout plan for your business.",
        leadName: "Name",
        leadEmail: "Email",
        leadCompany: "Company",
        leadUseCase: "Primary Use Case",
        useCaseOptions: [
          "Virtual Business Card",
          "BioLink Hub",
          "Business Profile",
          "Campaign QR System",
          "Multi-branch QR Operations",
        ],
        leadMessage: "Project Details",
        leadSubmit: "Send QR Project Inquiry",
        leadSending: "Sending...",
        leadSuccess: "Your request was sent successfully. I will get back to you shortly.",
        leadError: "Could not send right now. Please try again in a moment.",
        leadPrivacyConsentPrefix:
          "Ich stimme zu, dass meine Angaben zur Bearbeitung dieser Anfrage verarbeitet werden. Ich habe die",
        leadPrivacyConsentLink: "Datenschutzerklarung",
        leadPrivacyConsentSuffix: "gelesen.",
        leadPrivacyConsentError: "Bitte stimme der Verarbeitung gemaß Datenschutzerklarung zu.",
        checklistTitle: "Getting Started Checklist",
        checklistIntro: "Follow these quick steps to launch your first business-ready QR flow.",
        checklistSteps: [
          {
            title: "Step 1: Setup",
            items: [
              "Define the campaign goal and target action before generating codes.",
              "Prepare branding assets (logo, colors, CTA labels).",
              "Choose where the QR will appear (print, packaging, storefront, events).",
            ],
          },
          {
            title: "Step 2: Create First QR",
            items: [
              "Pick the correct QR type (URL, vCard, profile, form, WhatsApp).",
              "Enter destination content and review mobile output instantly.",
              "Test-scan with iPhone and Android before publishing.",
            ],
          },
          {
            title: "Step 3: Organize & Manage",
            items: [
              "Use folders/tags by campaign, client, or location.",
              "Name QR codes clearly for reporting and team handover.",
            ],
          },
          {
            title: "Step 4: Track & Analyze",
            items: [
              "Enable dynamic mode when you need analytics and flexible updates.",
              "Track scan trends by channel, device, and timeframe.",
            ],
          },
          {
            title: "Step 5: Share & Scale",
            items: [
              "Export print-ready assets and deploy across touchpoints.",
              "Iterate destinations and CTAs without reprinting.",
            ],
          },
        ],
        tipsTitle: "Tips & Tricks",
        tipsItems: [
          { title: "Make It Dynamic", text: "Use dynamic QR when destinations may change over time." },
          { title: "Brand It Clearly", text: "Add logo and brand colors, but keep high contrast for scanability." },
          { title: "Use The Right Type", text: "Match QR type to intent: URL, vCard, form, WhatsApp, profile, etc." },
          { title: "Track and Learn", text: "Use analytics to compare placement performance and improve campaigns." },
          { title: "Update Without Reprinting", text: "Edit dynamic destination content instead of printing new codes." },
          { title: "Add Clear CTA", text: "Tell people what to do after scan: book, contact, order, follow." },
          { title: "Test Before Launch", text: "Validate flow on multiple devices and scanning apps." },
          { title: "Keep It Simple", text: "Avoid visual clutter around the code; protect quiet zones." },
        ],
        stickyCta: "Need a conversion-ready QR system?",
        stickyPrimary: "Book QR Strategy",
        stickySecondary: "Open Contact",
        liveGroups: [
          {
            label: "vCard Links",
            links: [
              "https://utralink.com/v5xucn",
              "https://utralink.com/kws83v",
              "https://utralink.com/cnhgdb",
              "https://utralink.com/lrdene1",
              "https://utralink.com/ou7htj",
              "https://utralink.com/lrdene",
              "https://utralink.com/yfxvii",
              "https://utralink.com/5a66kf",
            ],
          },
          {
            label: "BioLink Links",
            links: [
              "https://utralink.com/enciso",
              "https://utralink.com/bio2",
              "https://utralink.com/sj5gnd",
              "https://utralink.com/BioLink",
            ],
          },
          {
            label: "Business Profile Links",
            links: [
              "https://utralink.com/poqy9t",
              "https://utralink.com/rest",
              "https://utralink.com/Barber",
              "https://utralink.com/resume",
              "https://utralink.com/kgiatg",
            ],
          },
        ],
      }
    : {
        eyebrow: "QR & NFC Solutions",
        title: "QR code solutions that improve business operations with measurable impact.",
        subtitle:
          "I build dynamic QR systems for lead capture, digital business cards, campaign control, and omnichannel communication. You print one QR code once, then keep content editable anytime.",
        heroMetrics: [
          { value: "1x", label: "Print Setup" },
          { value: "∞", label: "Content Updates" },
          { value: "24/7", label: "Mobile Access" },
          { value: "Live", label: "Campaign Control" },
        ],
        cards: [
          {
            title: "Virtual Business Card",
            text: "Smartphone-ready digital business cards with instant access to contact, website, WhatsApp, and social links.",
          },
          {
            title: "Print Once. Update Anytime.",
            text: "One printed QR with dynamic destination so offers, links, and content can change without reprinting.",
          },
          {
            title: "uTraLink Experience Stack",
            text: "Hands-on delivery from real QR/NFC platforms like utralink.com for scalable business use cases.",
          },
        ],
        benefitTitle: "How this helps your business",
        benefits: [
          "More leads from scannable touchpoints across print, packaging, storefronts, and events.",
          "Faster campaign iteration because destinations can be updated with zero print waste.",
          "Higher conversion through mobile-first landing flows and clear CTAs.",
          "Trackability with scan metrics, campaign performance, and conversion events.",
          "Unified admin workflow for multiple QR use cases in one system.",
        ],
        useCasesTitle: "Typical use cases",
        useCases: [
          "Smart business card & team profiles",
          "Product and offer QR campaigns",
          "WhatsApp / booking / lead form QR",
          "Restaurant menu, event, location, or review QR",
          "NFC + QR combinations for sales and on-site communication",
        ],
        ctaPrimary: "Start a Project",
        ctaSecondary: "Get in Touch",
        showcaseTitle: "Visual Showcase",
        showcaseItems: [
          {
            title: "VCard Landing",
            text: "Smartphone-ready profile pages for instant contact handoff right after a scan.",
          },
          {
            title: "BioLink Hub",
            text: "Multiple business links behind one QR destination for campaigns, social, and sales.",
          },
          {
            title: "Business Profile",
            text: "A company profile with services, CTA, and contact points optimized for local conversion.",
          },
        ],
        emulatorTitle: "Mobile Frame Emulator",
        emulatorDesc:
          "Three different mobile frames simulate how your QR destinations appear as vCard, BioLink, and Business Profile experiences.",
        emulatorLoadPreview: "Load live preview",
        frames: [
          {
            title: "vCard Experience",
            subtitle: "Save contact in one tap",
            points: ["Name, role, company", "Phone, email, WhatsApp", "Direct vCard export flow"],
            sampleUrl: "https://utralink.com/lrdene1",
            urls: [
              "https://utralink.com/lrdene1",
              "https://utralink.com/v5xucn",
              "https://utralink.com/kws83v",
              "https://utralink.com/cnhgdb",
              "https://utralink.com/ou7htj",
              "https://utralink.com/lrdene",
            ],
          },
          {
            title: "BioLink Experience",
            subtitle: "All priority links in one place",
            points: ["Website, offers, booking", "Social + messenger touchpoints", "Campaign-optimized CTA order"],
            sampleUrl: "https://utralink.com/BioLink",
            urls: [
              "https://utralink.com/BioLink",
              "https://utralink.com/bio2",
              "https://utralink.com/sj5gnd",
              "https://utralink.com/enciso",
            ],
          },
          {
            title: "Business Profile",
            subtitle: "Brand presentation in mobile format",
            points: ["Services and highlights", "Location, hours, CTA", "Editable without QR reprint"],
            sampleUrl: "https://utralink.com/rest",
            urls: [
              "https://utralink.com/rest",
              "https://utralink.com/Barber",
              "https://utralink.com/poqy9t",
              "https://utralink.com/resume",
              "https://utralink.com/kgiatg",
            ],
          },
        ],
        liveTitle: "Live uTraLink examples",
        workflowTitle: "QR Delivery Workflow",
        workflowSteps: [
          { step: "01", title: "Use-Case Mapping", text: "Define customer journey touchpoints and target conversions first." },
          { step: "02", title: "QR Architecture", text: "Implement dynamic destination logic, tracking parameters, and admin control." },
          { step: "03", title: "Mobile Experiences", text: "Design vCard, BioLink, and Business Profile flows for conversion." },
          { step: "04", title: "Launch & Optimize", text: "Ship, measure KPI trends, then continuously improve live destinations." },
        ],
        comparisonTitle: "Static vs Dynamic QR Value",
        comparisonRows: [
          { area: "Printed Material", staticMode: "Reprint for every change", dynamicMode: "Print once, update content live" },
          { area: "Campaign Agility", staticMode: "Slow iteration", dynamicMode: "Fast updates in minutes" },
          { area: "Lead Capture", staticMode: "Limited", dynamicMode: "Form, WhatsApp, booking, and profile flows" },
          { area: "Analytics", staticMode: "Low visibility", dynamicMode: "Scans, behavior, and conversions tracked" },
          { area: "Operations", staticMode: "Fragmented process", dynamicMode: "Centralized admin workflow" },
        ],
        testimonialsTitle: "Client Impact",
        testimonials: [
          {
            quote: "One QR across printed assets, but weekly offer updates without reprints. We cut both time and cost.",
            name: "Retail Operations Lead",
            role: "Multi-Location Business",
          },
          {
            quote: "The digital business card flow made event networking frictionless. Contacts now move directly into our funnel.",
            name: "Founder",
            role: "B2B Services",
          },
          {
            quote: "Dynamic QR flows finally gave us clear data on which campaigns actually generate leads.",
            name: "Marketing Manager",
            role: "Local Brand",
          },
        ],
        leadTitle: "Start Your QR Solution Project",
        leadDesc: "Share your use case and I will propose a practical rollout plan for your business.",
        leadName: "Name",
        leadEmail: "Email",
        leadCompany: "Company",
        leadUseCase: "Primary Use Case",
        useCaseOptions: [
          "Virtual Business Card",
          "BioLink Hub",
          "Business Profile",
          "Campaign QR System",
          "Multi-branch QR Operations",
        ],
        leadMessage: "Project Details",
        leadSubmit: "Send QR Project Inquiry",
        leadSending: "Sending...",
        leadSuccess: "Your request was sent successfully. I will get back to you shortly.",
        leadError: "Could not send right now. Please try again in a moment.",
        leadPrivacyConsentPrefix:
          "I agree that my details are processed to handle this request. I have read the",
        leadPrivacyConsentLink: "Privacy Policy",
        leadPrivacyConsentSuffix: ".",
        leadPrivacyConsentError: "Please agree to data processing according to the Privacy Policy.",
        checklistTitle: "Getting Started Checklist",
        checklistIntro: "Follow these quick steps to launch your first business-ready QR flow.",
        checklistSteps: [
          {
            title: "Step 1: Setup",
            items: [
              "Define campaign goals and desired user action first.",
              "Prepare branding assets: logo, colors, and CTA language.",
              "Select target touchpoints (print, packaging, storefront, events).",
            ],
          },
          {
            title: "Step 2: Create First QR",
            items: [
              "Choose the right QR type (URL, vCard, profile, form, WhatsApp).",
              "Add destination content and preview mobile output immediately.",
              "Test-scan on iPhone and Android before publishing.",
            ],
          },
          {
            title: "Step 3: Organize & Manage",
            items: [
              "Use folders/tags by campaign, client, and location.",
              "Name QR codes clearly for reporting and handover.",
            ],
          },
          {
            title: "Step 4: Track & Analyze",
            items: [
              "Use dynamic mode for analytics and fast destination updates.",
              "Review scan trends by channel, device, and time range.",
            ],
          },
          {
            title: "Step 5: Share & Scale",
            items: [
              "Export print-ready assets and deploy across channels.",
              "Optimize destination content continuously without reprints.",
            ],
          },
        ],
        tipsTitle: "Tips & Tricks",
        tipsItems: [
          { title: "Make It Dynamic", text: "Use dynamic QR when destination content may change later." },
          { title: "Brand It Clearly", text: "Apply logo and color styling while preserving scan contrast." },
          { title: "Use The Right Type", text: "Match QR type to your business objective and user intent." },
          { title: "Track and Learn", text: "Use scan analytics to identify top-performing placements." },
          { title: "Update Without Reprinting", text: "Edit dynamic QR destinations instead of printing new assets." },
          { title: "Add Clear CTA", text: "Tell users exactly what they gain after scanning." },
          { title: "Test Before Launch", text: "Always validate with multiple devices and scanner apps." },
          { title: "Keep It Simple", text: "Avoid clutter around QR visuals and keep quiet zones clean." },
        ],
        stickyCta: "Need a conversion-ready QR system?",
        stickyPrimary: "Book QR Strategy",
        stickySecondary: "Open Contact",
        liveGroups: [
          {
            label: "vCard links",
            links: [
              "https://utralink.com/v5xucn",
              "https://utralink.com/kws83v",
              "https://utralink.com/cnhgdb",
              "https://utralink.com/lrdene1",
              "https://utralink.com/ou7htj",
              "https://utralink.com/lrdene",
              "https://utralink.com/yfxvii",
              "https://utralink.com/5a66kf",
            ],
          },
          {
            label: "BioLink links",
            links: [
              "https://utralink.com/enciso",
              "https://utralink.com/bio2",
              "https://utralink.com/sj5gnd",
              "https://utralink.com/BioLink",
            ],
          },
          {
            label: "Business Profile links",
            links: [
              "https://utralink.com/poqy9t",
              "https://utralink.com/rest",
              "https://utralink.com/Barber",
              "https://utralink.com/resume",
              "https://utralink.com/kgiatg",
            ],
          },
        ],
      };
  const [selectedFrameUrlIndex, setSelectedFrameUrlIndex] = useState<Record<number, number>>({});
  const [loadedFramePreview, setLoadedFramePreview] = useState<Record<number, boolean>>({});
  const createLead = useMutation(api.leads.create);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    useCase: "Virtual Business Card",
    message: "",
    privacyConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { scrollYProgress } = useScroll();
  const orbAY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const orbBY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroLift = useTransform(scrollYProgress, [0, 0.35], [0, -18]);
  const sectionReveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };
  const staggerWrap = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: 0.06 },
    },
  };
  const staggerItem = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42 },
    },
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    if (!formData.privacyConsent) {
      setSubmitError(copy.leadPrivacyConsentError);
      return;
    }
    setSubmitError("");
    setIsSubmitting(true);
    const nicheMap: Record<string, string> = {
      "Virtual Business Card": "qr-vcard",
      "BioLink Hub": "qr-biolink",
      "Business Profile": "qr-business-profile",
      "Campaign QR System": "qr-campaign",
      "Multi-branch QR Operations": "qr-operations",
    };
    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || undefined,
        projectType: `QR Solutions: ${formData.useCase}`,
        budget: "To be discussed",
        timeline: "Discovery pending",
        message: `[Use case] ${formData.useCase}\n\n${formData.message.trim()}`,
        niche: nicheMap[formData.useCase] || "qr-solutions",
        privacyConsent: formData.privacyConsent,
        privacyConsentAt: Date.now(),
        privacyConsentVersion: PRIVACY_CONSENT_VERSION,
      });
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        useCase: "Virtual Business Card",
        message: "",
        privacyConsent: false,
      });
    } catch (error) {
      console.error("Failed to submit QR lead", error);
      setSubmitError(copy.leadError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.ambientLayer} aria-hidden="true">
        <motion.span className={styles.ambientOrbA} style={{ y: orbAY }} />
        <motion.span className={styles.ambientOrbB} style={{ y: orbBY }} />
      </div>
      <div className="container">
        <motion.section className={styles.hero} style={{ y: heroLift }}>
          <div className={styles.heroLayout}>
            <div className={styles.heroMain}>
              <span className={styles.eyebrow}>{copy.eyebrow}</span>
              <h1 className={styles.title}>{copy.title}</h1>
              <p className={styles.subtitle}>{copy.subtitle}</p>
              <div className={styles.metricRow}>
                {copy.heroMetrics.map((metric) => (
                  <article key={metric.label} className={styles.metricCard}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </article>
                ))}
              </div>
              <div className={styles.actions}>
                <LocaleLink href="/#contact" className="magnetic-button">
                  {copy.ctaPrimary}
                </LocaleLink>
                <LocaleLink href="/contact" className="magnetic-button">
                  {copy.ctaSecondary}
                </LocaleLink>
              </div>
            </div>
            <aside className={styles.heroPanel}>
              <h3>{copy.useCasesTitle}</h3>
              <ul className={styles.heroPanelList}>
                {copy.useCases.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className={styles.heroPanelFoot}>
                <span>{copy.heroMetrics[0]?.value}</span>
                <small>{copy.heroMetrics[0]?.label}</small>
              </div>
            </aside>
          </div>
        </motion.section>

        <motion.section
          className={styles.grid}
          variants={staggerWrap}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {copy.cards.map((card, index) => (
            <motion.article key={card.title} className={styles.card} variants={staggerItem}>
              <span className={styles.cardIndex}>0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.showcaseTitle}</h2>
          <motion.div className={styles.showcaseGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {copy.showcaseItems.map((item, index) => (
              <motion.article
                key={item.title}
                className={`${styles.showcaseCard} ${index === 0 ? styles.showcaseFeatured : ""}`}
                variants={staggerItem}
              >
                <div className={styles.showcaseImageWrap}>
                  <Image src="/assets/uTraLink-icon.png" alt={item.title} fill className={styles.showcaseImage} sizes="(max-width: 960px) 100vw, 33vw" />
                  <div className={styles.showcaseOverlay} />
                  <div className={styles.showcaseLogo}>
                    <span className={styles.showcaseLogoRing} />
                    <Image src="/assets/LOGO.png" alt="LOrdEnRYQuE" width={30} height={30} className={styles.showcaseNavLogo} />
                  </div>
                  <span className={styles.showcaseTag}>{index === 0 ? "Featured" : "Campaign"}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.workflowTitle}</h2>
          <motion.div className={styles.workflowGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {copy.workflowSteps.map((item) => (
              <motion.article key={item.step} className={styles.workflowCard} variants={staggerItem}>
                <span className={styles.workflowStep}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.emulatorTitle}</h2>
          <p className={styles.subtitle}>{copy.emulatorDesc}</p>
          <motion.div className={styles.emulatorGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
            {copy.frames.map((frame, index) => (
              <motion.article
                key={frame.title}
                className={`${styles.phoneFrame} ${index === 0 ? styles.frameA : index === 1 ? styles.frameB : styles.frameC}`}
                variants={staggerItem}
                whileHover={{ y: -4 }}
              >
                <div className={styles.frameBadge}>
                  <span>{index === 0 ? "vCard" : index === 1 ? "BioLink" : "Business"}</span>
                </div>
                <div className={styles.phoneNotch} />
                <div className={styles.phoneScreen}>
                  <div className={styles.phoneHeader}>
                    <Image src="/assets/uTraLink-icon.png" alt="uTraLink Logo" width={30} height={30} />
                    <span className={styles.phoneHeaderLabel}>uTraLink Preview</span>
                  </div>
                  <div className={styles.phoneBody}>
                    <h4>{frame.title}</h4>
                    <p>{frame.subtitle}</p>
                    <ul>
                      {frame.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <div className={styles.previewControls}>
                      <label htmlFor={`frame-url-${index}`}>Live URL</label>
                      <select
                        id={`frame-url-${index}`}
                        className={styles.previewSelect}
                        value={selectedFrameUrlIndex[index] ?? 0}
                        onChange={(event) =>
                          setSelectedFrameUrlIndex((prev) => ({
                            ...prev,
                            [index]: Number(event.target.value),
                          }))
                        }
                      >
                        {(frame.urls ?? [frame.sampleUrl]).map((url, optionIndex) => (
                          <option key={url} value={optionIndex}>
                            {url.replace("https://utralink.com/", "utralink.com/")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.frameViewport}>
                      {loadedFramePreview[index] ? (
                        <iframe
                          title={`${frame.title} live preview`}
                          src={(frame.urls ?? [frame.sampleUrl])[selectedFrameUrlIndex[index] ?? 0]}
                          className={styles.liveFrame}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                        />
                      ) : (
                        <button
                          type="button"
                          className={styles.frameLoadBtn}
                          onClick={() =>
                            setLoadedFramePreview((prev) => ({
                              ...prev,
                              [index]: true,
                            }))
                          }
                        >
                          {copy.emulatorLoadPreview}
                        </button>
                      )}
                    </div>
                    <p className={styles.frameHint}>
                      Live preview is embedded where allowed by the destination site.
                    </p>
                    <a href={frame.sampleUrl} target="_blank" rel="noopener noreferrer" className={styles.sampleLink}>
                      Open Live Example
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.liveTitle}</h2>
          <motion.div className={styles.liveGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {copy.liveGroups.map((group, index) => (
              <motion.article
                key={group.label}
                className={`${styles.liveCard} ${index === 0 ? styles.liveFeatured : ""}`}
                variants={staggerItem}
              >
                <h3>{group.label}</h3>
                <div className={styles.liveLinks}>
                  {group.links.map((link, linkIndex) => (
                    <a key={link} href={link} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                      <span className={styles.liveIndex}>{String(linkIndex + 1).padStart(2, "0")}</span>
                      {link.replace("https://utralink.com/", "utralink.com/")}
                    </a>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.comparisonTitle}</h2>
          <div className={styles.compareTable}>
            <div className={`${styles.compareRow} ${styles.compareHead}`}>
              <span>Area</span>
              <span>Static QR</span>
              <span>Dynamic QR</span>
            </div>
            {copy.comparisonRows.map((row) => (
              <div key={row.area} className={styles.compareRow}>
                <span>{row.area}</span>
                <span>{row.staticMode}</span>
                <span>{row.dynamicMode}</span>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.testimonialsTitle}</h2>
          <motion.div className={styles.testimonialGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {copy.testimonials.map((item) => (
              <motion.article key={`${item.name}-${item.role}`} className={styles.testimonialCard} variants={staggerItem}>
                <p>"{item.quote}"</p>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.benefitTitle}</h2>
          <div className={styles.list}>
            {copy.benefits.map((item) => (
              <div key={item} className={styles.item}>
                {item}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.useCasesTitle}</h2>
          <div className={styles.list}>
            {copy.useCases.map((item) => (
              <div key={item} className={styles.item}>
                {item}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <div className={styles.leadCard}>
            <h2>{copy.leadTitle}</h2>
            <p>{copy.leadDesc}</p>
            {submitted ? (
              <div className={styles.leadSuccess}>{copy.leadSuccess}</div>
            ) : (
              <form className={styles.leadForm} onSubmit={handleSubmit}>
                <div className={styles.leadGrid}>
                  <label>
                    <span>{copy.leadName}</span>
                    <input
                      required
                      value={formData.name}
                      onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>{copy.leadEmail}</span>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>{copy.leadCompany}</span>
                    <input
                      value={formData.company}
                      onChange={(event) => setFormData((prev) => ({ ...prev, company: event.target.value }))}
                    />
                  </label>
                  <label>
                    <span>{copy.leadUseCase}</span>
                    <select
                      value={formData.useCase}
                      onChange={(event) => setFormData((prev) => ({ ...prev, useCase: event.target.value }))}
                    >
                      {copy.useCaseOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className={styles.fullField}>
                  <span>{copy.leadMessage}</span>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                    placeholder="Share goals, channels, timeline, and expected outcomes."
                  />
                </label>
                <label className={styles.consentField}>
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(event) => setFormData((prev) => ({ ...prev, privacyConsent: event.target.checked }))}
                    required
                  />
                  <span>
                    {copy.leadPrivacyConsentPrefix}{" "}
                    <LocaleLink href="/privacy" className={styles.privacyLink}>
                      {copy.leadPrivacyConsentLink}
                    </LocaleLink>
                    {" "}
                    {copy.leadPrivacyConsentSuffix}
                  </span>
                </label>
                {submitError ? <p className={styles.leadError}>{submitError}</p> : null}
                <button type="submit" className="magnetic-button" disabled={isSubmitting}>
                  {isSubmitting ? copy.leadSending : copy.leadSubmit}
                </button>
              </form>
            )}
          </div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.checklistTitle}</h2>
          <p className={styles.subtitle}>{copy.checklistIntro}</p>
          <div className={styles.accordionStack}>
            {copy.checklistSteps.map((step) => (
              <details key={step.title} className={styles.accordionItem} open>
                <summary>{step.title}</summary>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </motion.section>

        <motion.section className={styles.section} variants={sectionReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <h2>{copy.tipsTitle}</h2>
          <motion.div className={styles.tipGrid} variants={staggerWrap} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {copy.tipsItems.map((tip) => (
              <motion.article key={tip.title} className={styles.tipCard} variants={staggerItem}>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>
      </div>
      <div className={styles.stickyCtaBar}>
        <p>{copy.stickyCta}</p>
        <div className={styles.stickyActions}>
          <LocaleLink href="/#contact" className="magnetic-button">
            {copy.stickyPrimary}
          </LocaleLink>
          <LocaleLink href="/contact" className={styles.stickyGhost}>
            {copy.stickySecondary}
          </LocaleLink>
        </div>
      </div>
    </main>
  );
}
