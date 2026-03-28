"use client";

import { useState } from "react";
import LocaleLink from "@/components/I18n/LocaleLink";
import styles from "./QRSolutionsPage.module.css";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const PRIVACY_CONSENT_VERSION = "qr_solutions_form_v1";

type LeadFormCopy = {
  leadName: string;
  leadEmail: string;
  leadCompany: string;
  leadUseCase: string;
  useCaseOptions: string[];
  leadMessage: string;
  leadSubmit: string;
  leadSending: string;
  leadSuccess: string;
  leadError: string;
  leadPrivacyConsentPrefix: string;
  leadPrivacyConsentLink: string;
  leadPrivacyConsentSuffix: string;
  leadPrivacyConsentError: string;
};

export default function QRSolutionsLeadForm({ copy }: { copy: LeadFormCopy }) {
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
    <>
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
              </LocaleLink>{" "}
              {copy.leadPrivacyConsentSuffix}
            </span>
          </label>
          {submitError ? <p className={styles.leadError}>{submitError}</p> : null}
          <button type="submit" className="magnetic-button" disabled={isSubmitting}>
            {isSubmitting ? copy.leadSending : copy.leadSubmit}
          </button>
        </form>
      )}
    </>
  );
}
