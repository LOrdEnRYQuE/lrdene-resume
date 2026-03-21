import React from "react";
import styles from "./TrustStrip.module.css";
import { motion } from "framer-motion";

const expertise = [
  "Web Development",
  "AI Integration",
  "Graphic Design",
  "UI/UX Design",
  "Branding Systems",
  "Business MVPs",
];

export const TrustStrip = () => {
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
