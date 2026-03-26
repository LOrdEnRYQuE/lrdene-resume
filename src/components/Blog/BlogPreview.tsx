import React from "react";
import styles from "./Blog.module.css";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

type BlogPost = {
  slug: string;
  _creationTime: number;
  readTime: string;
  title: string;
  excerpt: string;
};

type BlogPreviewProps = {
  locale: Locale;
  posts: BlogPost[];
};

export const BlogPreview = ({ locale, posts }: BlogPreviewProps) => {
  const recentPosts = posts?.slice(0, 3) || [];
  const copy =
    locale === "de"
      ? {
          titlePrefix: "Neueste",
          titleAccent: "Insights",
          subtitle: "Expertise, Workflows und Branchen-Updates.",
          readAll: "Alle Insights Lesen",
          readFull: "Vollständigen Artikel Lesen",
          empty: "Neue Inhalte folgen in Kürze.",
          dateLocale: "de-DE",
        }
      : {
          titlePrefix: "Latest",
          titleAccent: "Insights",
          subtitle: "Expertise, workflows, and industry updates.",
          readAll: "Read All Insights",
          readFull: "Read Full Story",
          empty: "New content arriving soon.",
          dateLocale: "en-US",
        };
  const localePrefix = locale === "de" ? "/de" : "/en";

  return (
    <section className={styles.previewSection}>
      <div className="container">
        <div className={styles.previewHeader}>
          <div>
            <h2 className={styles.previewTitle}>
              {copy.titlePrefix} <span className="gold-text">{copy.titleAccent}</span>
            </h2>
            <p className={styles.previewSubtitle}>
              {copy.subtitle}
            </p>
          </div>
          <Link href={`${localePrefix}/blog`} className={styles.previewAllLink}>
            {copy.readAll} <ArrowRight size={18} />
          </Link>
        </div>

        <div className={styles.previewGrid}>
          {recentPosts.map((post, index) => (
            <div 
              key={post.slug}
              className={styles.blogCard}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Link href={`${localePrefix}/blog/${post.slug}`} className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <Calendar size={12} /> {new Date(post._creationTime).toLocaleDateString(copy.dateLocale)}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.readMore}>
                      {copy.readFull} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          
          {posts && posts.length === 0 && (
            <p className={styles.empty}>{copy.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
};
