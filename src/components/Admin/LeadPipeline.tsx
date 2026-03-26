"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./LeadPipeline.module.css";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, MessageSquare, DollarSign, Clock, Search, BrainCircuit, Star } from "lucide-react";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { useAdminQuery } from "@/hooks/useAdminQuery";

const STATUS_COLORS: Record<string, string> = {
  "New": "#3b82f6",
  "Qualified": "#10b981",
  "Proposal": "#8b5cf6",
  "Won": "#059669",
  "Lost": "#ef4444",
};

const KANBAN_STAGES = ["New", "Qualified", "Proposal", "Won", "Lost"];

const PRIORITY_COLORS: Record<string, string> = {
  "High": "linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)",
  "Medium": "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
  "Low": "rgba(255,255,255,0.1)",
};

const NICHE_PRESETS = [
  { key: "all", label: "All" },
  { key: "qr-vcard", label: "vCard" },
  { key: "qr-biolink", label: "BioLink" },
  { key: "qr-business-profile", label: "Business Profile" },
  { key: "qr-campaign", label: "Campaign" },
  { key: "qr-operations", label: "Operations" },
  { key: "qr-solutions", label: "QR General" },
];

export const LeadPipeline = () => {
  const leadsQuery = useAdminQuery(api.leads.list) as any[] | undefined;
  const leads = useMemo(() => leadsQuery ?? [], [leadsQuery]);
  const updateStatus = useAdminMutation(api.leads.updateStatus);
  const addNote = useAdminMutation(api.leads.addNote);
  const convertLead = useAdminMutation(api.projects.convertFromLead);
  const prefs = useAdminQuery(api.adminPreferences.get) as { leadNichePreset?: string; leadViewMode?: "list" | "kanban" } | undefined;
  const updateLeadNichePreset = useAdminMutation(api.adminPreferences.updateLeadNichePreset);
  const updateLeadViewMode = useAdminMutation(api.adminPreferences.updateLeadViewMode);

  const [search, setSearch] = useState("");
  const [nichePreset, setNichePreset] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const hasAppliedServerPreset = useRef(false);
  const lastPersistedPreset = useRef<string>("all");
  const lastPersistedViewMode = useRef<"list" | "kanban">("kanban");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", projectType: "", budget: "", message: "" });
  const createLead = useMutation(api.leads.create);

  useEffect(() => {
    if (prefs === undefined || hasAppliedServerPreset.current) return;
    const serverPreset = prefs?.leadNichePreset || "all";
    const serverViewMode = prefs?.leadViewMode === "list" ? "list" : "kanban";
    setNichePreset(serverPreset);
    setViewMode(serverViewMode);
    lastPersistedPreset.current = serverPreset;
    lastPersistedViewMode.current = serverViewMode;
    hasAppliedServerPreset.current = true;
  }, [prefs]);

  useEffect(() => {
    if (!hasAppliedServerPreset.current) return;
    if (lastPersistedPreset.current === nichePreset) return;
    lastPersistedPreset.current = nichePreset;
    void updateLeadNichePreset({ leadNichePreset: nichePreset });
  }, [nichePreset, updateLeadNichePreset]);

  useEffect(() => {
    if (!hasAppliedServerPreset.current) return;
    if (lastPersistedViewMode.current === viewMode) return;
    lastPersistedViewMode.current = viewMode;
    void updateLeadViewMode({ leadViewMode: viewMode });
  }, [viewMode, updateLeadViewMode]);

  const searchMatchedLeads = useMemo(() => leads?.filter((l) => {
    const normalizedSearch = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(normalizedSearch) ||
      l.email.toLowerCase().includes(normalizedSearch)
    );
  }), [leads, search]);

  const nicheCounts = useMemo(() => {
    const counts: Record<string, number> = { all: searchMatchedLeads?.length || 0 };
    for (const lead of searchMatchedLeads || []) {
      const key = (lead.niche || "").toLowerCase();
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [searchMatchedLeads]);

  const filteredLeads = searchMatchedLeads?.filter((l) =>
    nichePreset === "all" ? true : (l.niche || "").toLowerCase() === nichePreset
  );

  const selectedLead = leads?.find(l => l._id === selectedLeadId);

  const handleStatusChange = async (id: any, status: string) => {
    await updateStatus({ id, status });
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !newNote.trim()) return;
    await addNote({ id: selectedLeadId as any, note: newNote });
    setNewNote("");
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    await createLead(newLead);
    setIsAddModalOpen(false);
    setNewLead({ name: "", email: "", projectType: "", budget: "", message: "" });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <Activity className="gold-text" size={32} />
          <div>
            <h1>Lead <span className="gold-text">Pipeline</span></h1>
            <p>Track inquiries, qualify prospects, and manage follow-ups.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button 
              className={viewMode === "list" ? styles.activeToggle : ""} 
              onClick={() => setViewMode("list")}
            >
              List
            </button>
            <button 
              className={viewMode === "kanban" ? styles.activeToggle : ""} 
              onClick={() => setViewMode("kanban")}
            >
              Kanban
            </button>
          </div>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              placeholder="Search leads..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className={styles.nicheFilterBar}>
            {NICHE_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                className={`${styles.nicheFilterBtn} ${nichePreset === preset.key ? styles.activeNicheFilter : ""}`}
                onClick={() => setNichePreset(preset.key)}
              >
                {preset.label} ({nicheCounts[preset.key] || 0})
              </button>
            ))}
          </div>
          <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
            <Star size={18} /> Add Lead
          </button>
        </div>
      </header>

      <div className={viewMode === "list" ? styles.mainLayout : styles.kanbanLayout}>
        {viewMode === "list" ? (
          <>
            <div className={styles.sidebar}>
              {filteredLeads?.map(lead => (
                <motion.div 
                  key={lead._id}
                  className={`${styles.leadItem} ${selectedLeadId === lead._id ? styles.active : ""}`}
                  onClick={() => setSelectedLeadId(lead._id)}
                  whileHover={{ x: 5 }}
                >
                  <div className={styles.leadHeader}>
                    <h4>{lead.name}</h4>
                    <div className={styles.badges}>
                      {lead.niche && <span className={styles.miniNicheBadge}>{lead.niche}</span>}
                      {lead.aiPriority === "High" && <Star size={12} className={styles.starIcon} />}
                      <span className={styles.statusBadge} style={{ backgroundColor: STATUS_COLORS[lead.status] || "#666" }}>
                        {lead.status}
                      </span>
                    </div>
                  </div>
                  <div className={styles.leadSub}>
                    <p>{lead.projectType} • {lead.budget}</p>
                    {lead.aiScore && (
                      <span className={styles.miniScore}>{lead.aiScore}%</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.content}>
              <AnimatePresence mode="wait">
                {selectedLead ? (
                  <motion.div 
                    key={selectedLead._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={styles.details}
                  >
                    <div className={styles.detailsHeader}>
                      <div className={styles.primaryInfo}>
                        <div className={styles.nameRow}>
                          <h2>{selectedLead.name}</h2>
                          {selectedLead.aiPriority && (
                            <span 
                              className={styles.priorityLabel} 
                              style={{ background: PRIORITY_COLORS[selectedLead.aiPriority] }}
                            >
                              {selectedLead.aiPriority} Priority
                            </span>
                          )}
                        </div>
                        <div className={styles.contactActions}>
                          <a href={`mailto:${selectedLead.email}`} className={styles.email}>
                            <Mail size={16} /> {selectedLead.email}
                          </a>
                          <button className={styles.replyBtn} onClick={() => alert("Email Engine Ready. RESEND_API_KEY required.")}>
                            <MessageSquare size={16} /> Command Reply
                          </button>
                          <button 
                            className={styles.actionBtn} 
                            onClick={async () => {
                              if (confirm("Initialize this lead as a new project draft?")) {
                                try {
                                  await convertLead({ leadId: selectedLead._id });
                                  alert("Lead converted to project draft successfully!");
                                } catch (err) {
                                  console.error(err);
                                  alert("Failed to convert lead.");
                                }
                              }
                            }}
                          >
                            <DollarSign size={16} /> Convert to Project
                          </button>
                        </div>
                      </div>
                      <div className={styles.aiStats}>
                        <div className={styles.scoreCircle}>
                          <BrainCircuit size={20} className="gold-text" />
                          <div className={styles.scoreInfo}>
                            <span className={styles.scoreValue}>{selectedLead.aiScore || 0}%</span>
                            <span className={styles.scoreLabel}>Neural Score</span>
                          </div>
                        </div>
                        <div className={styles.statusSelect}>
                          <select 
                            value={selectedLead.status}
                            onChange={e => handleStatusChange(selectedLead._id, e.target.value)}
                          >
                            {KANBAN_STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={styles.metaRow}>
                      <div className={styles.metaItem}>
                        <MessageSquare size={18} />
                        <span>{selectedLead.projectType}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <DollarSign size={18} />
                        <span>{selectedLead.budget}</span>
                      </div>
                      {selectedLead.niche && (
                        <div className={styles.metaItem}>
                          <BrainCircuit size={18} />
                          <span>{selectedLead.niche}</span>
                        </div>
                      )}
                      {selectedLead.timeline && (
                        <div className={styles.metaItem}>
                          <Clock size={18} />
                          <span>{selectedLead.timeline}</span>
                        </div>
                      )}
                    </div>

                    <div className={styles.messageBox}>
                      <h3>Original Message</h3>
                      <p>{selectedLead.message}</p>
                    </div>

                    <div className={styles.notesSection}>
                      <h3>Internal Notes</h3>
                      <div className={styles.notesList}>
                        {selectedLead.notes?.map((note: any, i: number) => (
                          <div key={i} className={styles.note}>
                            <p>{note.body}</p>
                            <span>{new Date(note.timestamp).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={handleAddNote} className={styles.noteForm}>
                        <textarea 
                          placeholder="Add a follow-up note..." 
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                        />
                        <button type="submit">Add Note</button>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <div className={styles.emptyState}>
                    <Mail size={48} className="gold-text" style={{ opacity: 0.2 }} />
                    <p>Select a lead to view details and manage the pipeline.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className={styles.kanbanBoard}>
            {KANBAN_STAGES.map(stage => (
              <div key={stage} className={styles.kanbanColumn}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitle}>
                    <span className={styles.dot} style={{ backgroundColor: STATUS_COLORS[stage] }} />
                    <h3>{stage}</h3>
                  </div>
                  <span className={styles.count}>
                    {filteredLeads?.filter(l => l.status === stage).length}
                  </span>
                </div>
                <div className={styles.columnContent}>
                  {filteredLeads?.filter(l => l.status === stage).map(lead => (
                    <motion.div 
                      key={lead._id}
                      className={styles.kanbanCard}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => { setSelectedLeadId(lead._id); setViewMode("list"); }}
                    >
                      <div className={styles.cardHeader}>
                        <h4>{lead.name}</h4>
                        {lead.aiPriority === "High" && <Star size={12} className="gold-text" />}
                      </div>
                      <p className={styles.cardProject}>{lead.projectType}</p>
                      <div className={styles.cardFooter}>
                        <span className={styles.cardBudget}>{lead.budget}</span>
                        {lead.aiScore && (
                          <span className={styles.cardScore}>{lead.aiScore}%</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2>Manual <span className="gold-text">Lead Intake</span></h2>
              <form onSubmit={handleCreateLead}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Client Name</label>
                    <input required value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Project Type</label>
                    <select value={newLead.projectType} onChange={e => setNewLead({...newLead, projectType: e.target.value})}>
                      <option value="AI Dashboard">AI Dashboard</option>
                      <option value="SaaS Platform">SaaS Platform</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Mobile App">Mobile App</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Budget</label>
                    <input placeholder="e.g. $5k - $10k" value={newLead.budget} onChange={e => setNewLead({...newLead, budget: e.target.value})} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Initial Message / Requirements</label>
                  <textarea required value={newLead.message} onChange={e => setNewLead({...newLead, message: e.target.value})} />
                </div>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className={styles.primaryBtn}>Create Entry</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
