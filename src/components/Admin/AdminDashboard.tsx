"use client";

import React from "react";
import styles from "./AdminDashboard.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Users, Briefcase, Activity, Globe, FileText, Image as ImageIcon } from "lucide-react";

export const AdminDashboard = () => {
  const leads = useQuery(api.leads.list, {}) || [];
  const posts = useQuery(api.posts.list, { category: undefined }) || [];
  
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  
  return (
    <div className={`${styles.dashboard} container`}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className={styles.title}>Command <span className="gold-text">Center</span></h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Overview of incoming leads and platform analytics.
          </p>
        </div>
      </motion.div>

      <div className={styles.navGrid}>
        <motion.a 
          href="/admin/seo" 
          className={styles.navCard}
          whileHover={{ y: -5, borderColor: "var(--accent-gold)" }}
        >
          <Globe size={24} className="gold-text" />
          <h3>SEO Manager</h3>
          <p>Control metadata & OpenGraph tags</p>
        </motion.a>
        <motion.a 
          href="/admin/projects" 
          className={styles.navCard}
          whileHover={{ y: -5, borderColor: "var(--accent-gold)" }}
        >
          <Briefcase size={24} className="gold-text" />
          <h3>Project Manager</h3>
          <p>CRUD for portfolio case studies</p>
        </motion.a>

        <motion.a 
          href="/admin/leads" 
          className={styles.navCard}
          whileHover={{ y: -5, borderColor: "var(--accent-gold)" }}
        >
          <Activity size={24} className="gold-text" />
          <h3>Lead Pipeline</h3>
          <p>Track status & follow-up notes</p>
        </motion.a>

        <motion.a 
          href="/admin/blog" 
          className={styles.navCard}
          whileHover={{ y: -5, borderColor: "var(--accent-gold)" }}
        >
          <FileText size={24} className="gold-text" />
          <h3>Journal Manager</h3>
          <p>Draft & publish editorial content</p>
        </motion.a>
        <motion.a 
          href="/admin/media" 
          className={styles.navCard}
          whileHover={{ y: -5, borderColor: "var(--accent-gold)" }}
        >
          <ImageIcon size={24} className="gold-text" />
          <h3>Media Library</h3>
          <p>Manage site assets & images</p>
        </motion.a>
      </div>

      <div className={styles.statsRow}>
        <motion.div className={styles.statCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <Users size={24} className="gold-text" />
          <div className={styles.statValue}>{leads.length}</div>
          <div className={styles.statLabel}>Total Inquiries</div>
        </motion.div>
        <motion.div className={styles.statCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Activity size={24} className="gold-text" />
          <div className={styles.statValue}>{newLeadsCount}</div>
          <div className={styles.statLabel}>New Leads</div>
        </motion.div>
        <motion.div className={styles.statCard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Briefcase size={24} className="gold-text" />
          <div className={styles.statValue}>V1.0.0</div>
          <div className={styles.statLabel}>System Status</div>
        </motion.div>
      </div>

      <motion.div 
        className={styles.tableContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Recent Leads Pipeline</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Budget</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.emptyState}>
                      <p>No leads have come in yet.</p>
                      <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                        Waiting for traffic to submit forms via the Contact page.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      {new Date(lead._creationTime).toLocaleDateString("en-US", {
                        month: "short", day: "numeric"
                      })}
                    </td>
                    <td><strong>{lead.name}</strong></td>
                    <td>{lead.email}</td>
                    <td>{lead.projectType}</td>
                    <td>{lead.budget}</td>
                    <td>
                      <span className={`${styles.badge} ${lead.status === 'new' ? styles.badgeNew : styles.badgeContacted}`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
