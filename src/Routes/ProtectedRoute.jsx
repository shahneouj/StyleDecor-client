import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import useAuth from '../Hook/useAuth.js';
import useAxios from '../Hook/useAxios.js';

const ProtectedRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const { user } = useAuth() || {};

  // fetch authoritative user record from server to get role
  const { data: userRecord, isLoading } = useAxios('get', user?.email ? `/users/${encodeURIComponent(user.email)}` : '/users/none', {}, { enabled: !!user?.email });
  const dbUser = userRecord?.data;
  const role = dbUser?.role || user?.role;

  if (isLoading) return <div className="p-6">Loading...</div>;

  // not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if roles constraint provided, check
  if (roles && roles.length > 0 && !roles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-6 bg-base-100 shadow">
          <h3 className="text-xl font-bold">Access denied</h3>
          <p className="text-sm text-gray-600 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  // OK
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
