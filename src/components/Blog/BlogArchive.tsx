"use client";

import React, { useState } from "react";
import styles from "./BlogArchive.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export const BlogArchive = () => {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const posts = useQuery(api.posts.list, { category, onlyPublished: true });

  const categories = ["Strategy", "Development", "Design", "AI"];

  const filteredPosts = posts?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.archive}>
      <header className={styles.header}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.intro}
        >
          <span className="gold-text">Insights & Strategy</span>
          <h1>The <span className="gold-text">LOrdEnRYQuE</span> Journal</h1>
          <p>Deep dives into product architecture, design evolution, and business-focused AI.</p>
        </motion.div>

        <div className={styles.controls}>
          <div className={styles.categories}>
            <button 
              className={!category ? styles.activeTab : ""} 
              onClick={() => setCategory(undefined)}
            >
              All Posts
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                className={category === cat ? styles.activeTab : ""}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.search}>
            <Search size={18} />
            <input 
              placeholder="Search articles..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        {filteredPosts?.map((post, index) => (
          <motion.article 
            key={post._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={styles.card}
          >
            <Link href={`/blog/${post.slug}`} className={styles.imageBox}>
              <img src={post.coverImage} alt={post.title} />
              <span className={styles.category}>{post.category}</span>
            </Link>
            <div className={styles.content}>
              <div className={styles.meta}>
                <span><Calendar size={14} /> {new Date(post.date).toLocaleDateString()}</span>
                <span><Clock size={14} /> {post.readTime}</span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h3>{post.title}</h3>
              </Link>
              <p>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                Read Article <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
