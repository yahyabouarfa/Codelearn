import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var colorClasses = {
    primary: "text-primary-600",
    secondary: "text-secondary-600",
    accent: "text-accent-600",
    warm: "text-warm-600",
};
var gradientClasses = {
    primary: "from-primary-500 to-primary-600",
    secondary: "from-secondary-500 to-secondary-600",
    accent: "from-accent-500 to-accent-600",
    warm: "from-warm-500 to-warm-600",
};
var sizeClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
};
export default function ProgressBar(_a) {
    var value = _a.value, _b = _a.max, max = _b === void 0 ? 100 : _b, _c = _a.size, size = _c === void 0 ? "md" : _c, _d = _a.variant, variant = _d === void 0 ? "linear" : _d, _e = _a.showLabel, showLabel = _e === void 0 ? false : _e, _f = _a.color, color = _f === void 0 ? "primary" : _f, _g = _a.className, className = _g === void 0 ? "" : _g;
    var percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    if (variant === "circular") {
        return _jsx(CircularProgress, { percentage: percentage, color: color, showLabel: showLabel });
    }
    return (_jsxs("div", { className: "w-full ".concat(className), children: [_jsx("div", { className: "w-full bg-slate-200 rounded-full overflow-hidden ".concat(sizeClasses[size]), children: _jsx("div", { className: "h-full bg-gradient-to-r ".concat(gradientClasses[color], " transition-all duration-500 ease-out rounded-full"), style: { width: "".concat(percentage, "%") } }) }), showLabel && (_jsxs("span", { className: "text-sm font-medium mt-1 block ".concat(colorClasses[color]), children: [Math.round(percentage), "%"] }))] }));
}
function CircularProgress(_a) {
    var percentage = _a.percentage, color = _a.color, showLabel = _a.showLabel, _b = _a.size, size = _b === void 0 ? 48 : _b;
    var strokeWidth = 4;
    var radius = (size - strokeWidth) / 2;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (percentage / 100) * circumference;
    var colorMap = {
        primary: "#4f46e5",
        secondary: "#9333ea",
        accent: "#10b981",
        warm: "#f97316",
    };
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center", children: [_jsxs("svg", { width: size, height: size, className: "transform -rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: "#e2e8f0", strokeWidth: strokeWidth, fill: "none" }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, stroke: colorMap[color], strokeWidth: strokeWidth, fill: "none", strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: offset, className: "transition-all duration-500 ease-out" })] }), showLabel && (_jsxs("span", { className: "absolute text-xs font-semibold ".concat(colorClasses[color]), style: { fontSize: size / 4 }, children: [Math.round(percentage), "%"] }))] }));
}
