"use client";

import React, { useState } from "react";
import styles from "./salon.module.css";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Scissors,
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Calendar,
  User,
  CheckCircle2,
  ArrowRight,
  Instagram,
  Facebook,
  X,
  Menu as MenuIcon,
  Sparkles,
} from "lucide-react";

/* ─── DATA ──────────────────────────────────────────────────── */
const SERVICES = [
  {
    category: "Haircuts",
    items: [
      { name: "Classic Cut", desc: "Scissor & clipper precision cut with wash & style", price: "45", duration: "45min" },
      { name: "Fade & Taper", desc: "Modern skin fade with seamless blend", price: "50", duration: "50min" },
      { name: "Textured Crop", desc: "Contemporary textured cut with styling product", price: "55", duration: "55min" },
    ],
  },
  {
    category: "Beard",
    items: [
      { name: "Beard Trim & Shape", desc: "Precision sculpt with hot towel finish", price: "30", duration: "30min" },
      { name: "Royal Shave", desc: "Traditional straight razor with steam & oils", price: "45", duration: "45min" },
      { name: "Beard Restoration", desc: "Deep conditioning treatment + shaping", price: "60", duration: "60min" },
    ],
  },
  {
    category: "Premium",
    items: [
      { name: "The Full Experience", desc: "Cut + shave + scalp massage + hot towel", price: "95", duration: "90min" },
      { name: "Kerastase Treatment", desc: "Bond-strengthening scalp & hair ritual", price: "80", duration: "75min" },
      { name: "Colour & Cut", desc: "Professional colour with precision cut", price: "120", duration: "120min" },
    ],
  },
];

const TEAM = [
  {
    name: "Marco R.",
    role: "Master Barber",
    exp: "14 years",
    specialty: "Fades & Tapers",
    bio: "Classical training met with modern street style. Marco specializes in high-contrast skin fades."
  },
  {
    name: "Sophia L.",
    role: "Senior Stylist",
    exp: "9 years",
    specialty: "Colour & Texture",
    bio: "A visionary in tonal harmony. Sophia brings years of session styling experience to every client."
  },
  {
    name: "James K.",
    role: "Barber & Grooming",
    exp: "7 years",
    specialty: "Classic Shaves",
    bio: "The custodian of tradition. Experts in hot towel shaves and beard sculpting rituals."
  },
];

const TIMES = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","13:00","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30",
];

const NAV_LINKS = ["Services", "Book", "Team", "Gallery"];

