"use client";

import React, { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import styles from "./SEOManager.module.css";
import ui from "./AdminPrimitives.module.css";
import {
  Globe,
  Share2,
  Save,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Search,
  FileText,
  ImageOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import { useQuery } from "convex/react";
import {
  parseTopicClusters,
  resolveTopicClusters,
  TOPIC_CLUSTER_CONTENT_KEY,
} from "@/lib/seo/topicClusters";

const AUDIT_ROUTES = ["/", "/about", "/services", "/projects", "/blog", "/contact"];
const ROUTES_WITH_INTERNAL_LINKING = new Set(["/blog", "/projects", "/services"]);
const ROUTES_WITH_SCHEMA = new Set(["/", "/blog", "/projects", "/services"]);
const ROUTES_WITH_CANONICAL_IN_CODE = new Set(["/", "/about", "/services", "/projects", "/blog", "/contact"]);
const DYNAMIC_TITLE_MIN = 35;
const DYNAMIC_TITLE_MAX = 70;
const DYNAMIC_DESCRIPTION_MIN = 80;
const DYNAMIC_DESCRIPTION_MAX = 170;

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export const SEOManager = () => {
  const metadataList = (useAdminQuery(api.siteMetadata.list) as any[]) || [];
  const posts = (useQuery(api.posts.list, { onlyPublished: true }) as any[]) || [];
  const projects = (useQuery(api.projects.list, { category: undefined }) as any[]) || [];
  const services = (useQuery(api.services.list, {}) as any[]) || [];
  const media = (useQuery(api.media.getMedia, {}) as any[]) || [];
  const topicClustersContent = useQuery(api.pages.getPageContent, {
    key: TOPIC_CLUSTER_CONTENT_KEY,
    fallbackToEnglish: true,
  }) as { data?: unknown } | null | undefined;
  const metadata = metadataList.length > 0 ? metadataList[0] : null;
  const updateMetadata = useAdminMutation(api.siteMetadata.update);
  const updatePageContent = useAdminMutation(api.pages.updatePageContent);

  const [formData, setFormData] = useState<any>({
    title: "",
    description: "",
    ogImage: "",
    keywords: "",
  });
  const [topicClustersJson, setTopicClustersJson] = useState("");
  const [topicClustersDirty, setTopicClustersDirty] = useState(false);
  const [topicClustersError, setTopicClustersError] = useState("");
  const [topicClustersNotice, setTopicClustersNotice] = useState("");
  const [staticFilter, setStaticFilter] = useState<"all" | "needsWork">("all");
  const [dynamicFilter, setDynamicFilter] = useState<"all" | "issuesOnly">("issuesOnly");
  const [dynamicSearch, setDynamicSearch] = useState("");

  const metadataByRoute = new Map(metadataList.map((entry) => [entry.route, entry]));

  const checklist = AUDIT_ROUTES.map((route) => {
    const record = metadataByRoute.get(route);
    const title = record?.title || "";
    const description = record?.description || "";
    const internalLinksRequired = ROUTES_WITH_INTERNAL_LINKING.has(route);
    const schemaRequired = ROUTES_WITH_SCHEMA.has(route);
    const hasTitle = title.length > 0 || ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const strongTitle = title.length === 0 || (title.length >= 35 && title.length <= 65);
    const hasDescription = description.length > 0 || ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const strongDescription = description.length === 0 || (description.length >= 110 && description.length <= 165);
    const hasCanonical = ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const hasInternalLinks = !internalLinksRequired || ROUTES_WITH_INTERNAL_LINKING.has(route);
    const hasSchema = !schemaRequired || ROUTES_WITH_SCHEMA.has(route);

    const checks = [
      { label: "Title present", ok: hasTitle },
      { label: "Title length healthy", ok: strongTitle },
      { label: "Description present", ok: hasDescription },
      { label: "Description length healthy", ok: strongDescription },
      { label: "Canonical configured", ok: hasCanonical },
      { label: internalLinksRequired ? "Internal links available" : "Internal links not required", ok: hasInternalLinks },
      { label: schemaRequired ? "Structured data enabled" : "Structured data not required", ok: hasSchema },
    ];

    const issueCount = checks.filter((check) => !check.ok).length;

    return {
      route,
      checks,
      issueCount,
    };
  });

  const openItems = checklist.reduce((count, item) => count + item.issueCount, 0);
  const passedStaticChecks = checklist.reduce((count, item) => count + item.checks.filter((check) => check.ok).length, 0);
  const totalStaticChecks = checklist.reduce((count, item) => count + item.checks.length, 0);

  const dynamicSeoRows = [
    ...posts.map((post) => ({
      route: `/blog/${post.slug}`,
      title: `${post.title} | AI & Product Insights`,
      description: post.excerpt as string,
      hasSchema: true,
      type: "Blog",
    })),
    ...projects.map((project) => ({
      route: `/projects/${project.slug}`,
      title: `${project.title} Case Study | Stack & Results`,
      description: project.summary as string,
      hasSchema: true,
      type: "Project",
    })),
    ...services.map((service) => ({
      route: `/services/${service.slug}`,
      title: `${service.title} Services | Strategy & Delivery`,
      description: service.description as string,
      hasSchema: true,
      type: "Service",
    })),
  ].map((row) => {
    const badTitle = row.title.length < DYNAMIC_TITLE_MIN || row.title.length > DYNAMIC_TITLE_MAX;
    const badDescription =
      row.description.length < DYNAMIC_DESCRIPTION_MIN || row.description.length > DYNAMIC_DESCRIPTION_MAX;
    const missingSchema = !row.hasSchema;
    const issueCount = [badTitle, badDescription, missingSchema].filter(Boolean).length;
    return {
      ...row,
      badTitle,
      badDescription,
      missingSchema,
      issueCount,
    };
  });

  const dynamicOpenItems = dynamicSeoRows.reduce((count, row) => count + row.issueCount, 0);
  const missingAltCount = media.filter((item) => !item.alt || String(item.alt).trim().length < 5).length;

  const filteredStaticRows = checklist.filter((item) =>
    staticFilter === "needsWork" ? item.issueCount > 0 : true,
  );

  const filteredDynamicRows = dynamicSeoRows
    .filter((row) => (dynamicFilter === "issuesOnly" ? row.issueCount > 0 : true))
    .filter((row) => {
      const query = dynamicSearch.trim().toLowerCase();
      if (!query) return true;
      return row.route.toLowerCase().includes(query) || row.type.toLowerCase().includes(query);
    })
    .sort((a, b) => b.issueCount - a.issueCount)
    .slice(0, 30);

  useEffect(() => {
    if (metadata) {
      setFormData({
        title: metadata.title || "",
        description: metadata.description || "",
        ogImage: metadata.ogImage || "",
        keywords: metadata.keywords || "",
      });
    }
  }, [metadata]);

  useEffect(() => {
    if (topicClustersDirty) return;
    const source = resolveTopicClusters(topicClustersContent?.data);
    setTopicClustersJson(JSON.stringify(source, null, 2));
  }, [topicClustersContent, topicClustersDirty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (metadata) {
        await updateMetadata({
          id: metadata._id,
          title: formData.title,
          description: formData.description,
          keywords: formData.keywords,
          ogImage: formData.ogImage,
        });
      } else {
        alert("No metadata record found to update.");
        return;
      }
      alert("SEO metadata updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update SEO metadata.");
    }
  };

  const handleSaveTopicClusters = async () => {
    setTopicClustersError("");
    setTopicClustersNotice("");
    try {
      const parsedJson = JSON.parse(topicClustersJson);
      const parsed = parseTopicClusters(parsedJson);
      if (!parsed) {
        setTopicClustersError("Invalid cluster JSON. Use the existing schema shape for clusters/topics/faqs.");
        return;
      }

      await updatePageContent({
        key: TOPIC_CLUSTER_CONTENT_KEY,
        data: parsed,
      });
      setTopicClustersDirty(false);
      setTopicClustersNotice(
        `Saved ${parsed.length} cluster(s) and ${parsed.reduce((sum, cluster) => sum + cluster.topics.length, 0)} topic page templates.`,
      );
    } catch {
      setTopicClustersError("Invalid JSON. Fix formatting and try again.");
    }
  };

  const titleLen = formData.title.length;
  const descriptionLen = formData.description.length;
  const titleHealthy = titleLen >= 35 && titleLen <= 65;
  const descriptionHealthy = descriptionLen >= 110 && descriptionLen <= 165;

  return (
    <div className={ui.shell}>
      <section className={ui.section}>
        <div className={ui.titleWrap}>
          <h2 className={ui.title}>SEO <span className="gold-text">Manager</span></h2>
          <p className={ui.subtitle}>Optimize discoverability, metadata quality, and programmatic SEO structure.</p>
        </div>
      </section>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <FileText size={16} className="gold-text" />
          <span className={styles.kpiLabel}>Static Audit Score</span>
          <strong className={styles.kpiValue}>{pct(passedStaticChecks, totalStaticChecks)}%</strong>
          <small>{passedStaticChecks}/{totalStaticChecks} checks passing</small>
        </div>
        <div className={styles.kpiCard}>
          <AlertTriangle size={16} className="gold-text" />
          <span className={styles.kpiLabel}>Open SEO Issues</span>
          <strong className={styles.kpiValue}>{openItems + dynamicOpenItems}</strong>
          <small>{openItems} static · {dynamicOpenItems} dynamic</small>
        </div>
        <div className={styles.kpiCard}>
          <ImageOff size={16} className="gold-text" />
          <span className={styles.kpiLabel}>Missing Media Alt</span>
          <strong className={styles.kpiValue}>{missingAltCount}</strong>
          <small>Media assets needing accessibility text</small>
        </div>
      </div>

      <div className={styles.seoGrid}>
        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Globe size={20} className="gold-text" />
              <h3 className={ui.title}>Global Metadata</h3>
            </div>
            <span className={styles.microPill}>Homepage snippet editor</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Site Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. LOrdEnRYQuE | AI Agent Architect"
              />
              <p className={`${styles.ruleHint} ${titleHealthy ? styles.ok : styles.warn}`}>
                {titleHealthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} Length: {titleLen} (target 35-65)
              </p>
            </div>

            <div className={styles.formGroup}>
              <label>Meta Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Showcase of high-performance AI agents and digital strategies."
              />
              <p className={`${styles.ruleHint} ${descriptionHealthy ? styles.ok : styles.warn}`}>
                {descriptionHealthy ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />} Length: {descriptionLen} (target 110-165)
              </p>
            </div>

            <div className={styles.formGroup}>
              <label>Keywords (comma separated)</label>
              <input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="AI Agents, Next.js, Portfolio, Digital Strategy"
              />
            </div>

            <div className={styles.sectionTitle}>
              <Share2 size={20} className="gold-text" />
              <h3 className={ui.title}>Social Sharing (OpenGraph)</h3>
            </div>

            <div className={styles.formGroup}>
              <label>OG Image URL</label>
              <input
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="URL to a 1200x630 sharing image"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Appearance Preview</label>
              <div className={styles.preview}>
                <div
                  className={styles.previewImage}
                  style={{
                    backgroundImage: `url(${formData.ogImage || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2426"})`,
                  }}
                />
                <div className={styles.previewContent}>
                  <div className={styles.previewTitle}>{formData.title || "LOrdEnRYQuE"}</div>
                  <div className={styles.previewDesc}>{formData.description || "Digital Portfolio and AI Showcase."}</div>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Save size={18} /> Update Metadata
            </button>
          </form>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <div className={styles.sectionTitle}>
              <ExternalLink size={20} className="gold-text" />
              <h3 className={ui.title}>Static Route Checklist</h3>
            </div>
            <div className={styles.filterRow}>
              <button
                type="button"
                className={`${styles.filterBtn} ${staticFilter === "all" ? styles.filterBtnActive : ""}`}
                onClick={() => setStaticFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${staticFilter === "needsWork" ? styles.filterBtnActive : ""}`}
                onClick={() => setStaticFilter("needsWork")}
              >
                Needs work
              </button>
            </div>
          </div>
          <p className={styles.checklistSub}>Open issues: {openItems}</p>
          <div className={styles.checklistGrid}>
            {filteredStaticRows.map((item) => (
              <div key={item.route} className={styles.checklistCard}>
                <div className={styles.routeHeader}>
                  <span>{item.route}</span>
                  <span className={item.issueCount === 0 ? styles.okPill : styles.warnPill}>
                    {item.issueCount === 0 ? "Healthy" : `${item.issueCount} issue${item.issueCount > 1 ? "s" : ""}`}
                  </span>
                </div>
                <ul className={styles.checkRows}>
                  {item.checks.map((check) => (
                    <li key={check.label} className={check.ok ? styles.ok : styles.warn}>
                      {check.ok ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} {check.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Search size={20} className="gold-text" />
              <h3 className={ui.title}>Dynamic SEO Health</h3>
            </div>
            <div className={styles.filterRow}>
              <button
                type="button"
                className={`${styles.filterBtn} ${dynamicFilter === "issuesOnly" ? styles.filterBtnActive : ""}`}
                onClick={() => setDynamicFilter("issuesOnly")}
              >
                Issues only
              </button>
              <button
                type="button"
                className={`${styles.filterBtn} ${dynamicFilter === "all" ? styles.filterBtnActive : ""}`}
                onClick={() => setDynamicFilter("all")}
              >
                All
              </button>
            </div>
          </div>
          <p className={styles.checklistSub}>Dynamic issues: {dynamicOpenItems} | Media missing alt text: {missingAltCount}</p>
          <input
            className={styles.searchInput}
            value={dynamicSearch}
            onChange={(event) => setDynamicSearch(event.target.value)}
            placeholder="Filter dynamic routes (e.g. /blog or service slug)"
          />
          <div className={styles.checklistGrid}>
            {filteredDynamicRows.map((row) => (
              <div key={row.route} className={styles.checklistCard}>
                <div className={styles.routeHeader}>
                  <span>{row.type}: {row.route}</span>
                  <span className={row.issueCount === 0 ? styles.okPill : styles.warnPill}>
                    {row.issueCount === 0 ? "Healthy" : `${row.issueCount} issue${row.issueCount > 1 ? "s" : ""}`}
                  </span>
                </div>
                <ul className={styles.checkRows}>
                  <li className={!row.badTitle ? styles.ok : styles.warn}>
                    {!row.badTitle ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} Title length ({row.title.length})
                  </li>
                  <li className={!row.badDescription ? styles.ok : styles.warn}>
                    {!row.badDescription ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} Description length ({row.description.length})
                  </li>
                  <li className={row.hasSchema ? styles.ok : styles.warn}>
                    {row.hasSchema ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} Structured data enabled
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Globe size={20} className="gold-text" />
              <h3 className={ui.title}>Programmatic SEO Topic Clusters</h3>
            </div>
            <span className={styles.microPill}>Drives /insights + sitemap</span>
          </div>
          <p className={styles.checklistSub}>
            Manage cluster and topic-template data used by <code>/insights</code> and sitemap generation.
          </p>

          <div className={styles.formGroup}>
            <label>Cluster JSON</label>
            <textarea
              rows={18}
              className={styles.codeArea}
              value={topicClustersJson}
              onChange={(event) => {
                setTopicClustersDirty(true);
                setTopicClustersError("");
                setTopicClustersNotice("");
                setTopicClustersJson(event.target.value);
              }}
              placeholder="[]"
            />
          </div>

          {topicClustersError ? <p className={styles.warn}>{topicClustersError}</p> : null}
          {topicClustersNotice ? <p className={styles.ok}>{topicClustersNotice}</p> : null}

          <button type="button" className={styles.saveBtn} onClick={handleSaveTopicClusters}>
            <Save size={18} /> Save Topic Clusters
          </button>
        </motion.div>
      </div>
    </div>
  );
};
