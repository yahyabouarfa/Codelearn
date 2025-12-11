import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../utils/classNames";
export var LoadingState = function (_a) {
    var _b = _a.message, message = _b === void 0 ? "Loading data…" : _b, className = _a.className, children = _a.children;
    return (_jsxs("div", { className: cn("flex w-full flex-col items-center justify-center gap-3 py-10", className), children: [_jsx("span", { className: "h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" }), _jsx("p", { className: "text-sm text-gray-600", children: message }), children] }));
};
