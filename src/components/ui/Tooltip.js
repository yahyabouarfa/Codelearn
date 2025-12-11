import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
var positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};
var arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900",
    right: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900",
};
export default function Tooltip(_a) {
    var content = _a.content, children = _a.children, _b = _a.position, position = _b === void 0 ? "top" : _b, _c = _a.delay, delay = _c === void 0 ? 200 : _c, _d = _a.className, className = _d === void 0 ? "" : _d;
    var _e = useState(false), isVisible = _e[0], setIsVisible = _e[1];
    var timeoutRef = useRef(null);
    var showTooltip = function () {
        timeoutRef.current = setTimeout(function () {
            setIsVisible(true);
        }, delay);
    };
    var hideTooltip = function () {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };
    useEffect(function () {
        return function () {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    return (_jsxs("div", { className: "relative inline-block ".concat(className), onMouseEnter: showTooltip, onMouseLeave: hideTooltip, onFocus: showTooltip, onBlur: hideTooltip, children: [children, isVisible && (_jsxs("div", { className: "absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg whitespace-nowrap animate-fade-in ".concat(positionClasses[position]), role: "tooltip", children: [content, _jsx("div", { className: "absolute w-0 h-0 border-4 ".concat(arrowClasses[position]) })] }))] }));
}
