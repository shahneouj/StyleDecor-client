import React from 'react';
import { Link, Outlet } from 'react-router';

const UserDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      <div className="mb-6">
        <div className="card bg-base-100 p-6 shadow">
          <h3 className="text-xl font-semibold mb-2">Welcome to your Dashboard</h3>
          <p className="text-sm text-gray-500">Use the sidebar to access your profile, bookings, and payments.</p>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default UserDashboard;
