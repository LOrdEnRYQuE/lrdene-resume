"use client";
import React, { useState } from "react";
import styles from "./lawyer.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Scale, Menu as MenuIcon, X, Shield, Briefcase, FileText, Users, CheckCircle, ChevronRight, Phone, Mail, Clock, Star, Lock, FolderOpen, MessageSquare, Calendar } from "lucide-react";

const PRACTICE_AREAS = [
  { icon: <Briefcase size={22} />, title: "Corporate Law", desc: "Business formation, M&A transactions, shareholder agreements, and commercial contracts for enterprises of all sizes.", tag: "Most Popular" },
  { icon: <Shield size={22} />, title: "Criminal Defense", desc: "Aggressive representation for federal and state criminal charges. We protect your rights at every stage of the process.", tag: null },
  { icon: <FileText size={22} />, title: "Estate Planning", desc: "Wills, trusts, probate administration, and asset protection strategies to secure your family's future.", tag: null },
  { icon: <Users size={22} />, title: "Family Law", desc: "Compassionate guidance through divorce, custody disputes, adoption, and domestic partnerships.", tag: null },
  { icon: <Scale size={22} />, title: "Litigation", desc: "Tenacious courtroom advocacy. We prepare every case as if it will go to trial — and win.", tag: "Top Rated" },
  { icon: <Lock size={22} />, title: "Intellectual Property", desc: "Patent filings, trademark registrations, copyright enforcement, and trade secret protection.", tag: null },
];

const TEAM = [
  { name: "Catherine Harlow", title: "Managing Partner", exp: "22 yrs", rating: 4.9, cases: "1,200+" },
  { name: "David Reyes", title: "Senior Litigator", exp: "15 yrs", rating: 4.8, cases: "890+" },
  { name: "Nadia Shen", title: "Corporate Counsel", exp: "11 yrs", rating: 4.9, cases: "640+" },
];

