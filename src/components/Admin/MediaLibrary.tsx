"use client";

import React, { useState } from "react";
import styles from "./MediaLibrary.module.css";
import { Image as ImageIcon, Upload, Trash2, Search, Filter, Grid, List as ListIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const MediaLibrary = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  // Mock media for now
  const media = [
    { id: 1, name: "hero-bg.jpg", size: "2.4 MB", type: "image/jpeg", date: "Mar 20, 2026", url: "/hero-bg.jpg" },
    { id: 2, name: "logo-gold.svg", size: "12 KB", type: "image/svg+xml", date: "Mar 19, 2026", url: "/logo.svg" },
    { id: 3, name: "project-01.webp", size: "450 KB", type: "image/webp", date: "Mar 18, 2026", url: "/project-01.jpg" },
    { id: 4, name: "author-avatar.png", size: "1.2 MB", type: "image/png", date: "Mar 15, 2026", url: "/avatar.png" },
  ];

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={styles.library}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <ImageIcon className="gold-text" size={32} />
          <div>
            <h1>Media <span className="gold-text">Library</span></h1>
            <p>Centralized asset management for your digital ecosystem.</p>
          </div>
        </div>
        <button className={styles.uploadBtn}>
          <Upload size={18} /> Upload Asset
        </button>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            placeholder="Search assets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.viewToggles}>
          <button onClick={() => setView("grid")} className={view === "grid" ? styles.activeView : ""}>
            <Grid size={18} />
          </button>
          <button onClick={() => setView("list")} className={view === "list" ? styles.activeView : ""}>
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className={view === "grid" ? styles.grid : styles.list}>
        {filteredMedia.map((item) => (
          <motion.div 
            key={item.id}
            className={view === "grid" ? styles.mediaCard : styles.mediaRow}
            whileHover={{ y: -5 }}
          >
            <div className={styles.preview}>
              <div className={styles.placeholderIcon}>
                <ImageIcon size={24} />
              </div>
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.meta}>{item.size} • {item.date}</span>
            </div>
            <button className={styles.deleteBtn}>
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
