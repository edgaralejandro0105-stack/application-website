import React from 'react';

export function Button({ children, className = '', variant = 'primary', ...props }) {
  const baseStyle = "relative inline-flex items-center justify-center rounded-full px-6 py-3 font-jakarta font-semibold tracking-[0.05em] uppercase text-xs transition-all duration-300 overflow-hidden group/btn";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-fixed-dim hover:shadow-neon",
    secondary: "bg-secondary text-on-secondary hover:bg-secondary-fixed-dim",
    outline: "border border-outline text-primary hover:border-primary hover:shadow-neon bg-transparent"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {/* Shine effect span */}
      <span className="absolute top-0 -left-[75%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 group-hover/btn:animate-shine pointer-events-none" />
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}
