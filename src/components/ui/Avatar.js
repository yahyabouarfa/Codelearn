import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
};
var statusColors = {
    online: "bg-accent-500",
    offline: "bg-slate-400",
    away: "bg-warm-500",
};
export default function Avatar(_a) {
    var name = _a.name, src = _a.src, _b = _a.size, size = _b === void 0 ? "md" : _b, status = _a.status, _c = _a.className, className = _c === void 0 ? "" : _c;
    var initials = name
        ? name
            .split(" ")
            .map(function (n) { return n[0]; })
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";
    var gradients = [
        "from-primary-500 to-secondary-500",
        "from-secondary-500 to-primary-600",
        "from-accent-500 to-accent-600",
        "from-warm-500 to-warm-600",
    ];
    var gradientIndex = name
        ? name.charCodeAt(0) % gradients.length
        : 0;
    return (_jsxs("div", { className: "relative inline-block ".concat(className), children: [_jsx("div", { className: "".concat(sizeClasses[size], " rounded-full overflow-hidden flex items-center justify-center font-semibold text-white bg-gradient-to-br ").concat(gradients[gradientIndex], " ring-2 ring-white shadow-md transition-transform duration-200 hover:scale-105"), children: src ? (_jsx("img", { src: src, alt: name || "Avatar", className: "h-full w-full object-cover" })) : (_jsx("span", { children: initials })) }), status && (_jsx("span", { className: "absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ".concat(statusColors[status]) }))] }));
}
