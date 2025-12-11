import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { ToastProvider } from "./components/ui/Toast";

const App = () => (
  <ToastProvider>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </ToastProvider>
);

export default App;
