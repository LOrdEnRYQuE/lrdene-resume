"use client";

import React, { useState } from "react";
import styles from "./ai-dashboard.module.css";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  Settings, 
  AlertCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function AIDashboardDemo() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.container}>
      {/* Local Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>NeuralNexus AI</div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Docs</a>
          <a href="#" className={styles.navLink}>API</a>
          <Link href="/demos" className={styles.navLink}>Exit Demo</Link>
        </div>
        <button style={{ 
          background: "#00f2fe", 
          color: "#000", 
          border: "none", 
          padding: "8px 16px", 
          borderRadius: "6px",
          fontWeight: "600"
        }}>
          Pro Account
        </button>
      </nav>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={`${styles.sidebarItem} ${activeTab === 'overview' ? styles.activeSidebarItem : ''}`} onClick={() => setActiveTab('overview')}>
            <BarChart3 size={18} /> Overview
          </div>
          <div className={styles.sidebarItem}><Cpu size={18} /> Models</div>
          <div className={styles.sidebarItem}><Database size={18} /> Datasets</div>
          <div className={styles.sidebarItem}><ShieldCheck size={18} /> Security</div>
          <div className={styles.sidebarItem}><Zap size={18} /> Workflows</div>
          <div style={{ marginTop: 'auto' }} className={styles.sidebarItem}><Settings size={18} /> Settings</div>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.title}>System Intelligence</h1>
            <p className={styles.subtitle}>Real-time monitoring for your AI infrastructure</p>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -5, borderColor: "#00f2fe" }}
            >
              <div className={styles.statLabel}>Processing Power</div>
              <div className={styles.statValue}>14.2 TFLOPS</div>
              <span className={styles.trendUp}>+12.4%</span>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -5, borderColor: "#00f2fe" }}
            >
              <div className={styles.statLabel}>Active Neurons</div>
              <div className={styles.statValue}>1.2B</div>
              <span className={styles.trendUp}>Stable</span>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -5, borderColor: "#00f2fe" }}
            >
              <div className={styles.statLabel}>Avg Latency</div>
              <div className={styles.statValue}>24ms</div>
              <span className={styles.trendDown}>-4.2ms</span>
            </motion.div>
            <motion.div 
              className={styles.statCard}
              whileHover={{ y: -5, borderColor: "#00f2fe" }}
            >
              <div className={styles.statLabel}>Monthly Cost</div>
              <div className={styles.statValue}>$1,240</div>
              <span className={styles.trendDown}>Efficiency +8%</span>
            </motion.div>
          </div>

          {/* Main Chart Section */}
          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <h3>Token Consumption</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Last 24 Hours</span>
                  <ExternalLink size={14} color="#666" />
                </div>
              </div>
              <div className={styles.placeholderChart}>
                <motion.div 
                  className={styles.line}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3>Model Performance</h3>
              <div className={styles.modelList}>
                <div>
                  <div className={styles.modelItem}>
                    <span>Nexus-Prime V1</span>
                    <span>98.2%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div className={styles.progressFill} style={{ width: '98.2%' }} />
                  </div>
                </div>
                <div>
                  <div className={styles.modelItem}>
                    <span>Lite-Neural 7B</span>
                    <span>94.5%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div className={styles.progressFill} style={{ width: '94.5%', background: '#4facfe' }} />
                  </div>
                </div>
                <div>
                  <div className={styles.modelItem}>
                    <span>Vision-Sync 3.0</span>
                    <span>89.1%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div className={styles.progressFill} style={{ width: '89.1%', background: '#ff3366' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '30px', padding: '15px', background: 'rgba(255, 170, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 170, 0, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffa500', marginBottom: '5px' }}>
                  <AlertCircle size={16} />
                  <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Resource Alert</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>Dataset "Alpha-Train" is nearing capacity. Optimization recommended.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
