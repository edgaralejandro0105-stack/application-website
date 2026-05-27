import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`glass-panel rounded-md shadow-lg overflow-hidden transition-all duration-300 hover:shadow-neon ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
