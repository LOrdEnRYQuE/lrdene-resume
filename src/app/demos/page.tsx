"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Demos.module.css";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ArrowRight, Code2 } from "lucide-react";

export default function DemosPage() {
  const demos = useQuery(api.demos.list);

  if (demos === undefined) {
    return (
      <div className={styles.loadingContainer}>
        <div className="gold-text">Initializing MVPs...</div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Interactive <span>Showcase</span>
        </motion.h1>
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Explore production-ready MVPs and experimental digital products.
        </motion.p>
      </header>

      <div className={styles.grid}>
        {demos?.length > 0 ? (
          demos.map((demo, idx) => (
            <motion.div 
              key={demo._id}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
            >
              <div className={styles.cardImage}>
                <Image 
                  src={demo.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"} 
                  alt={demo.name}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx < 2}
                />
                {demo.featured && (
                  <div className={styles.featuredLogoBadge} aria-label="Featured demo">
                    <span className={styles.featuredLogoRing} />
                    <Image
                      src="/assets/LOGO.png"
                      alt="LOrdEnRYQuE"
                      width={30}
                      height={30}
                      className={styles.featuredLogoImage}
                    />
                  </div>
                )}
                <div className={styles.imageOverlay}>
                  <Link href={`/demos/${demo.slug}`} className={styles.viewBtn}>
                    View Case Study <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.category}>{demo.category}</div>
                <h3 className={styles.demoName}>{demo.name}</h3>
                <p className={styles.description}>{demo.description}</p>
                
                <div className={styles.techStack}>
                  {(demo.techStack || []).map((tech: string, i: number) => (
                    <span key={i} className={styles.techTag}>
                      <Code2 size={10} /> {tech}
                    </span>
                  ))}
                </div>

                <div className={styles.footer}>
                  <Link href={demo.url || "#"} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>
                    Live Demo <ExternalLink size={14} />
                  </Link>
                  <Link href={`/demos/${demo.slug}`} className={styles.detailsLink}>
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={styles.empty}>
            <p className="platinum-text">No demos found. Please synchronize the portfolio in the Admin Panel.</p>
          </div>
        )}
      </div>
    </main>
  );
}
