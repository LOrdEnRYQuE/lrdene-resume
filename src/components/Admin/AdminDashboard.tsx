"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import styles from "./AdminDashboard.module.css";
import { useAdminQuery } from "@/hooks/useAdminQuery";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Briefcase,
  ClipboardCheck,
  Clock3,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  Users,
} from "lucide-react";

const STAGES = ["New", "Qualified", "Proposal", "Won", "Lost"];
const STAGE_FALLBACK: Record<string, string> = {
  new: "New",
  warm: "Qualified",
  hot: "Proposal",
  cold: "Lost",
};

function normalizeStage(status: string): string {
  return STAGE_FALLBACK[status] ?? status;
}

export const AdminDashboard = () => {
  const leadsQuery = useAdminQuery(api.leads.list) as any[] | undefined;
  const pipelineValue = (useAdminQuery(api.analytics_pro.getPipelineValue) as number | undefined) ?? 0;

  const metrics = useMemo(() => {
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;

    let newCount = 0;
    let wonCount = 0;
    let followUpsDue = 0;

    for (const lead of leadsQuery ?? []) {
      const stage = normalizeStage(lead.status);
      if (stage === "New") {
        newCount += 1;
      }
      if (stage === "Won") {
        wonCount += 1;
      }
      if ((stage === "New" || stage === "Qualified" || stage === "Proposal") && now - lead._creationTime > fortyEightHours) {
        followUpsDue += 1;
      }
    }

    const total = (leadsQuery ?? []).length;
    const winRate = total > 0 ? Math.round((wonCount / total) * 100) : 0;

    return {
      total,
      newCount,
      wonCount,
      followUpsDue,
      winRate,
    };
  }, [leadsQuery]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const stage of STAGES) {
      counts[stage] = 0;
    }

    for (const lead of leadsQuery ?? []) {
      const stage = normalizeStage(lead.status);
      counts[stage] = (counts[stage] ?? 0) + 1;
    }

    return counts;
  }, [leadsQuery]);

  const hotLeads = useMemo(() => {
    return [...(leadsQuery ?? [])]
      .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
      .slice(0, 6);
  }, [leadsQuery]);

  const actionCards = [
    {
      href: "/admin/leads",
      title: "Lead Desk",
      subtitle: "Triage new leads, update stage, add notes.",
      icon: Users,
    },
    {
      href: "/admin/portals",
      title: "Portal Architect",
      subtitle: "Provision secure project environments for your clients.",
      icon: FolderOpen,
    },
    {
      href: "/admin/demos",
      title: "Demo Desk",
      subtitle: "Map demos to buyer niches and proof points.",
      icon: Briefcase,
    },
    {
      href: "/admin/analytics",
      title: "Attribution Desk",
      subtitle: "Track traffic, source quality, and conversion flow.",
      icon: BarChart3,
    },
    {
      href: "/admin/inbox",
      title: "Sales Inbox",
      subtitle: "Control response channels and inbound messaging.",
      icon: MessageSquare,
    },
    {
      href: "/admin/site",
      title: "Site Control",
      subtitle: "Maintain global nav/footer/hero content blocks.",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className={styles.dashboard}>
      <section className={styles.commandBar}>
        <p className={styles.commandText}>
          Keep the pipeline moving with fast actions across leads, inbox, and delivery ops.
        </p>
        <div className={styles.commandActions}>
          <Link className={styles.primaryLink} href="/admin/leads">
            Open Lead Desk
            <ArrowRight size={16} />
          </Link>
          <Link className={styles.secondaryLink} href="/admin/inbox">
            Open Inbox
          </Link>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        <article className={styles.kpiCard}>
          <Users size={20} />
          <span className={styles.kpiLabel}>Total Leads</span>
          <strong>{metrics.total}</strong>
        </article>
        <article className={styles.kpiCard}>
          <Activity size={20} />
          <span className={styles.kpiLabel}>New Leads</span>
          <strong>{metrics.newCount}</strong>
        </article>
        <article className={styles.kpiCard}>
          <Clock3 size={20} />
          <span className={styles.kpiLabel}>Follow-ups Due</span>
          <strong>{metrics.followUpsDue}</strong>
        </article>
        <article className={styles.kpiCard}>
          <TrendingUp size={20} />
          <span className={styles.kpiLabel}>Win Rate</span>
          <strong>{metrics.winRate}%</strong>
        </article>
        <article className={styles.kpiCard}>
          <Briefcase size={20} />
          <span className={styles.kpiLabel}>Pipeline Value</span>
          <strong>${pipelineValue.toLocaleString()}</strong>
        </article>
      </section>

      <section className={styles.workspaceGrid}>
        <article className={styles.panel}>
          <h2>Pipeline Board</h2>
          <p>Current lead distribution by stage.</p>
          <div className={styles.stageGrid}>
            {STAGES.map((stage) => (
              <div key={stage} className={styles.stageCard}>
                <span>{stage}</span>
                <strong>{stageCounts[stage] ?? 0}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <h2>Priority Queue</h2>
          <p>Highest-intent leads based on AI score and priority.</p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Stage</th>
                  <th>Score</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {hotLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyRow}>
                      No leads available yet.
                    </td>
                  </tr>
                ) : (
                  hotLeads.map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>
                      <td>{normalizeStage(lead.status)}</td>
                      <td>{lead.aiScore ?? 0}</td>
                      <td>{lead.aiPriority ?? "Low"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className={styles.panel}>
        <h2>Office Workspaces</h2>
        <p>Structured desks for sales, operations, content, and delivery.</p>
        <div className={styles.actionGrid}>
          {actionCards.map((card) => (
            <Link key={card.href} href={card.href} className={styles.actionCard}>
              <card.icon size={18} />
              <h3>{card.title}</h3>
              <p>{card.subtitle}</p>
            </Link>
          ))}
        </div>
      </section>

      {metrics.followUpsDue > 0 ? (
        <section className={`${styles.panel} ${styles.alertPanel}`}>
          <AlertCircle size={18} />
          <p>
            {metrics.followUpsDue} lead(s) require follow-up. Prioritize these in <Link href="/admin/leads">Lead Desk</Link>.
          </p>
        </section>
      ) : null}
    </div>
  );
};
