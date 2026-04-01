"use client";

import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { ArrowRight, BadgePercent, Clock3, Sparkles } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ANALYTICS_EVENTS } from "@/lib/analytics/taxonomy";
import LocaleLink from "@/components/I18n/LocaleLink";
import styles from "./Offers.module.css";

type OffersPageClientProps = {
  locale: "en" | "de";
};

type OfferItem = {
  key: string;
  label: string;
  headline: string;
  price: string;
  description: string;
  points: string[];
  coupon: string;
  expiry: string;
  cta: string;
};

const PRIVACY_CONSENT_VERSION = "offers_claim_form_v1";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function OffersPageClient({ locale }: OffersPageClientProps) {
  const isDe = locale === "de";
  const createLead = useMutation(api.leads.create);
  const { trackConversion, trackEvent } = useAnalytics();
  const formRef = useRef<HTMLDivElement | null>(null);

  const copy = isDe
    ? {
        heroEyebrow: "Limitierte Angebote",
        heroTitle: "Spezielle Angebote für Startups, lokale Unternehmen und wachsende Marken",
        heroText:
          "Premium digitale Lösungen zu Aktionspreisen. Für Unternehmen, die Qualität, Geschwindigkeit und messbares Wachstum wollen.",
        heroPrimary: "Angebot sichern",
        heroSecondary: "Pakete ansehen",
        offersTitle: "Aktionspakete",
        couponTitle: "Coupon & Konditionen",
        couponText:
          "Jedes Angebot enthält einen vorausgefüllten Code, eine feste Aktionsfrist und klare Rahmenbedingungen für einen schnellen Start.",
        whyTitle: "Warum es dieses Angebot gibt",
        whyQuote:
          "Ich will Startups und lokalen Unternehmen helfen, mit Premium-Qualität zu starten, ohne die volle Eintrittsbarriere direkt am Anfang.",
        whyBody:
          "Das ist kein Billigangebot. Es ist ein strategischer Einstieg für Teams, die schnell live gehen und später sauber skalieren wollen.",
        formTitle: "Angebot anfragen",
        formText:
          "Wähle ein Paket, ergänze ein paar Projektdetails, und ich melde mich mit Scope, Verfügbarkeit und dem nächsten sinnvollen Schritt.",
        selectedOffer: "Ausgewähltes Angebot",
        couponCode: "Coupon Code",
        expiry: "Gültig bis",
        name: "Name",
        email: "E-Mail",
        company: "Firma",
        website: "Website",
        timeline: "Ziel-Zeitrahmen",
        timelineOptions: ["Sofort", "2-4 Wochen", "1-2 Monate", "Flexibel"],
        message: "Kurzbeschreibung",
        messagePlaceholder: "Was willst du bauen oder verbessern? Ziel, Umfang, Priorität, aktueller Stand ...",
        consent:
          "Ich stimme der Verarbeitung meiner Angaben zur Bearbeitung dieser Angebotsanfrage gemäß Datenschutzerklärung zu.",
        submit: "Angebot sichern",
        submitting: "Wird gesendet...",
        successTitle: "Anfrage erhalten",
        successText:
          "Deine Angebotsanfrage ist eingegangen. Der nächste Schritt ist Scope-Abstimmung und, falls passend, ein kurzer Call.",
        bookCall: "Call buchen",
        sendAnother: "Weiteres Angebot anfragen",
        faqTitle: "FAQ",
        termsTitle: "Bedingungen",
        terms: [
          "Nur für Neukunden.",
          "Limitierte Slots pro Monat.",
          "Nicht mit anderen Aktionen kombinierbar.",
          "Das finale Angebot hängt vom tatsächlichen Scope ab.",
          "Je nach Projekt kann eine Anzahlung erforderlich sein.",
        ],
        faq: [
          {
            q: "Für wen sind diese Angebote gedacht?",
            a: "Für Startups, lokale Unternehmen und wachsende Marken, die schnell mit hoher Qualität starten wollen.",
          },
          {
            q: "Wie schnell kann geliefert werden?",
            a: "Je nach Paket meist zwischen wenigen Tagen und einigen Wochen. Der genaue Zeitplan hängt vom Umfang ab.",
          },
          {
            q: "Was ist enthalten?",
            a: "Jedes Angebot hat einen klaren Kernumfang. Zusatzfunktionen, Inhalte oder Integrationen können sauber ergänzt werden.",
          },
          {
            q: "Kann ich individuelle Leistungen anfragen?",
            a: "Ja. Das Angebot dient als Einstieg. Wenn dein Scope größer ist, wird daraus ein angepasstes Angebot.",
          },
          {
            q: "Sind Hosting und Domain enthalten?",
            a: "Standardmäßig nicht dauerhaft. Setup und Empfehlungen sind möglich, laufende Kosten werden separat geklärt.",
          },
          {
            q: "Gibt es Zahlungspläne?",
            a: "Bei passenden Projekten ja. Das hängt von Paketgröße, Scope und Zeitrahmen ab.",
          },
        ],
        errors: {
          name: "Bitte gib deinen Namen ein.",
          email: "Bitte gib eine gültige E-Mail-Adresse ein.",
          message: "Bitte teile etwas Projektkontext mit.",
          consent: "Bitte bestätige die Datenschutzzustimmung.",
          submit: "Senden fehlgeschlagen. Bitte versuche es erneut.",
        },
      }
    : {
        heroEyebrow: "Limited-Time Offers",
        heroTitle: "Special Offers for Startups, Local Businesses, and Growing Brands",
        heroText:
          "Get premium digital solutions at promotional pricing. Designed for businesses that want quality, speed, and real growth.",
        heroPrimary: "Claim an Offer",
        heroSecondary: "View Packages",
        offersTitle: "Offer Packages",
        couponTitle: "Coupon & Terms Snapshot",
        couponText:
          "Each offer includes a prefilled code, a clear expiration date, and simple claim conditions so the buying decision stays friction-light.",
        whyTitle: "Why This Offer Exists",
        whyQuote:
          "I want to help startups and local businesses launch with premium quality without the full upfront barrier.",
        whyBody:
          "This is not discount-first positioning. It is a strategic on-ramp for teams that need speed now and a cleaner scale path later.",
        formTitle: "Claim Your Offer",
        formText:
          "Choose a package, add a few project details, and I’ll respond with scope, availability, and the right next step.",
        selectedOffer: "Selected Offer",
        couponCode: "Coupon Code",
        expiry: "Expires",
        name: "Name",
        email: "Email",
        company: "Company",
        website: "Website",
        timeline: "Target Timeline",
        timelineOptions: ["ASAP", "2-4 weeks", "1-2 months", "Flexible"],
        message: "Project Brief",
        messagePlaceholder: "What are you trying to launch or improve? Share goals, scope, urgency, and current blockers...",
        consent: "I agree to my data being processed to handle this offer inquiry according to the privacy policy.",
        submit: "Claim Offer",
        submitting: "Submitting...",
        successTitle: "Offer Request Received",
        successText:
          "Your request is in. Next step is scope alignment and, if needed, a short call to confirm fit and timing.",
        bookCall: "Book Call",
        sendAnother: "Claim Another Offer",
        faqTitle: "FAQ",
        termsTitle: "Terms",
        terms: [
          "New clients only.",
          "Limited slots available each month.",
          "Cannot be combined with other promotions.",
          "Final quote depends on actual scope.",
          "A deposit may be required depending on the project.",
        ],
        faq: [
          {
            q: "Who are these offers for?",
            a: "They are built for startups, local businesses, and growing brands that need strong execution without enterprise friction.",
          },
          {
            q: "How long does delivery take?",
            a: "Usually anywhere from a few days to a few weeks depending on the package and how prepared the inputs are.",
          },
          {
            q: "What is included?",
            a: "Each offer has a defined core scope. Extra features, content, or integrations can be added as custom scope.",
          },
          {
            q: "Can I request custom work?",
            a: "Yes. The offer is the starting point. If your scope is larger, I’ll convert it into a tailored proposal.",
          },
          {
            q: "Is hosting or domain included?",
            a: "Not as a permanent bundled cost by default. Setup help and recommendations are available.",
          },
          {
            q: "Do you offer payment plans?",
            a: "For the right project, yes. That depends on package size, scope complexity, and timeline.",
          },
        ],
        errors: {
          name: "Please enter your name.",
          email: "Please enter a valid email address.",
          message: "Please add some project context.",
          consent: "Please confirm the privacy consent.",
          submit: "Submission failed. Please try again.",
        },
      };

  const offers: OfferItem[] = isDe
    ? [
        {
          key: "startup-launch",
          label: "Startup Launch",
          headline: "Bis zu 50% OFF Web Design",
          price: "Bis zu 50% OFF",
          description: "Premium Landing Page für Startups mit hoher Geschwindigkeit, sauberer Struktur und Conversion-Fokus.",
          points: ["Premium Landing Page", "Mobile-first", "SEO-ready", "Schnelle Lieferung", "Ideal für Startups"],
          coupon: "START50",
          expiry: "30. Juni 2026",
          cta: "Angebot sichern",
        },
        {
          key: "business-website-pack",
          label: "Business Website Pack",
          headline: "Professionelle Website ab 2.490 EUR",
          price: "ab 2.490 EUR",
          description: "Für lokale Unternehmen, die eine moderne Website mit glaubwürdigem Auftritt und klarer Kontaktstrecke brauchen.",
          points: ["Bis zu 5 Seiten", "Modernes UI", "Kontaktformular", "WhatsApp Integration", "Basis-SEO"],
          coupon: "LOCALPRO",
          expiry: "30. Juni 2026",
          cta: "Paket wählen",
        },
        {
          key: "mvp-kickstart",
          label: "MVP Kickstart",
          headline: "Startup MVP Build",
          price: "ab 7.500 EUR",
          description: "Für Gründer, die in Wochen statt Monaten ein sauberes MVP mit belastbarer Struktur starten wollen.",
          points: ["UI Design", "Dashboards / Seiten", "Auth", "Admin Panel", "Skalierbare Struktur"],
          coupon: "MVPFAST",
          expiry: "30. Juni 2026",
          cta: "MVP starten",
        },
        {
          key: "ai-business-upgrade",
          label: "AI Business Upgrade",
          headline: "AI + Automation Setup",
          price: "ab 1.500 EUR",
          description: "Für Unternehmen, die Lead-Erfassung, interne Abläufe oder Kundenkommunikation mit KI verbessern wollen.",
          points: ["Chatbot", "Workflow Automation", "Lead Capture", "Smart Integrationen", "Beratung + Setup"],
          coupon: "AIFLOW",
          expiry: "30. Juni 2026",
          cta: "Beratung buchen",
        },
      ]
    : [
        {
          key: "startup-launch",
          label: "Startup Launch",
          headline: "Up to 50% OFF Web Design",
          price: "Up to 50% OFF",
          description: "A premium landing page offer for startups that need speed, clarity, and conversion intent from day one.",
          points: ["Premium landing page", "Mobile-first", "SEO-ready", "Fast delivery", "Ideal for startups"],
          coupon: "START50",
          expiry: "June 30, 2026",
          cta: "Claim Offer",
        },
        {
          key: "business-website-pack",
          label: "Business Website Pack",
          headline: "Professional Website from EUR 2,490",
          price: "from EUR 2,490",
          description: "For local businesses that need a modern site, stronger credibility, and a cleaner path to inquiries.",
          points: ["Up to 5 pages", "Modern UI", "Contact form", "WhatsApp integration", "Basic SEO"],
          coupon: "LOCALPRO",
          expiry: "June 30, 2026",
          cta: "Get This Package",
        },
        {
          key: "mvp-kickstart",
          label: "MVP Kickstart",
          headline: "Startup MVP Build",
          price: "from EUR 7,500",
          description: "For founders who need a serious MVP foundation with product thinking, not a fragile prototype.",
          points: ["UI design", "Dashboard / pages", "Auth", "Admin panel", "Scalable structure"],
          coupon: "MVPFAST",
          expiry: "June 30, 2026",
          cta: "Start MVP",
        },
        {
          key: "ai-business-upgrade",
          label: "AI Business Upgrade",
          headline: "AI + Automation Setup",
          price: "from EUR 1,500",
          description: "For businesses ready to improve lead capture, operations, or customer communication with practical AI.",
          points: ["Chatbot", "Workflow automation", "Lead capture", "Smart integrations", "Consulting + setup"],
          coupon: "AIFLOW",
          expiry: "June 30, 2026",
          cta: "Book Consultation",
        },
      ];

  const [selectedKey, setSelectedKey] = useState(offers[0]?.key ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [timeline, setTimeline] = useState(copy.timelineOptions[1] ?? "");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submittedOffer, setSubmittedOffer] = useState<OfferItem | null>(null);

  const selectedOffer = offers.find((offer) => offer.key === selectedKey) ?? offers[0];

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectOffer = (offerKey: string) => {
    const offer = offers.find((entry) => entry.key === offerKey);
    setSelectedKey(offerKey);
    setError("");
    if (offer) {
      trackEvent(ANALYTICS_EVENTS.CLICK_CTA, `Offer selected: ${offer.label}`, {
        route: "/offers",
        offer: offer.key,
      });
    }
    scrollToForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setCompany("");
    setWebsite("");
    setTimeline(copy.timelineOptions[1] ?? copy.timelineOptions[0] ?? "");
    setMessage("");
    setConsent(false);
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedOffer || submitting) return;

    if (!name.trim()) {
      setError(copy.errors.name);
      return;
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      setError(copy.errors.email);
      return;
    }
    if (!message.trim()) {
      setError(copy.errors.message);
      return;
    }
    if (!consent) {
      setError(copy.errors.consent);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const enrichedMessage = [
        `Offer Page Claim`,
        `Offer: ${selectedOffer.label}`,
        `Offer Headline: ${selectedOffer.headline}`,
        `Coupon: ${selectedOffer.coupon}`,
        `Expiry: ${selectedOffer.expiry}`,
        `Website: ${website.trim() || "n/a"}`,
        `Timeline: ${timeline}`,
        "",
        message.trim(),
      ].join("\n");

      await createLead({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company: company.trim() || undefined,
        projectType: `Offer Claim | ${selectedOffer.label}`,
        budget: selectedOffer.price,
        timeline,
        message: enrichedMessage,
        niche: `offers-${selectedOffer.key}`,
        privacyConsent: true,
        privacyConsentAt: Date.now(),
        privacyConsentVersion: PRIVACY_CONSENT_VERSION,
      });

      trackConversion("offer_claim_submit", 1);
      trackEvent(ANALYTICS_EVENTS.SUBMIT_CONTACT_FORM, `Offer claim submitted: ${selectedOffer.label}`, {
        route: "/offers",
        offer: selectedOffer.key,
        coupon: selectedOffer.coupon,
      });

      setSubmittedOffer(selectedOffer);
      resetForm();
    } catch {
      setError(copy.errors.submit);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{copy.heroEyebrow}</span>
          <h1 className={styles.title}>{copy.heroTitle}</h1>
          <p className={styles.subtitle}>{copy.heroText}</p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryButton} onClick={() => selectOffer(selectedOffer.key)}>
              {copy.heroPrimary}
            </button>
            <a href="#offer-packages" className={styles.secondaryButton}>
              {copy.heroSecondary}
            </a>
          </div>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.panelBadge}>
            <Sparkles size={16} />
            <span>{copy.couponTitle}</span>
          </div>
          <div className={styles.panelGrid}>
            <div>
              <span>{copy.selectedOffer}</span>
              <strong>{selectedOffer.label}</strong>
            </div>
            <div>
              <span>{copy.couponCode}</span>
              <strong>{selectedOffer.coupon}</strong>
            </div>
            <div>
              <span>{copy.expiry}</span>
              <strong>{selectedOffer.expiry}</strong>
            </div>
            <div>
              <span>{isDe ? "Preis" : "Pricing"}</span>
              <strong>{selectedOffer.price}</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="offer-packages" className={`container ${styles.offersSection}`}>
        <div className={styles.sectionHeader}>
          <h2>{copy.offersTitle}</h2>
          <p>{copy.couponText}</p>
        </div>
        <div className={styles.offerGrid}>
          {offers.map((offer) => {
            const isActive = offer.key === selectedOffer.key;
            return (
              <article key={offer.key} className={`${styles.offerCard} ${isActive ? styles.offerCardActive : ""}`}>
                <div className={styles.offerTop}>
                  <span className={styles.offerLabel}>{offer.label}</span>
                  <strong className={styles.offerPrice}>{offer.price}</strong>
                </div>
                <h3>{offer.headline}</h3>
                <p>{offer.description}</p>
                <ul className={styles.offerPoints}>
                  {offer.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className={styles.offerMeta}>
                  <span>
                    <BadgePercent size={14} />
                    {offer.coupon}
                  </span>
                  <span>
                    <Clock3 size={14} />
                    {offer.expiry}
                  </span>
                </div>
                <button type="button" className={styles.cardCta} onClick={() => selectOffer(offer.key)}>
                  {offer.cta}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className={`container ${styles.storySection}`}>
        <article className={styles.storyCard}>
          <h2>{copy.whyTitle}</h2>
          <blockquote>{copy.whyQuote}</blockquote>
          <p>{copy.whyBody}</p>
        </article>
        <article className={styles.storyCard}>
          <h2>{copy.couponTitle}</h2>
          <div className={styles.couponStrip}>
            <div>
              <span>{copy.selectedOffer}</span>
              <strong>{selectedOffer.label}</strong>
            </div>
            <div>
              <span>{copy.couponCode}</span>
              <strong>{selectedOffer.coupon}</strong>
            </div>
            <div>
              <span>{copy.expiry}</span>
              <strong>{selectedOffer.expiry}</strong>
            </div>
          </div>
        </article>
      </section>

      <section ref={formRef} className={`container ${styles.formSection}`}>
        <div className={styles.formIntro}>
          <h2>{copy.formTitle}</h2>
          <p>{copy.formText}</p>
        </div>

        <div className={styles.formShell}>
          {submittedOffer ? (
            <div className={styles.successCard}>
              <h3>{copy.successTitle}</h3>
              <p>{copy.successText}</p>
              <div className={styles.successMeta}>
                <span>{copy.selectedOffer}</span>
                <strong>{submittedOffer.label}</strong>
              </div>
              <div className={styles.successActions}>
                <LocaleLink href={`/contact?topic=offers&offer=${submittedOffer.key}`} className={styles.primaryButton}>
                  {copy.bookCall} <ArrowRight size={16} />
                </LocaleLink>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setSubmittedOffer(null);
                    scrollToForm();
                  }}
                >
                  {copy.sendAnother}
                </button>
              </div>
            </div>
          ) : (
            <form className={styles.claimForm} onSubmit={handleSubmit}>
              <div className={styles.readonlyGrid}>
                <div className={styles.readonlyField}>
                  <span>{copy.selectedOffer}</span>
                  <strong>{selectedOffer.label}</strong>
                </div>
                <div className={styles.readonlyField}>
                  <span>{copy.couponCode}</span>
                  <strong>{selectedOffer.coupon}</strong>
                </div>
                <div className={styles.readonlyField}>
                  <span>{copy.expiry}</span>
                  <strong>{selectedOffer.expiry}</strong>
                </div>
              </div>

              <div className={styles.formGrid}>
                <label>
                  {copy.name}
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                  {copy.email}
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                  {copy.company}
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                </label>
                <label>
                  {copy.website}
                  <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </label>
                <label className={styles.fullWidth}>
                  {copy.timeline}
                  <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                    {copy.timelineOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.fullWidth}>
                  {copy.message}
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={7} placeholder={copy.messagePlaceholder} />
                </label>
              </div>

              <label className={styles.consentRow}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{copy.consent}</span>
              </label>

              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.formActions}>
                <button type="submit" className={styles.primaryButton} disabled={submitting}>
                  {submitting ? copy.submitting : copy.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className={`container ${styles.bottomGrid}`}>
        <article className={styles.infoCard}>
          <h2>{copy.faqTitle}</h2>
          <div className={styles.faqList}>
            {copy.faq.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.infoCard}>
          <h2>{copy.termsTitle}</h2>
          <ul className={styles.termsList}>
            {copy.terms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
