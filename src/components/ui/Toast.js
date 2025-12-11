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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from "react";
import { cn } from "../../utils/classNames";
var ToastContext = createContext(undefined);
export function useToast() {
    var context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
var toneStyles = {
    success: "border-accent-300 bg-accent-50 text-accent-900",
    error: "border-red-300 bg-red-50 text-red-900",
    info: "border-primary-300 bg-primary-50 text-primary-900",
    warning: "border-warm-300 bg-warm-50 text-warm-900",
};
var toneIcons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
};
function Toast(_a) {
    var id = _a.id, tone = _a.tone, title = _a.title, message = _a.message, action = _a.action, onClose = _a.onClose;
    return (_jsxs("div", { className: cn("flex items-start gap-3 rounded-xl border-2 px-4 py-3 shadow-xl backdrop-blur-sm animate-slide-in-right min-w-[320px] max-w-md", toneStyles[tone]), children: [_jsx("div", { className: cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm", tone === "success" && "bg-accent-600 text-white", tone === "error" && "bg-red-600 text-white", tone === "info" && "bg-primary-600 text-white", tone === "warning" && "bg-warm-600 text-white"), children: toneIcons[tone] }), _jsxs("div", { className: "flex-1 space-y-1", children: [title && _jsx("p", { className: "text-sm font-bold", children: title }), _jsx("p", { className: "text-sm font-medium", children: message }), action && _jsx("div", { className: "mt-2", children: action })] }), _jsx("button", { onClick: onClose, className: "flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity", "aria-label": "Close notification", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }));
}
export function ToastProvider(_a) {
    var children = _a.children;
    var _b = useState([]), toasts = _b[0], setToasts = _b[1];
    var addToast = useCallback(function (toast) {
        var _a;
        var id = Math.random().toString(36).substring(2, 9);
        var newToast = __assign(__assign({}, toast), { id: id });
        setToasts(function (prev) {
            // Limit to 3 toasts
            var updated = __spreadArray(__spreadArray([], prev, true), [newToast], false);
            return updated.slice(-3);
        });
        // Auto-remove after duration
        var duration = (_a = toast.duration) !== null && _a !== void 0 ? _a : 5000;
        if (duration > 0) {
            setTimeout(function () {
                removeToast(id);
            }, duration);
        }
    }, []);
    var removeToast = useCallback(function (id) {
        setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== id; }); });
    }, []);
    return (_jsxs(ToastContext.Provider, { value: { addToast: addToast, removeToast: removeToast }, children: [children, _jsx("div", { className: "fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none", children: toasts.map(function (toast) { return (_jsx("div", { className: "pointer-events-auto", children: _jsx(Toast, __assign({}, toast, { onClose: function () { return removeToast(toast.id); } })) }, toast.id)); }) })] }));
}