/* ─── COMPONENT ─────────────────────────────────────────────── */
export default function SalonMVP() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [booking, setBooking] = useState({
    name: "", phone: "", service: "", stylist: "", date: "", time: "",
  });
  const [booked, setBooked] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileNav(false);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className={styles.app}>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <Scissors size={18} />
            <span>The<em>Guild</em></span>
          </div>

          <ul className={`${styles.navLinks} ${mobileNav ? styles.open : ""}`}>
            {NAV_LINKS.map((n) => (
              <li key={n}>
                <button className={styles.navLink} onClick={() => scrollTo(n.toLowerCase())}>
                  {n}
                </button>
              </li>
            ))}
            <li>
              <button className={styles.bookBtn} onClick={() => scrollTo("book")}>
                Book Now
              </button>
            </li>
          </ul>

          <button className={styles.hamburger} onClick={() => setMobileNav(!mobileNav)}>
            {mobileNav ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="hero" className={styles.hero}>
        <div className={styles.heroBg}>
          <Image
            src="/assets/salon-hero-new.png"
            alt="The Guild Barbershop"
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
            <Sparkles size={11} fill="currentColor" /> Premium Grooming Studio
          </span>
          <h1 className={styles.heroTitle}>
            The Art of<br />
            <em>Precision</em><br />
            Grooming.
          </h1>
          <p className={styles.heroSubtitle}>
            Award-winning barbers and stylists in the heart of the city. Where tradition meets modern craft.
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={() => scrollTo("book")}>
              Book Appointment <ArrowRight size={17} />
            </button>
            <button className={styles.ghostCta} onClick={() => scrollTo("services")}>
              View Services
            </button>
          </div>

          {/* Rating strip */}
          <div className={styles.ratingStrip}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <span className={styles.ratingText}><strong>4.9</strong> · 380+ reviews</span>
            <span className={styles.stripDivider} />
            <span className={styles.stripItem}><Clock size={13} /> Mon–Sat 9:00–19:00</span>
            <span className={styles.stripDivider} />
            <span className={styles.stripItem}><MapPin size={13} /> Mayfair, London</span>
          </div>
        </motion.div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section id="services" className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>What We Offer</span>
            <h2 className={styles.sectionTitle}>Our Services</h2>
            <p className={styles.sectionSubtitle}>
              Every visit is a ritual. Every cut, a statement. Priced transparently, delivered with mastery.
            </p>
          </div>

          {/* Category tabs */}
          <div className={styles.catTabs}>
            {SERVICES.map((cat, i) => (
              <button
                key={cat.category}
                className={`${styles.catTab} ${activeCategory === i ? styles.catActive : ""}`}
                onClick={() => setActiveCategory(i)}
              >
                {cat.category}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={styles.serviceGrid}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {SERVICES[activeCategory].items.map((item) => (
                <div key={item.name} className={styles.serviceCard}>
                  <div className={styles.serviceTop}>
                    <div>
                      <h3 className={styles.serviceName}>{item.name}</h3>
                      <span className={styles.serviceDuration}><Clock size={12} /> {item.duration}</span>
                    </div>
                    <span className={styles.servicePrice}>£{item.price}</span>
                  </div>
                  <p className={styles.serviceDesc}>{item.desc}</p>
                  <button
                    className={styles.serviceBookBtn}
                    onClick={() => {
                      setBooking((b) => ({ ...b, service: item.name }));
                      scrollTo("book");
                    }}
                  >
                    Book this <ChevronRight size={14} />
                  </button>
                  <div className={styles.serviceAccent} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOOKING ──────────────────────────────────────────── */}
      <section id="book" className={styles.bookingSection}>
        <div className={styles.container}>
          <div className={styles.bookingGrid}>

            {/* Left info */}
            <div className={styles.bookingInfo}>
              <span className={styles.eyebrow}>Online Booking</span>
              <h2 className={styles.sectionTitle}>Reserve<br />Your Seat</h2>
              <p className={styles.bookingDesc}>
                No waiting. Choose your service, pick your stylist, and lock in your slot — all in under 60 seconds.
              </p>
              <ul className={styles.perks}>
                {[
                  "Instant confirmation via SMS",
                  "Free cancellation up to 24h before",
                  "Reminder 2 hours before appointment",
                  "Loyalty points on every visit",
                ].map((p) => (
                  <li key={p} className={styles.perk}>
                    <CheckCircle2 size={15} className={styles.perkIcon} /> {p}
                  </li>
                ))}
              </ul>
              <div className={styles.contactBlock}>
                <a href="tel:+442012345678" className={styles.contactLink}>
                  <Phone size={15} /> +44 20 1234 5678
                </a>
                <a href="https://instagram.com" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  <Instagram size={15} /> @theguuildbarbers
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className={styles.formCard}>
              <AnimatePresence mode="wait">
                {!booked ? (
                  <motion.form
                    key="form"
                    className={styles.bookingForm}
                    onSubmit={handleBook}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                  >
                    <h3 className={styles.formTitle}>Book an Appointment</h3>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label><User size={12} /> Full Name</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={booking.name}
                          onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label><Phone size={12} /> Phone</label>
                        <input
                          type="tel"
                          placeholder="+44 ..."
                          value={booking.phone}
                          onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label><Scissors size={12} /> Service</label>
                        <select
                          value={booking.service}
                          onChange={(e) => setBooking({ ...booking, service: e.target.value })}
                          required
                        >
                          <option value="">Select service...</option>
                          {SERVICES.flatMap((cat) =>
                            cat.items.map((item) => (
                              <option key={item.name} value={item.name}>
                                {item.name} — £{item.price}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label><User size={12} /> Stylist</label>
                        <select
                          value={booking.stylist}
                          onChange={(e) => setBooking({ ...booking, stylist: e.target.value })}
                        >
                          <option value="">Any available</option>
                          {TEAM.map((m) => (
                            <option key={m.name} value={m.name}>{m.name} – {m.specialty}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label><Calendar size={12} /> Date</label>
                      <input
                        type="date"
                        value={booking.date}
                        onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label><Clock size={12} /> Time Slot</label>
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

                    <button type="submit" className={styles.submitBtn} disabled={!booking.time}>
                      Confirm Booking <ChevronRight size={17} />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className={styles.bookingSuccess}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className={styles.successIcon}><CheckCircle2 size={52} /></div>
                    <h3>You're All Set!</h3>
                    <p>
                      <strong>{booking.name}</strong>, your appointment for{" "}
                      <strong>{booking.service || "a service"}</strong>{" "}
                      {booking.stylist ? `with ${booking.stylist} ` : ""}
                      on <strong>{booking.date}</strong> at <strong>{booking.time}</strong> is confirmed.
                    </p>
                    <p className={styles.smsNote}>📱 SMS confirmation sent to {booking.phone}</p>
                    <button className={styles.ghostCta} onClick={() => { setBooked(false); setBooking({ name:"",phone:"",service:"",stylist:"",date:"",time:"" }); }}>
                      Book Another
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────── */}
      <section id="team" className={styles.section} style={{ background: "var(--s-darker)" }}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>The Experts</span>
            <h2 className={styles.sectionTitle}>Meet the Team</h2>
          </div>
          <div className={styles.teamGrid}>
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                className={styles.teamCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.teamAvatar}>
                  {member.name[0]}
                </div>
                <div className={styles.teamInfo}>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <span className={styles.teamRole}>{member.role}</span>
                  <p className={styles.teamBio}>{member.bio}</p>
                  <div className={styles.teamMeta}>
                    <span>{member.exp} exp.</span>
                    <span className={styles.teamSpecialty}>{member.specialty}</span>
                  </div>
                </div>
                <button
                  className={styles.teamBookBtn}
                  onClick={() => {
                    setBooking((b) => ({ ...b, stylist: member.name }));
                    scrollTo("book");
                  }}
                >
                  Book with {member.name.split(" ")[0]}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY (placeholder) ────────────────────────────── */}
      <section id="gallery" className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>Our Work</span>
            <h2 className={styles.sectionTitle}>The Gallery</h2>
          </div>
          <div className={styles.galleryGrid}>
            {[
              { label: "Fade & Taper", bg: "#1a1a18" },
              { label: "Classic Cut", bg: "#141410" },
              { label: "Royal Shave", bg: "#18160e" },
              { label: "Beard Art", bg: "#161412" },
              { label: "Colour Work", bg: "#141616" },
              { label: "Full Look", bg: "#121212" },
            ].map((g) => (
              <div key={g.label} className={styles.galleryItem} style={{ background: g.bg }}>
                <div className={styles.galleryLabel}>
                  <Scissors size={14} />
                  <span>{g.label}</span>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.galleryNote}>
            <Instagram size={14} /> Follow <strong>@theguildbarbers</strong> for the full portfolio
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerLogo}>
                <Scissors size={18} />
                <span>The<em>Guild</em></span>
              </div>
              <p className={styles.footerTagline}>Premium grooming since 2010.</p>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Hours</h4>
              <p className={styles.footerText}>Mon–Fri: 9:00–19:00</p>
              <p className={styles.footerText}>Saturday: 9:00–18:00</p>
              <p className={styles.footerText}>Sunday: Closed</p>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Location</h4>
              <p className={styles.footerText}>24 Savile Row</p>
              <p className={styles.footerText}>Mayfair, London W1S 3PR</p>
            </div>
            <div>
              <h4 className={styles.footerHeading}>Follow</h4>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}><Instagram size={18} /></a>
                <a href="#" className={styles.socialLink}><Facebook size={18} /></a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2025 The Guild. Salon & Barber MVP Demo · Built by LOrdEnRYQuE</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
