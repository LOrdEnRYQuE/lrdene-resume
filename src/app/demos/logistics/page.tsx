"use client";

import React from "react";
import styles from "./logistics.module.css";
import { motion } from "framer-motion";
import {
  Truck, 
  Package, 
  BarChart2, 
  Users, 
  Settings, 
  Search, 
  Filter,
  ArrowUpRight,
  Navigation,
  Box
} from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";

export default function LogisticsDemo() {
  const shipments = [
    { id: "TRK-00124", dest: "Berlin, DE", status: "In Transit", eta: "2h 15m", priority: "High" },
    { id: "TRK-00125", dest: "Paris, FR", status: "Out for Delivery", eta: "45m", priority: "Normal" },
    { id: "TRK-00126", dest: "London, UK", status: "Processing", eta: "Next Day", priority: "Low" },
    { id: "TRK-00127", dest: "Madrid, ES", status: "In Transit", eta: "5h 20m", priority: "Normal" },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Truck size={24} />
          RouteMaster
        </div>
        <div className={styles.navItem}><BarChart2 size={18} /> Global Analytics</div>
        <div className={`${styles.navItem} ${styles.activeNavItem}`}><Navigation size={18} /> Live Fleet</div>
        <div className={styles.navItem}><Package size={18} /> Shipments</div>
        <div className={styles.navItem}><Users size={18} /> Drivers</div>
        <div className={styles.navItem}><Box size={18} /> Inventory</div>
        <div style={{ marginTop: 'auto' }}>
          <div className={styles.navItem}><Settings size={18} /> Settings</div>
          <LocaleLink href="/demos" className={styles.navItem}>
             Exit Demo
          </LocaleLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Live Operations</h1>
            <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>Monitoring 124 active vehicles across EU Central</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div className={styles.statusBadge}>Fleet: Optimal</div>
            <div className={styles.statusBadge} style={{ background: '#af3232' }}>Weather Alert: UK</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Deliveries</div>
            <div className={styles.statVal}>1,280</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active Shipments</div>
            <div className={styles.statVal}>412</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>On-Time Rating</div>
            <div className={styles.statVal} style={{ color: '#238636' }}>98.2%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Fuel Efficiency</div>
            <div className={styles.statVal}>8.4 L/100km</div>
          </div>
        </div>

        {/* Map Area */}
        <div className={styles.mapArea}>
          <div style={{ padding: '20px', fontWeight: '600', color: '#8b949e' }}>Satellite Overview</div>
          <motion.div 
            className={styles.marker} 
            style={{ top: '40%', left: '30%' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <motion.div 
            className={styles.marker} 
            style={{ top: '60%', left: '70%', background: '#ff7b72' }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: '#21262d', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', border: '1px solid #30363d' }}>
             Zoom: 14.5x | Lat: 52.5200 | Lng: 13.4050
          </div>
        </div>

        {/* Tracking Card */}
        <div className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Priority Tracking</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Search size={18} color="#8b949e" />
              <Filter size={18} color="#8b949e" />
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Shipment ID</th>
                <th className={styles.th}>Destination</th>
                <th className={styles.th}>Current Status</th>
                <th className={styles.th}>ETA</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment, idx) => (
                <tr key={idx}>
                  <td className={styles.td}><span className={styles.shipmentId}>{shipment.id}</span></td>
                  <td className={styles.td}>{shipment.dest}</td>
                  <td className={styles.td}>
                    <span style={{ 
                      color: shipment.status === 'Out for Delivery' ? '#238636' : '#58a6ff',
                      fontWeight: '600'
                    }}>{shipment.status}</span>
                  </td>
                  <td className={styles.td}>{shipment.eta}</td>
                  <td className={styles.td}><ArrowUpRight size={16} color="#8b949e" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
