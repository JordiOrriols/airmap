import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CollapsiblePanel({ 
  title, 
  icon: Icon, 
  gradient = "from-violet-500 to-purple-500",
  children,
  defaultCollapsed = false 
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-r ${gradient} p-2 rounded-xl`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        {isCollapsed ? (
          <ChevronDown className="w-5 h-5 text-white/70" />
        ) : (
          <ChevronUp className="w-5 h-5 text-white/70" />
        )}
      </button>
      
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}