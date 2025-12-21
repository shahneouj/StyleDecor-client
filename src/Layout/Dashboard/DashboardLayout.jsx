import React from 'react';
import { Outlet } from 'react-router';
import DashboardSidebar from './DashboardSidebar.jsx';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-base-100">
     
      <div className="drawer drawer-mobile">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-6">
          <div className="mb-4 lg:hidden">
            <label htmlFor="dashboard-drawer" className="btn btn-sm">Open Dashboard Menu</label>
          </div>
<div className="flex">
           <DashboardSidebar />
      
          <Outlet />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default DashboardLayout;
