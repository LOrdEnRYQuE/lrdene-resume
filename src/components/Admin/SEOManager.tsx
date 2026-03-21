"use client";

import React, { useState } from "react";
import styles from "./SEOManager.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { Save, Globe, Info, Image as ImageIcon, Plus } from "lucide-react";

export const SEOManager = () => {
  const metadata = useQuery(api.siteMetadata.list);
  const upsertMetadata = useMutation(api.siteMetadata.create);
  
  const [newRoute, setNewRoute] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdate = async (item: any) => {
    try {
      await upsertMetadata({
        route: item.route,
        title: item.title,
        description: item.description,
        keywords: item.keywords,
        ogImage: item.ogImage,
      });
      alert(`Metadata for ${item.route} updated!`);
    } catch (error) {
      console.error("Failed to update metadata", error);
    }
  };

  const handleAdd = async () => {
    if (!newRoute) return;
    try {
      await upsertMetadata({
        route: newRoute,
        title: "New Page Title",
        description: "New Page Description",
      });
      setNewRoute("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add route", error);
    }
  };

  return (
    <div className={styles.manager}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <Globe className="gold-text" size={32} />
          <div>
            <h1>SEO <span className="gold-text">Command Center</span></h1>
            <p>Manage site-wide metadata, OpenGraph tags, and search visibility.</p>
          </div>
        </div>
        
        <button className={styles.addBtn} onClick={() => setIsAdding(!isAdding)}>
          <Plus size={18} /> Add Route
        </button>
      </header>

      {isAdding && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className={styles.addPanel}
        >
          <input 
            type="text" 
            placeholder="/example-route" 
            value={newRoute}
            onChange={(e) => setNewRoute(e.target.value)}
          />
          <button onClick={handleAdd}>Confirm Route</button>
        </motion.div>
      )}

      <div className={styles.grid}>
        {metadata?.map((item) => (
          <div key={item._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.routeTag}>{item.route}</span>
              <button 
                className={styles.saveBtn}
                onClick={() => handleUpdate(item)}
              >
                <Save size={14} /> Save
              </button>
            </div>
            
            <div className={styles.fields}>
              <div className={styles.field}>
                <label><Info size={14} /> Page Title</label>
                <input 
                  type="text" 
                  value={item.title} 
                  onChange={(e) => {
                    // This is a local update pattern for simplicity in this demo
                    // In a real app, you'd use a local state or a controlled component
                  }} 
                  className={styles.input}
                />
              </div>
              
              <div className={styles.field}>
                <label><Info size={14} /> Meta Description</label>
                <textarea 
                  value={item.description}
                  rows={3}
                  className={styles.textarea}
                  onChange={(e) => {}}
                />
              </div>

              <div className={styles.field}>
                <label><ImageIcon size={14} /> OpenGraph Image URL</label>
                <input 
                  type="text" 
                  value={item.ogImage || ""} 
                  placeholder="https://..."
                  className={styles.input}
                  onChange={(e) => {}}
                />
              </div>
            </div>
          </div>
        ))}
        
        {metadata?.length === 0 && (
          <div className={styles.empty}>
            <p>No managed routes found. Start by adding your first route.</p>
          </div>
        )}
      </div>
    </div>
  );
};
