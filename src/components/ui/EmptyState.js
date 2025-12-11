import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export var EmptyState = function (_a) {
    var title = _a.title, description = _a.description, action = _a.action;
    return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center", children: [_jsx("p", { className: "text-lg font-semibold text-gray-900", children: title }), _jsx("p", { className: "mt-2 max-w-md text-sm text-gray-500", children: description }), action && _jsx("div", { className: "mt-4", children: action })] }));
};
