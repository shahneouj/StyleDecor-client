import React from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';

const AssignedProjects = () => {
  const { user } = useAuth();
  const { data: resp, isLoading, error } = useAxios('get', '/bookings/assigned', {}, { enabled: !!user });
  const bookings = resp?.data || [];

  if (isLoading) return <div className="mockup-window border bg-base-200 p-4">Loading…</div>;
  if (error) return <div className="alert alert-error">{error.message || 'Failed to load assigned projects'}</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Assigned Projects</h3>
      <p className="text-sm text-gray-600 mb-4">List of your assigned projects.</p>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Service</th>
              <th>Booking Date</th>
              <th>Customer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id}>
                <td>{b._id}</td>
                <td>{b.serviceName}</td>
                <td>{b.createdAt || '-'}</td>
                <td>{b.customerName} <div className="text-xs">{b.customerEmail}</div></td>
                <td>
                  <div className="w-36">
                    <div className="h-2 bg-base-200 rounded overflow-hidden">
                      <div className="h-2 bg-primary" style={{ width: `${b.progress ?? 0}%` }} />
                    </div>
                    <div className="text-xs mt-1">{b.status} • {b.progress ?? 0}%</div>
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">No assigned projects</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedProjects;
