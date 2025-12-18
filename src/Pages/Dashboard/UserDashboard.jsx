import React from 'react';
import { Link, Outlet } from 'react-router';

const UserDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="profile" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">My Profile</h3>
          <p className="text-sm text-gray-500">View and update your profile</p>
        </Link>
        <Link to="bookings" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">My Bookings</h3>
          <p className="text-sm text-gray-500">View or cancel bookings</p>
        </Link>
        <Link to="payment-history" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Payment History</h3>
          <p className="text-sm text-gray-500">View past transactions</p>
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default UserDashboard;
