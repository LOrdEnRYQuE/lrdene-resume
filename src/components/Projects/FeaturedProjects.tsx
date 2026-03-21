"use client";

import React from "react";
import styles from "./FeaturedProjects.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowUpRight, BarChart3, Target, Code2 } from "lucide-react";
import Link from "next/link";

export const FeaturedProjects = () => {
  const featuredProjects = useQuery(api.projects.getFeatured);

  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Featured <span className="gold-text">Work</span></h2>
            <p className={styles.subtitle}>Selected projects that define my standards.</p>
          </div>
          <Link href="/projects" className={styles.viewAll}>
            View All Projects <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className={styles.projectList}>
          {featuredProjects?.map((project, index) => (
            <motion.div 
              key={project.slug}
              className={styles.projectCard}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className={styles.projectImage}>
                {project.category === "AI" ? <Target size={80} /> : <Code2 size={80} />}
              </div>
              
              <div className={styles.projectInfo}>
                <span className={styles.projectNum}>0{index + 1}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectValue}>{project.summary}</p>
                
                <div className={styles.projectMeta}>
                  {project.stack.slice(0, 3).map(tag => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                
                <Link href={`/projects/${project.slug}`} className={styles.caseStudyBtn}>
                  Read Case Study <ArrowUpRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {featuredProjects === undefined && (
            <p className={styles.loading}>Loading featured work...</p>
          )}
        </div>
      </div>
    </section>
  );
};
