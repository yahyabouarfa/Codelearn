import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
var variantStyles = {
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
var sizeStyles = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
};
export default function Tabs(_a) {
    var tabs = _a.tabs, activeTab = _a.activeTab, onChange = _a.onChange, _b = _a.variant, variant = _b === void 0 ? "underline" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, _d = _a.className, className = _d === void 0 ? "" : _d;
    var styles = variantStyles[variant];
    return (_jsx("div", { className: cn("flex", styles.container, className), children: tabs.map(function (tab) {
            var isActive = tab.id === activeTab;
            return (_jsxs("button", { onClick: function () { return onChange(tab.id); }, className: cn(styles.tab, isActive ? styles.active : styles.inactive, "flex items-center gap-2"), children: [tab.icon && _jsx("span", { className: "flex-shrink-0", children: tab.icon }), _jsx("span", { children: tab.label }), tab.badge !== undefined && (_jsx("span", { className: cn("ml-1 px-2 py-0.5 text-xs font-semibold rounded-full", isActive
                            ? "bg-primary-100 text-primary-700"
                            : "bg-slate-200 text-slate-700"), children: tab.badge })), isActive && variant === "underline" && _jsx("span", { className: styles.indicator })] }, tab.id));
        }) }));
}
export function TabPanel(_a) {
    var children = _a.children, activeTab = _a.activeTab, tabId = _a.tabId, _b = _a.className, className = _b === void 0 ? "" : _b;
    if (activeTab !== tabId)
        return null;
    return (_jsx("div", { className: cn("animate-fade-in", className), children: children }));
}
