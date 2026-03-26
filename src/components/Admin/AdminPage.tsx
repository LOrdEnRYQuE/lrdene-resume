import React from "react";
import styles from "./AdminPage.module.css";

type Props = {
  children: React.ReactNode;
  density?: "narrow" | "default" | "wide";
};

export default function AdminPage({ children, density = "default" }: Props) {
  const densityClass =
    density === "narrow" ? styles.narrow : density === "wide" ? styles.wide : "";
  return <section className={`${styles.page} ${densityClass}`.trim()}>{children}</section>;
}
