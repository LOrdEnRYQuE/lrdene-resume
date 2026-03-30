"use client";

import React, { useEffect, useState } from "react";
import styles from "./ProjectArchive.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, ArrowUpRight, Grid, List as ListIcon, X } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { useLocale } from "@/lib/i18n/useLocale";
import Image from "next/image";


const categories = ["All", "Web", "AI", "Design", "Branding", "Dashboard", "Demo"];

type ProjectItem = {
  _id?: string;
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  category: string;
  year?: string;
};

export const ProjectArchive = ({ initialProjects = [] }: { initialProjects?: ProjectItem[] }) => {
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 480px)");
    const syncMode = () => {
      if (mq.matches) setViewMode("grid");
    };
    syncMode();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", syncMode);
      return () => mq.removeEventListener("change", syncMode);
    }
    mq.addListener(syncMode);
    return () => mq.removeListener(syncMode);
  }, []);
  
  const projectsLive = useQuery(api.projects.list, {});
  const projects = projectsLive ?? initialProjects;

  const copy =
    locale === "de"
      ? {
          loading: "Projektarchiv wird geladen...",
          titlePrefix: "Projekt",
          titleAccent: "Archiv",
          subtitle: "Kuratiertes Portfolio aus digitalen Produkten, KI-Lösungen und Case Studies.",
          search: "Projekte suchen...",
          showing: "Zeige",
          project: "Projekt",
          projects: "Projekte",
          reset: "Filter Zurücksetzen",
          empty: "Keine Projekte passend zu deinen Filtern gefunden.",
          viewCase: "Case Study Ansehen",
          grid: "Rasteransicht",
          list: "Listenansicht",
          categoryLabels: {
            All: "Alle",
            Web: "Web",
            AI: "KI",
            Design: "Design",
            Branding: "Branding",
            Dashboard: "Dashboard",
            Demo: "Demo",
          } as Record<string, string>,
        }
      : {
          loading: "Syncing Project Vault...",
          titlePrefix: "Project",
          titleAccent: "Archive",
          subtitle: "A curated collection of digital products, AI solutions, and design case studies.",
          search: "Search projects...",
          showing: "Showing",
          project: "Project",
          projects: "Projects",
          reset: "Reset Filters",
          empty: "No projects found matching your criteria.",
          viewCase: "View Case Study",
          grid: "Grid View",
          list: "List View",
          categoryLabels: {
            All: "All",
            Web: "Web",
            AI: "AI",
            Design: "Design",
            Branding: "Branding",
            Dashboard: "Dashboard",
            Demo: "Demo",
          } as Record<string, string>,
        };

  if (!projects && initialProjects.length === 0) {
    return (
      <div className={styles.loading}>
        <div className="gold-text">{copy.loading}</div>
      </div>
    );
  }

  const filteredProjects = (projects ?? []).filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(p => selectedCategory === "All" || p.category === selectedCategory);

  return (
    <section className={styles.archive}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>{copy.titlePrefix} <span className="platinum-text">{copy.titleAccent}</span></h1>
          <p className={styles.subtitle}>{copy.subtitle}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.categories}>
            {categories.map((cat: string) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${selectedCategory === cat ? styles.active : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {copy.categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
          
          <div className={styles.rightControls}>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.toggleBtn} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                title={copy.grid}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`${styles.toggleBtn} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                title={copy.list}
              >
                <ListIcon size={18} />
              </button>
            </div>

            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder={copy.search}
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.resultsInfo}>
          <p className={styles.countText}>
            {copy.showing} <span className="platinum-text">{filteredProjects.length}</span> {filteredProjects.length === 1 ? copy.project : copy.projects}
          </p>
          {(selectedCategory !== "All" || searchQuery) && (
            <button 
              className={styles.resetAll}
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              {copy.reset}
            </button>
          )}
        </div>

        <motion.div 
          layout 
          className={viewMode === "grid" ? styles.grid : styles.list}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project.slug}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                className={styles.card}
              >
                <div className={styles.cardInner}>
                  <div className={styles.imageWrapper}>
                    <div className={styles.projectLogoBadge} aria-hidden="true">
                      <span className={styles.projectLogoRing} />
                      <Image
                        src="/assets/LOGO.png"
                        alt="LOrdEnRYQuE"
                        width={24}
                        height={24}
                        className={styles.projectLogoImage}
                      />
                    </div>
                    <div className={styles.imagePlaceholder}>
                      {project.category}
                    </div>
                    {viewMode === "grid" && (
                      <div className={styles.overlay}>
                        <LocaleLink href={`/projects/${project.slug}`} className={styles.viewBtn}>
                          {copy.viewCase} <ArrowUpRight size={18} />
                        </LocaleLink>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.content}>
                    <div className={styles.metaTop}>
                      <span className={styles.year}>{project.year || "2024"}</span>
                      <div className={styles.tags}>
                        {project.stack.slice(0, 3).map((tag: string) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.mainInfo}>
                      <h3 className={styles.cardTitle}>{project.title}</h3>
                      <p className={styles.cardSummary}>{project.summary}</p>
                    </div>
                    {viewMode === "list" && (
                      <LocaleLink href={`/projects/${project.slug}`} className={styles.listLink}>
                        <ArrowUpRight size={20} />
                      </LocaleLink>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {projects && filteredProjects.length === 0 && (
          <div className={styles.empty}>
            <p>{copy.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
};
