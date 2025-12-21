import React from 'react';
import { Link, Outlet } from 'react-router';


const AdminDashboard = () => {
  return (
    <div >
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>


          <div className="mb-6">
        <div className="card bg-base-100 p-6 shadow">
          <h3 className="text-xl font-semibold mb-2">Welcome to Admin Console</h3>
          <p className="text-sm text-gray-500">Use the dashboard sidebar to navigate admin sections — decorators, services, bookings, assignments and users.</p>
        </div>
      </div>
      <div className=' ml-1.5'>

      <Outlet  />
      </div>
</div>
    
  );
};

export default AdminDashboard;
