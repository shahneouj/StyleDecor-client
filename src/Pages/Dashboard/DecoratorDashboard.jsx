import React from 'react';
import { Link, Outlet } from 'react-router';

const DecoratorDashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Decorator Dashboard</h2>
<div className='flex'>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link to="assigned" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Assigned Projects</h3>
        </Link>
        <Link to="schedule" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Today's Schedule</h3>
        </Link>
        <Link to="earnings" className="card p-4 bg-white shadow">
          <h3 className="font-semibold">Earnings Summary</h3>
        </Link>
      </div>
<div className="divider lg:divider-horizontal "></div>
      <Outlet />
</div>
    </div>
  );
};

export default DecoratorDashboard;