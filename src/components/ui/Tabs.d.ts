import React from "react";
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
export default function Tabs({ tabs, activeTab, onChange, variant, size, className, }: TabsProps): import("react/jsx-runtime").JSX.Element;
interface TabPanelProps {
    children: React.ReactNode;
    activeTab: string;
    tabId: string;
    className?: string;
}
export declare function TabPanel({ children, activeTab, tabId, className }: TabPanelProps): import("react/jsx-runtime").JSX.Element | null;
export {};
