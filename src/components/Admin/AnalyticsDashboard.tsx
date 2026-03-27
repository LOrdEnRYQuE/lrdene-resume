"use client";

import React from "react";
import ui from "./AdminPrimitives.module.css";
import { api } from "../../../convex/_generated/api";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  MousePointer2, 
  Clock,
  Eye
} from "lucide-react";
import { useAdminQuery } from "@/hooks/useAdminQuery";

function sortCounter(counter: Record<string, number>) {
  return Object.entries(counter).sort(([, a], [, b]) => b - a);
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

  return (
    <div className={ui.shell}>
      <section className={ui.section}>
        <div className={ui.titleWrap}>
          <h2 className={ui.title}>Neural <span className="gold-text">Insights</span></h2>
          <p className={ui.subtitle}>Real-time user engagement and traffic flow.</p>
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
          <div className={ui.kpiValue}>{stats.totalViews}</div>
        </motion.div>

        <motion.div 
          className={ui.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Users className="gold-text" />
          <span className={ui.kpiLabel}>Unique Sessions</span>
          <div className={ui.kpiValue}>{stats.uniqueVisitors}</div>
        </motion.div>

        <motion.div 
          className={ui.kpiCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MousePointer2 className="gold-text" />
          <span className={ui.kpiLabel}>Active Routes</span>
          <div className={ui.kpiValue}>{Object.keys(viewsByRoute).length}</div>
        </motion.div>
      </div>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><BarChart3 size={18} className="gold-text" /> Popular Content</h3>
          </div>
          <div className={ui.list}>
            {Object.entries(viewsByRoute)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([route, count]) => (
                <div key={route} className={ui.listRow}>
                  <span className={ui.listRowLabel}>{route}</span>
                  <span className={ui.pill}>{count as number} views</span>
                </div>
              ))}
          </div>
        </div>

        <div className={ui.card}>
          <div className={ui.sectionHeader}>
            <h3 className={ui.title}><Clock size={18} className="gold-text" /> Live Feed</h3>
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
            Session conversion rate: {acquisition.conversionRate}%
          </p>
          <div className={ui.list}>
            {sortCounter(acquisition.bySource).slice(0, 6).map(([source, count]) => (
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
          </div>
        </div>

        <div className={ui.card}>
          <h3 className={ui.title}><MousePointer2 size={18} className="gold-text" /> Sales Intent</h3>
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
          </div>
        </div>
      </div>

      <div className={ui.card}>
        <h3 className={ui.title}><Clock size={18} className="gold-text" /> Funnel</h3>
        <div className={ui.grid2}>
          <div className={ui.list}>
            <div className={ui.listRow}><span className={ui.listRowLabel}>CTA Clicks</span><span className={ui.pill}>{funnel.ctaClicks}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Service Views</span><span className={ui.pill}>{funnel.serviceViews}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Project Views</span><span className={ui.pill}>{funnel.projectViews}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Demo Opens</span><span className={ui.pill}>{funnel.demoOpens}</span></div>
          </div>
          <div className={ui.list}>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Form Starts</span><span className={ui.pill}>{funnel.formStarts}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Step Views</span><span className={ui.pill}>{funnel.formStepViews}</span></div>
            <div className={ui.listRow}><span className={ui.listRowLabel}>Contact Submissions</span><span className={ui.pill}>{funnel.formSubmissions}</span></div>
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
