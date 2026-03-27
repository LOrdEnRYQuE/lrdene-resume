"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./DemoDetail.module.css";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Code2,
  Zap,
  Sparkles,
  Loader2,
  Send,
} from "lucide-react";

type Props = {
  slug: string;
};

export default function DemoDetailClient({ slug }: Props) {
  const router = useRouter();
  const demo = useQuery(api.demos.getBySlug, { slug });
  const createLead = useMutation(api.leads.create);

  const [requesting, setRequesting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  if (demo === undefined) {
    return (
      <div className={styles.loading}>
        <Loader2 className={styles.spinner} />
      </div>
    );
  }

  if (demo === null) {
    return (
      <div className={styles.notFound}>
        <h1>Case Study Not Found</h1>
        <button onClick={() => router.push("/demos")}>Return to Showcase</button>
      </div>
    );
  }

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await createLead({
        name: leadForm.name,
        email: leadForm.email,
        message: `[REQUEST FROM ${demo.name} SHOWCASE]: ${leadForm.message}`,
        projectType: demo.category,
        budget: "To be discussed",
        company: "Demo Requester",
        timeline: "ASAP",
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.push("/demos")}>
        <ArrowLeft size={18} /> Back to Showcase
      </button>

      <div className={styles.hero}>
        <motion.div className={styles.heroContent} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className={styles.categoryBadge}>{demo.category}</div>
          <h1 className={styles.title}>{demo.name}</h1>
          <p className={styles.description}>{demo.description}</p>

          <div className={styles.heroActions}>
            <a href={demo.url} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
              Visit Live Branch <ExternalLink size={18} />
            </a>
            <button
              className={styles.secondaryBtn}
              onClick={() => document.getElementById("request-form")?.scrollIntoView({ behavior: "smooth" })}
            >
              Request this MVP <Zap size={18} />
            </button>
          </div>
        </motion.div>

        <motion.div className={styles.heroImage} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Image
            src={demo.imageUrl || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"}
            alt={demo.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className={styles.glare}></div>
        </motion.div>
      </div>

      <div className={styles.detailsGrid}>
        <div className={styles.mainInfo}>
          <section className={styles.section}>
            <h2>Core Features</h2>
            <div className={styles.featureGrid}>
              {demo.features.map((feature, i) => (
                <div key={i} className={styles.featureItem}>
                  <CheckCircle2 size={20} className={styles.check} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.stickyCard}>
            <h3>Tech Architecture</h3>
            <div className={styles.stackList}>
              {demo.techStack.map((tech, i) => (
                <div key={i} className={styles.techItem}>
                  <Code2 size={16} /> {tech}
                </div>
              ))}
            </div>

            <div className={styles.branchInfo}>
              <Code2 size={16} /> <code>{demo.branch}</code>
            </div>
          </div>
        </div>
      </div>

      <section id="request-form" className={styles.conversionSection}>
        <div className={styles.conversionCard}>
          <div className={styles.conversionText}>
            <Sparkles size={40} className={styles.sparkleIcon} />
            <h2>Want a version of this for your business?</h2>
            <p>I can deploy a custom-tailored version of this {demo.name} branch to your infrastructure in record time.</p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form onSubmit={handleRequest} className={styles.form} exit={{ opacity: 0, scale: 0.9 }}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    required
                  />
                </div>
                <textarea
                  placeholder="Special requirements or questions?"
                  rows={4}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                />
                <button type="submit" disabled={requesting} className={styles.submitBtn}>
                  {requesting ? <Loader2 className={styles.spinner} /> : <><Send size={18} /> Send Request</>}
                </button>
              </motion.form>
            ) : (
              <motion.div className={styles.success} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className={styles.successIcon}><CheckCircle2 size={60} /></div>
                <h3>Request Received!</h3>
                <p>I&apos;ll be in touch within 24 hours to discuss your project requirements.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
