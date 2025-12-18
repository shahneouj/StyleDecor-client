import React from 'react';
import { NavLink } from 'react-router';
import useAuth from '../../Hook/useAuth.js';

const DashboardSidebar = () => {
  const { user } = useAuth() || {}; // derive a demo role from email if real role not present
  const userRole = user?.role || (user?.email?.includes('admin') ? 'admin' : user?.email?.includes('decorator') ? 'decorator' : 'user');

  return (
    <div className="w-64 bg-base-200 h-full p-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold">Dashboard</h3>
        <p className="text-sm text-gray-500">{user?.displayName || 'Guest'}</p>
      </div>

      <ul className="menu p-2">
        {/* Common */}
        <li>
          <NavLink to="/dashboard/user">User Dashboard</NavLink>
        </li>

        {/* Admin links */}
        {userRole === 'admin' && (
          <>
            <li>
              <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/admin/decorators">Manage Decorators</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/admin/services">Manage Services</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/admin/bookings">Manage Bookings</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/admin/analytics">Analytics</NavLink>
            </li>
          </>
        )}

        {/* Decorator links */}
        {userRole === 'decorator' && (
          <>
            <li>
              <NavLink to="/dashboard/decorator">Decorator Dashboard</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/decorator/assigned">Assigned Projects</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/decorator/schedule">Today's Schedule</NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/decorator/earnings">Earnings</NavLink>
            </li>
          </>
        )}

        {/* Quick Links for user functionality */}
        <li>
          <NavLink to="/dashboard/user/bookings">My Bookings</NavLink>
        </li>
        <li>
          <NavLink to="/dashboard/user/payment-history">Payment History</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default DashboardSidebar;
