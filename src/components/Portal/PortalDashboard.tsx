"use client";

import React, { useEffect, useState } from "react";
import styles from "./PortalDashboard.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  MessageSquare, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Send,
  User,
  ShieldAlert,
  File,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ChevronRight
} from "lucide-react";

interface PortalDashboardProps {
  code: string;
}

type PortalView = Doc<"clientPortals"> & {
  clientName?: string;
  projectTitle: string;
  projectStatus: string;
};

const ClientAssetList = ({ portalId, code }: { portalId: Id<"clientPortals">; code: string }) => {
  const assets = useQuery(api.portals.getPortalAssets, { portalId, code });
  const updateStatus = useMutation(api.portals.updateAssetStatus);

  if (!assets || assets.length === 0) return null;

  return (
    <div className={styles.assetList}>
      {assets.map((asset) => (
        <div key={asset._id} className={styles.assetItem}>
          <div className={styles.assetMain}>
            <div className={styles.assetInfo}>
              <File size={18} className="gold-text" />
              <div>
                <strong className={styles.assetName}>{asset.name}</strong>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <span className={`${styles.statusBadge} ${styles[asset.status]}`}>
                    {asset.status.toUpperCase()}
                  </span>
                  <span className={styles.assetDate}>
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.assetActions}>
              <a
                href={asset.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.previewLink}
              >
                Preview <ExternalLink size={12} />
              </a>
              {asset.status === "pending" && (
                <div className={styles.approvalGroup}>
                  <button 
                    onClick={() => updateStatus({ assetId: asset._id, status: "approved", code })}
                    className={styles.approveBtn}
                    title="Approve Asset"
                  >
                    <ThumbsUp size={14} /> Approve
                  </button>
                  <button 
                    onClick={() => {
                      const feedback = prompt("What needs to be changed?");
                      if (feedback) updateStatus({ assetId: asset._id, status: "revised", feedback, code });
                    }}
                    className={styles.reviseBtn}
                    title="Request Revision"
                  >
                    <ThumbsDown size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
          {asset.feedback && (
            <div className={styles.assetFeedback}>
              <ShieldAlert size={12} />
              <p><strong>Note:</strong> {asset.feedback}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const PortalDashboard = ({ code }: PortalDashboardProps) => {
  const [portal, setPortal] = useState<PortalView | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const validateAccess = useMutation(api.portals.validatePortalAccess);
  const messages = useQuery(api.portals.getPortalMessages, portal ? { portalId: portal._id, code } : "skip");
  const postMessage = useMutation(api.portals.addMessage);

  useEffect(() => {
    let cancelled = false;

    const resolveAccess = async () => {
      setIsValidating(true);
      setValidationError(null);
      try {
        const fingerprint = `portal:${window.navigator.userAgent}:${window.navigator.language}`;
        const result = await validateAccess({ code, fingerprint });
        if (cancelled) return;
        if (!result.ok) {
          setValidationError(result.error);
          setPortal(null);
          return;
        }
        setPortal(result.portal);
      } catch (error) {
        if (!cancelled) {
          setValidationError("Unable to validate portal access right now.");
          setPortal(null);
        }
      } finally {
        if (!cancelled) {
          setIsValidating(false);
        }
      }
    };

    void resolveAccess();
    return () => {
      cancelled = true;
    };
  }, [code, validateAccess]);

  if (validationError) {
    return (
      <div className={styles.errorWrapper}>
        <ShieldAlert size={64} color="var(--error)" />
        <h1>Access Denied</h1>
        <p>{validationError}</p>
        <button onClick={() => window.location.href = "/portal"} className="magnetic-button">
          Try Again
        </button>
      </div>
    );
  }

  if (isValidating) return <div className="loading">Initializing Secure Session...</div>;
  if (!portal) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await postMessage({
      portalId: portal._id,
      code,
      author: "client",
      content: message,
    });
    setMessage("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          <span className={styles.badge}>Live Project Portal</span>
          <h1>Welcome, <span className="gold-text">{portal.clientName}</span></h1>
          <p>Project: <strong>{portal.projectTitle}</strong></p>
        </div>
        <div className={styles.status}>
          <div className={styles.statusDot} />
          <span>Status: <strong>{portal.projectStatus}</strong></span>
        </div>
      </header>

      <div className={styles.grid}>
        <main className={styles.mainContent}>
          <section className={styles.card}>
            <h2><History size={20} className="gold-text" /> Project Roadmap</h2>
            <div className={styles.roadmap}>
              <div className={styles.step}>
                <CheckCircle2 size={24} color="#10b981" />
                <div className={styles.stepInfo}>
                  <h3>Discovery & Strategy</h3>
                  <p>Requirements finalized and architecture approved.</p>
                </div>
              </div>
              <div className={styles.step}>
                <Clock size={24} color="var(--accent-gold)" />
                <div className={styles.stepInfo}>
                  <h3>Active Development</h3>
                  <p>Building core features and integrating neural engines.</p>
                </div>
              </div>
              <div className={styles.step} style={{ opacity: 0.4 }}>
                <div className={styles.dot} />
                <div className={styles.stepInfo}>
                  <h3>Deployment & Handoff</h3>
                  <p>Final testing, optimization, and production launch.</p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2><ExternalLink size={20} className="gold-text" /> Private Demos</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Secure links to review the latest interactive builds.
            </p>
            <div className={styles.demoList}>
              <div className={styles.demoItem}>
                <div className={styles.demoMeta}>
                  <strong>Neural-Engine Alpha</strong>
                  <span>v0.4.2 • Updated 2 hours ago</span>
                </div>
                <a href="#" className={styles.viewBtn}>Launch Demo <ExternalLink size={14} /></a>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h2><ShieldCheck size={20} className="gold-text" /> Asset Approvals</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Review and approve project assets, designs, and deliverables.
            </p>
            <ClientAssetList portalId={portal._id} code={code} />
          </section>
        </main>

        <aside className={styles.sidebar}>
          <div className={`${styles.card} ${styles.chatCard}`}>
            <h2><MessageSquare size={20} className="gold-text" /> Feedback Loop</h2>
            <div className={styles.messageList}>
              <AnimatePresence initial={false}>
                {(messages || []).map((msg: any) => (
                  <motion.div 
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${styles.message} ${msg.author === 'client' ? styles.clientMsg : styles.adminMsg}`}
                  >
                    <div className={styles.msgHeader}>
                      <User size={12} />
                      <span>{msg.author === 'client' ? 'You' : 'Project Manager'}</span>
                    </div>
                    <p>{msg.content}</p>
                    <span className={styles.msgTime}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {(messages || []).length === 0 && (
                <p className={styles.emptyChat}>No messages yet. Send a query to your manager!</p>
              )}
            </div>

            <form onSubmit={handleSendMessage} className={styles.chatForm}>
              <input 
                type="text" 
                placeholder="Compose feedback..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className={styles.sendBtn}>
                <Send size={18} />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};
