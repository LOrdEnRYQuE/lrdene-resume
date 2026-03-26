"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

export default function ScrollLampEffect() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setActive(window.scrollY > 120);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`scroll-lamp ${active ? "is-active" : ""}`}
      style={
        {
          "--lamp-x": "50%",
          "--lamp-tilt": "0deg",
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="scroll-lamp-beam" />
      <div className="scroll-lamp-core" />
      <div className="scroll-lamp-road" />
    </div>
  );
}
