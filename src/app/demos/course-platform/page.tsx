"use client";

import React, { useState } from "react";
import styles from "./course-platform.module.css";
import { motion } from "framer-motion";
import {
  Play, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Send,
  Bell,
  Search,
} from "lucide-react";
import LocaleLink from "@/components/I18n/LocaleLink";

export default function CoursePlatformDemo() {
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = [
    { title: "Introduction to Modern Web", duration: "10:24", completed: true },
    { title: "Working with Data Streams", duration: "15:45", completed: true },
    { title: "Architecture Patterns", duration: "22:10", completed: false },
    { title: "Building the Frontend", duration: "18:30", completed: false },
    { title: "Testing and Deployment", duration: "12:05", completed: false },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>LearnFlow</div>
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 40px' }}>
          <div className={styles.inputWrapper}>
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Search lessons..." className={styles.input} />
          </div>
        </div>
        <div className={styles.userNav}>
          <LocaleLink href="/demos" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>Showcase</LocaleLink>
          <Bell size={20} color="#64748b" />
          <div className={styles.avatar}></div>
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Course Content</div>
          <div className={styles.lessonList}>
            {lessons.map((lesson, idx) => (
              <div 
                key={idx} 
                className={`${styles.lessonItem} ${currentLesson === idx ? styles.activeLesson : ''}`}
                onClick={() => setCurrentLesson(idx)}
              >
                {lesson.completed ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <Play size={18} color={currentLesson === idx ? '#4f46e5' : '#94a3b8'} />
                )}
                <div style={{ flex: 1 }}>{lesson.title}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{lesson.duration}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.content}>
          <motion.div 
            key={currentLesson}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.videoPlaceholder}>
              <Play size={64} className={styles.playIcon} />
            </div>
            
            <div className={styles.lessonInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4f46e5', marginBottom: '8px' }}>
                <BookOpen size={16} />
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Module 3: Infrastructure</span>
              </div>
              <h1 className={styles.lessonTitle}>{lessons[currentLesson].title}</h1>
              <p className={styles.lessonDescription}>
                In this lesson, we explore the fundamental concepts of technical systems. 
                Learn how to structure your projects for long-term growth and high performance.
              </p>
              
              <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                <button style={{ 
                  background: '#4f46e5', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Mark as Complete
                </button>
                <button style={{ 
                  background: 'transparent', 
                  color: '#1e293b', 
                  border: '1px solid #e2e8f0', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  Next Lesson
                </button>
              </div>
            </div>
          </motion.div>
        </main>

        {/* AI Sidecar */}
        <aside className={styles.sidecar}>
          <div className={styles.aiHeader}>
            <Sparkles size={18} color="#4f46e5" />
            AI Study Partner
          </div>
          <div className={styles.chatArea}>
            <div className={`${styles.message} ${styles.bot}`}>
              Hi! I'm your AI tutor. Stuck on something in the video? Just ask!
            </div>
            <div className={`${styles.message} ${styles.user}`}>
              Can you explain what "Data Streams" mean in this context?
            </div>
            <div className={`${styles.message} ${styles.bot}`}>
              Certainly! In this lesson, Data Streams refer to the constant flow of information between your app and the server...
            </div>
          </div>
          <div className={styles.chatInput}>
            <div className={styles.inputWrapper}>
              <input type="text" placeholder="Ask a question..." className={styles.input} />
              <button className={styles.sendBtn}><Send size={14} /></button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
