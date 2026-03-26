"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./ContactEditor.module.css";
import { Cloud, MessageSquare, Plus, Save, Trash2, Wrench } from "lucide-react";
import { useLocale } from "@/lib/i18n/useLocale";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

type ContactFormSettings = {
  enabled: boolean;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  projectTypes: string[];
  budgets: string[];
  timelines: string[];
  platformOptions: string[];
  goalOptions: string[];
  engagementOptions: string[];
  scopeOptions: string[];
  advancedScopeOptions: string[];
  backendDepthOptions: string[];
};

type ContactContent = {
  title: string;
  subtitle: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  location?: string;
  form: ContactFormSettings;
};

type PresetKey = "startup" | "enterprise" | "agency";

const DEFAULT_CONTENT: ContactContent = {
  title: "Let's Build Your Next Digital Product.",
  subtitle: "Currently accepting selective client projects in Germany and across Europe.",
  email: "lordenryque.dev@gmail.com",
  whatsapp: "+49 1722620671",
  linkedin: "LOrdEnRQuE",
  location: "Germany BY, 84028. Landshut Nahensteig 188E",
  form: {
    enabled: true,
    submitLabel: "Send Inquiry",
    successTitle: "Inquiry Received!",
    successMessage: "Thanks for reaching out. I will review your project details and get back to you shortly.",
    projectTypes: ["Full Product Build", "AI-Native App", "Premium Branding", "Advisory/Consulting"],
    budgets: ["€10k - €25k", "€25k - €50k", "€50k+", "Equity Based (Select Startups)"],
    timelines: ["Urgent (< 1 Month)", "1-3 Months", "3-6 Months", "Long-term Partnership"],
    platformOptions: ["Mobile Application", "Desktop Application", "Web Application", "Cross-Platform"],
    goalOptions: ["Generate Leads", "Increase Sales", "Automate Operations", "Modernize Brand", "Launch MVP", "Prepare for Scale"],
    engagementOptions: ["Done-for-you (full delivery)", "Collaborative Sprint", "Technical Advisory", "Retainer / Long-term"],
    scopeOptions: ["Logo", "Pages", "Features", "Database", "Backend", "CMS/Admin", "SEO Setup", "Analytics"],
    advancedScopeOptions: ["Auth & Roles", "Payment Integration", "CRM Integration", "Marketing Automation", "Multilingual Setup", "Email Flows"],
    backendDepthOptions: ["Light (basic API + forms)", "Medium (dashboard + workflows)", "Advanced (integrations + automation)"],
  },
};

const FORM_PRESETS: Record<PresetKey, Partial<ContactFormSettings>> = {
  startup: {
    projectTypes: ["MVP Build", "Landing + Funnel", "Automation Setup", "Technical Advisory"],
    budgets: ["€5k - €10k", "€10k - €25k", "€25k - €50k", "Equity Based (Select Startups)"],
    timelines: ["Urgent (< 1 Month)", "1-3 Months", "3-6 Months", "Long-term Partnership"],
    platformOptions: ["Web Application", "Mobile Application", "Cross-Platform"],
    goalOptions: ["Launch MVP", "Generate Leads", "Increase Sales", "Prepare for Scale"],
    engagementOptions: ["Collaborative Sprint", "Done-for-you (full delivery)", "Technical Advisory"],
    scopeOptions: ["Pages", "Features", "Backend", "Database", "Analytics", "SEO Setup"],
    advancedScopeOptions: ["Auth & Roles", "Payment Integration", "Marketing Automation", "Email Flows"],
    backendDepthOptions: ["Light (basic API + forms)", "Medium (dashboard + workflows)"],
  },
  enterprise: {
    projectTypes: ["Enterprise Platform", "Process Automation", "Data/AI Integration", "Modernization Program"],
    budgets: ["€25k - €50k", "€50k+", "€100k+", "Retainer / Ongoing Program"],
    timelines: ["1-3 Months", "3-6 Months", "6-12 Months", "Long-term Partnership"],
    platformOptions: ["Web Application", "Desktop Application", "Mobile Application", "Cross-Platform"],
    goalOptions: ["Automate Operations", "Prepare for Scale", "Increase Sales", "Modernize Brand", "Generate Leads"],
    engagementOptions: ["Done-for-you (full delivery)", "Retainer / Long-term", "Technical Advisory", "Collaborative Sprint"],
    scopeOptions: ["Pages", "Features", "Backend", "Database", "CMS/Admin", "Analytics", "SEO Setup"],
    advancedScopeOptions: ["Auth & Roles", "CRM Integration", "Payment Integration", "Marketing Automation", "Multilingual Setup", "Email Flows"],
    backendDepthOptions: ["Medium (dashboard + workflows)", "Advanced (integrations + automation)"],
  },
  agency: {
    projectTypes: ["Client Website Package", "Brand + Web Refresh", "Lead-Gen Funnel", "White-label Delivery"],
    budgets: ["€10k - €25k", "€25k - €50k", "€50k+", "Retainer / Long-term"],
    timelines: ["1-3 Months", "3-6 Months", "Long-term Partnership"],
    platformOptions: ["Web Application", "Mobile Application", "Cross-Platform"],
    goalOptions: ["Generate Leads", "Increase Sales", "Modernize Brand", "Automate Operations"],
    engagementOptions: ["Done-for-you (full delivery)", "Collaborative Sprint", "Retainer / Long-term"],
    scopeOptions: ["Logo", "Pages", "Features", "Backend", "CMS/Admin", "SEO Setup", "Analytics"],
    advancedScopeOptions: ["CRM Integration", "Marketing Automation", "Multilingual Setup", "Email Flows", "Payment Integration"],
    backendDepthOptions: ["Light (basic API + forms)", "Medium (dashboard + workflows)", "Advanced (integrations + automation)"],
  },
};

