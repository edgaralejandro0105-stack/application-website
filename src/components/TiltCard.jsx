import React from 'react';
import { motion } from 'framer-motion';

export function TiltCard({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}
