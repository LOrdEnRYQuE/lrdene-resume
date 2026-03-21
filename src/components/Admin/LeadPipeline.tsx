"use client";

import React, { useState } from "react";
import styles from "./LeadPipeline.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, MessageSquare, Trash2, Calendar, DollarSign, CheckCircle, Clock, Search } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "New": "#3b82f6",
  "Contacted": "#f59e0b",
  "Qualified": "#10b981",
  "Proposal Sent": "#8b5cf6",
  "Closed": "#059669",
  "Lost": "#ef4444",
};

export const LeadPipeline = () => {
  const leads = useQuery(api.leads.list, {}) || [];
  const updateStatus = useMutation(api.leads.updateStatus);
  const addNote = useMutation(api.leads.addNote);
  const deleteLead = useMutation(api.leads.del);

  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  const filteredLeads = leads?.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
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
        <div className={styles.searchBar}>
          <Search size={18} />
          <input 
            placeholder="Search leads..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.mainLayout}>
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
                <span className={styles.statusBadge} style={{ backgroundColor: STATUS_COLORS[lead.status] || "#666" }}>
                  {lead.status}
                </span>
              </div>
              <p>{lead.projectType} • {lead.budget}</p>
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
                    <h2>{selectedLead.name}</h2>
                    <a href={`mailto:${selectedLead.email}`} className={styles.email}>
                      <Mail size={16} /> {selectedLead.email}
                    </a>
                  </div>
                  <div className={styles.statusSelect}>
                    <select 
                      value={selectedLead.status}
                      onChange={e => handleStatusChange(selectedLead._id, e.target.value)}
                    >
                      {Object.keys(STATUS_COLORS).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
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
      </div>
    </div>
  );
};
