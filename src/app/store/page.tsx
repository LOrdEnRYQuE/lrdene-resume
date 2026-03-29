"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./Store.module.css";
import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Tag, 
  Star, 
  Download, 
  ExternalLink,
  Search,
  Code2
} from "lucide-react";
import Image from "next/image";
import LocaleLink from "@/components/I18n/LocaleLink";

const MOCK_PRODUCTS = [
  {
    _id: "p1",
    name: "Astra Design System",
    slug: "astra-design-system",
    description: "A comprehensive Figma & React design system with token architecture and glassmorphism components.",
    category: "UI Kits",
    price: 49,
    imageUrl: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070",
    techStack: ["Figma", "React", "Storybook"],
    downloadUrl: ""
  },
  {
    _id: "p2",
    name: "Nexus SaaS Blueprint",
    slug: "nexus-saas-blueprint",
    description: "Production-ready Next.js boilerplate with integrated auth, billing, and AI workflow patterns.",
    category: "Templates",
    price: 99,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2026",
    techStack: ["Next.js", "Stripe", "Clerk"],
    downloadUrl: ""
  }
];

export default function StorePage() {
  const productsFromDb = useQuery(api.products.listActive);
  const products = (productsFromDb && productsFromDb.length > 0) ? productsFromDb : MOCK_PRODUCTS;
  const isValidDownloadUrl = (value?: string) =>
    Boolean(value && value.trim() && value !== "#");

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className={styles.headerIcon}>
            <ShoppingBag size={48} />
          </div>
          <h1 className={styles.title}>Digital <span className="platinum-text">Assets</span></h1>
          <p className={styles.subtitle}>
            Premium templates, UI kits, and architectural blueprints for the modern engineer.
          </p>
        </motion.div>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Search assets..." />
        </div>
        <div className={styles.categories}>
          <button className={styles.activeCat}>All</button>
          <button>Templates</button>
          <button>UI Kits</button>
          <button>Blueprints</button>
        </div>
      </div>

      <div className={styles.productGrid}>
        {products.map((product, idx) => (
          <motion.div 
            key={product._id}
            className={styles.productCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={styles.preview}>
              <Image
                src={product.imageUrl || "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=2070"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.priceBadge}>${product.price}</div>
            </div>
            
            <div className={styles.content}>
              <div className={styles.topRow}>
                <span className={styles.categoryBadge}><Tag size={12} /> {product.category}</span>
                <div className={styles.rating}><Star size={12} fill="var(--accent-platinum)" /> 5.0</div>
              </div>
              
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDesc}>{product.description}</p>
              
              <div className={styles.techTags}>
                {(product.techStack as string[])?.slice(0, 3).map((tech, i) => (
                  <span key={i} className={styles.techTag}><Code2 size={10} /> {tech}</span>
                ))}
              </div>

              <div className={styles.actions}>
                {isValidDownloadUrl(product.downloadUrl) ? (
                  <LocaleLink href={product.downloadUrl as string} className={styles.buyBtn}>
                    Purchase Asset <Download size={18} />
                  </LocaleLink>
                ) : (
                  <LocaleLink href="/contact" className={styles.buyBtn}>
                    Request Access <Download size={18} />
                  </LocaleLink>
                )}
                <LocaleLink href="/contact" className={styles.detailsBtn} aria-label={`Ask about ${product.name}`}>
                  <ExternalLink size={18} />
                </LocaleLink>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
