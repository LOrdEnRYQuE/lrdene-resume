"use client";

import React, { useState } from "react";
import styles from "./BlogManager.module.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Edit3, Check, X, Eye } from "lucide-react";

export const BlogManager = () => {
  const posts = useQuery(api.posts.list, { category: undefined });
  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const deletePost = useMutation(api.posts.del);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      await createPost(formData);
      setIsAdding(false);
      setFormData(emptyPost);
    } catch (error) {
      console.error("Failed to create post", error);
    }
  };

  const togglePublished = async (id: any, current: boolean) => {
    await updatePost({ id, published: !current });
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
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
          <Plus size={18} /> New Article
        </button>
      </header>

      <div className={styles.tableCard}>
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
                <td>{new Date(post.date).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <button className={styles.editBtn}><Edit3 size={16} /></button>
                  <button onClick={() => deletePost({ id: post._id })} className={styles.deleteBtn}><Trash2 size={16} /></button>
                  <a href={`/blog/${post.slug}`} target="_blank" className={styles.viewLink}><Eye size={16} /></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <h2>Create New Article</h2>
              <div className={styles.form}>
                <input 
                  placeholder="Article Title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
                <input 
                  placeholder="Slug" 
                  value={formData.slug} 
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Strategy">Strategy</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="AI">AI</option>
                </select>
                <textarea 
                  placeholder="Excerpt" 
                  value={formData.excerpt} 
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                />
                <textarea 
                  placeholder="Content (Markdown supported style)" 
                  className={styles.contentInput}
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
                <input 
                  placeholder="Cover Image URL" 
                  value={formData.coverImage} 
                  onChange={e => setFormData({...formData, coverImage: e.target.value})}
                />
                <div className={styles.modalActions}>
                  <button onClick={handleCreate} className={styles.confirmBtn}>Create Article</button>
                  <button onClick={() => setIsAdding(false)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
