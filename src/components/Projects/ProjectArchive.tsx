"use client";

import React, { useState } from "react";
import styles from "./ProjectArchive.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, Grid, List as ListIcon } from "lucide-react";
import Link from "next/link";
import { Magnetic } from "../Common/Magnetic";

const categories = ["All", "Web", "AI", "Design", "Branding", "Dashboard", "Demo"];

export const ProjectArchive = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const projects = useQuery(api.projects.list, {
    category: selectedCategory === "All" ? undefined : selectedCategory
  });

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.archive}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Project <span className="gold-text">Archive</span></h1>
          <p className={styles.subtitle}>A collection of digital products, case studies, and MVPs.</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.categories}>
            {categories.map(cat => (
              <Magnetic key={cat} strength={0.2}>
                <button
                  className={`${styles.catBtn} ${selectedCategory === cat ? styles.active : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </Magnetic>
            ))}
          </div>
          
          <div className={styles.rightControls}>
            <div className={styles.viewToggle}>
              <Magnetic strength={0.3}>
                <button 
                  className={`${styles.toggleBtn} ${viewMode === "grid" ? styles.active : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <Grid size={18} />
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button 
                  className={`${styles.toggleBtn} ${viewMode === "list" ? styles.active : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <ListIcon size={18} />
                </button>
              </Magnetic>
            </div>

            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <motion.div 
          layout 
          className={viewMode === "grid" ? styles.grid : styles.list}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects?.map((project) => (
              <motion.div 
                layout
                key={project.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={styles.card}
              >
                <Magnetic strength={0.2} className={styles.cardInner}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.imagePlaceholder}>
                      {project.category}
                    </div>
                    {viewMode === "grid" && (
                      <div className={styles.overlay}>
                        <Link href={`/projects/${project.slug}`} className={styles.viewBtn}>
                          View Case Study <ArrowUpRight size={18} />
                        </Link>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.metaTop}>
                      <span className={styles.year}>2024</span>
                      <div className={styles.tags}>
                        {project.stack.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.mainInfo}>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardSummary}>{project.summary}</p>
                    </div>
                    {viewMode === "list" && (
                      <Link href={`/projects/${project.slug}`} className={styles.listLink}>
                        <ArrowUpRight size={20} />
                      </Link>
                    )}
                  </div>
                </Magnetic>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {projects && filteredProjects?.length === 0 && (
          <div className={styles.empty}>
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};
