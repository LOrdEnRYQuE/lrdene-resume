"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./ProductManager.module.css";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  ShoppingBag, 
  Star,
  PlusCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminMutation } from "@/hooks/useAdminMutation";

const CATEGORIES = ["Templates", "UI Kits", "Prompts", "Icons", "E-books"];

export const ProductManager = () => {
  const products = useQuery(api.products.listAll) || [];
  const createProduct = useAdminMutation(api.products.create);
  const updateProduct = useAdminMutation(api.products.update);
  const deleteProduct = useAdminMutation(api.products.remove);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "USD",
    category: "Templates",
    imageUrl: "",
    features: [] as string[],
    techStack: [] as string[],
    downloadUrl: "",
    active: true,
    featured: false
  });

  const [techInput, setTechInput] = useState("");

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "USD",
      category: "Templates",
      imageUrl: "",
      features: [],
      techStack: [],
      downloadUrl: "",
      active: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      imageUrl: product.imageUrl || "",
      features: product.features || [],
      techStack: product.techStack || [],
      downloadUrl: product.downloadUrl || "",
      active: product.active,
      featured: product.featured || false
    });
    setIsModalOpen(true);
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setFormData({ ...formData, techStack: [...formData.techStack, techInput] });
    setTechInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct._id,
          ...formData
        });
      } else {
        await createProduct(formData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Error saving product.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Digital <span className="gold-text">Store</span></h1>
          <p>Manage your premium digital assets and templates.</p>
        </div>
        <button className={styles.addBtn} onClick={handleOpenCreate}>
          <Plus size={20} /> Add Product
        </button>
      </header>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <motion.div 
            key={product._id}
            className={styles.productCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.imageContainer}>
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className={styles.placeholder}>
                  <ShoppingBag size={40} />
                </div>
              )}
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>
            
            <div className={styles.cardContent}>
              <div className={styles.titleArea}>
                <h3>{product.name}</h3>
                {product.featured && <Star size={14} className="gold-text" fill="currentColor" />}
              </div>
              <p className={styles.description}>{product.description}</p>
              
              <div className={styles.meta}>
                <span className={styles.price}>
                  {product.currency === "USD" ? "$" : ""}{product.price.toLocaleString()}
                </span>
                <span className={product.active ? styles.active : styles.inactive}>
                  {product.active ? "Active" : "Hidden"}
                </span>
              </div>

              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => handleOpenEdit(product)}>
                  <Edit2 size={16} /> Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => deleteProduct({ id: product._id })}>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <h2>{editingProduct ? "Edit Product" : "New Product Listing"}</h2>
              
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Product Name</label>
                    <input 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Premium React Template"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Slug</label>
                    <input 
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="react-template"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Price</label>
                    <input 
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Cover Image URL</label>
                  <input 
                    value={formData.imageUrl}
                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.section}>
                  <h3>Tech Stack</h3>
                  <div className={styles.tagInput}>
                    <input 
                      value={techInput}
                      onChange={e => setTechInput(e.target.value)}
                      placeholder="Press add..."
                    />
                    <button type="button" onClick={addTech}><PlusCircle size={20} /></button>
                  </div>
                  <div className={styles.tagCloud}>
                    {formData.techStack.map((t, i) => (
                      <span key={i} className={styles.tag}>
                        {t} <XCircle size={14} onClick={() => setFormData({ ...formData, techStack: formData.techStack.filter((_, idx) => idx !== i) })} />
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label>
                    <input 
                      type="checkbox"
                      checked={formData.featured}
                      onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured Product
                  </label>
                  <label>
                    <input 
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({ ...formData, active: e.target.checked })}
                    />
                    Active Listing
                  </label>
                </div>

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    {editingProduct ? "Update Asset" : "Publish Asset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
