"use client";

import React, { useState, useRef } from "react";
import styles from "./MediaLibrary.module.css";
import { Image as ImageIcon, Upload, Trash2, Search, Grid, List as ListIcon, Loader2, FileText, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdminMutation } from "@/hooks/useAdminMutation";

export const MediaLibrary = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateMedia = useAdminMutation(api.media.updateMedia);

  const media = useQuery(api.media.getMedia);
  const generateUploadUrl = useAdminMutation(api.media.generateUploadUrl);
  const saveMedia = useAdminMutation(api.media.saveMedia);
  const deleteMedia = useAdminMutation(api.media.deleteMedia);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      const mediaId = await saveMedia({
        storageId,
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Keep an SEO-friendly fallback alt text when uploading images.
      if (file.type.startsWith("image/")) {
        const altText = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();
        await updateMedia({ id: mediaId, alt: altText });
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredMedia = media?.filter(m => m.name.toLowerCase().includes(search.toLowerCase())) || [];

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon size={24} />;
    if (type.startsWith("video/")) return <Film size={24} />;
    return <FileText size={24} />;
  };

  return (
    <div className={styles.library}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <ImageIcon className="gold-text" size={32} />
          <div>
            <h1>Media <span className="gold-text">Library</span></h1>
            <p>Centralized asset management for your digital ecosystem.</p>
          </div>
        </div>
        <div className={styles.actions}>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            onChange={handleUpload}
          />
          <button 
            className={styles.uploadBtn} 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
            {isUploading ? "Uploading..." : "Upload Asset"}
          </button>
        </div>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            placeholder="Search assets..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.viewToggles}>
          <button onClick={() => setView("grid")} className={view === "grid" ? styles.activeView : ""}>
            <Grid size={18} />
          </button>
          <button onClick={() => setView("list")} className={view === "list" ? styles.activeView : ""}>
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className={view === "grid" ? styles.grid : styles.list}>
        <AnimatePresence mode="popLayout">
          {filteredMedia.map((item) => (
            <motion.div 
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={view === "grid" ? styles.mediaCard : styles.mediaRow}
              whileHover={{ y: -5 }}
            >
              <div className={styles.preview}>
                {item.type.startsWith("image/") && item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className={styles.previewImg} />
                ) : (
                  <div className={styles.placeholderIcon}>
                    {getFileIcon(item.type)}
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.meta}>{formatSize(item.size)} • {new Date(item.createdAt).toLocaleDateString()}</span>
                {item.alt && <span className={styles.altText}>SEO: {item.alt}</span>}
              </div>
              <button 
                className={styles.deleteBtn}
                onClick={() => deleteMedia({ id: item._id })}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMedia.length === 0 && !isUploading && (
          <div className={styles.empty}>
            <ImageIcon size={48} className={styles.emptyIcon} />
            <p>No assets found. Upload some to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};
