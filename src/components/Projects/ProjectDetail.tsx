"use client";

import React from "react";
import styles from "./ProjectDetail.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Code2, Trophy, Target, Calendar, Briefcase } from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";
import { notFound } from "next/navigation";
import { useLocale } from "@/lib/i18n/useLocale";


export const ProjectDetail = ({ slug }: { slug: string }) => {
  const locale = useLocale();
  const project = useQuery(api.projects.getBySlug, { slug });
  const copy =
    locale === "de"
      ? {
          loading: "Case Study wird geladen...",
          back: "Zurück zum Archiv",
          live: "Live Projekt",
          source: "Quellcode",
          challenge: "Die Herausforderung",
          solution: "Die Lösung",
          execution: "Technische Umsetzung",
          myRole: "Meine Rolle",
          status: "Status",
          year: "Jahr",
          stack: "Stack & Tools",
        }
      : {
          loading: "Loading case study...",
          back: "Back to Archive",
          live: "Live Project",
          source: "Source Code",
          challenge: "The Challenge",
          solution: "The Solution",
          execution: "Technical Execution",
          myRole: "My Role",
          status: "Status",
          year: "Year",
          stack: "Stack & Tools",
        };

  if (project === undefined) return <div className={styles.loading}>{copy.loading}</div>;
  if (project === null) notFound();

  return (
    <article className={styles.detail}>
      <div className={styles.heroSection}>
        <div className="container">
          <LocaleLink href="/projects" className={styles.backBtn}>
            <div className={styles.backInner}>
              <ArrowLeft size={16} /> <span>{copy.back}</span>
            </div>
          </LocaleLink>
          
          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className={styles.meta}>
                <span className={styles.year}>2024</span>
                <span className={styles.category}>{project.category}</span>
              </div>
              <h1 className={styles.title}>{project.title}</h1>
              <p className={styles.subtitle}>{project.summary}</p>
              
              <div className={styles.heroLinks}>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                    {copy.live} <ExternalLink size={16} />
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>
                    {copy.source} <Github size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className={styles.heroImageWrapper}>
          <div className={styles.parallaxImage}>
            <div className={styles.imageOverlay} />
          </div>
        </div>
      </div>

      <div className="container">
        <div className={styles.layout}>
          <main className={styles.mainContent}>
            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <Target size={24} className="gold-text" />
                <h2>{copy.challenge}</h2>
              </div>
              <p className={styles.blockText}>{project.challenge}</p>
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <Trophy size={24} className="gold-text" />
                <h2>{copy.solution}</h2>
              </div>
              <p className={styles.blockText}>{project.solution}</p>
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <Code2 size={24} className="gold-text" />
                <h2>{copy.execution}</h2>
              </div>
              <p className={styles.blockText}>{project.description}</p>
            </div>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Briefcase size={14} /> {copy.myRole}
                </div>
                <div className={styles.sidebarValue}>{project.role}</div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Target size={14} /> {copy.status}
                </div>
                <div className={styles.sidebarValue}>
                  <span className={styles.statusBadge}>{project.status}</span>
                </div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Calendar size={14} /> {copy.year}
                </div>
                <div className={styles.sidebarValue}>{project.year || "2024"}</div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>{copy.stack}</div>
                <div className={styles.stackGrid}>
                  {project.stack.map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
