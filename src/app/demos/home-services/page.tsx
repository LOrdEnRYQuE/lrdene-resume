"use client";
import React, { useState } from "react";
import styles from "./home-services.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Wrench, Menu as MenuIcon, X, Zap, Droplets, Flame, TreePine, Shield, CheckCircle, Phone, Mail, Star, Clock, MapPin, ChevronRight, DollarSign, Calendar, AlarmClock, FileText, Plus } from "lucide-react";

const SERVICES = [
  { icon: <Zap size={22} />, title: "Electrical", desc: "Panel upgrades, outlets, lighting, and full rewiring. Licensed master electrician on every job.", price: "From $95/hr" },
  { icon: <Droplets size={22} />, title: "Plumbing", desc: "Leak repairs, drain cleaning, fixture installation, and emergency pipe work. 24/7 emergency line.", price: "From $85/hr" },
  { icon: <Flame size={22} />, title: "HVAC", desc: "AC & furnace installation, maintenance plans, duct cleaning, and thermostat upgrades.", price: "From $120/hr" },
  { icon: <Wrench size={22} />, title: "General Repairs", desc: "Drywall, carpentry, tile, painting, and handyman services. No job too small.", price: "From $65/hr" },
  { icon: <TreePine size={22} />, title: "Landscaping", desc: "Lawn care, tree trimming, irrigation systems, seasonal cleanup, and hardscaping.", price: "From $75/hr" },
  { icon: <Shield size={22} />, title: "Smart Home", desc: "Security cameras, smart locks, whole-home audio, lighting automation, and EV charger install.", price: "From $110/hr" },
];

const JOBS = [
  { id: "JOB-441", client: "Maria Santos", service: "Electrical", status: "In Progress", tech: "Dave R.", date: "Mar 22", progress: 65 },
  { id: "JOB-440", client: "Tom Brennan", service: "Plumbing", status: "Scheduled", tech: "Kyle M.", date: "Mar 23", progress: 0 },
  { id: "JOB-439", client: "Priya Agarwal", service: "HVAC", status: "Completed", tech: "Sofia L.", date: "Mar 21", progress: 100 },
  { id: "JOB-438", client: "Jeff Kline", service: "Landscaping", status: "Invoiced", tech: "Ben O.", date: "Mar 20", progress: 100 },
];

const INVOICES = [
  { id: "INV-441", client: "Priya Agarwal", amount: "$485", status: "Paid" },
  { id: "INV-440", client: "Jeff Kline", amount: "$310", status: "Pending" },
  { id: "INV-438", client: "Anne Lloyd", amount: "$920", status: "Paid" },
  { id: "INV-435", client: "Marcus Webb", amount: "$225", status: "Overdue" },
];

const SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function HomeServicesMVP() {
  const [mobileNav, setMobileNav] = useState(false);
  const [dashTab, setDashTab] = useState<"jobs" | "invoices">("jobs");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileNav(false); };
  function handleBook(e: React.FormEvent) { e.preventDefault(); setBooked(true); }

  return (
    <div className={styles.app}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}><Wrench size={18} /><span>Swift<em>Fix</em></span></div>
          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {["Services", "Dashboard", "Book"].map(l => (
              <li key={l}><button className={styles.navLink} onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
            ))}
            <li><button className={styles.ctaBtn} onClick={() => scrollTo("book")}>Book a Job</button></li>
          </ul>
          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/assets/homeservices-hero.jpg" alt="Home services" fill className={styles.heroBgImg} priority />
          <div className={styles.heroOverlay} />
        </div>
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.eyebrow}><Shield size={11} fill="currentColor" /> Licensed · Insured · 5-Star Rated</span>
          <h1 className={styles.heroTitle}>Home Repairs,<br /><em>Done Right.</em></h1>
          <p className={styles.heroSubtitle}>SwiftFix connects homeowners with trusted, background-checked contractors. Same-day availability, transparent pricing, guaranteed work.</p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => scrollTo("book")}><Calendar size={17} /> Schedule a Job</button>
            <button className={styles.ghostCta} onClick={() => scrollTo("services")}>View Services <ChevronRight size={16} /></button>
          </div>
          <div className={styles.ratingBar}>
            <div className={styles.stars}>{[1,2,3,4,5].map(i=><Star key={i} size={14} fill="currentColor" />)}</div>
            <span className={styles.ratingText}><strong>4.9</strong> · 2,400+ reviews</span>
            <span className={styles.divider} />
            <span className={styles.metaItem}><AlarmClock size={13} /> Same-day available</span>
            <span className={styles.divider} />
            <span className={styles.metaItem}><MapPin size={13} /> Greater NYC</span>
          </div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrowLabel}>What We Fix</span>
            <h2 className={styles.sectionTitle}>Our Services</h2>
            <p className={styles.sectionSub}>Expert tradespeople for every home need. Fixed-rate estimates before any work begins.</p>
          </div>
          <div className={styles.svcGrid}>
            {SERVICES.map((s, i) => (
              <motion.div key={s.title} className={styles.svcCard} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div className={styles.svcIcon}>{s.icon}</div>
                <h3 className={styles.svcTitle}>{s.title}</h3>
                <p className={styles.svcDesc}>{s.desc}</p>
                <div className={styles.svcFooter}>
                  <span className={styles.svcPrice}>{s.price}</span>
                  <button className={styles.svcBook} onClick={() => scrollTo("book")}>Book <ChevronRight size={13} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section id="dashboard" className={styles.dashSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrowLabel}>Contractor Portal</span>
            <h2 className={styles.sectionTitle}>Job & Invoice Dashboard</h2>
            <p className={styles.sectionSub}>Real-time job tracking, status updates, and instant invoice management.</p>
          </div>
          <div className={styles.dashStats}>
            {[{ icon: <Wrench size={18}/>, label:"Active Jobs", v:"6" }, { icon: <CheckCircle size={18}/>, label:"Completed", v:"138" }, { icon: <DollarSign size={18}/>, label:"Revenue MTD", v:"$18.4K" }, { icon: <Star size={18}/>, label:"Avg Rating", v:"4.9" }].map(s=> (
              <div key={s.label} className={styles.dashStat}><div className={styles.dashStatIcon}>{s.icon}</div><strong>{s.v}</strong><span>{s.label}</span></div>
            ))}
          </div>
          <div className={styles.dashPanel}>
            <div className={styles.dashTabs}>
              <button className={`${styles.dashTab} ${dashTab==="jobs" ? styles.dashTabActive : ""}`} onClick={() => setDashTab("jobs")}><FileText size={15} /> Job Tracker</button>
              <button className={`${styles.dashTab} ${dashTab==="invoices" ? styles.dashTabActive : ""}`} onClick={() => setDashTab("invoices")}><DollarSign size={15} /> Invoices</button>
              <button className={styles.addBtn}><Plus size={15} /> New Job</button>
            </div>
            <AnimatePresence mode="wait">
              {dashTab === "jobs" ? (
                <motion.div key="jobs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={styles.jobTblHeader}><span>Job ID</span><span>Client</span><span>Service</span><span>Tech</span><span>Date</span><span>Status</span><span>Progress</span></div>
                  {JOBS.map((j, i) => (
                    <motion.div key={j.id} className={styles.jobRow} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <span className={styles.jobId}>{j.id}</span>
                      <span className={styles.jobClient}>{j.client}</span>
                      <span className={styles.jobSvc}>{j.service}</span>
                      <span className={styles.jobTech}>{j.tech}</span>
                      <span className={styles.jobDate}><Clock size={12} /> {j.date}</span>
                      <span className={`${styles.jobStatus} ${styles["js_" + j.status.replace(" ", "")]}`}>{j.status}</span>
                      <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${j.progress}%` }} /></div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div key="invoices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className={styles.invTblHeader}><span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span><span>Action</span></div>
                  {INVOICES.map((inv, i) => (
                    <motion.div key={inv.id} className={styles.invRow} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                      <span className={styles.jobId}>{inv.id}</span>
                      <span>{inv.client}</span>
                      <span className={styles.invAmount}>{inv.amount}</span>
                      <span className={`${styles.invStatus} ${styles["inv_" + inv.status]}`}>{inv.status}</span>
                      <button className={styles.invBtn}>{inv.status === "Pending" || inv.status === "Overdue" ? "Send Reminder" : "View"}</button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="book" className={styles.bookSection}>
        <div className={styles.container}>
          <div className={styles.bookGrid}>
            <div className={styles.bookInfo}>
              <span className={styles.eyebrowLabel}>Easy Scheduling</span>
              <h2 className={styles.sectionTitle}>Book a <em>Job</em></h2>
              <p className={styles.bookDesc}>Get a confirmed appointment in under 2 minutes. Transparent pricing, no surprises.</p>
              <ul className={styles.perks}>
                {["Free upfront estimate", "Background-checked pros", "On-time guarantee", "Satisfaction warranty"].map(p => (
                  <li key={p} className={styles.perk}><CheckCircle size={15} className={styles.perkIcon} /> {p}</li>
                ))}
              </ul>
              <div className={styles.contactLinks}>
                <a href="tel:+12125550177" className={styles.contactLink}><Phone size={14} /> +1 (212) 555-0177</a>
                <a href="mailto:jobs@swiftfix.io" className={styles.contactLink}><Mail size={14} /> jobs@swiftfix.io</a>
              </div>
            </div>
            <div className={styles.formCard}>
              {booked ? (
                <div className={styles.bookSuccess}>
                  <CheckCircle size={40} className={styles.successIcon} />
                  <h3>Job Scheduled!</h3>
                  <p>Your contractor will call 30 minutes before arrival. You'll receive a confirmation SMS shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className={styles.bookForm}>
                  <h3 className={styles.formTitle}>Book Your Service</h3>
                  <div className={styles.formRow}>
                    <div className={styles.fg}><label>Full Name</label><input type="text" required placeholder="Maria Santos" /></div>
                    <div className={styles.fg}><label>Phone</label><input type="tel" required placeholder="+1 (212) 555-…" /></div>
                  </div>
                  <div className={styles.fg}><label>Service Type</label><select required><option value="">Choose a service…</option>{SERVICES.map(s=><option key={s.title}>{s.title}</option>)}</select></div>
                  <div className={styles.fg}><label>Address</label><input type="text" required placeholder="123 Main St, New York, NY" /></div>
                  <div className={styles.fg}><label>Preferred Date</label><input type="date" required /></div>
                  <div className={styles.fg}><label>Time Slot</label>
                    <div className={styles.timeGrid}>
                      {SLOTS.map(t=><button type="button" key={t} className={`${styles.timeSlot} ${selectedTime===t?styles.timeActive:""}`} onClick={()=>setSelectedTime(t)}>{t}</button>)}
                    </div>
                  </div>
                  <button type="submit" className={styles.submitBtn}><Wrench size={16} /> Schedule Job</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}><Wrench size={16}/> Swift<em>Fix</em></div>
            <p className={styles.footerNote}>Home Services MVP Demo · Built by LOrdEnRYQuE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
