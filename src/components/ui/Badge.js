import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
var variantStyles = {
    gray: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/20",
    success: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-600/20",
    primary: "bg-primary-50 text-primary-700 ring-1 ring-inset ring-primary-600/20",
    secondary: "bg-secondary-50 text-secondary-700 ring-1 ring-inset ring-secondary-600/20",
    warning: "bg-warm-50 text-warm-700 ring-1 ring-inset ring-warm-600/20",
    danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    info: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
};
var sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
};
var shapeStyles = {
    pill: "rounded-full",
    square: "rounded-md",
};
export var Badge = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? "gray" : _b, _c = _a.size, size = _c === void 0 ? "sm" : _c, _d = _a.shape, shape = _d === void 0 ? "pill" : _d, icon = _a.icon, _e = _a.dot, dot = _e === void 0 ? false : _e, className = _a.className;
    return (_jsxs("span", { className: cn("inline-flex items-center gap-1.5 font-semibold transition-all duration-200", variantStyles[variant], sizeStyles[size], shapeStyles[shape], className), children: [dot && _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" }), icon && _jsx("span", { className: "flex-shrink-0", children: icon }), children] }));
};
