import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
export default function Dropdown(_a) {
    var trigger = _a.trigger, children = _a.children, _b = _a.align, align = _b === void 0 ? "right" : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var _d = useState(false), isOpen = _d[0], setIsOpen = _d[1];
    var dropdownRef = useRef(null);
    useEffect(function () {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    var alignmentClasses = align === "left" ? "left-0" : "right-0";
    return (_jsxs("div", { ref: dropdownRef, className: "relative inline-block ".concat(className), children: [_jsx("div", { onClick: function () { return setIsOpen(!isOpen); }, className: "cursor-pointer", children: trigger }), isOpen && (_jsx("div", { className: "absolute ".concat(alignmentClasses, " mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-slide-down"), children: children }))] }));
}
export function DropdownItem(_a) {
    var children = _a.children, onClick = _a.onClick, icon = _a.icon, _b = _a.danger, danger = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var handleClick = function () {
        onClick === null || onClick === void 0 ? void 0 : onClick();
    };
    return (_jsxs("button", { onClick: handleClick, className: "w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors duration-150 ".concat(danger
            ? "text-red-600 hover:bg-red-50"
            : "text-slate-700 hover:bg-slate-50", " ").concat(className), children: [icon && _jsx("span", { className: "flex-shrink-0", children: icon }), _jsx("span", { children: children })] }));
}
export function DropdownDivider() {
    return _jsx("div", { className: "my-1 border-t border-slate-200" });
}
