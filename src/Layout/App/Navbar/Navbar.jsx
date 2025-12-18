import React from "react";
import Logo from "../../../component/Logo/Logo.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router";
import useAuth from "../../../Hook/useAuth.js";
import useAxios from "../../../Hook/useAxios.js";

const NavBar = () => {
  const { user, logout } = useAuth();

  // Fetch authoritative user record from server (to get role/photo/etc.)
  const { data: userRecord, isLoading: userRecordLoading } = useAxios('get', user?.email ? `/users/${encodeURIComponent(user.email)}` : '/users/none', {}, { enabled: !!user?.email });
  const dbUser = userRecord?.data;
  const userRole = dbUser?.role || user?.role || (user?.email?.includes('admin') ? 'admin' : user?.email?.includes('decorator') ? 'decorator' : 'user');
  const avatarUrl = dbUser?.photoURL || user?.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(user?.displayName||user?.email||'user')}`;

  const navManu = (
    <>
      <li>
        {" "}
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        {" "}
        <NavLink to="/service">Services</NavLink>
      </li>
      <li>
        {" "}
        <NavLink to="/about">About</NavLink>
      </li>
      <li>
        {" "}
        <NavLink to="/contact">Contact</NavLink>
      </li>
      
    </>
  );
  const authNav = (
    <>
      {!user ? (
        <>
          <li>
            {" "}
            <NavLink className="btn btn-primary" to="/login">Login</NavLink>
          </li>
          <li>
            {" "}
            <NavLink className=" btn btn-primary" to="/register">Register</NavLink>
          </li>
        </>
      ) : (
        <li className="flex items-center">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={avatarUrl} alt="avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-72">
              <li className="px-2 py-1 text-xs text-gray-500">Role: {userRecordLoading ? '...' : userRole}</li>
              {/* role-specific structured menu */}
              {/* use server role when available */}
              {userRole === 'admin' && (
                <>
                  <li className="menu-title"><span>Admin</span></li>
                  <li><NavLink to="/dashboard/admin">Overview</NavLink></li>
                  <li><NavLink to="/dashboard/admin/decorators">Manage Decorators</NavLink></li>
                  <li><NavLink to="/dashboard/admin/services">Manage Services</NavLink></li>
                  <li><NavLink to="/dashboard/admin/bookings">Manage Bookings</NavLink></li>
                  <li><NavLink to="/dashboard/admin/analytics">Analytics</NavLink></li>
                  <li className="menu-title mt-2"><span>Actions</span></li>
                  <li><NavLink to="/dashboard/admin/decorators">Approve/Disable Decorators</NavLink></li>
                  <li><NavLink to="/dashboard/admin/services">Create Service</NavLink></li>
                </>
              )}

              {userRole === 'decorator' && (
                <>
                  <li className="menu-title"><span>Decorator</span></li>
                  <li><NavLink to="/dashboard/decorator/assigned">My Assigned Projects</NavLink></li>
                  <li><NavLink to="/dashboard/decorator/schedule">Today's Schedule</NavLink></li>
                  <li><NavLink to="/dashboard/decorator/earnings">Earnings Summary</NavLink></li>
                  <li className="menu-title mt-2"><span>Actions</span></li>
                  <li><NavLink to="/dashboard/decorator/assigned">Update Project Status</NavLink></li>
                  <li><NavLink to="/dashboard/user/payment-history">Payment History</NavLink></li>
                </>
              )}

              {userRole === 'user' && (
                <>
                  <li className="menu-title"><span>User</span></li>
                  <li><NavLink to="/dashboard/user/profile">My Profile</NavLink></li>
                  <li><NavLink to="/dashboard/user/bookings">My Bookings</NavLink></li>
                  <li><NavLink to="/dashboard/user/bookings?tab=cancellations">Booking Cancellation</NavLink></li>
                  <li><NavLink to="/dashboard/user/payment-history">Payment History</NavLink></li>
                  <li className="menu-title mt-2"><span>Actions</span></li>
                  <li><NavLink to="/dashboard/user/bookings">Update / Cancel Booking</NavLink></li>
                  <li><NavLink to="/dashboard/user/bookings?tab=pay">Pay for Booked Services</NavLink></li>
                </>
              )}

              <li className="divider"></li>
              <li><button className=" btn btn-primary text-left w-full" onClick={() => logout()}>Logout</button></li>
            </ul>
          </div>
        </li>
      )}
    </>
  );

  return (
    <nav className=" bg-base-100 shadow-sm">
      <div className="navbar ">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{" "}
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navManu}
              {/* {
                !user ? authNav : ''
              } */}

            </ul>
          </div>
          <Logo />
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navManu}</ul>
        </div>
        <div className="navbar-end menu menu-horizontal gap-3">
          {authNav}
          <Toggletheme />

        </div>
      </div>
    </nav>
  );
};

const Toggletheme = () => {
  const [isdark, setIsdark] = useState(
    JSON.parse(localStorage.getItem("isdark")),
  );
  useEffect(() => {
    localStorage.setItem("isdark", JSON.stringify(isdark));
  }, [isdark]);
  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        type="checkbox"
        className="theme-controller"
        value="forest"
        checked={isdark}
        onChange={() => setIsdark(!isdark)}
      />

      {/* sun icon */}
      <svg
        className="swap-off h-10 w-10 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
      </svg>

      {/* moon icon */}
      <svg
        className="swap-on h-10 w-10 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
      </svg>
    </label>
  );
};
export default NavBar;
