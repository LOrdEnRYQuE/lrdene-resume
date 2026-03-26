"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Blog.module.css";
import { motion } from "framer-motion";
import LocaleLink from "@/components/I18n/LocaleLink";
import { ArrowLeft, Clock } from "lucide-react";
import { useLocale } from "@/lib/i18n/useLocale";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";

export const BlogArticle = () => {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  
  const post = useQuery(api.posts.getBySlug, { slug });

  const copy =
    locale === "de"
      ? {
          loading: "Artikel wird geladen...",
          notFound: "Artikel nicht gefunden",
          back: "Zurück zu Insights",
          tag: "Engineering",
        }
      : {
          loading: "Loading article...",
          notFound: "Article Not Found",
          back: "Back to Insights",
          tag: "Engineering",
        };

  if (post === undefined) {
    return <div className="container" style={{ padding: "8rem 2rem", textAlign: "center", color: "#a0a0a0" }}>{copy.loading}</div>;
  }

  if (post === null) {
    return (
      <div className="container" style={{ padding: "8rem 2rem", textAlign: "center", color: "#a0a0a0", minHeight: "60vh" }}>
        <h1>{copy.notFound}</h1>
        <LocaleLink href="/blog" className={styles.goBack} style={{ marginTop: "2rem", display: "inline-block" }}>
          <ArrowLeft size={16} /> {copy.back}
        </LocaleLink>
      </div>
    );
  }

  const safeContent = sanitizeRichHtml(post.content || "");

  return (
    <article className={`${styles.blogPage} container`}>
      <div className={styles.articleContainer}>
        <motion.div 
          className={styles.articleHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LocaleLink href="/blog" className={styles.goBack}>
            <ArrowLeft size={16} /> {copy.back}
          </LocaleLink>
          <div className={styles.meta} style={{ justifyContent: "center", marginBottom: "2rem" }}>
            <span className={styles.tag}>{copy.tag}</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={14} /> {post.readTime}
            </span>
            <span>
              {new Date(post._creationTime).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
        </motion.div>

        <motion.div 
          className={styles.articleContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />
      </div>
    </article>
  );
};
