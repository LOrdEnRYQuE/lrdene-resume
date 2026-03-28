"use client";

import React from "react";
import ui from "./AdminPrimitives.module.css";
import styles from "./AnalyticsDashboard.module.css";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MousePointer2, 
  Clock,
  Eye,
  TrendingUp,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useAdminQuery } from "@/hooks/useAdminQuery";

function sortCounter(counter: Record<string, number>) {
  return Object.entries(counter).sort(([, a], [, b]) => b - a);
}

function safeRatio(value: number, total: number) {
  if (!total) return 0;
  return value / total;
}

function formatPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value: number) {
  return Intl.NumberFormat("en-US").format(value);
}

export const AnalyticsDashboard = () => {
  const [consentRangeDays, setConsentRangeDays] = React.useState<number | null>(30);
  const stats = useAdminQuery(api.analytics.getOverview) as
    | {
        totalViews: number;
        uniqueVisitors: number;
        viewsByRoute: Record<string, number>;
        recentEvents: any[];
        acquisition: {
          bySource: Record<string, number>;
          byMedium: Record<string, number>;
          byCampaign: Record<string, number>;
          byLandingPage: Record<string, number>;
          conversionRate: number;
        };
        salesIntent: {
          byProjectType: Record<string, number>;
          byBudget: Record<string, number>;
          byTimeline: Record<string, number>;
          byPromotionTier: Record<string, number>;
        };
        funnel: {
          formStarts: number;
          formStepViews: number;
          formSubmissions: number;
          ctaClicks: number;
          serviceViews: number;
          projectViews: number;
          demoOpens: number;
        };
      }
    | undefined;

  if (!stats) return <div className="loading">Initializing Neural Insights...</div>;
  const viewsByRoute = stats.viewsByRoute ?? {};
  const routeRanking = sortCounter(viewsByRoute);
  const recentEvents = stats.recentEvents ?? [];
  const acquisition = stats.acquisition ?? {
    bySource: {},
    byMedium: {},
    byCampaign: {},
    byLandingPage: {},
    conversionRate: 0,
  };
  const salesIntent = stats.salesIntent ?? {
    byProjectType: {},
    byBudget: {},
    byTimeline: {},
    byPromotionTier: {},
  };
  const funnel = stats.funnel ?? {
    formStarts: 0,
    formStepViews: 0,
    formSubmissions: 0,
    ctaClicks: 0,
    serviceViews: 0,
    projectViews: 0,
    demoOpens: 0,
  };
  const consent = {
    total: 0,
    analyticsAccepted: 0,
    analyticsRejected: 0,
    marketingAccepted: 0,
    marketingRejected: 0,
    analyticsOptInRate: 0,
    marketingOptInRate: 0,
    bySource: {},
    byLocale: {},
    byDevice: {},
    recent: [] as Array<{
      _id: string;
      timestamp: number;
      source: string;
      locale: string;
      analytics: boolean;
      marketing: boolean;
      device?: string;
    }>,
  };
  const consentRangeLabel =
    consentRangeDays === null ? "All time" : `Last ${consentRangeDays} days`;
  const topRouteViews = routeRanking[0]?.[1] ?? 0;
  const avgViewsPerVisitor = safeRatio(stats.totalViews, stats.uniqueVisitors || 1);
  const topRouteShare = safeRatio(topRouteViews, stats.totalViews);
  const contactCompletion = safeRatio(funnel.formSubmissions, funnel.formStarts);
  const ctaToFormStart = safeRatio(funnel.formStarts, funnel.ctaClicks);
  const sourceRanking = sortCounter(acquisition.bySource);
  const landingRanking = sortCounter(acquisition.byLandingPage);

  const diagnostics = [
    {
      label: "Contact Form Completion",
      value: formatPct(contactCompletion),
      tone: contactCompletion >= 0.35 ? "good" : contactCompletion >= 0.2 ? "warn" : "bad",
      hint: `${formatNumber(funnel.formSubmissions)} submissions from ${formatNumber(funnel.formStarts)} starts`,
    },
    {
      label: "CTA -> Form Start",
      value: formatPct(ctaToFormStart),
      tone: ctaToFormStart >= 0.3 ? "good" : ctaToFormStart >= 0.15 ? "warn" : "bad",
      hint: `${formatNumber(funnel.formStarts)} starts from ${formatNumber(funnel.ctaClicks)} CTA clicks`,
    },
    {
      label: "Route Concentration Risk",
      value: formatPct(topRouteShare),
      tone: topRouteShare <= 0.35 ? "good" : topRouteShare <= 0.55 ? "warn" : "bad",
      hint: `Top route contributes ${formatNumber(topRouteViews)} views`,
    },
  ] as const;

  return (
    <div className={ui.shell}>
      <section className={ui.section}>
        <div className={ui.titleWrap}>
          <h2 className={ui.title}>Neural <span className="gold-text">Insights</span></h2>
          <p className={ui.subtitle}>Traffic quality, conversion pressure points, and intent signals.</p>
        </div>
      </section>

      <div className={ui.grid3}>
        <motion.div 
          className={ui.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Eye className="gold-text" />
          <span className={ui.kpiLabel}>Total Impressions</span>
          <div className={ui.kpiValue}>{formatNumber(stats.totalViews)}</div>
        </motion.div>

        <motion.div 
          className={ui.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Users className="gold-text" />
          <span className={ui.kpiLabel}>Unique Visitors</span>
          <div className={ui.kpiValue}>{formatNumber(stats.uniqueVisitors)}</div>
        </motion.div>

        <motion.div 
          className={ui.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MousePointer2 className="gold-text" />
          <span className={ui.kpiLabel}>Views / Visitor</span>
          <div className={ui.kpiValue}>{avgViewsPerVisitor.toFixed(2)}</div>
        </motion.div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Gauge size={18} className="gold-text" /> Signal Health</h3>
            <span className={styles.microPill}>{Object.keys(viewsByRoute).length} active routes</span>
          </div>
          <div className={styles.healthList}>
            {diagnostics.map((item) => (
              <div key={item.label} className={styles.healthRow}>
                <div>
                  <p className={styles.healthLabel}>{item.label}</p>
                  <p className={styles.healthHint}>{item.hint}</p>
                </div>
                <div className={styles.healthValueWrap}>
                  <span className={styles.healthValue}>{item.value}</span>
                  <span className={`${styles.healthState} ${item.tone === "good" ? styles.good : item.tone === "warn" ? styles.warn : styles.bad}`}>
                    {item.tone === "good" ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                    {item.tone === "good" ? "Healthy" : item.tone === "warn" ? "Watch" : "Action"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><TrendingUp size={18} className="gold-text" /> Conversion Funnel</h3>
          </div>
          <div className={styles.funnelList}>
            {[
              { label: "CTA Clicks", value: funnel.ctaClicks, base: Math.max(funnel.ctaClicks, 1) },
              { label: "Form Starts", value: funnel.formStarts, base: Math.max(funnel.ctaClicks, 1) },
              { label: "Step Views", value: funnel.formStepViews, base: Math.max(funnel.ctaClicks, 1) },
              { label: "Submissions", value: funnel.formSubmissions, base: Math.max(funnel.ctaClicks, 1) },
            ].map((step) => (
              <div key={step.label} className={styles.funnelRow}>
                <div className={styles.funnelMeta}>
                  <span>{step.label}</span>
                  <span>{formatNumber(step.value)} ({formatPct(safeRatio(step.value, step.base))})</span>
                </div>
                <div className={styles.funnelTrack}>
                  <div className={styles.funnelFill} style={{ width: `${Math.max(5, safeRatio(step.value, step.base) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><BarChart3 size={18} className="gold-text" /> Top Routes</h3>
          </div>
          <div className={ui.tableWrap}>
            <table className={ui.table}>
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Views</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {routeRanking.slice(0, 10).map(([route, count]) => (
                  <tr key={route}>
                    <td>{route}</td>
                    <td>{formatNumber(count)}</td>
                    <td>{formatPct(safeRatio(count, stats.totalViews))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {routeRanking.length === 0 ? <p className={ui.subtitle}>No route impressions yet.</p> : null}
          </div>
        </div>

        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Clock size={18} className="gold-text" /> Live Feed</h3>
            <span className={styles.microPill}>{recentEvents.length} recent events</span>
          </div>
          <div className={ui.list}>
            {recentEvents.map((event: any) => (
              <div key={event._id} className={ui.listRow}>
                <span className={ui.listRowLabel}>
                  {event.type.toUpperCase()} · {event.label} on {event.route}
                </span>
                <span className={ui.pill}>
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <p className={ui.subtitle}>
                No recent events recorded.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <h3 className={ui.title}><BarChart3 size={18} className="gold-text" /> Acquisition</h3>
          <p className={ui.subtitle}>
            Session conversion rate: {acquisition.conversionRate.toFixed(1)}%
          </p>
          <div className={ui.list}>
            {sourceRanking.slice(0, 6).map(([source, count]) => (
              <div key={source} className={ui.listRow}>
                <span className={ui.listRowLabel}>Source: {source}</span>
                <span className={ui.pill}>{count} sessions</span>
              </div>
            ))}
            {sortCounter(acquisition.byMedium).slice(0, 4).map(([medium, count]) => (
              <div key={medium} className={ui.listRow}>
                <span className={ui.listRowLabel}>Medium: {medium}</span>
                <span className={ui.pill}>{count} sessions</span>
              </div>
            ))}
            {sourceRanking.length === 0 && <p className={ui.subtitle}>No acquisition source data yet.</p>}
          </div>
        </div>

        <div className={ui.card}>
          <h3 className={ui.title}><MousePointer2 size={18} className="gold-text" /> High-Intent Segments</h3>
          <div className={ui.list}>
            {sortCounter(salesIntent.byProjectType).slice(0, 6).map(([projectType, count]) => (
              <div key={projectType} className={ui.listRow}>
                <span className={ui.listRowLabel}>Project Type: {projectType}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {sortCounter(salesIntent.byBudget).slice(0, 4).map(([budget, count]) => (
              <div key={budget} className={ui.listRow}>
                <span className={ui.listRowLabel}>Budget: {budget}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {sortCounter(salesIntent.byPromotionTier).slice(0, 4).map(([tier, count]) => (
              <div key={tier} className={ui.listRow}>
                <span className={ui.listRowLabel}>Promotion: {tier}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {landingRanking.slice(0, 3).map(([landing, count]) => (
              <div key={landing} className={ui.listRow}>
                <span className={ui.listRowLabel}>Landing: {landing}</span>
                <span className={ui.pill}>{count} sessions</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={ui.card}>
        <h3 className={ui.title}><Clock size={18} className="gold-text" /> Funnel</h3>
        <div className={ui.grid2}>
          <div className={ui.list}>
            <div className={ui.listRow}><span className={ui.listRowLabel}>CTA Clicks</span><span className={ui.pill}>{formatNumber(funnel.ctaClicks)}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Service Views</span><span className={ui.pill}>{formatNumber(funnel.serviceViews)}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Project Views</span><span className={ui.pill}>{formatNumber(funnel.projectViews)}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Demo Opens</span><span className={ui.pill}>{formatNumber(funnel.demoOpens)}</span></div>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Form Starts</span><span className={ui.pill}>{formatNumber(funnel.formStarts)}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Step Views</span><span className={ui.pill}>{formatNumber(funnel.formStepViews)}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Submissions</span><span className={ui.pill}>{formatNumber(funnel.formSubmissions)}</span></div>
          </div>
        </div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Users size={18} className="gold-text" /> Consent Signals</h3>
            <div className={ui.chipGroup}>
              <button
                type="button"
                onClick={() => setConsentRangeDays(7)}
                className={`${ui.chipButton} ${consentRangeDays === 7 ? ui.chipButtonActive : ""}`}
              >
                7d
              </button>
              <button
                type="button"
                onClick={() => setConsentRangeDays(30)}
                className={`${ui.chipButton} ${consentRangeDays === 30 ? ui.chipButtonActive : ""}`}
              >
                30d
              </button>
              <button
                type="button"
                onClick={() => setConsentRangeDays(90)}
                className={`${ui.chipButton} ${consentRangeDays === 90 ? ui.chipButtonActive : ""}`}
              >
                90d
              </button>
              <button
                type="button"
                onClick={() => setConsentRangeDays(null)}
                className={`${ui.chipButton} ${consentRangeDays === null ? ui.chipButtonActive : ""}`}
              >
                All
              </button>
            </div>
          </div>
          <p className={ui.subtitle}>
            {consentRangeLabel} · Consent stats are temporarily unavailable in this build.
          </p>
          <div className={ui.list}>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Total Consent Events</span>
              <span className={ui.pill}>{consent.total}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Analytics Accepted</span>
              <span className={ui.pill}>{consent.analyticsAccepted}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Analytics Rejected</span>
              <span className={ui.pill}>{consent.analyticsRejected}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Marketing Accepted</span>
              <span className={ui.pill}>{consent.marketingAccepted}</span>
            </div>
            <div className={ui.listRow}>
              <span className={ui.listRowLabel}>Marketing Rejected</span>
              <span className={ui.pill}>{consent.marketingRejected}</span>
            </div>
          </div>
        </div>

        <div className={ui.card}>
          <h3 className={ui.title}><BarChart3 size={18} className="gold-text" /> Consent Segments</h3>
          <div className={ui.list}>
            {sortCounter(consent.bySource).slice(0, 4).map(([source, count]) => (
              <div key={`source-${source}`} className={ui.listRow}>
                <span className={ui.listRowLabel}>Source: {source}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {sortCounter(consent.byLocale).slice(0, 4).map(([locale, count]) => (
              <div key={`locale-${locale}`} className={ui.listRow}>
                <span className={ui.listRowLabel}>Locale: {locale}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {sortCounter(consent.byDevice).slice(0, 4).map(([device, count]) => (
              <div key={`device-${device}`} className={ui.listRow}>
                <span className={ui.listRowLabel}>Device: {device}</span>
                <span className={ui.pill}>{count}</span>
              </div>
            ))}
            {consent.total === 0 && (
              <p className={ui.subtitle}>No consent logs yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className={ui.card}>
        <h3 className={ui.title}><Clock size={18} className="gold-text" /> Recent Consent Changes</h3>
        <div className={ui.list}>
          {consent.recent.map((entry) => (
            <div key={entry._id} className={ui.listRow}>
              <span className={ui.listRowLabel}>
                {entry.locale.toUpperCase()} · {entry.source} · analytics {entry.analytics ? "on" : "off"} · marketing{" "}
                {entry.marketing ? "on" : "off"}
              </span>
              <span className={ui.pill}>
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
          {consent.recent.length === 0 && <p className={ui.subtitle}>No recent consent changes.</p>}
        </div>
      </div>
    </div>
  );
};
