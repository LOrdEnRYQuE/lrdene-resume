"use client";

import React from "react";
import styles from "./Blog.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";

export const BlogList = () => {
  const locale = useLocale();
  const posts = useQuery(api.posts.list, {}) || [];
  const copy =
    locale === "de"
      ? {
          title: "Insights & Updates",
          subtitle:
            "Deep Dives zu Software-Architektur, KI-Produktaufbau und Designsystemen für moderne Produkte.",
          empty: "Die ersten Artikel erscheinen bald. Schau später wieder vorbei.",
          tag: "Engineering",
          read: "Artikel Lesen",
        }
      : {
          title: "Insights & Updates",
          subtitle:
            "Deep dives into software architecture, AI product building, and design systems for enterprise applications.",
          empty: "Publishing the first few articles soon. Check back later!",
          tag: "Engineering",
          read: "Read Article",
        };

  return (
    <div className={`${styles.blogPage} container`}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>{copy.title.split(" & ")[0]} & <span className="gold-text">{copy.title.split(" & ")[1] || "Updates"}</span></h1>
        <p className={styles.subtitle}>{copy.subtitle}</p>
      </motion.div>

      <div className={styles.grid}>
        {posts.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", textAlign: "center", gridColumn: "1 / -1", padding: "4rem 0" }}>
            <p>{copy.empty}</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <LocaleLink href={`/blog/${post.slug}`} key={post._id} passHref legacyBehavior>
              <motion.a 
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.meta}>
                  <span className={styles.tag}>{copy.tag}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={14} /> {post.readTime}
                  </span>
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.readMore}>
                  {copy.read} <ArrowRight size={16} />
                </div>
              </motion.a>
            </LocaleLink>
          ))
        )}
      </div>
    </div>
  );
};
