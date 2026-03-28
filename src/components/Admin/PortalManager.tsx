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
  File,
  RefreshCw,
  PauseCircle,
  CheckCircle2,
  Ban,
  BookOpen,
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
  const updatePortalStatus = useAdminMutation(api.portals.updatePortalStatus);
  const rotatePortalCode = useAdminMutation(api.portals.rotatePortalCode);
  const generateUploadUrl = useAdminMutation(api.portals.generateUploadUrl);
  const addPortalAsset = useAdminMutation(api.portals.addPortalAsset);
  
  const [selectedLeadId, setSelectedLeadId] = useState<Id<"leads"> | "">("");
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | "">("");
  const [isCreating, setIsCreating] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [inlineMessage, setInlineMessage] = useState<string>("");

  const handleCreatePortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    setIsCreating(true);
    try {
      const created = (await createPortal({
        leadId: selectedLeadId,
        projectId: selectedProjectId || undefined,
      })) as { secretCode?: string } | null;
      setSelectedLeadId("");
      setSelectedProjectId("");
      if (created?.secretCode) {
        setInlineMessage(`Portal initialized: ${created.secretCode}`);
      }
    } catch (err) {
      console.error(err);
      setInlineMessage("Failed to initialize portal.");
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
      setInlineMessage(`Asset uploaded: ${file.name}`);
    } catch (err) {
      console.error("Upload failed", err);
      setInlineMessage("Upload failed.");
    }
  };

  const copyToClipboard = async (code: string) => {
    const url = `${window.location.origin}/portal/${code}`;
    await navigator.clipboard.writeText(url);
    setInlineMessage("Portal URL copied.");
  };

  const handleStatusChange = async (
    portalId: Id<"clientPortals">,
    status: "active" | "on-hold" | "completed" | "revoked",
  ) => {
    setStatusUpdatingId(portalId);
    try {
      await updatePortalStatus({ portalId, status });
      setInlineMessage(`Portal status updated: ${status}`);
    } catch (error) {
      console.error("Failed to update status", error);
      setInlineMessage("Failed to update portal status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleRotateCode = async (portalId: Id<"clientPortals">) => {
    setRotatingId(portalId);
    try {
      const result = (await rotatePortalCode({ portalId })) as { secretCode?: string } | null;
      if (result?.secretCode) {
        setInlineMessage(`Portal code rotated: ${result.secretCode}`);
      } else {
        setInlineMessage("Portal code rotated.");
      }
    } catch (error) {
      console.error("Failed to rotate portal code", error);
      setInlineMessage("Failed to rotate portal code.");
    } finally {
      setRotatingId(null);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Portal <span className="gold-text">Architect</span></h1>
          <p>Provision secure project environments for your clients.</p>
          {inlineMessage ? <p className={styles.inlineMessage}>{inlineMessage}</p> : null}
        </div>
      </header>

      <section className={styles.tutorialCard}>
        <h2><BookOpen size={18} className="gold-text" /> How To Use Portal Architect</h2>
        <div className={styles.tutorialGrid}>
          <article>
            <h3>1. Create Portal</h3>
            <p>Select a lead, optionally link a project, then click <strong>Initialize Portal</strong>.</p>
          </article>
          <article>
            <h3>2. Share Secure Access</h3>
            <p>Use <strong>Copy URL</strong> to send the private portal link to your client.</p>
          </article>
          <article>
            <h3>3. Upload Delivery Assets</h3>
            <p>Use the upload action to attach files. Assets appear in the portal workspace.</p>
          </article>
          <article>
            <h3>4. Control Lifecycle</h3>
            <p>Set status to <strong>On-Hold</strong>, <strong>Completed</strong>, or <strong>Revoked</strong> as the project evolves.</p>
          </article>
          <article>
            <h3>5. Rotate Access Code</h3>
            <p>Use <strong>Rotate Code</strong> immediately if a link is exposed or staff changes.</p>
          </article>
        </div>
        <p className={styles.tutorialNote}>
          Security tip: keep portals on <strong>Active</strong> only while collaboration is ongoing; use <strong>Revoked</strong> to disable access instantly.
        </p>
      </section>

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
                      {portal.clientEmail ? <span className={styles.portalEmail}>{portal.clientEmail}</span> : null}
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
                      <button
                        onClick={() => handleRotateCode(portal._id)}
                        title="Rotate Code"
                        disabled={rotatingId === portal._id}
                      >
                        <RefreshCw size={16} />
                      </button>
                      <a href={`/portal/${portal.secretCode}`} target="_blank" rel="noopener noreferrer" title="View Portal">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                  <div className={styles.portalMeta}>
                    <span>Status: <strong style={{ color: "var(--accent-gold)" }}>{portal.status}</strong></span>
                    {portal.projectTitle ? <span>Project: {portal.projectTitle}</span> : null}
                    {portal.lastAccessed && (
                      <span>Last Seen: {new Date(portal.lastAccessed).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className={styles.statusActions}>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      disabled={statusUpdatingId === portal._id}
                      onClick={() => handleStatusChange(portal._id, "active")}
                    >
                      <CheckCircle2 size={14} /> Activate
                    </button>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      disabled={statusUpdatingId === portal._id}
                      onClick={() => handleStatusChange(portal._id, "on-hold")}
                    >
                      <PauseCircle size={14} /> On-Hold
                    </button>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      disabled={statusUpdatingId === portal._id}
                      onClick={() => handleStatusChange(portal._id, "completed")}
                    >
                      <CheckCircle2 size={14} /> Complete
                    </button>
                    <button
                      type="button"
                      className={styles.statusBtn}
                      disabled={statusUpdatingId === portal._id}
                      onClick={() => handleStatusChange(portal._id, "revoked")}
                    >
                      <Ban size={14} /> Revoke
                    </button>
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
