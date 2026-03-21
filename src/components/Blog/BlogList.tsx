"use client";

import React from "react";
import styles from "./Blog.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export const BlogList = () => {
  const posts = useQuery(api.posts.list, {}) || [];

  return (
    <div className={`${styles.blogPage} container`}>
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className={styles.title}>Insights & <span className="gold-text">Updates</span></h1>
        <p className={styles.subtitle}>
          Deep dives into software architecture, AI product building, and design systems for enterprise applications.
        </p>
      </motion.div>

      <div className={styles.grid}>
        {posts.length === 0 ? (
          <div style={{ color: "var(--text-secondary)", textAlign: "center", gridColumn: "1 / -1", padding: "4rem 0" }}>
            <p>Publishing the first few articles soon. Check back later!</p>
          </div>
        ) : (
          posts.map((post, index) => (
            <Link href={`/blog/${post.slug}`} key={post._id} passHref legacyBehavior>
              <motion.a 
                className={styles.card}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.meta}>
                  <span className={styles.tag}>Engineering</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={14} /> {post.readTime}
                  </span>
                </div>
                <h2 className={styles.cardTitle}>{post.title}</h2>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.readMore}>
                  Read Article <ArrowRight size={16} />
                </div>
              </motion.a>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
