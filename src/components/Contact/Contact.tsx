"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Contact.module.css";
import { Mail, MessageSquare, Linkedin, Send, CheckCircle2, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLocale } from "@/lib/i18n/useLocale";
import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useSearchParams } from "next/navigation";

type ContactContent = {
  title: string;
  subtitle: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  location?: string;
  form?: {
    enabled?: boolean;
    submitLabel?: string;
    successTitle?: string;
    successMessage?: string;
    projectTypes?: string[];
    budgets?: string[];
    timelines?: string[];
    platformOptions?: string[];
    goalOptions?: string[];
    engagementOptions?: string[];
    scopeOptions?: string[];
    advancedScopeOptions?: string[];
    backendDepthOptions?: string[];
  };
};
type HomePromotionsContent = {
  tiers?: Array<{ off?: string }>;
};

const defaultProjectTypes = ["Full Product Build", "AI-Native App", "Premium Branding", "Advisory/Consulting"];
const defaultBudgets = ["€10k - €25k", "€25k - €50k", "€50k+", "Equity Based (Select Startups)"];
const defaultTimelines = ["Urgent (< 1 Month)", "1-3 Months", "3-6 Months", "Long-term Partnership"];
const CUSTOM_BUDGET_VALUE = "__custom_budget__";
const QR_PROJECT_TYPE_EN = "QR/NFC Solution";
const QR_PROJECT_TYPE_DE = "QR/NFC Lösung";
const MIN_NAME_LENGTH = 2;
const MIN_MESSAGE_LENGTH = 20;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRIVACY_CONSENT_VERSION = "contact_form_v1";

