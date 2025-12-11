import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { ToastProvider } from "./components/ui/Toast";
var App = function () { return (_jsx(ToastProvider, { children: _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(AppLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(CoursesPage, {}) }), _jsx(Route, { path: "/courses/:courseId", element: _jsx(CourseDetailPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })); };
export default App;
