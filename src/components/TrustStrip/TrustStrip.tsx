import React from "react";
import styles from "./TrustStrip.module.css";
import type { Locale } from "@/lib/i18n/config";

type TrustStripProps = {
  locale: Locale;
};

export const TrustStrip = ({ locale }: TrustStripProps) => {
  const expertise =
    locale === "de"
      ? [
          "Webentwicklung",
          "KI Integration",
          "Grafikdesign",
          "UI/UX Design",
          "Branding Systeme",
          "Business MVPs",
        ]
      : [
          "Web Development",
          "AI Integration",
          "Graphic Design",
          "UI/UX Design",
          "Branding Systems",
          "Business MVPs",
        ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {expertise.map((item, index) => (
          <React.Fragment key={item}>
            <span className={styles.item}>{item}</span>
            {index < expertise.length - 1 && (
              <span className={styles.separator}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className={styles.container} aria-hidden="true">
        {expertise.map((item, index) => (
          <React.Fragment key={item}>
            <span className={styles.item}>{item}</span>
            {index < expertise.length - 1 && (
              <span className={styles.separator}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
