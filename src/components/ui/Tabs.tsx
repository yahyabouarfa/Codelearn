import React, { useState } from "react";
import { cn } from "../../utils/classNames";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills" | "bordered";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  underline: {
    container: "border-b border-slate-200",
    tab: "relative px-4 py-3 text-sm font-semibold transition-colors duration-200",
    active: "text-primary-600",
    inactive: "text-slate-600 hover:text-slate-900",
    indicator: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600",
  },
  pills: {
    container: "bg-slate-100 p-1 rounded-xl",
    tab: "relative px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200",
    active: "bg-white text-primary-700 shadow-sm",
    inactive: "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
    indicator: "",
  },
  bordered: {
    container: "gap-2",
    tab: "px-4 py-2.5 text-sm font-semibold border-2 rounded-xl transition-all duration-200",
    active: "border-primary-600 bg-primary-50 text-primary-700",
    inactive: "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
    indicator: "",
  },
};

const sizeStyles = {
  sm: "text-xs px-3 py-2",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  size = "md",
  className = "",
}: TabsProps) {
  const styles = variantStyles[variant];

  return (
    <div className={cn("flex", styles.container, className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              styles.tab,
              isActive ? styles.active : styles.inactive,
              "flex items-center gap-2"
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "ml-1 px-2 py-0.5 text-xs font-semibold rounded-full",
                  isActive
                    ? "bg-primary-100 text-primary-700"
                    : "bg-slate-200 text-slate-700"
                )}
              >
                {tab.badge}
              </span>
            )}
            {isActive && variant === "underline" && <span className={styles.indicator} />}
          </button>
        );
      })}
    </div>
  );
}

// Tab content wrapper component
interface TabPanelProps {
  children: React.ReactNode;
  activeTab: string;
  tabId: string;
  className?: string;
}

export function TabPanel({ children, activeTab, tabId, className = "" }: TabPanelProps) {
  if (activeTab !== tabId) return null;

  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}