function normalizeContactContent(raw: any): ContactContent {
  const normalizedTitle =
    !raw?.title || raw.title === "TEST CONTACT HEADLINE"
      ? DEFAULT_CONTENT.title
      : raw.title;
  const normalizedSubtitle =
    !raw?.subtitle || raw.subtitle === "Currently accepting selective projects for Q3 2024."
      ? DEFAULT_CONTENT.subtitle
      : raw.subtitle;
  const normalizedEmail =
    !raw?.email || raw.email === "hello@lrdene.com" || raw.email === "hello@leads.dev"
      ? DEFAULT_CONTENT.email
      : raw.email;
  const normalizedWhatsapp =
    !raw?.whatsapp || raw.whatsapp === "+[Your Number]" || raw.whatsapp === "+1234567890"
      ? DEFAULT_CONTENT.whatsapp
      : raw.whatsapp;
  const normalizedLinkedin =
    !raw?.linkedin ||
    raw.linkedin === "Attila Lazar" ||
    raw.linkedin === "https://linkedin.com/in/leads" ||
    raw.linkedin === "linkedin.com/in/leads" ||
    raw.linkedin === "leads"
      ? DEFAULT_CONTENT.linkedin
      : raw.linkedin;
  return {
    title: normalizedTitle,
    subtitle: normalizedSubtitle,
    email: normalizedEmail,
    whatsapp: normalizedWhatsapp,
    linkedin: normalizedLinkedin,
    location: raw?.location ?? DEFAULT_CONTENT.location,
    form: {
      enabled: raw?.form?.enabled ?? true,
      submitLabel: raw?.form?.submitLabel ?? DEFAULT_CONTENT.form.submitLabel,
      successTitle: raw?.form?.successTitle ?? DEFAULT_CONTENT.form.successTitle,
      successMessage: raw?.form?.successMessage ?? DEFAULT_CONTENT.form.successMessage,
      projectTypes: Array.isArray(raw?.form?.projectTypes) && raw.form.projectTypes.length > 0
        ? raw.form.projectTypes
        : DEFAULT_CONTENT.form.projectTypes,
      budgets: Array.isArray(raw?.form?.budgets) && raw.form.budgets.length > 0
        ? raw.form.budgets
        : DEFAULT_CONTENT.form.budgets,
      timelines: Array.isArray(raw?.form?.timelines) && raw.form.timelines.length > 0
        ? raw.form.timelines
        : DEFAULT_CONTENT.form.timelines,
      platformOptions: Array.isArray(raw?.form?.platformOptions) && raw.form.platformOptions.length > 0
        ? raw.form.platformOptions
        : DEFAULT_CONTENT.form.platformOptions,
      goalOptions: Array.isArray(raw?.form?.goalOptions) && raw.form.goalOptions.length > 0
        ? raw.form.goalOptions
        : DEFAULT_CONTENT.form.goalOptions,
      engagementOptions: Array.isArray(raw?.form?.engagementOptions) && raw.form.engagementOptions.length > 0
        ? raw.form.engagementOptions
        : DEFAULT_CONTENT.form.engagementOptions,
      scopeOptions: Array.isArray(raw?.form?.scopeOptions) && raw.form.scopeOptions.length > 0
        ? raw.form.scopeOptions
        : DEFAULT_CONTENT.form.scopeOptions,
      advancedScopeOptions: Array.isArray(raw?.form?.advancedScopeOptions) && raw.form.advancedScopeOptions.length > 0
        ? raw.form.advancedScopeOptions
        : DEFAULT_CONTENT.form.advancedScopeOptions,
      backendDepthOptions: Array.isArray(raw?.form?.backendDepthOptions) && raw.form.backendDepthOptions.length > 0
        ? raw.form.backendDepthOptions
        : DEFAULT_CONTENT.form.backendDepthOptions,
    },
  };
}

