"use client";

import styles from "./PortalDashboard.module.css";
import { ShieldAlert } from "lucide-react";

export const PortalError = ({ code }: { code: string }) => (
  <div className={styles.errorWrapper}>
    <ShieldAlert size={64} style={{ color: "var(--accent-gold)" }} />
    <h1>Access Volatility</h1>
    <p>The neural link <strong>{code}</strong> is unrecognized or structurally compromised.</p>
    <button 
        onClick={() => window.location.href = "/portal"} 
        className="magnetic-button"
        style={{ 
            marginTop: "2rem",
            background: "rgba(212, 175, 55, 0.1)",
            border: "1px solid var(--accent-gold)",
            color: "var(--accent-gold)",
            padding: "0.75rem 2rem",
            borderRadius: "4px"
        }}
    >
      Retry Connection
    </button>
  </div>
);
