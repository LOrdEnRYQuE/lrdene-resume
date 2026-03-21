"use client";

import React from "react";
import styles from "./Blog.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const BlogPreview = () => {
  const posts = useQuery(api.posts.list, {}) || [];
  const recentPosts = posts?.slice(0, 3) || [];

  return (
    <section className={styles.previewSection}>
      <div className="container">
        <div className={styles.previewHeader}>
          <div>
            <h2 className={styles.previewTitle}>
              Latest <span className="gold-text">Insights</span>
            </h2>
            <p className={styles.previewSubtitle}>
              Expertise, workflows, and industry updates.
            </p>
          </div>
          <Link href="/blog" className={styles.viewAllBtn}>
            Read All Insights <ArrowRight size={18} />
          </Link>
        </div>

        <div className={styles.previewGrid}>
          {recentPosts.map((post, index) => (
            <motion.div 
              key={post.slug}
              className={styles.blogCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <Calendar size={12} /> {new Date(post._creationTime).toLocaleDateString()}
                    </span>
                    <span className={styles.metaItem}>
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{post.title}</h3>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <div className={styles.cardFooter}>
                    <span className={styles.readMore}>
                      Read Full Story <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          
          {posts && posts.length === 0 && (
            <p className={styles.empty}>New content arriving soon.</p>
          )}
        </div>
      </div>
    </section>
  );
};
