"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import styles from "./SEOManager.module.css";
import ui from "./AdminPrimitives.module.css";
import { Globe, Share2, Save, ExternalLink } from "lucide-react";
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
    route: "/"
  });
  const [topicClustersJson, setTopicClustersJson] = useState("");
  const [topicClustersDirty, setTopicClustersDirty] = useState(false);
  const [topicClustersError, setTopicClustersError] = useState("");
  const [topicClustersNotice, setTopicClustersNotice] = useState("");

  const metadataByRoute = new Map(metadataList.map((entry) => [entry.route, entry]));
  const checklist = AUDIT_ROUTES.map((route) => {
    const record = metadataByRoute.get(route);
    const title = record?.title || "";
    const description = record?.description || "";
    const hasTitle = title.length > 0 || ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const strongTitle = title.length === 0 || (title.length >= 35 && title.length <= 65);
    const hasDescription = description.length > 0 || ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const strongDescription = description.length === 0 || (description.length >= 110 && description.length <= 165);
    const hasCanonical = ROUTES_WITH_CANONICAL_IN_CODE.has(route);
    const hasInternalLinks = ROUTES_WITH_INTERNAL_LINKING.has(route);
    const hasSchema = ROUTES_WITH_SCHEMA.has(route);

    return {
      route,
      hasTitle,
      strongTitle,
      hasDescription,
      strongDescription,
      hasCanonical,
      hasInternalLinks,
      hasSchema,
    };
  });

  const openItems = checklist.reduce((count, item) => {
    const failures = [
      !item.hasTitle,
      !item.strongTitle,
      !item.hasDescription,
      !item.strongDescription,
      !item.hasCanonical,
      !item.hasInternalLinks,
      !item.hasSchema,
    ].filter(Boolean).length;
    return count + failures;
  }, 0);

  const dynamicSeoRows = [
    ...posts.map((post) => ({
      route: `/blog/${post.slug}`,
      title: post.title as string,
      description: post.excerpt as string,
      hasSchema: true,
      type: "Blog",
    })),
    ...projects.map((project) => ({
      route: `/projects/${project.slug}`,
      title: project.title as string,
      description: project.summary as string,
      hasSchema: true,
      type: "Project",
    })),
    ...services.map((service) => ({
      route: `/services/${service.slug}`,
      title: service.title as string,
      description: service.description as string,
      hasSchema: true,
      type: "Service",
    })),
  ];

  const dynamicOpenItems = dynamicSeoRows.reduce((count, row) => {
    const badTitle = row.title.length < 35 || row.title.length > 65;
    const badDescription = row.description.length < 110 || row.description.length > 165;
    const missingSchema = !row.hasSchema;
    return count + [badTitle, badDescription, missingSchema].filter(Boolean).length;
  }, 0);

  const missingAltCount = media.filter((item) => !item.alt || String(item.alt).trim().length < 5).length;

  useEffect(() => {
    if (metadata) {
      setFormData({
        title: metadata.title || "",
        description: metadata.description || "",
        ogImage: metadata.ogImage || "",
        keywords: metadata.keywords || ""
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
          ogImage: formData.ogImage
        });
      } else {
        // Fallback to update logic or show error if no initial record exists
        alert("No metadata record found to update.");
      }
      alert("SEO Metadata updated successfully!");
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

  return (
    <div className={ui.shell}>
      <section className={ui.section}>
        <div className={ui.titleWrap}>
          <h2 className={ui.title}>SEO <span className="gold-text">Manager</span></h2>
          <p className={ui.subtitle}>Control how your site appears in search engines and social media.</p>
        </div>
      </section>

      <div className={styles.seoGrid}>
        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <Globe size={24} className="gold-text" />
            <h3 className={ui.title}>Global Metadata</h3>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Site Title</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. LOrdEnRYQuE | AI Agent Architect" />
            </div>

            <div className={styles.formGroup}>
              <label>Meta Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Showcase of high-performance AI agents and digital strategies." />
            </div>

            <div className={styles.formGroup}>
              <label>Keywords (comma separated)</label>
              <input value={formData.keywords} onChange={e => setFormData({ ...formData, keywords: e.target.value })} placeholder="AI Agents, Next.js, Portfolio, Digital Strategy" />
            </div>

            <div className={ui.sectionHeader} style={{ marginTop: "1rem" }}>
              <Share2 size={24} className="gold-text" />
              <h3 className={ui.title}>Social Sharing (OpenGraph)</h3>
            </div>

            <div className={styles.formGroup}>
              <label>OG Image URL</label>
              <input value={formData.ogImage} onChange={e => setFormData({ ...formData, ogImage: e.target.value })} placeholder="URL to a 1200x630 sharing image" />
            </div>

            <div className={styles.formGroup}>
              <label>Appearance Preview</label>
              <div className={styles.preview}>
                <div 
                  className={styles.previewImage} 
                  style={{ backgroundImage: `url(${formData.ogImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2426'})` }} 
                />
                <div className={styles.previewContent}>
                  <div className={styles.previewTitle}>{formData.title || "LOrdEnRYQuE"}</div>
                  <div className={styles.previewDesc}>{formData.description || "Digital Portfolio and AI Showcase."}</div>
                </div>
              </div>
            </div>

            <button type="submit" className={styles.saveBtn}>
              <Save size={18} style={{ marginRight: "0.5rem" }} /> Update Metadata
            </button>
          </form>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <ExternalLink size={24} className="gold-text" />
            <h3 className={ui.title}>SEO Checklist</h3>
          </div>
          <p className={styles.checklistSub}>Open issues: {openItems}</p>
          <div className={styles.checklistGrid}>
            {checklist.map((item) => (
              <div key={item.route} className={styles.checklistCard}>
                <div className={styles.routeHeader}>
                  <span>{item.route}</span>
                </div>
                <ul className={styles.checkRows}>
                  <li className={item.hasTitle ? styles.ok : styles.warn}>Title present</li>
                  <li className={item.strongTitle ? styles.ok : styles.warn}>Title length healthy</li>
                  <li className={item.hasDescription ? styles.ok : styles.warn}>Description present</li>
                  <li className={item.strongDescription ? styles.ok : styles.warn}>Description length healthy</li>
                  <li className={item.hasCanonical ? styles.ok : styles.warn}>Canonical configured</li>
                  <li className={item.hasInternalLinks ? styles.ok : styles.warn}>Internal links available</li>
                  <li className={item.hasSchema ? styles.ok : styles.warn}>Structured data enabled</li>
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <ExternalLink size={24} className="gold-text" />
            <h3 className={ui.title}>Dynamic SEO Health</h3>
          </div>
          <p className={styles.checklistSub}>
            Dynamic issues: {dynamicOpenItems} | Media missing alt text: {missingAltCount}
          </p>
          <div className={styles.checklistGrid}>
            {dynamicSeoRows.slice(0, 24).map((row) => {
              const badTitle = row.title.length < 35 || row.title.length > 65;
              const badDescription = row.description.length < 110 || row.description.length > 165;
              return (
                <div key={row.route} className={styles.checklistCard}>
                  <div className={styles.routeHeader}>
                    <span>{row.type}: {row.route}</span>
                  </div>
                  <ul className={styles.checkRows}>
                    <li className={!badTitle ? styles.ok : styles.warn}>Title length healthy ({row.title.length})</li>
                    <li className={!badDescription ? styles.ok : styles.warn}>Description length healthy ({row.description.length})</li>
                    <li className={row.hasSchema ? styles.ok : styles.warn}>Structured data enabled</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div className={ui.card} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={ui.sectionHeader}>
            <Globe size={24} className="gold-text" />
            <h3 className={ui.title}>Programmatic SEO Topic Clusters</h3>
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
            <Save size={18} style={{ marginRight: "0.5rem" }} /> Save Topic Clusters
          </button>
        </motion.div>
      </div>
    </div>
  );
};
