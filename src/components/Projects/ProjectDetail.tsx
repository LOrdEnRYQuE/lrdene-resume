"use client";

import React from "react";
import styles from "./ProjectDetail.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Code2, Trophy, Target, Calendar, Briefcase } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Magnetic } from "../Common/Magnetic";

export const ProjectDetail = ({ slug }: { slug: string }) => {
  const project = useQuery(api.projects.getBySlug, { slug });

  if (project === undefined) return <div className={styles.loading}>Loading case study...</div>;
  if (project === null) notFound();

  return (
    <article className={styles.detail}>
      <div className={styles.heroSection}>
        <div className="container">
          <Link href="/projects" className={styles.backBtn}>
            <Magnetic strength={0.3} className={styles.backInner}>
              <ArrowLeft size={16} /> <span>Back to Archive</span>
            </Magnetic>
          </Link>
          
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
                  <Magnetic strength={0.2}>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
                      Live Project <ExternalLink size={16} />
                    </a>
                  </Magnetic>
                )}
                {project.githubUrl && (
                  <Magnetic strength={0.2}>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryLink}>
                      Source Code <Github size={16} />
                    </a>
                  </Magnetic>
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
                <h2>The Challenge</h2>
              </div>
              <p className={styles.blockText}>{project.challenge}</p>
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <Trophy size={24} className="gold-text" />
                <h2>The Solution</h2>
              </div>
              <p className={styles.blockText}>{project.solution}</p>
            </div>

            <div className={styles.block}>
              <div className={styles.blockHeader}>
                <Code2 size={24} className="gold-text" />
                <h2>Technical Execution</h2>
              </div>
              <p className={styles.blockText}>{project.description}</p>
            </div>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.sidebarSticky}>
              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Briefcase size={14} /> My Role
                </div>
                <div className={styles.sidebarValue}>{project.role}</div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Target size={14} /> Status
                </div>
                <div className={styles.sidebarValue}>
                  <span className={styles.statusBadge}>{project.status}</span>
                </div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>
                  <Calendar size={14} /> Year
                </div>
                <div className={styles.sidebarValue}>2024</div>
              </div>

              <div className={styles.sidebarSection}>
                <div className={styles.sidebarLabel}>Stack & Tools</div>
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
