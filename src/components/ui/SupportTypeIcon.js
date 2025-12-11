import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
export var SupportTypeIcon = function (_a) {
    var type = _a.type, className = _a.className;
    var normalized = type.toUpperCase();
    if (normalized === "VIDEO") {
        return (_jsx("span", { className: cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600", className), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M5 3h10a4 4 0 0 1 4 4v1.18l1.55-.89A1 1 0 0 1 22 8.18v7.64a1 1 0 0 1-1.45.89L19 15.82V17a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm5 5.38-2 .9v2.44l2 .9Z" }) }) }));
    }
    return (_jsx("span", { className: cn("inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600", className), children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: _jsx("path", { d: "M6 2h8a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1H4a2 2 0 0 1-2-2V6a4 4 0 0 1 4-4Zm10 5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9h1a3 3 0 0 1 3 3v1h10a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1Zm-4.75 4.83-2.19 2.19a1 1 0 0 1-1.41-1.42l2.5-2.49a1 1 0 0 1 1.41 0l2.5 2.49a1 1 0 0 1-1.41 1.42Z" }) }) }));
};
