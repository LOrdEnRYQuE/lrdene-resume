"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import styles from "./OfferingsManager.module.css";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Zap, 
  Package, 
  Truck, 
  X,
  Code2
} from "lucide-react";
import { useAdminMutation } from "@/hooks/useAdminMutation";

type Tab = "services" | "products";

export const OfferingsManager = ({ initialTab = "services" }: { initialTab?: Tab }) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const services = useQuery(api.services.listAll);
  const products = useQuery(api.products.listAll);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<any>(null);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === "services" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <Zap size={18} /> Services
          </button>
          <button 
            className={`${styles.tab} ${activeTab === "products" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("products")}
          >
            <Package size={18} /> Digital Store
          </button>
        </div>
        
        <button className={styles.addBtn} onClick={() => { setEditingId(null); setIsEditing(true); }}>
          <Plus size={18} /> New {activeTab === "services" ? "Service" : "Product"}
        </button>
      </header>

      <div className={styles.grid}>
        {activeTab === "services" ? (
          services?.map(service => (
            <div key={service._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <h3>{service.title}</h3>
                  <span className={styles.priceTag}>{service.price}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => { setEditingId(service); setIsEditing(true); }}><Edit3 size={16} /></button>
                  <button className={styles.delete}><Trash2 size={16} /></button>
                </div>
              </div>
              <p className={styles.desc}>{service.description}</p>
              <div className={styles.meta}>
                <span><Truck size={14} /> {service.deliveryTime}</span>
                <span className={styles.statusBadge}>{service.status}</span>
              </div>
            </div>
          ))
        ) : (
          products?.map(product => (
            <div key={product._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <h3>{product.name}</h3>
                  <span className={styles.priceTag}>${product.price}</span>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => { setEditingId(product); setIsEditing(true); }}><Edit3 size={16} /></button>
                  <button className={styles.delete}><Trash2 size={16} /></button>
                </div>
              </div>
              <p className={styles.desc}>{product.description}</p>
              <div className={styles.meta}>
                <span><Code2 size={14} /> {product.category}</span>
                <span className={styles.statusBadge}>{product.active ? "Active" : "Draft"}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditing && (
        <OfferingsModal 
          type={activeTab} 
          data={editingId} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
};

const OfferingsModal = ({ type, data, onClose }: { type: Tab, data: any, onClose: () => void }) => {
  const createService = useAdminMutation(api.services.create);
  const updateService = useAdminMutation(api.services.update);
  const createProduct = useAdminMutation(api.products.create);
  const updateProduct = useAdminMutation(api.products.update);

  const [formData, setFormData] = useState(data || (type === "services" ? {
    title: "",
    slug: "",
    description: "",
    iconName: "Zap",
    price: "",
    deliveryTime: "",
    features: [],
    process: [],
    status: "active",
    category: "Development"
  } : {
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "USD",
    category: "Templates",
    features: [],
    techStack: [],
    active: true
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "services") {
      if (data) await updateService({ id: data._id, ...formData });
      else await createService(formData);
    } else {
      if (data) await updateProduct({ id: data._id, ...formData });
      else await createProduct(formData);
    }
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{data ? "Edit" : "Create"} {type === "services" ? "Service" : "Product"}</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>{type === "services" ? "Title" : "Name"}</label>
            <input 
              value={type === "services" ? formData.title : formData.name}
              onChange={e => setFormData({...formData, [type === "services" ? "title" : "name"]: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Slug</label>
            <input 
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Price {type === "products" ? "(Numerical)" : "(String)"}</label>
            <input 
              value={formData.price}
              onChange={e => setFormData({...formData, price: type === "products" ? Number(e.target.value) : e.target.value})}
              required
            />
          </div>
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>Save Offering</button>
          </div>
        </form>
      </div>
    </div>
  );
};
