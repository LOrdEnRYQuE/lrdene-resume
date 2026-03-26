"use client";

import React from "react";
import styles from "./BlogPost.module.css";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/useLocale";

interface BlogPostProps {
  post: any;
  relatedPosts?: any[];
  relatedProjects?: any[];
  relatedServices?: any[];
}

export const BlogPost = ({
  post,
  relatedPosts = [],
  relatedProjects = [],
  relatedServices = [],
}: BlogPostProps) => {
  const locale = useLocale();
  if (!post) return null;
  const publishedDate = new Date(post.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US");
  const copy =
    locale === "de"
      ? {
          back: "Zurück zum Journal",
          founder: "Founder, LOrdEnRYQuE",
          share: "Teilen",
          related: "Ähnliche Inhalte",
        }
      : {
          back: "Back to Journal",
          founder: "Founder, LOrdEnRYQuE",
          share: "Share",
          related: "Related Content",
        };

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.hero}
      >
        <LocaleLink href="/blog" className={styles.backLink}>
          <ChevronLeft size={16} /> {copy.back}
        </LocaleLink>
        <div className={styles.header}>
          <span className={styles.category}>{post.category}</span>
          <h1>{post.title}</h1>
          <div className={styles.meta}>
            <span><User size={16} /> {post.author}</span>
            <span><Calendar size={16} /> {publishedDate}</span>
            <span><Clock size={16} /> {post.readTime}</span>
          </div>
        </div>
        <div className={styles.imageBox}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        </div>
      </motion.div>

      <div className={styles.articleLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.authorCard}>
            <div className={styles.authorAvatar}>AL</div>
            <div>
              <h4>{post.author}</h4>
              <p>{copy.founder}</p>
            </div>
          </div>
          <div className={styles.share}>
            <span>{copy.share}</span>
            <div className={styles.shareButtons}>
              {/* Add sharing icons if needed */}
            </div>
          </div>
        </aside>

        <article className={styles.content}>
          <p className={styles.excerpt}>{post.excerpt}</p>
          <div className={styles.body}>
            {/* Split content by double newlines to render paragraphs, or use a markdown library if available. 
                For MVP, we'll do simple paragraphs. */}
            {post.content.split('\n\n').map((block: string, i: number) => (
              block.startsWith('##') ? 
                <h2 key={i}>{block.replace('## ', '')}</h2> :
                block.startsWith('###') ?
                <h3 key={i}>{block.replace('### ', '')}</h3> :
                <p key={i}>{block}</p>
            ))}
          </div>

          {(relatedPosts.length > 0 || relatedProjects.length > 0 || relatedServices.length > 0) && (
            <section className={styles.relatedSection}>
              <h3>{copy.related}</h3>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((item) => (
                  <LocaleLink
                    key={item._id}
                    href={`/blog/${item.slug}`}
                    className={styles.relatedItem}
                    data-track-event="internal_link_click"
                    data-track-label={`Blog related: ${item.title}`}
                  >
                    {item.title}
                  </LocaleLink>
                ))}
                {relatedProjects.map((item) => (
                  <LocaleLink
                    key={item._id}
                    href={`/projects/${item.slug}`}
                    className={styles.relatedItem}
                    data-track-event="internal_link_click"
                    data-track-label={`Project related: ${item.title}`}
                  >
                    {item.title}
                  </LocaleLink>
                ))}
                {relatedServices.map((item) => (
                  <LocaleLink
                    key={item._id}
                    href={`/services/${item.slug}`}
                    className={styles.relatedItem}
                    data-track-event="internal_link_click"
                    data-track-label={`Service related: ${item.title}`}
                  >
                    {item.title}
                  </LocaleLink>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
};
