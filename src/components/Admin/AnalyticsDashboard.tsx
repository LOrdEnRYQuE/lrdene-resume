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
    </div>
  );
};
