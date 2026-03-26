"use client";

import React, { useState } from "react";
import styles from "./restaurant.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  UtensilsCrossed,
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  X,
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  List,
  Settings,
  Menu as MenuIcon,
} from "lucide-react";

/* ─────────────────────────── DATA ─────────────────────────── */
const NAV = ["Menu", "Reservations", "About", "Admin"];

const MENU = [
  {
    category: "Starters",
    items: [
      { name: "Burrata & Heirloom Tomato", desc: "Calabrian chili oil, basil pearls, aged balsamic", price: "18" },
      { name: "Wagyu Beef Carpaccio", desc: "Truffled aioli, capers, parmigiano, microgreens", price: "24" },
      { name: "Seared Scallops", desc: "Cauliflower purée, crispy pancetta, lemon beurre blanc", price: "22" },
    ],
  },
  {
    category: "Mains",
    items: [
      { name: "28-Day Dry-Aged Ribeye", desc: "Bone marrow butter, crispy shallots, truffle jus", price: "68" },
      { name: "Pan-Roasted Halibut", desc: "Saffron risotto, asparagus, sauce vierge", price: "52" },
      { name: "Duck Confit", desc: "Cherry reduction, pomme purée, haricot verts", price: "46" },
      { name: "Mushroom Wellington", desc: "Duxelles, spinach, truffle cream (V)", price: "38" },
    ],
  },
  {
    category: "Desserts",
    items: [
      { name: "Chocolate Fondant", desc: "Tahitian vanilla ice cream, gold leaf", price: "16" },
      { name: "Crème Brûlée", desc: "Classic Madagascar vanilla, caramelised sugar", price: "14" },
      { name: "Tarte Tatin", desc: "Caramelised apple, clotted cream", price: "15" },
    ],
  },
];

const TIMES = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

const TODAY_BOOKINGS = [
  { name: "Laurent, Thomas", guests: 4, time: "19:00", table: "A3", status: "Confirmed" },
  { name: "Rossi, Elena", guests: 2, time: "19:30", table: "B1", status: "Confirmed" },
  { name: "Chen, Wei", guests: 6, time: "20:00", table: "C2", status: "Pending" },
  { name: "Müller, Hans", guests: 3, time: "20:30", table: "A5", status: "Confirmed" },
];