function updateArrayItem(items: string[], index: number, value: string) {
  const next = [...items];
  next[index] = value;
  return next;
}

export default function ContactEditor() {
  const locale = useLocale();
  const content = useQuery(api.pages.getPageContent, { key: "contact", locale });
  const leadsQuery = useAdminQuery(api.leads.list) as any[] | undefined;

  const updateContent = useAdminMutation(api.pages.updatePageContent);
  const seedSiteContent = useAdminMutation(api.pages.seedSiteContent);

  const [data, setData] = useState<ContactContent>(DEFAULT_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setData(normalizeContactContent(content?.data));
  }, [content]);

  const recentLeads = useMemo(() => (leadsQuery ?? []).slice(0, 8), [leadsQuery]);

  const handleSync = async () => {
    if (!confirm("This will synchronize default Contact content from system. Continue?")) {
      return;
    }

    setIsSyncing(true);
    try {
      await seedSiteContent({});
    } catch (error) {
      console.error("Sync failed:", error);
      alert("Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent({ key: "contact", data, locale });
      alert("Contact settings saved.");
    } catch {
      alert("Failed to save contact settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const applyPreset = (presetKey: PresetKey) => {
    const preset = FORM_PRESETS[presetKey];
    const prettyName = presetKey.charAt(0).toUpperCase() + presetKey.slice(1);
    if (!confirm(`Apply ${prettyName} wizard preset? This overwrites current wizard option lists.`)) return;

    setData((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        ...preset,
      },
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="premium-title">
            Contact <span className="gold-text">Ops</span>
          </h1>
          <p className="text-secondary">Manage contact page copy and form behavior. Email handling lives in Inbox Desk.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/inbox" className={styles.addBtn}>
            Open Inbox Desk
          </Link>
          <button className={styles.syncBtn} onClick={handleSync} disabled={isSyncing}>
            <Cloud size={16} />
            {isSyncing ? "Syncing..." : "Sync Default"}
          </button>
          <button onClick={handleSave} disabled={isSaving} className={styles.saveBtn}>
            <Save size={16} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      <div className={styles.editorGrid}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <MessageSquare size={20} className="gold-text" />
              <h2>Contact Page Copy</h2>
            </div>
          </div>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Headline</label>
              <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Subtitle</label>
              <textarea value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>WhatsApp / Phone</label>
              <input value={data.whatsapp} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>LinkedIn</label>
              <input value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Location</label>
              <input value={data.location ?? ""} onChange={(e) => setData({ ...data, location: e.target.value })} />
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <Wrench size={20} className="gold-text" />
              <h2>Form Configuration</h2>
            </div>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label>Form Enabled</label>
              <select
                value={data.form.enabled ? "enabled" : "disabled"}
                onChange={(e) =>
                  setData({
                    ...data,
                    form: { ...data.form, enabled: e.target.value === "enabled" },
                  })
                }
              >
                <option value="enabled">enabled</option>
                <option value="disabled">disabled</option>
              </select>
            </div>

            <div className={styles.field}>
              <label>Submit Button Label</label>
              <input
                value={data.form.submitLabel}
                onChange={(e) => setData({ ...data, form: { ...data.form, submitLabel: e.target.value } })}
              />
            </div>

            <div className={styles.field}>
              <label>Success Title</label>
              <input
                value={data.form.successTitle}
                onChange={(e) => setData({ ...data, form: { ...data.form, successTitle: e.target.value } })}
              />
            </div>

            <div className={styles.field}>
              <label>Success Message</label>
              <textarea
                value={data.form.successMessage}
                onChange={(e) => setData({ ...data, form: { ...data.form, successMessage: e.target.value } })}
              />
            </div>
          </div>

          <div className={styles.presetRow}>
            <span className={styles.presetLabel}>Wizard Presets</span>
            <button type="button" className={styles.addBtn} onClick={() => applyPreset("startup")}>
              Startup
            </button>
            <button type="button" className={styles.addBtn} onClick={() => applyPreset("enterprise")}>
              Enterprise
            </button>
            <button type="button" className={styles.addBtn} onClick={() => applyPreset("agency")}>
              Agency
            </button>
          </div>

          <div className={styles.itemList}>
            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Project Type Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, projectTypes: [...data.form.projectTypes, "New Option"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.projectTypes.map((item, index) => (
                <div key={`project-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, projectTypes: updateArrayItem(data.form.projectTypes, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, projectTypes: data.form.projectTypes.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Budget Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, budgets: [...data.form.budgets, "New Budget"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.budgets.map((item, index) => (
                <div key={`budget-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, budgets: updateArrayItem(data.form.budgets, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, budgets: data.form.budgets.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Timeline Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, timelines: [...data.form.timelines, "New Timeline"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.timelines.map((item, index) => (
                <div key={`timeline-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, timelines: updateArrayItem(data.form.timelines, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, timelines: data.form.timelines.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Platform Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, platformOptions: [...data.form.platformOptions, "New Platform"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.platformOptions.map((item, index) => (
                <div key={`platform-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, platformOptions: updateArrayItem(data.form.platformOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, platformOptions: data.form.platformOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Goal Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, goalOptions: [...data.form.goalOptions, "New Goal"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.goalOptions.map((item, index) => (
                <div key={`goal-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, goalOptions: updateArrayItem(data.form.goalOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, goalOptions: data.form.goalOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Engagement Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() =>
                    setData({ ...data, form: { ...data.form, engagementOptions: [...data.form.engagementOptions, "New Model"] } })
                  }
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.engagementOptions.map((item, index) => (
                <div key={`engagement-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, engagementOptions: updateArrayItem(data.form.engagementOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, engagementOptions: data.form.engagementOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Scope Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() => setData({ ...data, form: { ...data.form, scopeOptions: [...data.form.scopeOptions, "New Scope Item"] } })}
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.scopeOptions.map((item, index) => (
                <div key={`scope-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, scopeOptions: updateArrayItem(data.form.scopeOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, scopeOptions: data.form.scopeOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Advanced Scope Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() =>
                    setData({ ...data, form: { ...data.form, advancedScopeOptions: [...data.form.advancedScopeOptions, "New Advanced Scope"] } })
                  }
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.advancedScopeOptions.map((item, index) => (
                <div key={`advanced-scope-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, advancedScopeOptions: updateArrayItem(data.form.advancedScopeOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, advancedScopeOptions: data.form.advancedScopeOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.item}>
              <div className={styles.itemHeader}>
                <strong>Backend Depth Options</strong>
                <button
                  className={styles.addBtn}
                  onClick={() =>
                    setData({ ...data, form: { ...data.form, backendDepthOptions: [...data.form.backendDepthOptions, "New Backend Depth"] } })
                  }
                >
                  <Plus size={13} /> Add
                </button>
              </div>
              {data.form.backendDepthOptions.map((item, index) => (
                <div key={`backend-depth-${index}`} className={styles.itemRow}>
                  <input
                    value={item}
                    onChange={(e) =>
                      setData({
                        ...data,
                        form: { ...data.form, backendDepthOptions: updateArrayItem(data.form.backendDepthOptions, index, e.target.value) },
                      })
                    }
                  />
                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      setData({
                        ...data,
                        form: { ...data.form, backendDepthOptions: data.form.backendDepthOptions.filter((_, i) => i !== index) },
                      })
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardHeaderLeft}>
              <MessageSquare size={20} className="gold-text" />
              <h2>Recent Contact Form Submissions</h2>
            </div>
            <Link href="/admin/inbox" className={styles.addBtn}>
              Open Inbox Desk
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <p className={styles.empty}>No submissions yet.</p>
          ) : (
            <div className={styles.submissionsWrap}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Project Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td>{lead.email}</td>
                        <td>{lead.projectType}</td>
                        <td>{lead.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.mobileLeadList}>
                {recentLeads.map((lead) => (
                  <article key={`mobile-${lead._id}`} className={styles.mobileLeadCard}>
                    <div className={styles.mobileLeadTop}>
                      <strong>{lead.name}</strong>
                      <span>{lead.status}</span>
                    </div>
                    <p>{lead.email}</p>
                    <small>{lead.projectType}</small>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
