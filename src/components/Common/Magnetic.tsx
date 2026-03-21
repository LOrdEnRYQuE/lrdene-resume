"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "../../hooks/useMagnetic";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export const Magnetic = ({ children, strength = 0.3, className }: MagneticProps) => {
  const { ref, x, y } = useMagnetic(strength);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
