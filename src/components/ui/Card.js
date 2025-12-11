import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
var variantStyles = {
    elevated: "bg-white shadow-lg border border-slate-100",
    flat: "bg-white border border-slate-200",
    bordered: "bg-white border-2 border-slate-300",
    gradient: "bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-md",
};
var paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};
export var Card = function (_a) {
    var children = _a.children, className = _a.className, _b = _a.variant, variant = _b === void 0 ? "elevated" : _b, _c = _a.hover, hover = _c === void 0 ? false : _c, _d = _a.padding, padding = _d === void 0 ? "md" : _d, onClick = _a.onClick;
    return (_jsx("div", { className: cn("rounded-2xl transition-all duration-300", variantStyles[variant], paddingStyles[padding], hover && "hover:-translate-y-2 hover:shadow-xl cursor-pointer", onClick && "cursor-pointer", className), onClick: onClick, children: children }));
};
