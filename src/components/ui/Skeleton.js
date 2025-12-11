import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
};
export default function Skeleton(_a) {
    var _b = _a.variant, variant = _b === void 0 ? "rounded" : _b, width = _a.width, height = _a.height, _c = _a.className, className = _c === void 0 ? "" : _c;
    var style = {};
    if (width)
        style.width = width;
    if (height)
        style.height = height;
    return (_jsx("div", { className: "shimmer-effect animate-shimmer ".concat(variantClasses[variant], " ").concat(className), style: style }));
}
// Compound components for common patterns
export function SkeletonCard() {
    return (_jsx("div", { className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-200", children: _jsxs("div", { className: "space-y-4", children: [_jsx(Skeleton, { height: "24px", width: "60%" }), _jsx(Skeleton, { height: "16px", width: "100%" }), _jsx(Skeleton, { height: "16px", width: "80%" }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Skeleton, { height: "32px", width: "80px", variant: "rounded" }), _jsx(Skeleton, { height: "32px", width: "80px", variant: "rounded" })] })] }) }));
}
export function SkeletonText(_a) {
    var _b = _a.lines, lines = _b === void 0 ? 3 : _b;
    return (_jsx("div", { className: "space-y-2", children: Array.from({ length: lines }).map(function (_, i) { return (_jsx(Skeleton, { height: "16px", width: i === lines - 1 ? "70%" : "100%", variant: "text" }, i)); }) }));
}
