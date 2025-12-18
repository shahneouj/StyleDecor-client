import React from 'react';

const MyBookings = () => {
  return (
    <div className="card p-6 bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">My Bookings</h3>
      <p className="text-sm text-gray-600">List of bookings with actions (Update / Cancel / Pay).</p>
      <div className="mt-4">
        <div className="mockup-window border bg-base-200 p-4">Example booking rows will appear here.</div>
      </div>
    </div>
  );
};

export default MyBookings;
