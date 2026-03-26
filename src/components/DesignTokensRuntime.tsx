"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function DesignTokensRuntime() {
  const tokens = useQuery(api.pages.getGlobalDesignTokens);

  useEffect(() => {
    if (!tokens) {
      return;
    }

    const root = document.documentElement;
    const radius = tokens.button.shape === "pill" ? 9999 : tokens.button.shape === "square" ? 4 : tokens.button.radiusPx;

    root.style.setProperty("--bg-dark", tokens.palette.background);
    root.style.setProperty("--text-primary", tokens.palette.text);
    root.style.setProperty("--accent-platinum", tokens.palette.accent);
    root.style.setProperty("--font-serif", tokens.typography.fontFamily);
    root.style.setProperty("--font-base-size", `${tokens.typography.baseSizePx}px`);

    root.style.setProperty("--btn-silver-top", tokens.button.gradientFrom);
    root.style.setProperty("--btn-silver-mid", tokens.button.gradientMid || tokens.button.gradientFrom);
    root.style.setProperty("--btn-silver-bottom", tokens.button.gradientTo);
    root.style.setProperty("--btn-text-dark", tokens.button.textColor);
    root.style.setProperty("--btn-border-outer", tokens.button.borderColor);
    root.style.setProperty("--btn-border-inner", tokens.button.borderInnerColor || tokens.button.borderColor);
    root.style.setProperty("--btn-shadow-soft", tokens.button.shadow);
    root.style.setProperty("--btn-shadow-press", tokens.button.pressedShadow);
    root.style.setProperty("--btn-radius", `${radius}px`);
  }, [tokens]);

  return null;
}
