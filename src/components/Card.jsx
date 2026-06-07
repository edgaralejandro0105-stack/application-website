import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function Card({ children, className = '', ...props }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div 
      className={`glass-panel rounded-md shadow-lg overflow-hidden transition-all duration-300 hover:shadow-neon relative group/card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
