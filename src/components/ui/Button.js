var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
var baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
var sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3 text-base rounded-xl gap-2.5",
    xl: "px-8 py-4 text-lg rounded-2xl gap-3",
};
var variantStyles = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus-visible:outline-primary-600 shadow-md hover:shadow-lg",
    secondary: "bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus-visible:outline-secondary-600 shadow-md hover:shadow-lg",
    ghost: "text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-300",
    success: "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 focus-visible:outline-accent-600 shadow-md hover:shadow-lg",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus-visible:outline-red-600 shadow-md hover:shadow-lg",
    outline: "bg-white text-slate-700 border-2 border-slate-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-primary-600 shadow-sm",
};
export var Button = function (_a) {
    var children = _a.children, className = _a.className, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, _d = _a.loading, loading = _d === void 0 ? false : _d, disabled = _a.disabled, icon = _a.icon, _e = _a.iconPosition, iconPosition = _e === void 0 ? "left" : _e, _f = _a.fullWidth, fullWidth = _f === void 0 ? false : _f, props = __rest(_a, ["children", "className", "variant", "size", "loading", "disabled", "icon", "iconPosition", "fullWidth"]);
    var showIcon = icon && !loading;
    var showSpinner = loading;
    return (_jsxs("button", __assign({ className: cn(baseStyles, sizeStyles[size], variantStyles[variant], fullWidth && "w-full", className), disabled: disabled || loading }, props, { children: [showSpinner && (_jsx("span", { className: "inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" })), showIcon && iconPosition === "left" && _jsx("span", { className: "flex-shrink-0", children: icon }), children, showIcon && iconPosition === "right" && _jsx("span", { className: "flex-shrink-0", children: icon })] })));
};