/* ─────────────────────────── COMPONENT ─────────────────────── */
export default function RestaurantMVP() {
  const [activeSection, setActiveSection] = useState("menu");
  const [activeCategory, setActiveCategory] = useState(0);
  const [adminSection, setAdminSection] = useState("bookings");
  const [mobileNav, setMobileNav] = useState(false);

  // Booking form state
  const [booking, setBooking] = useState({ name: "", email: "", guests: "2", date: "", time: "" });
  const [booked, setBooked] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileNav(false);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className={styles.app}>

      {/* ── NAVIGATION ─────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <UtensilsCrossed size={20} />
            <span>La<em>Maison</em></span>
          </div>

          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {NAV.map((n) => (
              <li key={n}>
                <button
                  className={`${styles.navLink} ${activeSection === n.toLowerCase() ? styles.active : ""}`}
                  onClick={() => scrollTo(n.toLowerCase())}
                >
                  {n}
                </button>
              </li>
            ))}
            <li>
              <button className={styles.reserveBtn} onClick={() => scrollTo("reservations")}>
                Reserve a Table
              </button>
            </li>
          </ul>

          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/assets/restaurant-hero.jpg"
            alt="La Maison Interior"
            fill
            className={styles.heroBgImg}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>

        <motion.div
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.heroEyebrow}>
            <Star size={12} fill="currentColor" /> Fine Dining Experience
          </span>
          <h1 className={styles.heroTitle}>
            Where Every<br />
            <em>Bite Becomes</em><br />
            A Memory.
          </h1>
          <p className={styles.heroSubtitle}>
            An intimate fine-dining restaurant serving modern European cuisine with seasonal, locally sourced ingredients.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => scrollTo("reservations")}>
              Book a Table <ArrowRight size={18} />
            </button>
            <button className={styles.ghostCta} onClick={() => scrollTo("menu")}>
              Explore Menu
            </button>
          </div>

          {/* Quick info strip */}
          <div className={styles.heroStrip}>
            <div className={styles.stripItem}>
              <MapPin size={15} />
              <span>12 Rue de la Paix, Paris</span>
            </div>
            <div className={styles.stripDivider} />
            <div className={styles.stripItem}>
              <Clock size={15} />
              <span>Tue–Sun: 18:00 – 22:30</span>
            </div>
            <div className={styles.stripDivider} />
            <div className={styles.stripItem}>
              <Phone size={15} />
              <span>+33 1 42 00 00 00</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MENU ───────────────────────────────────────────── */}
      <section id="menu" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>À La Carte</span>
            <h2 className={styles.sectionTitle}>Our Menu</h2>
            <p className={styles.sectionSubtitle}>
              Seasonal ingredients, executed with precision. Each dish tells a story.
            </p>
          </div>

          {/* Category tabs */}
          <div className={styles.categoryTabs}>
            {MENU.map((cat, i) => (
              <button
                key={cat.category}
                className={`${styles.catTab} ${activeCategory === i ? styles.catActive : ""}`}
                onClick={() => setActiveCategory(i)}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={styles.menuGrid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              {MENU[activeCategory].items.map((item) => (
                <div key={item.name} className={styles.menuCard}>
                  <div className={styles.menuCardTop}>
                    <h3 className={styles.menuItemName}>{item.name}</h3>
                    <span className={styles.menuPrice}>£{item.price}</span>
                  </div>
                  <p className={styles.menuItemDesc}>{item.desc}</p>
                  <div className={styles.menuCardLine} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOOKING ────────────────────────────────────────── */}
      <section id="reservations" className={styles.bookingSection}>
        <div className={styles.container}>
          <div className={styles.bookingGrid}>
            {/* Left: info */}
            <div className={styles.bookingInfo}>
              <span className={styles.eyebrow}>Reserve a Table</span>
              <h2 className={styles.sectionTitle}>An Evening<br />To Remember</h2>
              <p className={styles.bookingDesc}>
                Our intimate dining room seats only 40 guests per sitting, ensuring unhurried, personalised service for every table.
              </p>

              <ul className={styles.bookingPerks}>
                {[
                  "Complimentary amuse-bouche on arrival",
                  "Sommelier pairing available",
                  "Private dining room for groups 8+",
                  "Dietary requirements catered for",
                ].map((p) => (
                  <li key={p} className={styles.perk}>
                    <CheckCircle2 size={16} className={styles.perkIcon} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className={styles.bookingFormWrap}>
              <AnimatePresence mode="wait">
                {!booked ? (
                  <motion.form
                    key="form"
                    className={styles.bookingForm}
                    onSubmit={handleBook}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <h3 className={styles.formTitle}>Make a Reservation</h3>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={booking.name}
                          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={booking.email}
                          onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label><Users size={14} /> Guests</label>
                        <select value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: e.target.value })}>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label><Calendar size={14} /> Date</label>
                        <input
                          type="date"
                          value={booking.date}
                          onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label><Clock size={14} /> Preferred Time</label>
                      <div className={styles.timeGrid}>
                        {TIMES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            className={`${styles.timeSlot} ${booking.time === t ? styles.timeActive : ""}`}
                            onClick={() => setBooking({ ...booking, time: t })}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      Confirm Reservation <ChevronRight size={18} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className={styles.bookingSuccess}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className={styles.successIcon}><CheckCircle2 size={56} /></div>
                    <h3>Reservation Confirmed!</h3>
                    <p>
                      Thank you, <strong>{booking.name}</strong>. Your table for {booking.guests} on{" "}
                      <strong>{booking.date}</strong> at <strong>{booking.time}</strong> is confirmed.
                      A confirmation will be sent to {booking.email}.
                    </p>
                    <button className={styles.ghostCta} onClick={() => setBooked(false)}>
                      Make Another Reservation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADMIN PANEL ────────────────────────────────────── */}
      <section id="admin" className={styles.adminSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Staff Portal</span>
            <h2 className={styles.sectionTitle}>Admin Flow</h2>
            <p className={styles.sectionSubtitle}>A real-time hospitality management dashboard for your team.</p>
          </div>

          <div className={styles.adminPanel}>
            {/* Sidebar */}
            <aside className={styles.adminSidebar}>
              <div className={styles.adminLogo}>
                <UtensilsCrossed size={18} />
                <span>La Maison Admin</span>
              </div>
              <nav className={styles.adminNav}>
                {[
                  { id: "bookings", icon: <Calendar size={18} />, label: "Bookings" },
                  { id: "orders", icon: <ShoppingBag size={18} />, label: "Orders" },
                  { id: "analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
                  { id: "menu-mgr", icon: <List size={18} />, label: "Menu Manager" },
                  { id: "settings", icon: <Settings size={18} />, label: "Settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    className={`${styles.adminNavItem} ${adminSection === item.id ? styles.adminNavActive : ""}`}
                    onClick={() => setAdminSection(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main area */}
            <div className={styles.adminMain}>
              <AnimatePresence mode="wait">
                {adminSection === "bookings" && (
                  <motion.div
                    key="bookings"
                    className={styles.adminView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Stats row */}
                    <div className={styles.statsRow}>
                      {[
                        { label: "Tonight's Covers", value: "38", sub: "+12% vs last week" },
                        { label: "Tables Available", value: "4", sub: "of 12 tables" },
                        { label: "Revenue Forecast", value: "£2,840", sub: "avg per cover £74" },
                      ].map((s) => (
                        <div key={s.label} className={styles.statCard}>
                          <p className={styles.statLabel}>{s.label}</p>
                          <p className={styles.statValue}>{s.value}</p>
                          <p className={styles.statSub}>{s.sub}</p>
                        </div>
                      ))}
                    </div>

                    <h3 className={styles.adminViewTitle}>Today's Reservations</h3>
                    <div className={styles.bookingTable}>
                      <div className={styles.tableHeader}>
                        <span>Guest</span>
                        <span>Time</span>
                        <span>Table</span>
                        <span>Covers</span>
                        <span>Status</span>
                      </div>
                      {TODAY_BOOKINGS.map((b, i) => (
                        <motion.div
                          key={b.name}
                          className={styles.tableRow}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <span className={styles.guestName}>{b.name}</span>
                          <span>{b.time}</span>
                          <span className={styles.tableNum}>{b.table}</span>
                          <span><Users size={14} /> {b.guests}</span>
                          <span className={`${styles.statusBadge} ${b.status === "Confirmed" ? styles.confirmed : styles.pending}`}>
                            {b.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {adminSection === "analytics" && (
                  <motion.div
                    key="analytics"
                    className={styles.adminView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className={styles.adminViewTitle}>Revenue Overview</h3>
                    <div className={styles.statsRow}>
                      {[
                        { label: "This Month", value: "£28,400", sub: "+18% vs last month" },
                        { label: "Avg Cover Spend", value: "£74", sub: "target: £70" },
                        { label: "Repeat Guests", value: "64%", sub: "loyalty rate" },
                      ].map((s) => (
                        <div key={s.label} className={styles.statCard}>
                          <p className={styles.statLabel}>{s.label}</p>
                          <p className={styles.statValue}>{s.value}</p>
                          <p className={styles.statSub}>{s.sub}</p>
                        </div>
                      ))}
                    </div>
                    {/* Simple bar chart visualisation */}
                    <div className={styles.barChart}>
                      {[
                        { day: "Mon", pct: 40 },
                        { day: "Tue", pct: 70 },
                        { day: "Wed", pct: 55 },
                        { day: "Thu", pct: 80 },
                        { day: "Fri", pct: 100 },
                        { day: "Sat", pct: 95 },
                        { day: "Sun", pct: 75 },
                      ].map((d) => (
                        <div key={d.day} className={styles.barCol}>
                          <motion.div
                            className={styles.bar}
                            initial={{ height: 0 }}
                            animate={{ height: `${d.pct}%` }}
                            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                          />
                          <span className={styles.barLabel}>{d.day}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {adminSection === "menu-mgr" && (
                  <motion.div
                    key="menu-mgr"
                    className={styles.adminView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className={styles.adminViewTitle}>Menu Manager</h3>
                    {MENU.map((cat) => (
                      <div key={cat.category} className={styles.menuMgrSection}>
                        <h4 className={styles.menuMgrCat}>{cat.category}</h4>
                        {cat.items.map((item) => (
                          <div key={item.name} className={styles.menuMgrItem}>
                            <div>
                              <span className={styles.menuMgrName}>{item.name}</span>
                              <span className={styles.menuMgrDesc}>{item.desc}</span>
                            </div>
                            <div className={styles.menuMgrActions}>
                              <span className={styles.menuMgrPrice}>£{item.price}</span>
                              <button className={styles.editBtn}>Edit</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}

                {(adminSection === "orders" || adminSection === "settings") && (
                  <motion.div
                    key="placeholder"
                    className={styles.adminView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className={styles.comingSoon}>
                      <LayoutDashboard size={48} />
                      <h3>{adminSection === "orders" ? "Order Management" : "System Settings"}</h3>
                      <p>This module is available in the full production build.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <UtensilsCrossed size={20} />
              <span>La<em>Maison</em></span>
            </div>
            <p className={styles.footerNote}>Restaurant MVP Demo · Built by LOrdEnRYQuE</p>
            <div className={styles.footerLinks}>
              <button onClick={() => scrollTo("menu")}>Menu</button>
              <button onClick={() => scrollTo("reservations")}>Reservations</button>
              <button onClick={() => scrollTo("admin")}>Admin</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
