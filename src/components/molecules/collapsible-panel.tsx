import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

export default function CollapsiblePanel({
  title,
  icon: Icon,
  gradient = "from-violet-500 to-purple-500",
  children,
  defaultCollapsed = false,
}) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { t } = useTranslation();

  return (
    <ErrorBoundary fallback={<div>{t("error.something_wrong", "Something went wrong")}</div>}>
      <div className="bg-card-app backdrop-blur-xl border border-app-secondary rounded-3xl shadow-card overflow-hidden">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 flex items-center justify-between hover:bg-button-ghost transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-r ${gradient} p-2 rounded-xl`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-app-primary">{title}</h2>
          </div>
          {isCollapsed ? (
            <ChevronDown className="w-5 h-5 text-app-secondary" />
          ) : (
            <ChevronUp className="w-5 h-5 text-app-secondary" />
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
              <div className="p-6 pt-0">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
