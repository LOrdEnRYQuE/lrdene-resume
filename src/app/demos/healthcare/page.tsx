"use client";

import React from "react";
import styles from "./healthcare.module.css";
import { motion } from "framer-motion";
import {
  Heart, 
  PlusCircle, 
  MessageSquare, 
  Calendar, 
  Activity, 
  Clock, 
  User, 
  ArrowRight,
  Stethoscope,
  ShieldCheck,
  FileText
} from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";

export default function HealthcareDemo() {
  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <ShieldCheck size={28} />
          HealCore
        </div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.navLink}>Dashboard</a>
          <a href="#" className={styles.navLink}>Medical Records</a>
          <a href="#" className={styles.navLink}>Billing</a>
          <LocaleLink href="/demos" className={styles.navLink}>Exit Demo</LocaleLink>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right', display: 'none' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>David Miller</div>
            <div style={{ fontSize: '0.7rem', color: '#718096' }}>Patient ID: #4492</div>
          </div>
          <div style={{ width: '40px', height: '40px', background: '#edf2f7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="#718096" />
          </div>
        </div>
      </nav>

      <div className={styles.layout}>
        {/* Main Section */}
        <main className={styles.main}>
          <motion.div 
            className={styles.welcomeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={styles.welcomeTitle}>Good morning, David.</h1>
            <p>You have a follow-up appointment with Dr. Sarah Smith at 2:00 PM today.</p>
          </motion.div>

          <div className={styles.healthStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Heart Rate</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <div className={styles.statValue}>72</div>
                <div style={{ fontSize: '0.7rem', color: '#718096' }}>BPM</div>
              </div>
              <Activity size={14} color="#f56565" style={{ marginTop: 'auto' }} />
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Blood Sugar</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <div className={styles.statValue}>98</div>
                <div style={{ fontSize: '0.7rem', color: '#718096' }}>mg/dL</div>
              </div>
              <Clock size={14} color="#3182ce" style={{ marginTop: 'auto' }} />
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Sleep Quality</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                <div className={styles.statValue}>8.5</div>
                <div style={{ fontSize: '0.7rem', color: '#718096' }}>Hours</div>
              </div>
              <Heart size={14} color="#38b2ac" style={{ marginTop: 'auto' }} />
            </div>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} color="#3182ce" />
              Upcoming Appointments
            </h2>
            <div className={styles.appointmentCard}>
              <div className={styles.dateBox}>
                <div className={styles.dateMonth}>MAR</div>
                <div>24</div>
              </div>
              <div className={styles.aptInfo}>
                <div className={styles.aptDoctor}>Dr. Sarah Smith</div>
                <div className={styles.aptSpecialty}>General Practitioner • Virtual Call</div>
              </div>
              <button style={{ 
                background: '#ebf8ff', 
                color: '#3182ce', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Join Call
              </button>
            </div>
            <div className={styles.appointmentCard}>
              <div className={styles.dateBox} style={{ background: '#f7fafc', color: '#718096' }}>
                <div className={styles.dateMonth}>APR</div>
                <div>02</div>
              </div>
              <div className={styles.aptInfo}>
                <div className={styles.aptDoctor}>Dr. Michael Chen</div>
                <div className={styles.aptSpecialty}>Cardiologist • In-Person</div>
              </div>
              <button style={{ 
                background: 'transparent', 
                color: '#718096', 
                border: '1px solid #edf2f7', 
                padding: '10px 20px', 
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Reschedule
              </button>
            </div>
          </div>
        </main>

        {/* Action Sidebar */}
        <aside className={styles.sidebar}>
          <motion.div className={styles.actionCard} whileHover={{ x: 5 }}>
            <div className={styles.actionIcon}>
              <Stethoscope size={24} />
            </div>
            <div>
              <div className={styles.actionTitle}>Symptom Checker</div>
              <div className={styles.actionDesc}>AI-powered initial health assessment.</div>
            </div>
            <ArrowRight size={18} color="#718096" />
          </motion.div>

          <motion.div className={styles.actionCard} whileHover={{ x: 5 }} style={{ borderLeft: '4px solid #38b2ac' }}>
            <div className={styles.actionIcon} style={{ background: '#e6fffa', color: '#319795' }}>
              <MessageSquare size={24} />
            </div>
            <div>
              <div className={styles.actionTitle}>Direct Message</div>
              <div className={styles.actionDesc}>Talk with your medical care team.</div>
            </div>
            <ArrowRight size={18} color="#718096" />
          </motion.div>

          <motion.div className={styles.actionCard} whileHover={{ x: 5 }}>
            <div className={styles.actionIcon} style={{ background: '#ebf4ff', color: '#4299e1' }}>
              <FileText size={24} />
            </div>
            <div>
              <div className={styles.actionTitle}>Lab Results</div>
              <div className={styles.actionDesc}>View and download latest reports.</div>
            </div>
            <ArrowRight size={18} color="#718096" />
          </motion.div>

          <div style={{ padding: '20px', background: '#f7fafc', borderRadius: '12px', textAlign: 'center' }}>
            <PlusCircle size={32} color="#3182ce" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>New Appointment</div>
            <p style={{ fontSize: '0.8rem', color: '#718096' }}>Schedule a visit with any specialist in our network.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
