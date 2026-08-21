import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect unauthenticated user to login page, preserving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based Access Control Guard
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role);
    if (!hasRole) {
      // Redirect to authorized portal dashboard based on role
      if (user.role === 'student') return <Navigate to="/student" replace />;
      if (user.role === 'staff') return <Navigate to="/staff" replace />;
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};
