"use client";

import React, { useState } from "react";
import styles from "./BlogArchive.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/useLocale";
import { FALLBACK_POSTS } from "@/lib/postsFallback";

const FormattedDate = ({ date, locale }: { date: string | number; locale: "en-US" | "de-DE" }) => {
  const isoDate = new Date(date).toISOString().slice(0, 10);
  return <span>{new Date(isoDate).toLocaleDateString(locale)}</span>;
};

const CATEGORIES = ["All", "Strategy", "Development", "Design", "AI", "Insights"];

export const BlogArchive = () => {
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const copy =
    locale === "de"
      ? {
          loading: "Journal wird geladen...",
          eyebrow: "Insights & Strategie",
          title: "Das LOrdEnRYQuE Journal",
          subtitle: "Deep Dives zu Produktarchitektur, Designentwicklung und business-fokussierter KI.",
          search: "Artikel suchen...",
          read: "Artikel Lesen",
          empty: "Keine Artikel in dieser Kategorie gefunden.",
          categories: {
            All: "Alle",
            Strategy: "Strategie",
            Development: "Entwicklung",
            Design: "Design",
            AI: "KI",
            Insights: "Insights",
          } as Record<string, string>,
          dateLocale: "de-DE" as const,
        }
      : {
          loading: "Scanning Journal Archive...",
          eyebrow: "Insights & Strategy",
          title: "The LOrdEnRYQuE Journal",
          subtitle: "Deep dives into product architecture, design evolution, and business-focused AI.",
          search: "Search articles...",
          read: "Read Article",
          empty: "No articles found in this category.",
          categories: {
            All: "All",
            Strategy: "Strategy",
            Development: "Development",
            Design: "Design",
            AI: "AI",
            Insights: "Insights",
          } as Record<string, string>,
          dateLocale: "en-US" as const,
        };
  
  const posts = useQuery(api.posts.list, { onlyPublished: true });

  if (posts === undefined) {
    return (
      <div className={styles.loading}>
        <div className="gold-text">{copy.loading}</div>
      </div>
    );
  }

  const postsToRender = posts.length > 0 ? posts : FALLBACK_POSTS;
  const normalizedSearch = search.trim().toLowerCase();
  const filteredPosts = postsToRender.filter((post) => {
    const categoryMatches = selectedCategory === "All" ? true : post.category === selectedCategory;
    const searchMatches =
      normalizedSearch.length === 0
        ? true
        : post.title.toLowerCase().includes(normalizedSearch) ||
          post.excerpt.toLowerCase().includes(normalizedSearch);
    return categoryMatches && searchMatches;
  });

  return (
    <div className={styles.archive}>
      <header className={`${styles.header} container`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.intro}
        >
          <span className="platinum-text">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </motion.div>

        <div className={styles.controls}>
          <div className={styles.categories}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {copy.categories[cat] || cat}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <Search size={18} />
            <input 
              placeholder={copy.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className={`${styles.grid} container`}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <motion.article 
              key={post._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={styles.card}
            >
              <LocaleLink href={`/blog/${post.slug}`} className={styles.imageBox}>
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
                <span className={styles.category}>{post.category}</span>
              </LocaleLink>
              <div className={styles.content}>
                <div className={styles.meta}>
                  <span className={styles.date}><Calendar size={14} /> <FormattedDate date={post.date} locale={copy.dateLocale} /></span>
                  <span><Clock size={14} /> {post.readTime}</span>
                </div>
                <LocaleLink href={`/blog/${post.slug}`}>
                  <h3>{post.title}</h3>
                </LocaleLink>
                <p>{post.excerpt}</p>
                <LocaleLink
                  href={`/blog/${post.slug}`}
                  className={styles.readMore}
                  data-track-event="internal_link_click"
                  data-track-label={`Blog archive read: ${post.title}`}
                >
                  {copy.read} <ArrowRight size={16} />
                </LocaleLink>
              </div>
            </motion.article>
          ))
        ) : (
          <div className={styles.empty}>
            <p className="platinum-text">{copy.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
};
