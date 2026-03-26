"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import styles from "./AboutEditor.module.css";
import { 
  Save, 
  Menu, 
  Layout, 
  Sparkles, 
  Zap, 
  Plus, 
  Trash2, 
  Globe, 
  Link as LinkIcon,
  Image as ImageIcon,
  BadgePercent
} from "lucide-react";
import { useLocale } from "@/lib/i18n/useLocale";
import { useAdminMutation } from "@/hooks/useAdminMutation";

type EditorTab = "navigation" | "footer" | "hero" | "promotions";

const defaultPromotionsData = {
  eyebrow: "Startup Promotions",
  titleA: "Startup offers from",
  titleB: "10% to 50% OFF",
  subtitle:
    "For startup businesses, I offer project-based discounts. Entry starts at 10%, with up to 50% OFF for high-fit opportunities.",
  note: "Final discount level depends on project scope, timeline, and strategic fit.",
  cta: "Claim Startup Offer",
  tiers: [
    { off: "10%", stage: "Early-stage idea" },
    { off: "20%", stage: "MVP planning" },
    { off: "30%", stage: "Initial traction" },
    { off: "40%", stage: "Product-market validation" },
    { off: "50%", stage: "High-potential startup fit" },
  ],
};

export default function SiteEditor() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<EditorTab>("navigation");
  const [isSaving, setIsSaving] = useState(false);

  const navContent = useQuery(api.pages.getPageContent, { key: "navbar", locale });
  const footerContent = useQuery(api.pages.getPageContent, { key: "footer", locale });
  const heroContent = useQuery(api.pages.getPageContent, { key: "home_hero", locale });
  const promotionsContent = useQuery(api.pages.getPageContent, { key: "home_promotions", locale, fallbackToEnglish: true });

  const updateContent = useAdminMutation(api.pages.updatePageContent);
  const seedContent = useAdminMutation(api.pages.seedSiteContent);


  const [navData, setNavData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [heroData, setHeroData] = useState<any>(null);
  const [promotionsData, setPromotionsData] = useState<any>(null);

  useEffect(() => { if (navContent?.data) setNavData(navContent.data); }, [navContent]);
  useEffect(() => { if (footerContent?.data) setFooterData(footerContent.data); }, [footerContent]);
  useEffect(() => { if (heroContent?.data) setHeroData(heroContent.data); }, [heroContent]);
  useEffect(() => {
    if (promotionsContent?.data) {
      setPromotionsData(promotionsContent.data);
      return;
    }
    setPromotionsData(defaultPromotionsData);
  }, [promotionsContent]);

  const handleSeed = async () => {
    setIsSaving(true);
    try {
      await seedContent({});
      alert("Site content initialized with defaults");
      window.location.reload();
    } catch {
      alert("Failed to initialize site content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (key: string, data: any) => {
    setIsSaving(true);
    try {
      await updateContent({ key, data, locale });
      alert("Content saved successfully!");
    } catch {
      alert("Failed to save content");
    } finally {
      setIsSaving(false);
    }
  };

  if (!navData || !footerData || !heroData || !promotionsData) {
    return (
      <div className="p-8 text-center gold-text">
        <p className="mb-4">No site configuration found. Would you like to initialize with defaults?</p>
        <button 
          onClick={handleSeed}
          className={styles.saveBtn}
          style={{margin: '0 auto', display: 'flex'}}
          disabled={isSaving}
        >
          {isSaving ? "Initializing..." : "Initialize Site Content"}
        </button>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="premium-title">Site <span className="gold-text">Controller</span></h1>
          <p className="text-secondary">Master management of global elements and home page sections.</p>
        </div>
        <div className={styles.headerTabs}>
          <button 
            className={activeTab === "navigation" ? styles.activeTab : ""} 
            onClick={() => setActiveTab("navigation")}
          >
            <Menu size={16} /> Header
          </button>
          <button 
            className={activeTab === "footer" ? styles.activeTab : ""} 
            onClick={() => setActiveTab("footer")}
          >
            <Globe size={16} /> Footer
          </button>
          <button 
            className={activeTab === "hero" ? styles.activeTab : ""} 
            onClick={() => setActiveTab("hero")}
          >
            <Sparkles size={16} /> Home Hero
          </button>
          <button
            className={activeTab === "promotions" ? styles.activeTab : ""}
            onClick={() => setActiveTab("promotions")}
          >
            <BadgePercent size={16} /> Promotions
          </button>
        </div>
      </header>

      <main className={styles.editorMain}>
        {activeTab === "navigation" && (
          <div className={styles.editorGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <ImageIcon size={20} className="gold-text" />
                <h2>Identity</h2>
              </div>
              <div className={styles.field}>
                <label>Logo Path (Public Assets)</label>
                <input 
                  value={navData.logo} 
                  onChange={e => setNavData({...navData, logo: e.target.value})}
                />
              </div>
              <div className={styles.field}>
                <label>Main CTA Text</label>
                <input 
                  value={navData.ctaText} 
                  onChange={e => setNavData({...navData, ctaText: e.target.value})}
                />
              </div>
              <button 
                onClick={() => handleSave("navbar", navData)} 
                disabled={isSaving}
                className={styles.saveBtn}
                style={{marginTop: '20px'}}
              >
                <Save size={18} /> Save Navigation
              </button>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <LinkIcon size={20} className="gold-text" />
                <h2>Navigation Links</h2>
                <button 
                  className={styles.addBtn}
                  onClick={() => setNavData({...navData, links: [...navData.links, { name: "New Link", href: "/" }]})}
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
              <div className={styles.itemList}>
                {navData.links.map((link: any, idx: number) => (
                  <div key={idx} className={styles.item}>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                      <input 
                        placeholder="Label" 
                        value={link.name} 
                        onChange={e => {
                          const newLinks = [...navData.links];
                          newLinks[idx].name = e.target.value;
                          setNavData({...navData, links: newLinks});
                        }}
                      />
                      <input 
                        placeholder="URL" 
                        value={link.href} 
                        onChange={e => {
                          const newLinks = [...navData.links];
                          newLinks[idx].href = e.target.value;
                          setNavData({...navData, links: newLinks});
                        }}
                      />
                      <button 
                        onClick={() => {
                          const newLinks = navData.links.filter((_: any, i: number) => i !== idx);
                          setNavData({...navData, links: newLinks});
                        }}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "footer" && (
          <div className={styles.editorGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Globe size={20} className="gold-text" />
                <h2>Footer Brand</h2>
              </div>
              <div className={styles.field}>
                <label>Tagline / Description</label>
                <textarea 
                  rows={3}
                  value={footerData.brandText} 
                  onChange={e => setFooterData({...footerData, brandText: e.target.value})}
                />
              </div>
              <button 
                onClick={() => handleSave("footer", footerData)} 
                disabled={isSaving}
                className={styles.saveBtn}
                style={{marginTop: '20px'}}
              >
                <Save size={18} /> Save Footer
              </button>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Layout size={20} className="gold-text" />
                <h2>Footer Columns</h2>
              </div>
              <div className={styles.itemList}>
                {footerData.pillars.map((pillar: any, pIdx: number) => (
                  <div key={pIdx} className={styles.item} style={{marginBottom: '30px'}}>
                    <input 
                      className={styles.pillarTitle}
                      value={pillar.title}
                      onChange={e => {
                        const newPillars = [...footerData.pillars];
                        newPillars[pIdx].title = e.target.value;
                        setFooterData({...footerData, pillars: newPillars});
                      }}
                    />
                    {pillar.links.map((link: any, lIdx: number) => (
                      <div key={lIdx} style={{display: 'flex', gap: '5px', marginBottom: '5px'}}>
                        <input 
                          style={{fontSize: '0.8rem'}}
                          value={link.label}
                          onChange={e => {
                            const newPillars = [...footerData.pillars];
                            newPillars[pIdx].links[lIdx].label = e.target.value;
                            setFooterData({...footerData, pillars: newPillars});
                          }}
                        />
                        <input 
                          style={{fontSize: '0.8rem'}}
                          value={link.href}
                          onChange={e => {
                            const newPillars = [...footerData.pillars];
                            newPillars[pIdx].links[lIdx].href = e.target.value;
                            setFooterData({...footerData, pillars: newPillars});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "hero" && (
          <div className={styles.editorGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Sparkles size={20} className="gold-text" />
                <h2>Home Hero Copy</h2>
              </div>
              <div className={styles.field}>
                <label>Headline</label>
                <textarea 
                  rows={2}
                  value={heroData.headline} 
                  onChange={e => setHeroData({...heroData, headline: e.target.value})}
                />
              </div>
              <div className={styles.field}>
                <label>Subheadline</label>
                <textarea 
                  rows={4}
                  value={heroData.subtitle} 
                  onChange={e => setHeroData({...heroData, subtitle: e.target.value})}
                />
              </div>
              <div style={{display: 'flex', gap: '20px'}}>
                <div className={styles.field}>
                  <label>Primary Action Label</label>
                  <input 
                    value={heroData.ctaPrimary} 
                    onChange={e => setHeroData({...heroData, ctaPrimary: e.target.value})}
                  />
                </div>
                <div className={styles.field}>
                  <label>Secondary Action Label</label>
                  <input 
                    value={heroData.ctaSecondary} 
                    onChange={e => setHeroData({...heroData, ctaSecondary: e.target.value})}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleSave("home_hero", heroData)} 
                disabled={isSaving}
                className={styles.saveBtn}
                style={{marginTop: '20px'}}
              >
                <Save size={18} /> Save Home Hero
              </button>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Zap size={20} className="gold-text" />
                <h2>Floating Stats</h2>
              </div>
              <div className={styles.itemList}>
                {heroData.stats.map((stat: any, idx: number) => (
                  <div key={idx} className={styles.item}>
                    <input 
                      className={styles.pillarTitle}
                      value={stat.label}
                      onChange={e => {
                        const newStats = [...heroData.stats];
                        newStats[idx].label = e.target.value;
                        setHeroData({...heroData, stats: newStats});
                      }}
                    />
                    <input 
                      style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}
                      value={stat.value}
                      onChange={e => {
                        const newStats = [...heroData.stats];
                        newStats[idx].value = e.target.value;
                        setHeroData({...heroData, stats: newStats});
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "promotions" && (
          <div className={styles.editorGrid}>
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <BadgePercent size={20} className="gold-text" />
                <h2>Promotion Copy</h2>
              </div>
              <div className={styles.field}>
                <label>Eyebrow</label>
                <input
                  value={promotionsData.eyebrow || ""}
                  onChange={e => setPromotionsData({ ...promotionsData, eyebrow: e.target.value })}
                />
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <div className={styles.field}>
                  <label>Title A</label>
                  <input
                    value={promotionsData.titleA || ""}
                    onChange={e => setPromotionsData({ ...promotionsData, titleA: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Title B</label>
                  <input
                    value={promotionsData.titleB || ""}
                    onChange={e => setPromotionsData({ ...promotionsData, titleB: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Subtitle</label>
                <textarea
                  rows={3}
                  value={promotionsData.subtitle || ""}
                  onChange={e => setPromotionsData({ ...promotionsData, subtitle: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label>Note</label>
                <textarea
                  rows={2}
                  value={promotionsData.note || ""}
                  onChange={e => setPromotionsData({ ...promotionsData, note: e.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label>CTA Label</label>
                <input
                  value={promotionsData.cta || ""}
                  onChange={e => setPromotionsData({ ...promotionsData, cta: e.target.value })}
                />
              </div>
              <button
                onClick={() => handleSave("home_promotions", promotionsData)}
                disabled={isSaving}
                className={styles.saveBtn}
                style={{marginTop: '20px'}}
              >
                <Save size={18} /> Save Promotions
              </button>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <Zap size={20} className="gold-text" />
                <h2>Promotion Tiers</h2>
              </div>
              <div className={styles.itemList}>
                {(promotionsData.tiers || []).map((tier: any, idx: number) => (
                  <div key={idx} className={styles.item}>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                      <input
                        placeholder="Discount"
                        value={tier.off || ""}
                        onChange={e => {
                          const next = [...(promotionsData.tiers || [])];
                          next[idx] = { ...next[idx], off: e.target.value };
                          setPromotionsData({ ...promotionsData, tiers: next });
                        }}
                      />
                      <input
                        placeholder="Stage label"
                        value={tier.stage || ""}
                        onChange={e => {
                          const next = [...(promotionsData.tiers || [])];
                          next[idx] = { ...next[idx], stage: e.target.value };
                          setPromotionsData({ ...promotionsData, tiers: next });
                        }}
                      />
                      <button
                        onClick={() => {
                          const next = (promotionsData.tiers || []).filter((_: any, i: number) => i !== idx);
                          setPromotionsData({ ...promotionsData, tiers: next });
                        }}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={styles.addBtn}
                onClick={() => setPromotionsData({
                  ...promotionsData,
                  tiers: [...(promotionsData.tiers || []), { off: "10%", stage: "New tier" }],
                })}
                style={{marginTop: '12px'}}
              >
                <Plus size={14} /> Add Tier
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
