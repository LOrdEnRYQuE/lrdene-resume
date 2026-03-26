"use client";

import React, { useState } from "react";
import styles from "./PortalManager.module.css";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  ShieldCheck, 
  Plus, 
  Copy, 
  ExternalLink,
  AlertCircle,
  Upload,
  File
} from "lucide-react";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import { useAdminMutation } from "@/hooks/useAdminMutation";

const AssetList = ({ portalId }: { portalId: Id<"clientPortals"> }) => {
  const assets = useAdminQuery(api.portals.getPortalAssets, { portalId }) as any[] | undefined;

  if (!assets || assets.length === 0) return null;

  return (
    <div className={styles.assetList}>
      {assets.map((asset) => (
        <div key={asset._id} className={styles.assetItem}>
          <div className={styles.assetInfo}>
            <File size={14} className="gold-text" />
            <span className={styles.assetName}>{asset.name}</span>
            <span className={`${styles.statusBadge} ${styles[asset.status]}`}>
              {asset.status.toUpperCase()}
            </span>
          </div>
          <div className={styles.assetActions}>
            <a href={asset.url || "#"} target="_blank" rel="noopener noreferrer" className={styles.viewBtn}>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PortalManager = () => {
  const leads = (useAdminQuery(api.leads.list) as any[]) || [];
  const projects = useQuery(api.projects.list, {}) || [];
  const portals = (useAdminQuery(api.portals.listPortals) as any[]) || [];
  const createPortal = useAdminMutation(api.portals.createPortal);
  const generateUploadUrl = useAdminMutation(api.portals.generateUploadUrl);
  const addPortalAsset = useAdminMutation(api.portals.addPortalAsset);
  
  const [selectedLeadId, setSelectedLeadId] = useState<Id<"leads"> | "">("");
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | "">("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    setIsCreating(true);
    try {
      await createPortal({
        leadId: selectedLeadId,
        projectId: selectedProjectId || undefined,
      });
      setSelectedLeadId("");
      setSelectedProjectId("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (portalId: Id<"clientPortals">, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await addPortalAsset({
        portalId,
        storageId,
        name: file.name,
        format: file.type.startsWith("image") ? "image" : "file",
      });
      alert(`Asset "${file.name}" uploaded successfully.`);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed.");
    }
  };

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/portal/${code}`;
    navigator.clipboard.writeText(url);
    alert("Portal URL copied to clipboard!");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Portal <span className="gold-text">Architect</span></h1>
          <p>Provision secure project environments for your clients.</p>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.creator}>
          <div className={styles.card}>
            <h2><Plus size={20} className="gold-text" /> New Deployment</h2>
            <form onSubmit={handleCreatePortal} className={styles.form}>
              <div className={styles.field}>
                <label>Select Client (Lead)</label>
                <select 
                  value={selectedLeadId} 
                    onChange={(e) => setSelectedLeadId(e.target.value as Id<"leads"> | "")}
                  required
                >
                  <option value="">Select a lead...</option>
                  {leads.map(lead => (
                    <option key={lead._id} value={lead._id}>{lead.name} ({lead.email})</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label>Link Project (Optional)</label>
                <select 
                  value={selectedProjectId} 
                    onChange={(e) => setSelectedProjectId(e.target.value as Id<"projects"> | "")}
                >
                  <option value="">No project linked...</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>{project.title}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className={styles.initializeBtn}
                disabled={isCreating || !selectedLeadId}
              >
                {isCreating ? "Generating Neural Link..." : "Initialize Portal"}
              </button>
            </form>
          </div>
        </section>

        <section className={styles.list}>
          <div className={styles.card}>
            <h2><ShieldCheck size={20} className="gold-text" /> Active Neural Links</h2>
            <div className={styles.portalList}>
              {portals.map((portal) => (
                <div key={portal._id} className={styles.portalItem}>
                  <div className={styles.portalMain}>
                    <div className={styles.portalInfo}>
                      <strong>{portal.clientName}</strong>
                      <code>{portal.secretCode}</code>
                    </div>
                    <div className={styles.portalActions}>
                      <label className={styles.uploadBtn}>
                        <Upload size={16} />
                        <input 
                          type="file" 
                          hidden 
                          onChange={(e) => handleFileUpload(portal._id, e)} 
                        />
                      </label>
                      <button onClick={() => copyToClipboard(portal.secretCode)} title="Copy URL">
                        <Copy size={16} />
                      </button>
                      <a href={`/portal/${portal.secretCode}`} target="_blank" rel="noopener noreferrer" title="View Portal">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <div className={styles.portalMeta}>
                    <span>Status: <strong style={{ color: "var(--accent-gold)" }}>{portal.status}</strong></span>
                    {portal.lastAccessed && (
                      <span>Last Seen: {new Date(portal.lastAccessed).toLocaleDateString()}</span>
                    )}
                  </div>
                  <AssetList portalId={portal._id} />
                </div>
              ))}
              {portals.length === 0 && (
                <div className={styles.empty}>
                  <AlertCircle size={32} style={{ opacity: 0.3, marginBottom: "1rem" }} />
                  <p>No active portals found. Start by initializing one above.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
