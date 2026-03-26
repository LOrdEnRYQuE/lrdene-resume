"use client";

import React, { useState } from "react";
import styles from "./OfferingsManager.module.css"; // Reuse styling for consistency
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Plus, Trash2, Edit3, Package } from "lucide-react";
import { useAdminMutation } from "@/hooks/useAdminMutation";

export const StoreManager = () => {
  const products = useQuery(api.products.listAll) || [];
  const createProduct = useAdminMutation(api.products.create);
  const updateProduct = useAdminMutation(api.products.update);
  const removeProduct = useAdminMutation(api.products.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const emptyProduct = {
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "USD",
    category: "Templates", // Default
    features: [] as string[],
    techStack: [] as string[],
    active: true,
    imageUrl: "",
    downloadUrl: "",
  };

  const [formData, setFormData] = useState(emptyProduct);

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateProduct({ id: editingId as any, ...formData });
        setEditingId(null);
      } else {
        await createProduct(formData);
      }
      setIsAdding(false);
      setFormData(emptyProduct);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      currency: product.currency,
      category: product.category,
      features: product.features || [],
      techStack: product.techStack || [],
      active: product.active,
      imageUrl: product.imageUrl || "",
      downloadUrl: product.downloadUrl || "",
    });
    setIsAdding(true);
  };

  return (
    <div className={styles.manager}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <ShoppingBag className="gold-text" size={32} />
          <div>
            <h1>Digital <span className="gold-text">Store</span></h1>
            <p>Manage your premium templates, UI kits, and digital tools.</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditingId(null); setFormData(emptyProduct); setIsAdding(true); }}>
          <Plus size={18} /> Add Product
        </button>
      </header>

      <div className={styles.grid}>
        <AnimatePresence>
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              className={styles.card}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className={styles.cardHeader}>
                <Package size={24} className="gold-text" />
                <div className={styles.badge}>{product.category}</div>
              </div>
              <h3>{product.name}</h3>
              <p className={styles.price}>
                {product.currency === "USD" ? "$" : product.currency}
                {product.price}
              </p>
              <p className={styles.desc}>{product.description}</p>
              <div className={styles.actions}>
                <button onClick={() => startEdit(product)} className={styles.editBtn}><Edit3 size={16} /></button>
                <button onClick={() => { if(confirm("Delete this product?")) removeProduct({ id: product._id })}} className={styles.deleteBtn}><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className={styles.modalOverlay}>
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={styles.modal}
              style={{ maxWidth: "600px" }}
            >
              <h2>{editingId ? "Edit Product" : "New Digital Tool"}</h2>
              <div className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Name</label>
                    <input 
                      placeholder="Product Name" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Slug</label>
                    <input 
                      placeholder="product-slug" 
                      value={formData.slug} 
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Price</label>
                    <input 
                      type="number"
                      placeholder="0.00" 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="Templates">Templates</option>
                      <option value="UI Kits">UI Kits</option>
                      <option value="Prompts">Prompts</option>
                      <option value="SaaS Starter">SaaS Starter</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Description</label>
                  <textarea 
                    placeholder="Describe your digital offering..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className={styles.modalActions}>
                  <button onClick={handleSave} className={styles.confirmBtn}>
                    {editingId ? "Update Product" : "Create Product"}
                  </button>
                  <button onClick={() => setIsAdding(false)} className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
