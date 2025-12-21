import React from 'react';
import { NavLink, useNavigate } from 'react-router';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';

const SidebarLink = ({ to, children, badge }) => (
  <li>
    <NavLink to={to} className="justify-between">
      {children}
      {badge ? <div className="badge">{badge}</div> : null}
    </NavLink>
  </li>
);

const DashboardSidebar = () => {
  const { user, logout } = useAuth() || {};
  const { data: userRecord } = useAxios('get', user?.email ? `/users/${encodeURIComponent(user.email)}` : '/users/none', {}, { enabled: !!user?.email });
  const dbUser = userRecord?.data;
  const userRole = dbUser?.role || user?.role || (user?.email?.includes('admin') ? 'admin' : user?.email?.includes('decorator') ? 'decorator' : 'user');
  const avatarUrl = dbUser?.photoURL || user?.photoURL;

  const navigate = useNavigate();
  const handleLogout = async () => {
    if (!confirm('Log out?')) return;
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
      alert('Logout failed');
    }
  };

  return (
    <aside className="w-72 bg-base-200 min-h-screen p-4 shadow-sm mr-6">
      {/* Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="avatar">
          <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={avatarUrl} alt="avatar" />
          </div>
        </div>
        <div>
          <h4 className="font-bold">{dbUser?.name || user?.displayName || 'Guest User'}</h4>
          <p className="text-sm text-gray-500">{dbUser?.email || user?.email || '-'}</p>
          <div className="badge badge-outline mt-2">{userRole}</div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="card p-3 bg-base-100 text-center">
          <div className="text-sm text-gray-500">Bookings</div>
          <div className="font-bold text-lg">—</div>
        </div>
        <div className="card p-3 bg-base-100 text-center">
          <div className="text-sm text-gray-500">Earnings</div>
          <div className="font-bold text-lg">—</div>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="menu p-2 overflow-y-auto">
          <li className="menu-title"><span>Quick</span></li>
          <SidebarLink to="/dashboard/user/profile">My Profile</SidebarLink>
          <SidebarLink to="/dashboard/user/bookings">My Bookings</SidebarLink>
          <SidebarLink to="/dashboard/user/bookings?tab=cancellations">Booking Cancellation</SidebarLink>
          <SidebarLink to="/dashboard/user/payment-history">Payment History</SidebarLink>

          {userRole === 'decorator' && (
            <>
              <li className="menu-title mt-3"><span>Decorator</span></li>
              <SidebarLink to="/dashboard/decorator/assigned">Assigned Projects</SidebarLink>
              <SidebarLink to="/dashboard/decorator/schedule">Today's Schedule</SidebarLink>
              <SidebarLink to="/dashboard/decorator/update-status">Update Project Status</SidebarLink>
              <SidebarLink to="/dashboard/decorator/earnings">Earnings Summary</SidebarLink>
            </>
          )}

          {userRole === 'admin' && (
            <>
              <li className="menu-title mt-3"><span>Admin</span></li>
              <SidebarLink to="/dashboard/admin">Overview</SidebarLink>
              <SidebarLink to="/dashboard/admin/decorators">Manage Decorators</SidebarLink>
              <SidebarLink to="/dashboard/admin/services">Manage Services</SidebarLink>
              <SidebarLink to="/dashboard/admin/bookings">Manage Bookings</SidebarLink>
              <SidebarLink to="/dashboard/admin/assign">Assign Decorator</SidebarLink>
              <SidebarLink to="/dashboard/admin/analytics">Analytics</SidebarLink>
              <SidebarLink to="/dashboard/admin/users">Manage Users</SidebarLink>
            </>
          )}
        </ul>
      </nav>

      <div className="mt-4 space-y-2">
        <button className="btn btn-block btn-ghost w-full" onClick={() => navigate('/')}>Back to Home</button>
        <button className="btn btn-block btn-outline btn-error w-full" onClick={handleLogout}>Logout</button>
      </div>

      <div className="mt-6 text-center text-xs text-gray-500">StyleDecor • Admin Panel</div>
    </aside>
  );
};

export default DashboardSidebar;
