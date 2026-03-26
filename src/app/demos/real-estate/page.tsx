"use client";
import React, { useState } from "react";
import styles from "./real-estate.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Building2, Search, MapPin, BedDouble, Bath, Maximize2, Heart, ArrowRight, Star, ChevronRight, X, BarChart3, Home, Users, DollarSign, Menu as MenuIcon, Sparkles, TrendingUp, Eye } from "lucide-react";

const LISTINGS = [
  { id: 1, title: "Sky Penthouse", location: "Manhattan, NY", price: "4,200,000", beds: 4, baths: 3, sqft: "3,800", type: "Penthouse", img: "#0d1b2a", tag: "Featured" },
  { id: 2, title: "Hudson Loft", location: "Brooklyn, NY", price: "1,850,000", beds: 2, baths: 2, sqft: "1,940", type: "Loft", img: "#0a1628", tag: "New" },
  { id: 3, title: "Park Avenue Suite", location: "Upper East Side", price: "3,100,000", beds: 3, baths: 2, sqft: "2,600", type: "Apartment", img: "#0c1a2e", tag: null },
  { id: 4, title: "Tribeca Townhouse", location: "Tribeca, NY", price: "6,500,000", beds: 5, baths: 4, sqft: "5,200", type: "Townhouse", img: "#091520", tag: "Exclusive" },
  { id: 5, title: "Chelsea Modern", location: "Chelsea, NY", price: "2,400,000", beds: 3, baths: 2, sqft: "2,100", type: "Apartment", img: "#0b1825", tag: null },
  { id: 6, title: "NOHO Loft", location: "NoHo, NY", price: "2,950,000", beds: 2, baths: 2, sqft: "2,400", type: "Loft", img: "#0d1e30", tag: "Hot" },
];

const AGENT_STATS = [
  { label: "Active Listings", value: "24", icon: <Home size={20} />, change: "+3 this week" },
  { label: "Total Inquiries", value: "142", icon: <Users size={20} />, change: "+18 this week" },
  { label: "Under Contract", value: "7", icon: <TrendingUp size={20} />, change: "↑ 40% close rate" },
  { label: "Revenue YTD", value: "$2.1M", icon: <DollarSign size={20} />, change: "+28% vs last yr" },
];

const RECENT_INQUIRIES = [
  { name: "Alexandra Chen", property: "Sky Penthouse", time: "2h ago", status: "New" },
  { name: "Marcus Williams", property: "Tribeca Townhouse", time: "4h ago", status: "Viewing" },
  { name: "Sophie Laurent", property: "Hudson Loft", time: "1d ago", status: "Offer" },
  { name: "James Harrington", property: "Park Avenue Suite", time: "1d ago", status: "New" },
];

