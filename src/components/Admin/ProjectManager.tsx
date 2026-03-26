"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./ProjectManager.module.css";
import { Plus, Edit2, Trash2, Star, ExternalLink, X, Globe, Activity, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";

const CATEGORIES = ["AI", "Web", "Mobile", "Open Source", "Design", "Automation"];

export const ProjectManager = () => {
  const projects = useQuery(api.projects.list, {}) || [];
  const createProject = useAdminMutation(api.projects.create);
  const updateProject = useAdminMutation(api.projects.update);
  const deleteProject = useAdminMutation(api.projects.remove);
  const seedProjects = useAdminMutation(api.projects.seedAllProjects);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleSync = async () => {
    if (confirm("Import default projects into the database for management?")) {
      setIsSyncing(true);
      try {
        await seedProjects({});
        alert("Projects synchronized successfully.");
      } catch (err) {
        console.error(err);
        alert("Sync failed.");
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    category: "AI",
    role: "Lead Developer",
    stack: ["Next.js", "Convex", "Framer Motion"],
    featured: false,
    status: "active",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
    videoUrl: "",
    liveUrl: "",
    githubUrl: "",
    gallery: [] as string[],
    year: new Date().getFullYear().toString()
  });

  const handleOpenEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      summary: project.summary,
      description: project.description,
      category: project.category,
      role: project.role,
      stack: project.stack || [],
      featured: project.featured,
      status: project.status,
      coverImage: project.coverImage,
      videoUrl: project.videoUrl || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      gallery: project.gallery || [],
      year: project.year || ""
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      description: "",
      category: "AI",
      role: "Lead Developer",
      stack: ["Next.js"],
      featured: false,
      status: "active",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
      videoUrl: "",
      liveUrl: "",
      githubUrl: "",
      gallery: [],
      year: new Date().getFullYear().toString()
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject({
          id: editingProject._id,
          ...formData
        });
      } else {
        await createProject(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save project:", err);
      alert("Error saving project. Check console.");
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject({ id });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Project <span className="gold-text">Manager</span></h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage your showcase portfolio.</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn} 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Zap size={20} className={isSyncing ? "animate-spin" : ""} /> 
            {isSyncing ? "Syncing..." : "Sync Projects"}
          </button>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            <Plus size={20} /> Add Project
          </button>
        </div>
      </header>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <motion.div 
            key={project._id} 
            className={styles.projectCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.cardHeader}>
              <div>
                <h3>{project.title}</h3>
                <span className={styles.statusBadge}>{project.status}</span>
              </div>
              {project.featured && <Star size={16} className="gold-text" fill="currentColor" />}
            </div>

            <div className={styles.meta}>
              <span><strong>Slug:</strong> {project.slug}</span>
              <span><strong>Category:</strong> {project.category}</span>
              <span><strong>Year:</strong> {project.year}</span>
            </div>

            <div className={styles.actions}>
              <div className={styles.links}>
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo"><ExternalLink size={16} /></a>}
                {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="Source Code"><Globe size={16} /></a>}
                {project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" title="Case Study Video"><Activity size={16} /></a>}
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.editBtn} onClick={() => handleOpenEdit(project)}>
                  <Edit2 size={16} />
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(project._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className={styles.header}>
                <h2>{editingProject ? "Edit Project" : "New Project"}</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Slug</label>
                    <input 
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="project-slug"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Summary</label>
                  <input 
                    required
                    value={formData.summary}
                    onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Short punchy line"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Full project story..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Year</label>
                    <input 
                      value={formData.year}
                      onChange={e => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Live Demo URL</label>
                    <input 
                      value={formData.liveUrl}
                      onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>GitHub URL</label>
                    <input 
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Case Study Video (Vimeo/YouTube)</label>
                  <input 
                    value={formData.videoUrl}
                    onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.checkbox} onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
                  <div style={{ 
                    width: 20, height: 20, 
                    border: "2px solid var(--accent-gold)", 
                    borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: formData.featured ? "var(--accent-gold)" : "transparent"
                  }}>
                    {formData.featured && <Plus size={14} color="#000" />}
                  </div>
                  <label style={{ cursor: "pointer" }}>Featured Project</label>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className={styles.saveBtn}>Save Project</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
