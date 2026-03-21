"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Blog.module.css";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export const BlogArticle = () => {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = useQuery(api.posts.getBySlug, { slug });

  if (post === undefined) {
    return <div className="container" style={{ padding: "8rem 2rem", textAlign: "center", color: "#a0a0a0" }}>Loading article...</div>;
  }

  if (post === null) {
    return (
      <div className="container" style={{ padding: "8rem 2rem", textAlign: "center", color: "#a0a0a0", minHeight: "60vh" }}>
        <h1>Article Not Found</h1>
        <Link href="/blog" className={styles.goBack} style={{ marginTop: "2rem", display: "inline-block" }}>
          <ArrowLeft size={16} /> Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <article className={`${styles.blogPage} container`}>
      <div className={styles.articleContainer}>
        <motion.div 
          className={styles.articleHeader}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/blog" className={styles.goBack}>
            <ArrowLeft size={16} /> Back to Insights
          </Link>
          <div className={styles.meta} style={{ justifyContent: "center", marginBottom: "2rem" }}>
            <span className={styles.tag}>Engineering</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Clock size={14} /> {post.readTime}
            </span>
            <span>
              {new Date(post._creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className={styles.articleTitle}>{post.title}</h1>
        </motion.div>

        <motion.div 
          className={styles.articleContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
};
