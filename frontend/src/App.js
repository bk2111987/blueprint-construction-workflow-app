import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TwoFactorAuth from './components/auth/TwoFactorAuth';

// Dashboard Components
import ContractorDashboard from './components/dashboards/ContractorDashboard';
import VendorDashboard from './components/dashboards/VendorDashboard';
import SubcontractorDashboard from './components/dashboards/SubcontractorDashboard';
import CustomerDashboard from './components/dashboards/CustomerDashboard';

// Role-based dashboard routing
const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'contractor':
      return <Navigate to="/contractor" />;
    case 'vendor':
      return <Navigate to="/vendor" />;
    case 'subcontractor':
      return <Navigate to="/subcontractor" />;
    case 'customer':
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/login" />;
  }
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-2fa" element={<TwoFactorAuth />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardRouter />} />

        {/* Role-specific Routes */}
        <Route
          path="/contractor/*"
          element={
            <PrivateRoute allowedRoles={['contractor']}>
              <ContractorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendor/*"
          element={
            <PrivateRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/subcontractor/*"
          element={
            <PrivateRoute allowedRoles={['subcontractor']}>
              <SubcontractorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/customer/*"
          element={
            <PrivateRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />

        {/* Root Route - Redirect to dashboard or login */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
