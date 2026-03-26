"use client";

import React, { useState } from "react";
import styles from "./JournalManager.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Edit3, Eye, Cloud } from "lucide-react";
import { useAdminMutation } from "@/hooks/useAdminMutation";

export const JournalManager = () => {
  const posts = useQuery(api.posts.list, { category: undefined });
  const createPost = useAdminMutation(api.posts.create);
  const updatePost = useAdminMutation(api.posts.update);
  const deletePost = useAdminMutation(api.posts.del);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const seedProjects = useMutation(api.seed.seedProjects);

  const emptyPost = {
    title: "",
    slug: "",
    category: "Strategy",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "Attila Lazar",
    published: false,
    readTime: "5 min",
  };

  const [formData, setFormData] = useState(emptyPost);

  const handleCreate = async () => {
    try {
      if (editingId) {
        await updatePost({ id: editingId as any, ...formData });
        setEditingId(null);
      } else {
        await createPost(formData);
      }
      setIsAdding(false);
      setFormData(emptyPost);
    } catch (error) {
      console.error("Failed to save post", error);
    }
  };

  const startEdit = (post: any) => {
    setEditingId(post._id);
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      author: post.author,
      published: post.published,
      readTime: post.readTime,
    });
    setIsAdding(true);
  };

  const handleSync = async () => {
    if (!confirm("This will synchronize default articles from the system. Continue?")) return;
    setIsSyncing(true);
    try {
      await seedProjects({ force: true });
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  const togglePublished = async (id: any, published: boolean) => {
    try {
      await updatePost({ id, published: !published });
    } catch (error) {
      console.error("Failed to update publish status", error);
    }
  };

  return (
    <div className={styles.manager}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <FileText className="gold-text" size={32} />
          <div>
            <h1>Journal <span className="gold-text">Manager</span></h1>
            <p>Draft, publish, and manage your editorial insights.</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.syncBtn} 
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Cloud size={16} className={isSyncing ? styles.syncingIcon : ""} />
            {isSyncing ? "Syncing..." : "Sync Journal"}
          </button>
          <button className={styles.addBtn} onClick={() => { setEditingId(null); setFormData(emptyPost); setIsAdding(true); }}>
            <Plus size={18} /> New Article
          </button>
        </div>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Status</th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts?.map((post) => (
                <tr key={post._id}>
                  <td>
                    <button 
                      onClick={() => togglePublished(post._id, post.published)}
                      className={post.published ? styles.statusPublished : styles.statusDraft}
                    >
                      {post.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className={styles.titleCell}>{post.title}</td>
                  <td>{post.category}</td>
                  <td>{post.date ? new Date(post.date).toLocaleDateString() : "N/A"}</td>
                  <td className={styles.actions}>
                    <button onClick={() => startEdit(post)} className={styles.editBtn} title="Edit Article"><Edit3 size={16} /></button>
                    <button onClick={() => { if(confirm("Delete this article?")) deletePost({ id: post._id })}} className={styles.deleteBtn} title="Delete Article"><Trash2 size={16} /></button>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className={styles.viewLink} title="View Live"><Eye size={16} /></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.mobileList}>
          {posts?.map((post) => (
            <article key={`mobile-${post._id}`} className={styles.mobileItem}>
              <div className={styles.mobileTop}>
                <button
                  onClick={() => togglePublished(post._id, post.published)}
                  className={post.published ? styles.statusPublished : styles.statusDraft}
                >
                  {post.published ? "Published" : "Draft"}
                </button>
                <span>{post.date ? new Date(post.date).toLocaleDateString() : "N/A"}</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.category}</p>
              <div className={styles.mobileActions}>
                <button onClick={() => startEdit(post)} className={styles.editBtn}><Edit3 size={16} /> Edit</button>
                <button onClick={() => { if(confirm("Delete this article?")) deletePost({ id: post._id })}} className={styles.deleteBtn}><Trash2 size={16} /> Delete</button>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className={styles.viewLink}><Eye size={16} /> View</a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalOverlay}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={styles.modal}
            >
              <h2>{editingId ? "Edit Article" : "Create New Article"}</h2>
              <div className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Title</label>
                    <input 
                      placeholder="Article Title" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Slug</label>
                    <input 
                      placeholder="slug-url-path" 
                      value={formData.slug} 
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Category</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Strategy">Strategy</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="AI">AI</option>
                      <option value="Insights">Insights</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label>Read Time</label>
                    <input 
                      placeholder="e.g. 5 min" 
                      value={formData.readTime} 
                      onChange={e => setFormData({...formData, readTime: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Excerpt</label>
                  <textarea 
                    placeholder="Short summary for the grid view..." 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className={styles.field}>
                  <label>Content (Full Article Body)</label>
                  <textarea 
                    placeholder="Article content..." 
                    className={styles.contentInput}
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})}
                  />
                </div>

                <div className={styles.field}>
                  <label>Cover Image URL</label>
                  <input 
                    placeholder="https://..." 
                    value={formData.coverImage} 
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button onClick={handleCreate} className={styles.confirmBtn}>
                    {editingId ? "Save Changes" : "Create Article"}
                  </button>
                  <button onClick={() => { setIsAdding(false); setEditingId(null); }} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
