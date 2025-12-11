import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import { ROLES } from './config/constants';
import { roleUtils } from './utils/roleUtils';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Creator Pages
import CreateCourse from './pages/Creator/CreateCourse';
import MyCourses from './pages/Creator/MyCourses';
import CourseDetailPage from './pages/Creator/CourseDetailPage';
import EditCourse from './pages/Creator/EditCourse';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import CourseValidation from './pages/Admin/CourseValidation';
import UserManagement from './pages/Admin/UserManagement';
import CoursesList from './pages/Admin/CoursesList';

// Apprenant Pages
import ApprenantDashboard from './pages/Apprenant/Dashboard';
import ApprenantCourseDetail from './pages/Apprenant/CourseDetail';

// Common Pages
import Unauthorized from './pages/Unauthorized';

// Smart redirect based on user role
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const defaultRoute = roleUtils.getDefaultRouteForRole(user);
  return <Navigate to={defaultRoute} replace />;
};

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />

              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes with layout */}
                <Route
                  path="/*"
                  element={
                    <div className="flex flex-col min-h-screen">
                      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                      <div className="flex flex-1">
                        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                        <main className="flex-1 p-6 lg:p-8 overflow-auto">
                          <div className="max-w-7xl mx-auto">
                            <Routes>
                                {/* Default redirect based on user role */}
                                <Route path="/" element={<RoleBasedRedirect />} />

                                {/* Creator routes */}
                                <Route
                                  path="/creator/courses"
                                  element={<MyCourses />}
                                />
                                <Route
                                  path="/creator/courses/create"
                                  element={<CreateCourse />}
                                />
                                <Route
                                  path="/creator/courses/:id"
                                  element={<CourseDetailPage />}
                                />
                                <Route
                                  path="/creator/courses/edit/:id"
                                  element={<EditCourse />}
                                />

                                {/* Admin routes */}
                                <Route
                                  path="/admin/dashboard"
                                  element={<AdminDashboard />}
                                />
                                <Route
                                  path="/admin/courses"
                                  element={<CoursesList />}
                                />
                                <Route
                                  path="/admin/courses/validation"
                                  element={<CourseValidation />}
                                />
                                <Route
                                  path="/admin/users"
                                  element={<UserManagement />}
                                />

                                {/* Apprenant routes */}
                                <Route
                                  path="/apprenant/dashboard"
                                  element={<ApprenantDashboard />}
                                />
                                <Route
                                  path="/apprenant/courses/:id"
                                  element={<ApprenantCourseDetail />}
                                />

                                {/* 404 - redirect to user's dashboard */}
                                <Route path="*" element={<RoleBasedRedirect />} />
                              </Routes>
                            </div>
                          </main>
                        </div>
                        <Footer />
                      </div>
                  }
                />
              </Routes>
            </div>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
