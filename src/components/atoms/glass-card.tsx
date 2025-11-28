import React from "react";
import { motion } from "framer-motion";

export default function GlassCard({ 
  children, 
  className = "",
  animate = false,
  ...props 
}) {
  const baseClasses = "bg-slate-900/70 backdrop-blur-xs border border-white/20 rounded-3xl shadow-2xl";
  
  if (animate) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}