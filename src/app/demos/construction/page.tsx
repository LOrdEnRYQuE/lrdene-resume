"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  HardHat, 
  Construction, 
  Ruler, 
  Hammer, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight,
  ChevronRight,
  Calendar,
  Layers,
  Zap,
  Phone,
  Mail
} from "lucide-react";
import styles from "./construction.module.css";

const PROJECTS = [
  {
    id: 1,
    title: "The Zenith Heights",
    location: "Downtown Metropolis",
    status: "In Progress",
    progress: 65,
    type: "Residential",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2426"
  },
  {
    id: 2,
    title: "Nova Tech Park",
    location: "Silicon Valley East",
    status: "Foundation",
    progress: 20,
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2426"
  },
  {
    id: 3,
    title: "Azure Marina Resonates",
    location: "Coastal District",
    status: "Finishing",
    progress: 92,
    type: "Luxury Living",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2426"
  }
];

const SERVICES = [
  {
    icon: <Construction size={24} />,
    title: "Civil Engineering",
    desc: "Precision grading and infrastructure development for large-scale projects."
  },
  {
    icon: <Layers size={24} />,
    title: "Structural Framing",
    desc: "Industrial-grade steel and timber framing engineered for maximum endurance."
  },
  {
    icon: <Zap size={24} />,
    title: "Smart Integration",
    desc: "Building-wide IoT and automation systems integrated from the ground up."
  }
];

export default function ConstructionPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image 
            src="/assets/construction-hero.png"
            alt="Titan Structures Hero"
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <div className={styles.heroContent}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroBadge}
          >
            <ShieldCheck size={14} /> INDUSTRIAL GRADE EXCELLENCE
          </motion.div>
          
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            TITAN <span>STRUCTURES</span>
          </motion.h1>
          
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Engineering the future of high-impact architecture with precision, 
            safety, and unmatched industrial expertise.
          </motion.p>
          
          <motion.div 
            className={styles.heroActions}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button className={styles.primaryBtn}>
              View Projects <ChevronRight size={18} />
            </button>
            <button className={styles.secondaryBtn}>
              Request Proposal
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>250+</span>
          <span className={styles.statLabel}>PROECTS COMPLETED</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>15M+</span>
          <span className={styles.statLabel}>SQ FT DEVELOPED</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>0</span>
          <span className={styles.statLabel}>SAFETY INCIDENTS</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>45</span>
          <span className={styles.statLabel}>YEARS OF LEGACY</span>
        </div>
      </section>

      {/* Active Projects */}
      <section className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTag}>PORTFOLIO</div>
          <h2 className={styles.sectionTitle}>Active <span>Engagements</span></h2>
        </div>

        <div className={styles.projectGrid}>
          {PROJECTS.map((project) => (
            <motion.div 
              key={project.id}
              className={styles.projectCard}
              whileHover={{ y: -10 }}
            >
              <div className={styles.projectImageContainer}>
                <Image src={project.image} alt={project.title} fill className={styles.projectImage} />
                <div className={styles.projectStatusBadge}>{project.status}</div>
              </div>
              <div className={styles.projectInfo}>
                <div className={project.type === "Luxury Living" ? styles.projectTypeGold : styles.projectType}>
                  {project.type}
                </div>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <div className={styles.projectLoc}>
                  <MapPin size={14} /> {project.location}
                </div>
                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span>Completion</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div 
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesContent}>
          <div className={styles.sectionTag}>CAPABILITIES</div>
          <h2 className={styles.sectionTitle}>Industrial <span>Precision</span></h2>
          <p className={styles.sectionDesc}>
            From initial site analysis to the final structural inspection, our teams 
            operate with military-grade precision and efficiency.
          </p>
          
          <div className={styles.servicesList}>
            {SERVICES.map((s, i) => (
              <div key={i} className={styles.serviceItem}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <div className={styles.serviceText}>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.servicesVisual}>
          <div className={styles.visualCard}>
            <HardHat size={48} className={styles.visualIcon} />
            <div className={styles.visualOverlay} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contactSection}>
        <div className={styles.contactCard}>
          <div className={styles.contactHeader}>
            <h3>Initialize <span>Consultation</span></h3>
            <p>Ready to break ground on your next landmark? Our engineers are standing by.</p>
          </div>
          
          <form className={styles.contactForm}>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Project Name</label>
                <input type="text" placeholder="e.g. Skyline Plaza" />
              </div>
              <div className={styles.inputGroup}>
                <label>Budget Range</label>
                <select>
                  <option>$1M - $5M</option>
                  <option>$5M - $20M</option>
                  <option>$20M+</option>
                </select>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>Message</label>
              <textarea placeholder="Describe your structural requirements..." rows={4} />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Submit RFP <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <h2>TITAN</h2>
          <p>Structural Excellence Since 1981</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.linkGroup}>
            <h4>Sitemap</h4>
            <a href="#">Projects</a>
            <a href="#">Services</a>
            <a href="#">Safety</a>
          </div>
          <div className={styles.linkGroup}>
            <h4>Connect</h4>
            <a href="#"><Phone size={14} /> +1 (555) TITAN-01</a>
            <a href="#"><Mail size={14} /> hello@titan-structures.io</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
