"use client";

import React, { useState } from "react";
import styles from "./ProjectManager.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, LayoutGrid } from "lucide-react";

export const ProjectManager = () => {
  const projects = useQuery(api.projects.list, { category: undefined });
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.del);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyProject = {
    title: "",
    slug: "",
    summary: "",
    description: "",
    role: "",
    stack: [] as string[],
    category: "Web",
    featured: false,
    status: "In Progress",
    coverImage: "",
  };

  const [formData, setFormData] = useState(emptyProject);

  const handleCreate = async () => {
    try {
      await createProject(formData);
      setIsAdding(false);
      setFormData(emptyProject);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject({ id });
    }
  };

  return (
    <div className={styles.manager}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <LayoutGrid className="gold-text" size={32} />
          <div>
            <h1>Project <span className="gold-text">Manager</span></h1>
            <p>Full CRUD control over your portfolio case studies.</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
          <Plus size={18} /> New Project
        </button>
      </header>

      <div className={styles.grid}>
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`${styles.card} ${styles.formCard}`}
            >
              <h3>Create New Project</h3>
              <div className={styles.form}>
                <input 
                  placeholder="Project Title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
                <input 
                  placeholder="Slug (e.g. my-awesome-project)" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
                <textarea 
                  placeholder="Summary" 
                  value={formData.summary} 
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                />
                <div className={styles.formActions}>
                  <button onClick={handleCreate} className={styles.confirmBtn}><Check size={18} /> Create</button>
                  <button onClick={() => setIsAdding(false)} className={styles.cancelBtn}><X size={18} /> Cancel</button>
                </div>
              </div>
            </motion.div>
          )}

          {projects?.map((project) => (
            <motion.div 
              key={project._id} 
              className={styles.card}
              layout
            >
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.category}>{project.category}</span>
                  <div className={styles.actions}>
                    <button onClick={() => handleDelete(project._id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                  </div>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <div className={styles.footer}>
                  <span className={project.featured ? "gold-text" : ""}>{project.featured ? "★ Featured" : "Standard"}</span>
                  <span>{project.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
