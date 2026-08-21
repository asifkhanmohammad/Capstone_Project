import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubmitComplaint } from './pages/student/SubmitComplaint';
import { MyComplaints } from './pages/student/MyComplaints';
import { ComplaintDetails } from './pages/student/ComplaintDetails';
import { ServiceRequests } from './pages/student/ServiceRequests';
import { NotificationsPage } from './pages/student/NotificationsPage';
import { FeedbackPage } from './pages/student/FeedbackPage';

// Staff / Faculty Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedComplaints } from './pages/staff/AssignedComplaints';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AllComplaints } from './pages/admin/AllComplaints';
import { DepartmentManager } from './pages/admin/DepartmentManager';
import { StaffManager } from './pages/admin/StaffManager';
import { AnalyticsPage } from './pages/admin/AnalyticsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  if (isPublicPage) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Shared Complaint Details */}
            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute>
                  <ComplaintDetails />
                </ProtectedRoute>
              }
            />

            {/* Student Protected Routes */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/submit"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <SubmitComplaint />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/complaints"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/services"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ServiceRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/feedback"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />

            {/* Staff / Faculty Protected Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/assigned"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <AssignedComplaints />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AllComplaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/departments"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <DepartmentManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <StaffManager />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <ServiceRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;
