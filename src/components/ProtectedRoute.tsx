import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, user, allowedRoles }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}