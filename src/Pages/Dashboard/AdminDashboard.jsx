import React from 'react';
import { Link, Outlet } from 'react-router';

const AdminDashboard = () => {
  return (
    <div >
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
<div className='flex'>

      <div className="grid grid-cols-1  gap-4 mb-6 mr-2.5">
        <Link to="decorators" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Manage Decorators</h3>
          <p className="text-sm text-gray-500">Create / Update / Delete decorators</p>
        </Link>
        <Link to="services" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Manage Services</h3>
          <p className="text-sm text-gray-500">Create / Update / Delete services</p>
        </Link>
        <Link to="bookings" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Manage Bookings</h3>
          <p className="text-sm text-gray-500">View and update booking statuses</p>
        </Link>
        <Link to="analytics" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-gray-500">Revenue & service demand charts</p>
        </Link>
        <Link to="users" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Manage Users</h3>
          <p className="text-sm text-gray-500">View and set roles for users</p>
        </Link>
      </div>
 <div className="divider lg:divider-horizontal "></div>
      <Outlet />
</div>
    </div>
  );
};

export default AdminDashboard;
