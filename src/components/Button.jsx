import React from 'react';

export function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyle = "inline-flex items-center justify-center rounded-full px-6 py-3 font-jakarta font-semibold tracking-[0.05em] uppercase text-xs transition-all duration-300";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-fixed-dim hover:shadow-neon",
    secondary: "bg-secondary text-on-secondary hover:bg-secondary-fixed-dim",
    outline: "border border-outline text-primary hover:border-primary hover:shadow-neon bg-transparent"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
