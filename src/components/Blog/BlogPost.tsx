"use client";

import React from "react";
import styles from "./BlogPost.module.css";
import { motion } from "framer-motion";
import { Calendar, Clock, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface BlogPostProps {
  post: any;
}

export const BlogPost = ({ post }: BlogPostProps) => {
  if (!post) return null;

  return (
    <div className={styles.container}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={styles.hero}
      >
        <Link href="/blog" className={styles.backLink}>
          <ChevronLeft size={16} /> Back to Journal
        </Link>
        <div className={styles.header}>
          <span className={styles.category}>{post.category}</span>
          <h1>{post.title}</h1>
          <div className={styles.meta}>
            <span><User size={16} /> {post.author}</span>
            <span><Calendar size={16} /> {new Date(post.date).toLocaleDateString()}</span>
            <span><Clock size={16} /> {post.readTime}</span>
          </div>
        </div>
        <div className={styles.imageBox}>
          <img src={post.coverImage} alt={post.title} />
        </div>
      </motion.div>

      <div className={styles.articleLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.authorCard}>
            <div className={styles.authorAvatar}>AL</div>
            <div>
              <h4>{post.author}</h4>
              <p>Founder, LOrdEnRYQuE</p>
            </div>
          </div>
          <div className={styles.share}>
            <span>Share</span>
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
        </article>
      </div>
    </div>
  );
};
