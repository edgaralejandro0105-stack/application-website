import React from 'react';

export function Input({ label, type = 'text', id, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md text-on-surface-variant uppercase tracking-[0.05em]">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className="w-full bg-surface-container-high/50 border border-outline-variant rounded-DEFAULT px-4 py-3 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:shadow-neon transition-all duration-300 backdrop-blur-md"
        {...props}
      />
    </div>
  );
}