export default function RealEstateMVP() {
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "sold">("buy");
  const [mobileNav, setMobileNav] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("listings");
  const [search, setSearch] = useState("");

  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileNav(false); };
  const toggleSave = (id: number) => setSaved(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <div className={styles.app}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}><Building2 size={19} /><span>Prime<em>Estate</em></span></div>
          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {["Listings", "Dashboard", "About"].map(l => (
              <li key={l}><button className={styles.navLink} onClick={() => scrollTo(l.toLowerCase())}>{l}</button></li>
            ))}
            <li><button className={styles.ctaBtn} onClick={() => scrollTo("listings")}>Find Property</button></li>
          </ul>
          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src="/assets/realestate-hero.jpg" alt="Luxury property" fill className={styles.heroBgImg} priority />
          <div className={styles.heroOverlay} />
        </div>
        <motion.div className={styles.heroContent} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className={styles.eyebrow}><Sparkles size={11} fill="currentColor" /> New York's Premier Brokerage</span>
          <h1 className={styles.heroTitle}>Find Your<br /><em>Perfect</em><br />Address.</h1>
          <p className={styles.heroSubtitle}>Exclusive listings across Manhattan, Brooklyn, and beyond. Expert agents, white-glove service.</p>

          {/* Search bar */}
          <div className={styles.searchCard}>
            <div className={styles.searchTabs}>
              {(["buy", "rent", "sold"] as const).map(t => (
                <button key={t} className={`${styles.searchTab} ${activeTab === t ? styles.searchTabActive : ""}`} onClick={() => setActiveTab(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.searchRow}>
              <div className={styles.searchInput}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Search by neighbourhood, zip, or address..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className={styles.searchSelect}><option>Any type</option><option>Apartment</option><option>Penthouse</option><option>Townhouse</option><option>Loft</option></select>
              <select className={styles.searchSelect}><option>Any price</option><option>Under $1M</option><option>$1M–$3M</option><option>$3M–$6M</option><option>$6M+</option></select>
              <button className={styles.searchBtn}>Search <ArrowRight size={16} /></button>
            </div>
          </div>

          <div className={styles.heroStats}>
            {[["2,400+", "Active Listings"], ["98%", "Client Satisfaction"], ["$1.2B+", "Sales Volume"]].map(([v, l]) => (
              <div key={l} className={styles.heroStat}><strong>{v}</strong><span>{l}</span></div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* LISTINGS */}
      <section id="listings" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrowLabel}>Premium Selection</span>
            <h2 className={styles.sectionTitle}>Featured Listings</h2>
            <p className={styles.sectionSub}>Hand-picked exclusive properties. Updated daily.</p>
          </div>
          <div className={styles.listingsGrid}>
            {LISTINGS.map((l, i) => (
              <motion.div key={l.id} className={styles.listingCard} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <div className={styles.cardImg} style={{ background: l.img }}>
                  {l.tag && <span className={styles.cardTag}>{l.tag}</span>}
                  <button className={`${styles.saveBtn} ${saved.includes(l.id) ? styles.saved : ""}`} onClick={() => toggleSave(l.id)}>
                    <Heart size={16} fill={saved.includes(l.id) ? "currentColor" : "none"} />
                  </button>
                  <div className={styles.cardImgOverlay}>
                    <button className={styles.viewBtn}><Eye size={14} /> View Details</button>
                  </div>
                  {/* Property type watermark */}
                  <div className={styles.propType}><Building2 size={12} /> {l.type}</div>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardLocation}><MapPin size={12} /> {l.location}</div>
                  <h3 className={styles.cardTitle}>{l.title}</h3>
                  <div className={styles.cardFeatures}>
                    <span><BedDouble size={13} /> {l.beds} Bed</span>
                    <span><Bath size={13} /> {l.baths} Bath</span>
                    <span><Maximize2 size={13} /> {l.sqft} ft²</span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>${l.price}</span>
                    <button className={styles.inquireBtn}>Inquire <ChevronRight size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENT DASHBOARD */}
      <section id="dashboard" className={styles.dashSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrowLabel}>Staff Portal</span>
            <h2 className={styles.sectionTitle}>Agent Dashboard</h2>
            <p className={styles.sectionSub}>Real-time performance metrics and lead management for your sales team.</p>
          </div>

          <div className={styles.dashPanel}>
            {/* Sidebar */}
            <aside className={styles.dashSidebar}>
              <div className={styles.agentCard}>
                <div className={styles.agentAvatar}>JR</div>
                <div><p className={styles.agentName}>James Richardson</p><p className={styles.agentRole}>Senior Agent · NYC</p></div>
              </div>
              <nav className={styles.dashNav}>
                {[
                  { id: "listings", icon: <Home size={17} />, label: "My Listings" },
                  { id: "inquiries", icon: <Users size={17} />, label: "Inquiries" },
                  { id: "analytics", icon: <BarChart3 size={17} />, label: "Analytics" },
                ].map(item => (
                  <button key={item.id} className={`${styles.dashNavItem} ${activeSection === item.id ? styles.dashNavActive : ""}`} onClick={() => setActiveSection(item.id)}>
                    {item.icon}<span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main */}
            <div className={styles.dashMain}>
              <div className={styles.statsGrid}>
                {AGENT_STATS.map(s => (
                  <div key={s.label} className={styles.statCard}>
                    <div className={styles.statIcon}>{s.icon}</div>
                    <div>
                      <p className={styles.statValue}>{s.value}</p>
                      <p className={styles.statLabel}>{s.label}</p>
                      <p className={styles.statChange}>{s.change}</p>
                    </div>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeSection === "inquiries" || activeSection === "listings" ? (
                  <motion.div key="tbl" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={styles.dashView}>
                    <h3 className={styles.dashViewTitle}>Recent Inquiries</h3>
                    <div className={styles.inquiryTable}>
                      <div className={styles.tblHeader}>
                        <span>Client</span><span>Property</span><span>Time</span><span>Status</span>
                      </div>
                      {RECENT_INQUIRIES.map((inq, i) => (
                        <motion.div key={inq.name} className={styles.tblRow} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                          <span className={styles.clientName}>{inq.name}</span>
                          <span className={styles.propName}>{inq.property}</span>
                          <span className={styles.timeCell}>{inq.time}</span>
                          <span className={`${styles.statusBadge} ${styles["status" + inq.status]}`}>{inq.status}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="analytics" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className={styles.dashView}>
                    <h3 className={styles.dashViewTitle}>Monthly Performance</h3>
                    <div className={styles.barChart}>
                      {[{ d: "Jan", p: 60 }, { d: "Feb", p: 45 }, { d: "Mar", p: 80 }, { d: "Apr", p: 70 }, { d: "May", p: 90 }, { d: "Jun", p: 100 }, { d: "Jul", p: 85 }].map(b => (
                        <div key={b.d} className={styles.barCol}>
                          <motion.div className={styles.bar} initial={{ height: 0 }} animate={{ height: `${b.p}%` }} transition={{ delay: 0.2, duration: 0.5 }} />
                          <span className={styles.barLbl}>{b.d}</span>
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

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}><Building2 size={18} /><span>Prime<em>Estate</em></span></div>
            <p className={styles.footerNote}>Real Estate MVP Demo · Built by LOrdEnRYQuE</p>
            <div className={styles.footerLinks}>
              {["Listings", "Dashboard", "Contact"].map(l => <button key={l} onClick={() => scrollTo(l.toLowerCase())}>{l}</button>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
