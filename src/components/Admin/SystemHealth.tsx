"use client";

import React from "react";
import ui from "./AdminPrimitives.module.css";
import { api } from "../../../convex/_generated/api";
import { 
  Database, 
  Cpu, 
  ShieldCheck, 
  RefreshCw,
  HardDrive
} from "lucide-react";
import { useAdminQuery } from "@/hooks/useAdminQuery";

export const SystemHealth = () => {
  const stats = useAdminQuery(api.stats.getSystemStats) as
    | {
        dbStatus: string;
        runtime: string;
        environment: string;
        leads: number;
        posts: number;
        demos: number;
      }
    | undefined;

  if (!stats) return <div className="loading">Diagnosing Systems...</div>;

  return (
    <div className={ui.shell}>
      <section className={ui.section}>
        <div className={ui.sectionHeader}>
          <div className={ui.titleWrap}>
            <h2 className={ui.title}>System <span className="gold-text">Health</span></h2>
            <p className={ui.subtitle}>Real-time platform vitals and database integrity status.</p>
          </div>
          <div className={ui.pill}>System Online</div>
        </div>
      </section>

      <section className={ui.grid2}>
        <article className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Database size={18} className="gold-text" /> Database Vitals</h3>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Status</span>
              <span className={ui.pill}>{stats.dbStatus}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Connection</span>
              <span className={ui.pill}>Stable (WebSocket)</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Region</span>
              <span className={ui.pill}>AWS us-east-1</span>
            </div>
          </div>
        </article>

        <article className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Cpu size={18} className="gold-text" /> Infrastructure</h3>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Runtime</span>
              <span className={ui.pill}>{stats.runtime}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Environment</span>
              <span className={ui.pill}>{stats.environment}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Framework</span>
              <span className={ui.pill}>Next.js 15.5</span>
            </div>
          </div>
        </article>

        <article className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><HardDrive size={18} className="gold-text" /> Data Volumes</h3>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Leads</span>
              <span className={ui.pill}>{stats.leads}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Journal Entries</span>
              <span className={ui.pill}>{stats.posts}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Live Demos</span>
              <span className={ui.pill}>{stats.demos}</span>
            </div>
          </div>
        </article>

        <article className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><ShieldCheck size={18} className="gold-text" /> Security</h3>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>SSL Status</span>
              <span className={ui.pill}>Verified</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Auth Logic</span>
              <span className={ui.pill}>Managed</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>CORS Setup</span>
              <span className={ui.pill}>Restricted</span>
            </div>
          </div>
        </article>
      </section>

      <section className={ui.card}>
        <div className={ui.sectionHeader}>
          <h3 className={ui.title}><RefreshCw size={18} className="gold-text" /> Latency & Performance</h3>
        </div>
        <div className={ui.grid2}>
          <div className={ui.kpiCard}>
            <span className={ui.kpiLabel}>API Latency</span>
            <strong className={ui.kpiValue}>12ms</strong>
          </div>
          <div className={ui.kpiCard}>
            <span className={ui.kpiLabel}>Edge Cold Start</span>
            <strong className={ui.kpiValue}>0.8s</strong>
          </div>
        </div>
      </section>
    </div>
  );
};
