import React from "react";
import styles from "./FeaturedProjects.module.css";
import { ArrowUpRight, Target, Code2, Globe, Cpu, Layout, Shield } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target size={80} />,
  Code2: <Code2 size={80} />,
  Globe: <Globe size={80} />,
  Cpu: <Cpu size={80} />,
  Layout: <Layout size={80} />,
  Shield: <Shield size={80} />,
};

type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  iconName?: string;
};

type FeaturedProjectsProps = {
  locale: Locale;
  featuredProjects: FeaturedProject[];
};

export const FeaturedProjects = ({ locale, featuredProjects }: FeaturedProjectsProps) => {
  const copy =
    locale === "de"
      ? {
          titlePrefix: "Ausgewählte",
          titleAccent: "Arbeiten",
          subtitle: "Ausgewählte Projekte, die meinen Standard definieren.",
          viewAll: "Alle Projekte",
          caseStudy: "Case Study Lesen",
          loading: "Ausgewählte Projekte werden geladen...",
        }
      : {
          titlePrefix: "Featured",
          titleAccent: "Work",
          subtitle: "Selected projects that define my standards.",
          viewAll: "View All Projects",
          caseStudy: "Read Case Study",
          loading: "Loading featured work...",
        };
  return (
    <section className={styles.projects} id="projects">
      <div className="container">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{copy.titlePrefix} <span className="gold-text">{copy.titleAccent}</span></h2>
            <p className={styles.subtitle}>{copy.subtitle}</p>
          </div>
          <Link href="/projects" className={styles.viewAll}>
            {copy.viewAll} <ArrowUpRight size={20} />
          </Link>
        </div>

        <div className={styles.projectList}>
          {featuredProjects?.map((project, index) => (
            <div 
              key={project.slug}
              className={styles.projectCard}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className={styles.projectImage}>
                {project.iconName ? ICON_MAP[project.iconName] : <Code2 size={80} />}
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
                
                <Link href={`/projects/${project.slug}`} className={styles.caseStudyLink}>
                  {copy.caseStudy} <ArrowUpRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
