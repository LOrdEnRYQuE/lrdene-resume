"use client";

import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Partners.module.css";

type WizardProps = {
  locale: "en" | "de";
};

const PRIVACY_CONSENT_VERSION = "partners_lead_wizard_v1";

export default function PartnersLeadWizard({ locale }: WizardProps) {
  const isDe = locale === "de";
  const createLead = useMutation(api.leads.create);

  const copy = isDe
    ? {
        title: "Partner Leads Wizard",
        subtitle: "Sende qualifizierte Empfehlungen strukturiert in unter 2 Minuten.",
        steps: ["Partner", "Lead", "Finalisieren"],
        partnerType: "Partnertyp",
        referral: "Empfehlungspartner",
        execution: "Umsetzungspartner",
        name: "Dein Name",
        email: "Deine E-Mail",
        company: "Deine Firma",
        leadName: "Lead Name",
        leadCompany: "Lead Firma",
        leadEmail: "Lead E-Mail (optional)",
        leadNeed: "Lead Bedarf",
        needOptions: [
          "Website Relaunch",
          "New Business Website",
          "Landing Page Funnel",
          "E-Commerce Build",
          "Custom Web App",
          "MVP Build",
          "Dashboard / Admin Panel",
          "AI Integration",
          "Chatbot / AI Assistant",
          "Automation Setup",
          "CRM / Lead System",
          "Technical SEO",
          "Analytics / Tracking Setup",
        ],
        budget: "Projektbudget",
        budgetOptions: ["€10k - €25k", "€25k - €50k", "€50k+"],
        timeline: "Ziel-Zeitrahmen",
        timelineOptions: ["< 30 Tage", "1-3 Monate", "3-6 Monate"],
        relationship: "Wie ist der Kontakt?",
        relationshipOptions: ["Warm Intro", "Bestehender Kunde", "Neuer Kontakt"],
        notes: "Zusatzinfo",
        notesPlaceholder: "Kontext, Dringlichkeit, Entscheidungsprozess, spezielle Anforderungen ...",
        consent:
          "Ich stimme der Verarbeitung zur Kontaktaufnahme und Lead-Qualifizierung gemaß Datenschutzerklaerung zu.",
        back: "Zurueck",
        next: "Weiter",
        submit: "Lead Senden",
        sending: "Wird gesendet...",
        success: "Lead erfolgreich gesendet. Danke fuer die Empfehlung.",
        error: "Senden fehlgeschlagen. Bitte erneut versuchen.",
        required: "Bitte alle Pflichtfelder ausfuellen und Zustimmung bestaetigen.",
      }
    : {
        title: "Partner Leads Wizard",
        subtitle: "Submit qualified partner referrals in under 2 minutes.",
        steps: ["Partner", "Lead", "Finalize"],
        partnerType: "Partner Type",
        referral: "Referral Partner",
        execution: "Delivery Partner",
        name: "Your Name",
        email: "Your Email",
        company: "Your Company",
        leadName: "Lead Name",
        leadCompany: "Lead Company",
        leadEmail: "Lead Email (optional)",
        leadNeed: "Lead Need",
        needOptions: [
          "Website Relaunch",
          "New Business Website",
          "Landing Page Funnel",
          "E-Commerce Build",
          "Custom Web App",
          "MVP Build",
          "Dashboard / Admin Panel",
          "AI Integration",
          "Chatbot / AI Assistant",
          "Automation Setup",
          "CRM / Lead System",
          "Technical SEO",
          "Analytics / Tracking Setup",
        ],
        budget: "Project Budget",
        budgetOptions: ["€10k - €25k", "€25k - €50k", "€50k+"],
        timeline: "Target Timeline",
        timelineOptions: ["< 30 days", "1-3 months", "3-6 months"],
        relationship: "Relationship",
        relationshipOptions: ["Warm Intro", "Existing Client", "New Contact"],
        notes: "Additional Notes",
        notesPlaceholder: "Context, urgency, decision process, key requirements ...",
        consent: "I agree to data processing for contact and lead qualification according to the privacy policy.",
        back: "Back",
        next: "Next",
        submit: "Submit Lead",
        sending: "Submitting...",
        success: "Lead submitted successfully. Thanks for the referral.",
        error: "Submission failed. Please try again.",
        required: "Please fill all required fields and confirm consent.",
      };

  const [step, setStep] = useState(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    partnerType: "referral",
    name: "",
    email: "",
    company: "",
    leadName: "",
    leadCompany: "",
    leadEmail: "",
    leadNeed: copy.needOptions[0],
    budget: copy.budgetOptions[0],
    timeline: copy.timelineOptions[1],
    relationship: copy.relationshipOptions[0],
    notes: "",
    consent: false,
  });

  const progress = useMemo(() => (step / 3) * 100, [step]);

  const update = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const validateStep = (targetStep: number) => {
    if (targetStep === 2) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) return false;
    }
    if (targetStep === 3) {
      if (!formData.leadName.trim() || !formData.leadCompany.trim()) return false;
    }
    return true;
  };

  const onNext = () => {
    const nextStep = Math.min(step + 1, 3);
    if (!validateStep(nextStep)) {
      setError(copy.required);
      return;
    }
    setStep(nextStep);
  };

  const onBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    setError("");
  };

  const onSubmit = async () => {
    if (!formData.consent) {
      setError(copy.required);
      return;
    }
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim() || !formData.leadName.trim() || !formData.leadCompany.trim()) {
      setError(copy.required);
      return;
    }
    setSending(true);
    setError("");
    setSuccess("");
    try {
      const partnerTypeLabel = formData.partnerType === "execution" ? copy.execution : copy.referral;
      const message = [
        `Partner Lead Wizard Submission`,
        `Partner Type: ${partnerTypeLabel}`,
        `Lead Name: ${formData.leadName}`,
        `Lead Company: ${formData.leadCompany}`,
        `Lead Email: ${formData.leadEmail || "n/a"}`,
        `Lead Need: ${formData.leadNeed}`,
        `Relationship: ${formData.relationship}`,
        `Notes: ${formData.notes || "n/a"}`,
      ].join("\n");

      await createLead({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        projectType: `Partner Lead | ${partnerTypeLabel}`,
        budget: formData.budget,
        timeline: formData.timeline,
        message,
        niche: "partner-referral",
        privacyConsent: true,
        privacyConsentAt: Date.now(),
        privacyConsentVersion: PRIVACY_CONSENT_VERSION,
      });

      setSuccess(copy.success);
      setStep(1);
      setFormData({
        partnerType: "referral",
        name: "",
        email: "",
        company: "",
        leadName: "",
        leadCompany: "",
        leadEmail: "",
        leadNeed: copy.needOptions[0],
        budget: copy.budgetOptions[0],
        timeline: copy.timelineOptions[1],
        relationship: copy.relationshipOptions[0],
        notes: "",
        consent: false,
      });
    } catch {
      setError(copy.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className={`container ${styles.wizardWrap}`}>
      <div className={styles.wizardHeader}>
        <h2>{copy.title}</h2>
        <p>{copy.subtitle}</p>
      </div>

      <div className={styles.wizardProgress}>
        <div className={styles.wizardProgressFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.wizardSteps}>
        {copy.steps.map((item, index) => (
          <span key={item} className={step === index + 1 ? styles.activeStep : ""}>
            {item}
          </span>
        ))}
      </div>

      <div className={styles.wizardCard}>
        {step === 1 && (
          <div className={styles.wizardGrid}>
            <label>
              {copy.partnerType}
              <select value={formData.partnerType} onChange={(e) => update("partnerType", e.target.value)}>
                <option value="referral">{copy.referral}</option>
                <option value="execution">{copy.execution}</option>
              </select>
            </label>
            <label>
              {copy.name}
              <input value={formData.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label>
              {copy.email}
              <input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} />
            </label>
            <label>
              {copy.company}
              <input value={formData.company} onChange={(e) => update("company", e.target.value)} />
            </label>
          </div>
        )}

        {step === 2 && (
          <div className={styles.wizardGrid}>
            <label>
              {copy.leadName}
              <input value={formData.leadName} onChange={(e) => update("leadName", e.target.value)} />
            </label>
            <label>
              {copy.leadCompany}
              <input value={formData.leadCompany} onChange={(e) => update("leadCompany", e.target.value)} />
            </label>
            <label>
              {copy.leadEmail}
              <input type="email" value={formData.leadEmail} onChange={(e) => update("leadEmail", e.target.value)} />
            </label>
            <label>
              {copy.leadNeed}
              <select value={formData.leadNeed} onChange={(e) => update("leadNeed", e.target.value)}>
                {copy.needOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === 3 && (
          <div className={styles.wizardGrid}>
            <label>
              {copy.budget}
              <select value={formData.budget} onChange={(e) => update("budget", e.target.value)}>
                {copy.budgetOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {copy.timeline}
              <select value={formData.timeline} onChange={(e) => update("timeline", e.target.value)}>
                {copy.timelineOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {copy.relationship}
              <select value={formData.relationship} onChange={(e) => update("relationship", e.target.value)}>
                {copy.relationshipOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.fullWidth}>
              {copy.notes}
              <textarea rows={4} value={formData.notes} onChange={(e) => update("notes", e.target.value)} placeholder={copy.notesPlaceholder} />
            </label>
            <label className={`${styles.fullWidth} ${styles.consentRow}`}>
              <input type="checkbox" checked={formData.consent} onChange={(e) => update("consent", e.target.checked)} />
              <span>{copy.consent}</span>
            </label>
          </div>
        )}

        {error ? <p className={styles.wizardError}>{error}</p> : null}
        {success ? <p className={styles.wizardSuccess}>{success}</p> : null}

        <div className={styles.wizardActions}>
          <button type="button" onClick={onBack} disabled={step === 1 || sending} className={styles.wizardSecondary}>
            {copy.back}
          </button>
          {step < 3 ? (
            <button type="button" onClick={onNext} disabled={sending} className={styles.wizardPrimary}>
              {copy.next}
            </button>
          ) : (
            <button type="button" onClick={onSubmit} disabled={sending} className={styles.wizardPrimary}>
              {sending ? copy.sending : copy.submit}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
