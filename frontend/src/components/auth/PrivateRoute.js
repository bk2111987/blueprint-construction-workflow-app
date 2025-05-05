import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!user || !token) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if route requires specific roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard if user's role is not allowed
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and authorized, render the protected component
  return children;
};

export default PrivateRoute;