export const Contact = () => {
  const DEFAULT_CONTACT_TITLE = "Let's Build Your Next Digital Product.";
  const DEFAULT_CONTACT_SUBTITLE = "Currently accepting selective client projects in Germany and across Europe.";
  const LEGACY_CONTACT_TITLE = "Let's Build Something Trustworthy.";
  const LEGACY_CONTACT_SUBTITLE =
    "Usually replies within 24-48 hours. Available for end-to-end product builds, AI integrations, and premium brand redesigns.";
  const LEGACY_TEST_CONTACT_TITLE = "TEST CONTACT HEADLINE";
  const LEGACY_TEST_CONTACT_SUBTITLE = "Currently accepting selective projects for Q3 2024.";

  const DEFAULT_CONTACT_EMAIL = "lordenryque.dev@gmail.com";
  const DEFAULT_WHATSAPP = "+49 1722620671";
  const DEFAULT_LINKEDIN = "LOrdEnRQuE";
  const DEFAULT_LOCATION = "Germany BY, 84028. Landshut Nahensteig 188E";
  const LEGACY_EMAILS = ["hello@lrdene.com", "hello@leads.dev"];
  const LEGACY_WHATSAPPS = ["+[Your Number]", "+1234567890"];
  const LEGACY_LINKEDINS = ["Attila Lazar", "https://linkedin.com/in/leads", "linkedin.com/in/leads", "leads"];

  const locale = useLocale();
  const searchParams = useSearchParams();
  const content = useQuery(api.pages.getPageContent, { key: "contact", locale, fallbackToEnglish: false });
  const data = (content?.data ?? {}) as ContactContent;
  const promotionsContent = useQuery(api.pages.getPageContent, { key: "home_promotions", locale, fallbackToEnglish: true });
  const promotionsData = (promotionsContent?.data ?? {}) as HomePromotionsContent;

  const formEnabled = data.form?.enabled ?? true;
  const submitLabel =
    data.form?.submitLabel || (locale === "de" ? "Anfrage Senden" : "Send Inquiry");
  const successTitle =
    data.form?.successTitle || (locale === "de" ? "Anfrage Erhalten!" : "Inquiry Received!");
  const successMessage =
    data.form?.successMessage ||
    (locale === "de"
      ? "Danke fur deine Nachricht. Ich prufe dein Projekt und melde mich zeitnah."
      : "Thanks for reaching out. I'll review your project details and get back to you shortly.");

  const projectTypes = useMemo(
    () => {
      const base = Array.isArray(data.form?.projectTypes) && data.form?.projectTypes.length ? data.form.projectTypes : defaultProjectTypes;
      const qrLabel = locale === "de" ? QR_PROJECT_TYPE_DE : QR_PROJECT_TYPE_EN;
      return base.includes(qrLabel) ? base : [...base, qrLabel];
    },
    [data.form?.projectTypes, locale],
  );
  const budgets = useMemo(
    () => (Array.isArray(data.form?.budgets) && data.form?.budgets.length ? data.form.budgets : defaultBudgets),
    [data.form?.budgets],
  );
  const timelines = useMemo(
    () => (Array.isArray(data.form?.timelines) && data.form?.timelines.length ? data.form.timelines : defaultTimelines),
    [data.form?.timelines],
  );

  const copy =
    locale === "de"
      ? {
          title: "Lass uns etwas Verlassliches bauen.",
          subtitle:
            "Antwortet in der Regel innerhalb von 24-48 Stunden. Verfugbar fur Produktaufbau, KI-Integration und Premium Redesigns.",
          email: "E-Mail",
          whatsapp: "WhatsApp",
          linkedin: "LinkedIn",
          location: "Standort",
          disabledTitle: "Kontaktformular ist vorubergehend geschlossen",
          disabledSubtitle: "Bitte nutze E-Mail oder WhatsApp aus dem linken Bereich.",
          sendAnother: "Weitere Anfrage Senden",
          optional: "Optional",
          sending: "Wird gesendet...",
          note: "Deine Daten werden nur zur Bearbeitung deiner Anfrage gemaß Datenschutzerklarung verarbeitet.",
          privacyConsentPrefix: "Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Ich habe die",
          privacyConsentLink: "Datenschutzerklarung",
          privacyConsentSuffix: "gelesen.",
          stepLabels: ["Basis", "Projekt", "Scope", "Details"],
          next: "Weiter",
          back: "Zuruck",
          submit: submitLabel,
          progress: "Fortschritt",
          reviewTitle: "Zusammenfassung",
          reviewProject: "Projekt",
          reviewPlatforms: "Plattformen",
          reviewGoals: "Ziele",
          reviewScope: "Scope",
          reviewBudget: "Budget",
          reviewTimeline: "Zeitrahmen",
          reviewQrUseCase: "QR Use Case",
          reviewPromotion: "Startup Promotion",
          submitError: "Senden fehlgeschlagen. Bitte versuche es erneut oder nutze E-Mail/WhatsApp.",
          step1Title: "Basisinformationen",
          name: "Name",
          namePlaceholder: "Dein Name",
          emailLabel: "E-Mail",
          emailPlaceholder: "email@beispiel.de",
          company: "Unternehmen",
          companyPlaceholder: "Dein Unternehmen",
          step2Title: "Projektart & Plattform",
          projectType: "Projekt Typ",
          projectHint: "Wahle den Schwerpunkt deines Projekts.",
          platforms: "Plattformen",
          platformHint: "Mehrfachauswahl moglich.",
          goals: "Projektziele",
          goalsHint: "Was soll das Projekt konkret erreichen?",
          engagement: "Zusammenarbeitsmodell",
          engagementHint: "Wie mochtest du zusammenarbeiten?",
          qrUseCase: "QR Use Case",
          qrUseCaseHint: "Welche QR/NFC-Implementierung ist dein Hauptfokus?",
          step3Title: "Leistungsumfang",
          checklistTitle: "Was brauchst du?",
          checklistHint: "Markiere die gewunschten Bestandteile.",
          advancedScopeTitle: "Erweiterte Features",
          advancedScopeHint: "Optional: technische und operative Add-ons.",
          backendDepth: "Backend Tiefe",
          backendDepthHint: "Wie umfangreich soll die Backend-Logik sein?",
          scopeNote: "Feature / Backend Hinweise",
          scopePlaceholder: "z.B. 12 Seiten, Nutzerrollen, API Integrationen, Admin Dashboard...",
          step4Title: "Budget, Timeline & Nachricht",
          budget: "Geschatztes Budget",
          customBudget: "Eigenes Budget",
          customBudgetPlaceholder: "z.B. 18.000 EUR",
          timeline: "Ziel-Zeitrahmen",
          promotion: "Startup Promotion Anwenden",
          promotionHint: "Falls dein Unternehmen ein Startup ist, kannst du eine Promotion-Stufe anfragen (10% bis 50% OFF).",
          promotionNone: "Keine Promotion",
          message: "Nachricht",
          messagePlaceholder: "Beschreibe Ziele, Probleme, Deadline und woran Erfolg gemessen wird...",
          validation1: "Bitte Name und E-Mail ausfullen.",
          validationEmail: "Bitte eine gultige E-Mail-Adresse eingeben.",
          validationNameLength: "Bitte gib mindestens 2 Zeichen fur den Namen ein.",
          validation2: "Bitte Projekttyp und mindestens eine Plattform wahlen.",
          validation3: "Bitte mindestens einen Scope-Punkt auswahlen.",
          validation4: "Bitte eine Nachricht eingeben.",
          validationMessageLength: "Bitte gib mehr Details an (mindestens 20 Zeichen).",
          validationBudget: "Bitte eigenes Budget eingeben oder eine Budget-Stufe wahlen.",
          validationGoals: "Bitte mindestens ein Projektziel auswahlen.",
          validationPrivacyConsent: "Bitte stimme der Verarbeitung gemaß Datenschutzerklarung zu.",
        }
      : {
          title: "Let's Build Something Trustworthy.",
          subtitle:
            "Usually replies within 24-48 hours. Available for end-to-end product builds, AI integrations, and premium brand redesigns.",
          email: "Email",
          whatsapp: "WhatsApp",
          linkedin: "LinkedIn",
          location: "Location",
          disabledTitle: "Contact form is temporarily closed",
          disabledSubtitle: "Please use email or WhatsApp from the left panel.",
          sendAnother: "Send Another",
          optional: "Optional",
          sending: "Sending...",
          note: "Your data is used only to handle your inquiry, as described in our Privacy Policy.",
          privacyConsentPrefix: "I agree that my details are processed to handle my inquiry. I have read the",
          privacyConsentLink: "Privacy Policy",
          privacyConsentSuffix: ".",
          stepLabels: ["Basics", "Project", "Scope", "Details"],
          next: "Next",
          back: "Back",
          submit: submitLabel,
          progress: "Progress",
          reviewTitle: "Review",
          reviewProject: "Project",
          reviewPlatforms: "Platforms",
          reviewGoals: "Goals",
          reviewScope: "Scope",
          reviewBudget: "Budget",
          reviewTimeline: "Timeline",
          reviewQrUseCase: "QR Use Case",
          reviewPromotion: "Startup Promotion",
          submitError: "Could not send right now. Please try again or use Email/WhatsApp.",
          step1Title: "Basic Information",
          name: "Name",
          namePlaceholder: "Your name",
          emailLabel: "Email",
          emailPlaceholder: "email@example.com",
          company: "Company",
          companyPlaceholder: "Your organization",
          step2Title: "Project Type & Platforms",
          projectType: "Project Type",
          projectHint: "Choose your main project direction.",
          platforms: "Platforms",
          platformHint: "You can select multiple.",
          goals: "Project Goals",
          goalsHint: "What outcomes should this project drive?",
          engagement: "Engagement Model",
          engagementHint: "How do you want to collaborate?",
          qrUseCase: "QR Use Case",
          qrUseCaseHint: "Which QR/NFC implementation is your primary focus?",
          step3Title: "Scope Checklist",
          checklistTitle: "What should be included?",
          checklistHint: "Mark all items needed for this project.",
          advancedScopeTitle: "Advanced Scope",
          advancedScopeHint: "Optional technical and operational add-ons.",
          backendDepth: "Backend Depth",
          backendDepthHint: "How deep should backend logic go?",
          scopeNote: "Feature / Backend Notes",
          scopePlaceholder: "e.g. 12 pages, role permissions, API integrations, admin dashboard...",
          step4Title: "Budget, Timeline & Message",
          budget: "Estimated Budget",
          customBudget: "Custom Budget",
          customBudgetPlaceholder: "e.g. 18,000 EUR",
          timeline: "Target Timeline",
          promotion: "Apply Startup Promotion",
          promotionHint: "If your business is a startup, you can request a promotion tier (10% up to 50% OFF).",
          promotionNone: "No Promotion",
          message: "Message",
          messagePlaceholder: "Share goals, constraints, deadline, and what success looks like...",
          validation1: "Please fill in name and email.",
          validationEmail: "Please enter a valid email address.",
          validationNameLength: "Please enter at least 2 characters for your name.",
          validation2: "Please choose a project type and at least one platform.",
          validation3: "Please select at least one scope item.",
          validation4: "Please add a message.",
          validationMessageLength: "Please share more detail (at least 20 characters).",
          validationBudget: "Please enter a custom budget or choose one range.",
          validationGoals: "Please select at least one project goal.",
          validationPrivacyConsent: "Please agree to data processing according to the Privacy Policy.",
        };

  const platformOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.platformOptions) && data.form.platformOptions.length > 0) return data.form.platformOptions;
      return locale === "de"
        ? ["Mobile Anwendung", "Desktop Anwendung", "Web Anwendung", "Cross-Platform"]
        : ["Mobile Application", "Desktop Application", "Web Application", "Cross-Platform"];
    },
    [data.form?.platformOptions, locale],
  );
  const goalOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.goalOptions) && data.form.goalOptions.length > 0) return data.form.goalOptions;
      return locale === "de"
        ? ["Leads steigern", "Verkauf erhohen", "Prozesse automatisieren", "Marke modernisieren", "MVP launchen", "Skalierung vorbereiten"]
        : ["Generate Leads", "Increase Sales", "Automate Operations", "Modernize Brand", "Launch MVP", "Prepare for Scale"];
    },
    [data.form?.goalOptions, locale],
  );
  const engagementOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.engagementOptions) && data.form.engagementOptions.length > 0) return data.form.engagementOptions;
      return locale === "de"
        ? ["Done-for-you (komplett)", "Collaborative Sprint", "Technische Beratung", "Retainer / Langfristig"]
        : ["Done-for-you (full delivery)", "Collaborative Sprint", "Technical Advisory", "Retainer / Long-term"];
    },
    [data.form?.engagementOptions, locale],
  );
  const scopeOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.scopeOptions) && data.form.scopeOptions.length > 0) return data.form.scopeOptions;
      return ["Logo", "Pages", "Features", "Database", "Backend", "CMS/Admin", "SEO Setup", "Analytics"];
    },
    [data.form?.scopeOptions],
  );
  const advancedScopeOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.advancedScopeOptions) && data.form.advancedScopeOptions.length > 0) return data.form.advancedScopeOptions;
      return locale === "de"
        ? ["Auth & Rollen", "Payment Integration", "CRM Integration", "Marketing Automation", "Mehrsprachigkeit", "E-Mail Flows"]
        : ["Auth & Roles", "Payment Integration", "CRM Integration", "Marketing Automation", "Multilingual Setup", "Email Flows"];
    },
    [data.form?.advancedScopeOptions, locale],
  );
  const backendDepthOptions = useMemo(
    () => {
      if (Array.isArray(data.form?.backendDepthOptions) && data.form.backendDepthOptions.length > 0) return data.form.backendDepthOptions;
      return locale === "de"
        ? ["Light (Basis API + Formular)", "Medium (Dashboard + Workflows)", "Advanced (Integrationen + Automationen)"]
        : ["Light (basic API + forms)", "Medium (dashboard + workflows)", "Advanced (integrations + automation)"];
    },
    [data.form?.backendDepthOptions, locale],
  );
  const qrUseCaseOptions = useMemo(
    () =>
      locale === "de"
        ? [
            { label: "Virtuelle Business Card", niche: "qr-vcard" },
            { label: "BioLink Hub", niche: "qr-biolink" },
            { label: "Business Profile", niche: "qr-business-profile" },
            { label: "Campaign QR System", niche: "qr-campaign" },
            { label: "Multi-branch QR Operations", niche: "qr-operations" },
          ]
        : [
            { label: "Virtual Business Card", niche: "qr-vcard" },
            { label: "BioLink Hub", niche: "qr-biolink" },
            { label: "Business Profile", niche: "qr-business-profile" },
            { label: "Campaign QR System", niche: "qr-campaign" },
            { label: "Multi-branch QR Operations", niche: "qr-operations" },
          ],
    [locale],
  );
  const promotionOptions = useMemo(() => {
    const seeded = Array.isArray(promotionsData.tiers)
      ? promotionsData.tiers
          .map((tier) => (typeof tier?.off === "string" ? tier.off.trim() : ""))
          .filter((off) => off.length > 0)
          .map((off) => (off.toLowerCase().includes("off") ? off : `${off} OFF`))
      : [];
    const fallback = ["10% OFF", "20% OFF", "30% OFF", "40% OFF", "50% OFF"];
    const merged = [...seeded, ...fallback];
    return merged.filter((item, index) => merged.indexOf(item) === index);
  }, [promotionsData.tiers]);
  const pickOption = (options: string[], index: number, fallback: string) => options[index] ?? options[0] ?? fallback;
  const buildInitialFormData = () => ({
    name: "",
    email: "",
    company: "",
    projectType: pickOption(projectTypes, 0, defaultProjectTypes[0]),
    platforms: [pickOption(platformOptions, 2, "Web Application")],
    goals: [pickOption(goalOptions, 0, "Generate Leads")],
    engagement: pickOption(engagementOptions, 0, "Done-for-you (full delivery)"),
    qrUseCase: "qr-vcard",
    scope: [pickOption(scopeOptions, 2, "Features"), pickOption(scopeOptions, 4, "Backend")],
    scopeAdvanced: [pickOption(advancedScopeOptions, 0, "Auth & Roles")],
    backendDepth: pickOption(backendDepthOptions, 1, "Medium (dashboard + workflows)"),
    scopeNotes: "",
    promotionRequest: "none",
    budget: pickOption(budgets, 0, defaultBudgets[0]),
    budgetCustom: "",
    timeline: pickOption(timelines, 1, defaultTimelines[1]),
    message: "",
    privacyConsent: false,
  });

  const [formData, setFormData] = useState(buildInitialFormData);
  const [step, setStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [website, setWebsite] = useState("");
  const controlsDisabled = isSubmitting;
  const startedTrackingRef = useRef(false);
  const prefillAppliedRef = useRef(false);

  const createLead = useMutation(api.leads.create);
  const { trackConversion, trackEvent } = useAnalytics();
  const totalSteps = 4;
  const progressPercent = Math.round((step / totalSteps) * 100);
  const isQrProject =
    formData.projectType === QR_PROJECT_TYPE_EN ||
    formData.projectType === QR_PROJECT_TYPE_DE ||
    /qr|nfc/i.test(formData.projectType);
  const contactEmail = !data.email || LEGACY_EMAILS.includes(data.email) ? DEFAULT_CONTACT_EMAIL : data.email;
  const whatsappValue = !data.whatsapp || LEGACY_WHATSAPPS.includes(data.whatsapp) ? DEFAULT_WHATSAPP : data.whatsapp;
  const linkedinValue = !data.linkedin || LEGACY_LINKEDINS.includes(data.linkedin) ? DEFAULT_LINKEDIN : data.linkedin;
  const locationValue = !data.location ? DEFAULT_LOCATION : data.location;
  const titleValue =
    !data.title || data.title === LEGACY_CONTACT_TITLE || data.title === LEGACY_TEST_CONTACT_TITLE
      ? DEFAULT_CONTACT_TITLE
      : data.title;
  const subtitleValue =
    !data.subtitle || data.subtitle === LEGACY_CONTACT_SUBTITLE || data.subtitle === LEGACY_TEST_CONTACT_SUBTITLE
      ? DEFAULT_CONTACT_SUBTITLE
      : data.subtitle;
  const whatsappHref = (() => {
    const normalized = whatsappValue.replace(/[^\d+]/g, "").replace(/^\+/, "");
    return normalized ? `https://wa.me/${normalized}` : undefined;
  })();
  const linkedinHref = (() => {
    if (!linkedinValue || linkedinValue === "Attila Lazar") return "https://www.linkedin.com";
    if (linkedinValue.startsWith("http://") || linkedinValue.startsWith("https://")) return linkedinValue;
    if (linkedinValue.startsWith("linkedin.com")) return `https://${linkedinValue}`;
    return `https://www.linkedin.com/in/${linkedinValue.replace(/^@/, "")}`;
  })();
  const locationHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationValue)}`;

  useEffect(() => {
    setFormData((prev) => {
      const nextPlatforms = prev.platforms.filter((item) => platformOptions.includes(item));
      const nextGoals = prev.goals.filter((item) => goalOptions.includes(item));
      const nextScope = prev.scope.filter((item) => scopeOptions.includes(item));
      const nextScopeAdvanced = prev.scopeAdvanced.filter((item) => advancedScopeOptions.includes(item));
      const nextProjectType = projectTypes.includes(prev.projectType) ? prev.projectType : pickOption(projectTypes, 0, defaultProjectTypes[0]);
      const nextEngagement = engagementOptions.includes(prev.engagement)
        ? prev.engagement
        : pickOption(engagementOptions, 0, "Done-for-you (full delivery)");
      const nextBackendDepth = backendDepthOptions.includes(prev.backendDepth)
        ? prev.backendDepth
        : pickOption(backendDepthOptions, 1, "Medium (dashboard + workflows)");
      const nextBudget = prev.budget === CUSTOM_BUDGET_VALUE || budgets.includes(prev.budget)
        ? prev.budget
        : pickOption(budgets, 0, defaultBudgets[0]);
      const nextTimeline = timelines.includes(prev.timeline)
        ? prev.timeline
        : pickOption(timelines, 1, defaultTimelines[1]);
      const nextPromotionRequest =
        prev.promotionRequest === "none" || promotionOptions.includes(prev.promotionRequest)
          ? prev.promotionRequest
          : "none";

      return {
        ...prev,
        projectType: nextProjectType,
        platforms: nextPlatforms.length ? nextPlatforms : [pickOption(platformOptions, 2, "Web Application")],
        goals: nextGoals.length ? nextGoals : [pickOption(goalOptions, 0, "Generate Leads")],
        engagement: nextEngagement,
        scope: nextScope.length ? nextScope : [pickOption(scopeOptions, 2, "Features")],
        scopeAdvanced: nextScopeAdvanced.length ? nextScopeAdvanced : [pickOption(advancedScopeOptions, 0, "Auth & Roles")],
        backendDepth: nextBackendDepth,
        budget: nextBudget,
        timeline: nextTimeline,
        promotionRequest: nextPromotionRequest,
      };
    });
  }, [advancedScopeOptions, backendDepthOptions, budgets, engagementOptions, goalOptions, platformOptions, projectTypes, promotionOptions, scopeOptions, timelines]);

  useEffect(() => {
    if (prefillAppliedRef.current) return;
    const topic = searchParams.get("topic")?.trim().toLowerCase() || "";
    const service = searchParams.get("service")?.trim() || "";
    if (!topic && !service) {
      prefillAppliedRef.current = true;
      return;
    }

    const isPartnerIntent = ["partners", "partner", "referral", "referrals", "partnership"].includes(topic);

    setFormData((prev) => {
      let next = { ...prev };

      if (isPartnerIntent) {
        const advisoryEngagement =
          engagementOptions.find((entry) => /advisory|beratung/i.test(entry)) ?? engagementOptions[0] ?? prev.engagement;
        const advisoryProjectType =
          projectTypes.find((entry) => /advisory|consulting|beratung/i.test(entry)) ?? projectTypes[0] ?? prev.projectType;

        next = {
          ...next,
          projectType: advisoryProjectType,
          engagement: advisoryEngagement,
        };

        if (!prev.message.trim()) {
          next.message =
            locale === "de"
              ? "Es geht um eine Partner-/Referral-Zusammenarbeit. Hier ist der Kontext:"
              : "This request is for a partner/referral collaboration. Context:";
        }
      }

      if (service) {
        const serviceLine = locale === "de" ? `Gewunschter Service: ${service}` : `Requested service: ${service}`;
        if (!next.scopeNotes.includes(serviceLine)) {
          next.scopeNotes = next.scopeNotes.trim() ? `${next.scopeNotes}\n${serviceLine}` : serviceLine;
        }
      }

      return next;
    });

    prefillAppliedRef.current = true;
  }, [engagementOptions, locale, projectTypes, searchParams]);

  useEffect(() => {
    if (!formEnabled || submitted || startedTrackingRef.current) return;
    trackEvent(ANALYTICS_EVENTS.START_CONTACT_FORM, "Contact form started", {
      route: "/contact",
      source: "contact_section",
    });
    startedTrackingRef.current = true;
  }, [formEnabled, submitted, trackEvent]);

  useEffect(() => {
    if (!formEnabled || submitted) return;
    trackEvent(ANALYTICS_EVENTS.CONTACT_STEP_VIEW, `Contact step ${step} viewed`, {
      step,
      total_steps: totalSteps,
    });
  }, [formEnabled, step, submitted, totalSteps, trackEvent]);

  const toggleListValue = (
    key: "platforms" | "scope" | "goals" | "scopeAdvanced",
    value: string,
    preventEmpty = false,
  ) => {
    setFormData((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      const next = exists ? current.filter((item) => item !== value) : [...current, value];
      if (preventEmpty && next.length === 0) return prev;
      return { ...prev, [key]: next };
    });
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setStepError(copy.validation1);
        return false;
      }
      if (formData.name.trim().length < MIN_NAME_LENGTH) {
        setStepError(copy.validationNameLength);
        return false;
      }
      if (!EMAIL_REGEX.test(formData.email.trim())) {
        setStepError(copy.validationEmail);
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.projectType || formData.platforms.length === 0) {
        setStepError(copy.validation2);
        return false;
      }
      if (formData.goals.length === 0) {
        setStepError(copy.validationGoals);
        return false;
      }
      if (isQrProject && !formData.qrUseCase) {
        setStepError(copy.validation2);
        return false;
      }
    }
    if (currentStep === 3) {
      if (formData.scope.length === 0) {
        setStepError(copy.validation3);
        return false;
      }
    }
    if (currentStep === 4) {
      if (formData.budget === CUSTOM_BUDGET_VALUE && !formData.budgetCustom.trim()) {
        setStepError(copy.validationBudget);
        return false;
      }
      if (!formData.message.trim()) {
        setStepError(copy.validation4);
        return false;
      }
      if (formData.message.trim().length < MIN_MESSAGE_LENGTH) {
        setStepError(copy.validationMessageLength);
        return false;
      }
      if (!formData.privacyConsent) {
        setStepError(copy.validationPrivacyConsent);
        return false;
      }
    }

    setStepError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    trackEvent(ANALYTICS_EVENTS.CONTACT_STEP_NEXT, `Contact step ${step} completed`, {
      step,
      total_steps: totalSteps,
    });
    setStep((prev) => Math.min(totalSteps, prev + 1));
  };

  const handleBack = () => {
    setStepError("");
    trackEvent(ANALYTICS_EVENTS.CONTACT_STEP_BACK, `Contact step ${step} back`, {
      step,
      total_steps: totalSteps,
    });
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (website.trim().length > 0) {
      setSubmitted(true);
      return;
    }
    if (!validateStep(4)) return;
    setSubmitError("");

    const qrUseCaseLabel = qrUseCaseOptions.find((option) => option.niche === formData.qrUseCase)?.label;
    const promotionLabel = formData.promotionRequest === "none" ? copy.promotionNone : formData.promotionRequest;
    const mergedProjectType = isQrProject
      ? `${formData.projectType} (${formData.platforms.join(", ")}${qrUseCaseLabel ? ` • ${qrUseCaseLabel}` : ""})`
      : `${formData.projectType} (${formData.platforms.join(", ")})`;
    const finalBudget = formData.budget === CUSTOM_BUDGET_VALUE ? formData.budgetCustom.trim() : formData.budget;
    const enrichedMessage = [
      formData.message,
      "",
      "--- Project Profile ---",
      `Goals: ${formData.goals.join(", ")}`,
      `Engagement: ${formData.engagement}`,
      ...(isQrProject ? [`QR Use Case: ${qrUseCaseLabel || "qr-solutions"}`] : []),
      `Startup Promotion: ${promotionLabel}`,
      "",
      "--- Scope Summary ---",
      `Checklist: ${formData.scope.join(", ")}`,
      `Advanced: ${formData.scopeAdvanced.join(", ") || "n/a"}`,
      `Backend Depth: ${formData.backendDepth}`,
      `Scope Notes: ${formData.scopeNotes.trim() || "n/a"}`,
    ].join("\n");

    setIsSubmitting(true);
    try {
      await createLead({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim() || undefined,
        projectType: mergedProjectType,
        budget: finalBudget,
        timeline: formData.timeline,
        message: enrichedMessage,
        niche: isQrProject ? formData.qrUseCase || "qr-solutions" : undefined,
        privacyConsent: formData.privacyConsent,
        privacyConsentAt: Date.now(),
        privacyConsentVersion: PRIVACY_CONSENT_VERSION,
      });

      trackConversion("contact_submit", 1);
      trackEvent(ANALYTICS_EVENTS.SUBMIT_CONTACT_FORM, "Contact wizard submitted", {
        projectType: formData.projectType,
        budget: finalBudget,
        timeline: formData.timeline,
        promotion_tier: formData.promotionRequest,
        goals_count: formData.goals.length,
        scope_count: formData.scope.length,
        platforms_count: formData.platforms.length,
        stepCount: totalSteps,
      });

      setSubmitted(true);
      setStep(1);
      setStepError("");
      setFormData(buildInitialFormData());
      setWebsite("");
    } catch (error) {
      console.error("Failed to submit lead", error);
      setSubmitError(copy.submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.contact} id="contact">
      <div className={`${styles.content} container`}>
        <div className={styles.intro}>
          <h2 className="premium-title">{titleValue || copy.title}</h2>
          <p className={styles.introText}>
            {subtitleValue || copy.subtitle}
          </p>

          <div className={styles.contactInfo}>
            <div className={styles.infoItem}>
              <Mail size={20} className="gold-text" />
              <span>
                <strong>{copy.email}:</strong>{" "}
                <a href={`mailto:${contactEmail}`} className={styles.infoLink}>
                  {contactEmail}
                </a>
              </span>
            </div>
            <div className={styles.infoItem}>
              <MessageSquare size={20} className="gold-text" />
              <span>
                <strong>{copy.whatsapp}:</strong>{" "}
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                    {whatsappValue}
                  </a>
                ) : (
                  whatsappValue
                )}
              </span>
            </div>
            <div className={styles.infoItem}>
              <Linkedin size={20} className="gold-text" />
              <span>
                <strong>{copy.linkedin}:</strong>{" "}
                <a href={linkedinHref} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                  {linkedinValue}
                </a>
              </span>
            </div>
            <div className={styles.infoItem}>
              <MapPin size={20} className="gold-text" />
              <span>
                <strong>{copy.location}:</strong>{" "}
                <a href={locationHref} target="_blank" rel="noopener noreferrer" className={styles.infoLink}>
                  {locationValue}
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.formCard}>
          {!formEnabled ? (
            <div className={styles.formDisabled}>
              <h3>{copy.disabledTitle}</h3>
              <p>{copy.disabledSubtitle}</p>
            </div>
          ) : submitted ? (
            <div className={styles.successMessage} style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <CheckCircle2 size={48} className="gold-text" style={{ margin: "0 auto 1rem" }} />
              <h3>{successTitle}</h3>
              <p style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>{successMessage}</p>
              <button onClick={() => setSubmitted(false)} className={styles.primaryAction} style={{ marginTop: "2rem" }}>
                {copy.sendAnother}
              </button>
            </div>
          ) : (
            <form className={styles.wizardForm} onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
                <label htmlFor="contact_website">Website</label>
                <input
                  id="contact_website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  autoComplete="off"
                  tabIndex={-1}
                />
              </div>
              <div className={styles.progressMeta}>
                <span>{copy.progress}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className={styles.progressTrack} aria-hidden="true">
                <span className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
              </div>
              <div className={styles.stepper}>
                {copy.stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const active = step === stepNumber;
                  const done = step > stepNumber;
                  return (
                    <div key={label} className={`${styles.stepItem} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}>
                      <span className={styles.stepNumber}>{stepNumber}</span>
                      <span className={styles.stepLabel}>{label}</span>
                    </div>
                  );
                })}
              </div>

              {step === 1 && (
                <div className={styles.formGrid}>
                  <h3 className={styles.stepTitle}>{copy.step1Title}</h3>
                  <div className={styles.field}>
                    <label className={styles.label}>{copy.name}</label>
                    <input
                      type="text"
                      required
                      placeholder={copy.namePlaceholder}
                      className={styles.input}
                      minLength={MIN_NAME_LENGTH}
                      maxLength={120}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>{copy.emailLabel}</label>
                    <input
                      type="email"
                      required
                      placeholder={copy.emailPlaceholder}
                      className={styles.input}
                      maxLength={190}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>
                      {copy.company} <span className={styles.optional}>({copy.optional})</span>
                    </label>
                    <input
                      type="text"
                      placeholder={copy.companyPlaceholder}
                      className={styles.input}
                      maxLength={160}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className={styles.formGrid}>
                  <h3 className={styles.stepTitle}>{copy.step2Title}</h3>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.projectType}</label>
                    <p className={styles.hint}>{copy.projectHint}</p>
                    <div className={styles.optionGrid}>
                      {projectTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.optionBtn} ${formData.projectType === type ? styles.optionBtnActive : ""}`}
                          data-selected={formData.projectType === type ? "true" : "false"}
                          aria-pressed={formData.projectType === type}
                          onClick={() => setFormData({ ...formData, projectType: type })}
                        >
                          {formData.projectType === type ? "✓ " : ""}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.platforms}</label>
                    <p className={styles.hint}>{copy.platformHint}</p>
                    <div className={styles.checkGrid}>
                      {platformOptions.map((platform) => (
                        <button
                          key={platform}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.checkBtn} ${formData.platforms.includes(platform) ? styles.checkBtnActive : ""}`}
                          data-selected={formData.platforms.includes(platform) ? "true" : "false"}
                          aria-pressed={formData.platforms.includes(platform)}
                          onClick={() => toggleListValue("platforms", platform, true)}
                        >
                          {formData.platforms.includes(platform) ? "✓ " : ""}
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.goals}</label>
                    <p className={styles.hint}>{copy.goalsHint}</p>
                    <div className={styles.checkGrid}>
                      {goalOptions.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.checkBtn} ${formData.goals.includes(goal) ? styles.checkBtnActive : ""}`}
                          data-selected={formData.goals.includes(goal) ? "true" : "false"}
                          aria-pressed={formData.goals.includes(goal)}
                          onClick={() => toggleListValue("goals", goal, true)}
                        >
                          {formData.goals.includes(goal) ? "✓ " : ""}
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.engagement}</label>
                    <p className={styles.hint}>{copy.engagementHint}</p>
                    <div className={styles.optionGrid}>
                      {engagementOptions.map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.optionBtn} ${formData.engagement === mode ? styles.optionBtnActive : ""}`}
                          data-selected={formData.engagement === mode ? "true" : "false"}
                          aria-pressed={formData.engagement === mode}
                          onClick={() => setFormData({ ...formData, engagement: mode })}
                        >
                          {formData.engagement === mode ? "✓ " : ""}
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isQrProject ? (
                    <div className={`${styles.field} ${styles.fullWidth}`}>
                      <label className={styles.label}>{copy.qrUseCase}</label>
                      <p className={styles.hint}>{copy.qrUseCaseHint}</p>
                      <div className={styles.optionGrid}>
                        {qrUseCaseOptions.map((option) => (
                          <button
                            key={option.niche}
                            type="button"
                            disabled={controlsDisabled}
                            className={`${styles.optionBtn} ${formData.qrUseCase === option.niche ? styles.optionBtnActive : ""}`}
                            data-selected={formData.qrUseCase === option.niche ? "true" : "false"}
                            aria-pressed={formData.qrUseCase === option.niche}
                            onClick={() => setFormData({ ...formData, qrUseCase: option.niche })}
                          >
                            {formData.qrUseCase === option.niche ? "✓ " : ""}
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {step === 3 && (
                <div className={styles.formGrid}>
                  <h3 className={styles.stepTitle}>{copy.step3Title}</h3>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.checklistTitle}</label>
                    <p className={styles.hint}>{copy.checklistHint}</p>
                    <div className={styles.checkGrid}>
                      {scopeOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.checkBtn} ${formData.scope.includes(item) ? styles.checkBtnActive : ""}`}
                          data-selected={formData.scope.includes(item) ? "true" : "false"}
                          aria-pressed={formData.scope.includes(item)}
                          onClick={() => toggleListValue("scope", item, true)}
                        >
                          {formData.scope.includes(item) ? "✓ " : ""}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.advancedScopeTitle}</label>
                    <p className={styles.hint}>{copy.advancedScopeHint}</p>
                    <div className={styles.checkGrid}>
                      {advancedScopeOptions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.checkBtn} ${formData.scopeAdvanced.includes(item) ? styles.checkBtnActive : ""}`}
                          data-selected={formData.scopeAdvanced.includes(item) ? "true" : "false"}
                          aria-pressed={formData.scopeAdvanced.includes(item)}
                          onClick={() => toggleListValue("scopeAdvanced", item)}
                        >
                          {formData.scopeAdvanced.includes(item) ? "✓ " : ""}
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label}>{copy.backendDepth}</label>
                    <p className={styles.hint}>{copy.backendDepthHint}</p>
                    <select
                      className={styles.input}
                      value={formData.backendDepth}
                      onChange={(e) => setFormData({ ...formData, backendDepth: e.target.value })}
                    >
                      {backendDepthOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.scopeNote}</label>
                    <textarea
                      rows={4}
                      placeholder={copy.scopePlaceholder}
                      className={styles.input}
                      maxLength={1200}
                      value={formData.scopeNotes}
                      onChange={(e) => setFormData({ ...formData, scopeNotes: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className={styles.formGrid}>
                  <h3 className={styles.stepTitle}>{copy.step4Title}</h3>

                  <div className={styles.field}>
                    <label className={styles.label}>{copy.budget}</label>
                    <select
                      className={styles.input}
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      {budgets.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                      <option value={CUSTOM_BUDGET_VALUE}>{copy.customBudget}</option>
                    </select>
                  </div>

                  {formData.budget === CUSTOM_BUDGET_VALUE ? (
                    <div className={styles.field}>
                      <label className={styles.label}>{copy.customBudget}</label>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder={copy.customBudgetPlaceholder}
                        maxLength={80}
                        value={formData.budgetCustom}
                        onChange={(e) => setFormData({ ...formData, budgetCustom: e.target.value })}
                      />
                    </div>
                  ) : null}

                  <div className={styles.field}>
                    <label className={styles.label}>{copy.timeline}</label>
                    <select
                      className={styles.input}
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    >
                      {timelines.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.promotion}</label>
                    <p className={styles.hint}>{copy.promotionHint}</p>
                    <div className={styles.optionGrid}>
                      <button
                        type="button"
                        disabled={controlsDisabled}
                        className={`${styles.optionBtn} ${formData.promotionRequest === "none" ? styles.optionBtnActive : ""}`}
                        data-selected={formData.promotionRequest === "none" ? "true" : "false"}
                        aria-pressed={formData.promotionRequest === "none"}
                        onClick={() => setFormData({ ...formData, promotionRequest: "none" })}
                      >
                        {formData.promotionRequest === "none" ? "✓ " : ""}
                        {copy.promotionNone}
                      </button>
                      {promotionOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          disabled={controlsDisabled}
                          className={`${styles.optionBtn} ${formData.promotionRequest === option ? styles.optionBtnActive : ""}`}
                          data-selected={formData.promotionRequest === option ? "true" : "false"}
                          aria-pressed={formData.promotionRequest === option}
                          onClick={() => {
                            setFormData({ ...formData, promotionRequest: option });
                            trackEvent(ANALYTICS_EVENTS.SELECT_PROMOTION_TIER, "Promotion tier selected", {
                              promotion_tier: option,
                            });
                          }}
                        >
                          {formData.promotionRequest === option ? "✓ " : ""}
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.label}>{copy.message}</label>
                    <textarea
                      rows={5}
                      required
                      placeholder={copy.messagePlaceholder}
                      className={styles.input}
                      minLength={MIN_MESSAGE_LENGTH}
                      maxLength={3000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label className={styles.consentRow}>
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                        required
                        className={styles.consentCheckbox}
                      />
                      <span className={styles.consentText}>
                        {copy.privacyConsentPrefix}{" "}
                        <LocaleLink href="/privacy" className={styles.consentLink}>
                          {copy.privacyConsentLink}
                        </LocaleLink>{" "}
                        {copy.privacyConsentSuffix}
                      </span>
                    </label>
                  </div>

                  <div className={`${styles.reviewCard} ${styles.fullWidth}`}>
                    <h4>{copy.reviewTitle}</h4>
                    <div className={styles.reviewGrid}>
                      <p><strong>{copy.reviewProject}:</strong> {formData.projectType}</p>
                      <p><strong>{copy.reviewPlatforms}:</strong> {formData.platforms.join(", ")}</p>
                      <p><strong>{copy.reviewGoals}:</strong> {formData.goals.join(", ")}</p>
                      <p><strong>{copy.reviewScope}:</strong> {formData.scope.join(", ")}</p>
                      {isQrProject ? (
                        <p><strong>{copy.reviewQrUseCase}:</strong> {qrUseCaseOptions.find((option) => option.niche === formData.qrUseCase)?.label || "-"}</p>
                      ) : null}
                      <p><strong>{copy.reviewPromotion}:</strong> {formData.promotionRequest === "none" ? copy.promotionNone : formData.promotionRequest}</p>
                      <p><strong>{copy.reviewBudget}:</strong> {formData.budget === CUSTOM_BUDGET_VALUE ? formData.budgetCustom || "-" : formData.budget}</p>
                      <p><strong>{copy.reviewTimeline}:</strong> {formData.timeline}</p>
                    </div>
                  </div>
                </div>
              )}

              {stepError ? <p className={styles.stepError} role="alert" aria-live="polite">{stepError}</p> : null}
              {submitError ? <p className={styles.stepError} role="alert" aria-live="polite">{submitError}</p> : null}

              <div className={styles.wizardActions}>
                {step > 1 ? (
                  <button type="button" className={styles.secondaryAction} onClick={handleBack} disabled={isSubmitting}>
                    <ArrowLeft size={16} /> {copy.back}
                  </button>
                ) : <span />}

                {step < totalSteps ? (
                  <button type="button" className={styles.primaryAction} onClick={handleNext} disabled={isSubmitting}>
                    {copy.next} <ArrowRight size={16} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className={`${styles.primaryAction} ${isSubmitting ? styles.loadingAction : ""}`}>
                    {isSubmitting ? copy.sending : copy.submit}
                    <Send size={16} />
                  </button>
                )}
              </div>

              <span className={styles.note}>{copy.note}</span>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