const PORTAL_CASES = [
  { id: "C-2401", client: "Harrington Corp.", type: "Corporate", status: "Active", next: "Mar 28" },
  { id: "C-2398", client: "Laurent Family", type: "Estate", status: "Review", next: "Mar 30" },
  { id: "C-2390", client: "T. Morrison", type: "Litigation", status: "Discovery", next: "Apr 2" },
  { id: "C-2385", client: "Chen Industries", type: "IP", status: "Filed", next: "Apr 8" },
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

export default function LawyerMVP() {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeView, setActiveView] = useState<"cases" | "chat" | "docs">("cases");
  const [selectedTime, setSelectedTime] = useState("");
  const [booked, setBooked] = useState(false);

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileNav(false); };

  function handleBook(e: React.FormEvent) {
    e.preventDefault();
    setBooked(true);
  }

  return (
    <div className={styles.app}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}><Scale size={18} /><span>Harlow<em>&amp; Associates</em></span></div>
          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {["Practice", "Team", "Portal", "Contact"].map(l => (
              <li key={l}><button className={styles.navLink} onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
            ))}
            <li><button className={styles.ctaBtn} onClick={() => scrollTo("contact")}>Free Consultation</button></li>
          </ul>
          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/assets/lawyer-hero.jpg" alt="Law firm" fill className={styles.heroBgImg} priority />
          <div className={styles.heroOverlay} />
        </div>
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <div className={styles.trustBadge}><Shield size={12} fill="currentColor" /> Trusted since 1998 · NYC Bar Certified</div>
          <h1 className={styles.heroTitle}>Justice<br />Begins with<br /><em>Preparation.</em></h1>
          <p className={styles.heroSubtitle}>Harlow & Associates delivers rigorous legal strategy with a 94% success rate across corporate, civil, and criminal matters.</p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => scrollTo("contact")}><Calendar size={17} /> Schedule Consultation</button>
            <button className={styles.ghostCta} onClick={() => scrollTo("portal")}><Lock size={16} /> Client Portal</button>
          </div>
          <div className={styles.heroStats}>
            {[["94%", "Case Success Rate"], ["25+", "Years Experience"], ["3,000+", "Cases Won"]].map(([v, l]) => (
              <div key={l} className={styles.heroStat}><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PRACTICE AREAS */}
      <section id="practice" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Our Expertise</span>
            <h2 className={styles.sectionTitle}>Practice Areas</h2>
            <p className={styles.sectionSub}>Comprehensive legal services delivered with precision and urgency.</p>
          </div>
          <div className={styles.practiceGrid}>
            {PRACTICE_AREAS.map((p, i) => (
              <motion.div key={p.title} className={styles.practiceCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <div className={styles.practiceIcon}>{p.icon}</div>
                {p.tag && <span className={styles.practiceTag}>{p.tag}</span>}
                <h3 className={styles.practiceTitle}>{p.title}</h3>
                <p className={styles.practiceDesc}>{p.desc}</p>
                <button className={styles.learnMore}>Learn more <ChevronRight size={14} /></button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Our Attorneys</span>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
            <p className={styles.sectionSub}>Decades of combined experience. A reputation built on results.</p>
          </div>
          <div className={styles.teamGrid}>
            {TEAM.map((m, i) => (
              <motion.div key={m.name} className={styles.teamCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className={styles.teamAvatar}>{m.name.split(" ").map(n => n[0]).join("")}</div>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{m.name}</h3>
                  <p className={styles.teamTitle}>{m.title}</p>
                  <div className={styles.teamStats}>
                    <span>{m.exp} exp</span>
                    <span>·</span>
                    <span>{m.cases} cases</span>
                    <span>·</span>
                    <span className={styles.teamRating}><Star size={12} fill="currentColor" /> {m.rating}</span>
                  </div>
                </div>
                <button className={styles.bookAttorney}>Book Consultation</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT PORTAL */}
      <section id="portal" className={styles.portalSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Secure Access</span>
            <h2 className={styles.sectionTitle}>Client Portal</h2>
            <p className={styles.sectionSub}>Manage your cases, communicate securely, and access documents 24/7.</p>
          </div>
          <div className={styles.portalPanel}>
            <div className={styles.portalSidebar}>
              <div className={styles.portalUser}><div className={styles.portalAvatar}>JD</div><div><p className={styles.portalUserName}>John Davidson</p><p className={styles.portalUserRole}>Client ID #4821</p></div></div>
              <nav className={styles.portalNav}>
                {[
                  { id: "cases", icon: <FolderOpen size={16} />, label: "My Cases" },
                  { id: "chat", icon: <MessageSquare size={16} />, label: "Secure Chat" },
                  { id: "docs", icon: <FileText size={16} />, label: "Documents" },
                ].map(item => (
                  <button key={item.id} className={`${styles.portalNavItem} ${activeView === item.id ? styles.portalNavActive : ""}`} onClick={() => setActiveView(item.id as typeof activeView)}>
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className={styles.portalMain}>
              <AnimatePresence mode="wait">
                {activeView === "cases" && (
                  <motion.div key="cases" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className={styles.portalViewTitle}>Active Cases</h3>
                    <div className={styles.caseTable}>
                      <div className={styles.caseTblHeader}><span>Case ID</span><span>Client</span><span>Type</span><span>Status</span><span>Next Date</span></div>
                      {PORTAL_CASES.map((c, i) => (
                        <motion.div key={c.id} className={styles.caseRow} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                          <span className={styles.caseId}>{c.id}</span>
                          <span>{c.client}</span>
                          <span className={styles.caseType}>{c.type}</span>
                          <span className={`${styles.caseStatus} ${styles["cs" + c.status]}`}>{c.status}</span>
                          <span className={styles.caseDate}><Clock size={12} /> {c.next}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeView === "chat" && (
                  <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.chatView}>
                    <h3 className={styles.portalViewTitle}>Secure Message Thread</h3>
                    <div className={styles.chatMessages}>
                      <div className={`${styles.chatMsg} ${styles.msgIn}`}><p>Good morning, Mr. Davidson. The deposition for the Harrington case has been rescheduled to March 28th at 9 AM.</p><span>Catherine Harlow · 8:42 AM</span></div>
                      <div className={`${styles.chatMsg} ${styles.msgOut}`}><p>Understood. Should I prepare any additional documentation before then?</p><span>You · 9:05 AM</span></div>
                      <div className={`${styles.chatMsg} ${styles.msgIn}`}><p>Yes — please send over the Q4 financial statements and the board minutes from December. All communications are end-to-end encrypted.</p><span>Catherine Harlow · 9:18 AM</span></div>
                    </div>
                    <div className={styles.chatInput}><input type="text" placeholder="Type a secure message…" /><button><ChevronRight size={18} /></button></div>
                  </motion.div>
                )}
                {activeView === "docs" && (
                  <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h3 className={styles.portalViewTitle}>Documents</h3>
                    <div className={styles.docList}>
                      {[["Harrington_LOI.pdf", "Signed", "Mar 18"], ["NDA_Corp.pdf", "Pending Review", "Mar 20"], ["Board_Minutes_Dec.pdf", "Draft", "Mar 21"], ["IP_Filing_2024.pdf", "Filed", "Mar 10"]].map(([name, status, date]) => (
                        <div key={name} className={styles.docRow}>
                          <FileText size={16} className={styles.docIcon} />
                          <span className={styles.docName}>{name}</span>
                          <span className={`${styles.docStatus} ${status === "Filed" || status === "Signed" ? styles.docStatusOk : ""}`}>{status}</span>
                          <span className={styles.docDate}>{date}</span>
                          <button className={styles.docDl}>Download</button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION BOOKING */}
      <section id="contact" className={styles.contactSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <span className={styles.eyebrow}>Free Consultation</span>
              <h2 className={styles.sectionTitle}>Start Your Case<br /><em>Today.</em></h2>
              <p className={styles.contactDesc}>Our attorneys will review your situation confidentially and provide honest guidance — no obligation, no cost.</p>
              <ul className={styles.perks}>
                {["Strictly confidential", "No obligation", "Available same-day", "NYC & federal courts"].map(p => (
                  <li key={p} className={styles.perk}><CheckCircle size={16} className={styles.perkIcon} /> {p}</li>
                ))}
              </ul>
              <div className={styles.contactLinks}>
                <a href="tel:+12125550199" className={styles.contactLink}><Phone size={15} /> +1 (212) 555-0199</a>
                <a href="mailto:consult@harlow.law" className={styles.contactLink}><Mail size={15} /> consult@harlow.law</a>
              </div>
            </div>
            <div className={styles.formCard}>
              {booked ? (
                <div className={styles.successState}>
                  <CheckCircle size={42} className={styles.successIcon} />
                  <h3>Consultation Confirmed</h3>
                  <p>We'll call you within 2 business hours to confirm your slot. All information is protected by attorney-client privilege.</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className={styles.bookForm}>
                  <h3 className={styles.formTitle}>Book a Free Consultation</h3>
                  <div className={styles.formRow}><div className={styles.fg}><label>Full Name</label><input type="text" required placeholder="Catherine Laurent" /></div><div className={styles.fg}><label>Phone</label><input type="tel" required placeholder="+1 (212) 555-…" /></div></div>
                  <div className={styles.fg}><label>Email</label><input type="email" required placeholder="you@email.com" /></div>
                  <div className={styles.fg}><label>Practice Area</label><select required><option value="">Select area…</option>{PRACTICE_AREAS.map(p => <option key={p.title}>{p.title}</option>)}</select></div>
                  <div className={styles.fg}><label>Preferred Date</label><input type="date" required /></div>
                  <div className={styles.fg}><label>Time Slot</label>
                    <div className={styles.timeGrid}>
                      {TIME_SLOTS.map(t => <button type="button" key={t} className={`${styles.timeSlot} ${selectedTime === t ? styles.timeActive : ""}`} onClick={() => setSelectedTime(t)}>{t}</button>)}
                    </div>
                  </div>
                  <button type="submit" className={styles.submitBtn}><Calendar size={17} /> Book Free Consultation</button>
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
            <div className={styles.footerLogo}><Scale size={17} /> Harlow<em> &amp; Associates</em></div>
            <p className={styles.footerNote}>Lawyer & Consultant MVP Demo · Built by LOrdEnRYQuE</p>
            <p className={styles.footerDisclaim}>Attorney advertising. Prior results do not guarantee similar outcomes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
