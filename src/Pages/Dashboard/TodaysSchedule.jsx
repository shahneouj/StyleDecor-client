import React from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';

const TodaysSchedule = () => {
  const { user } = useAuth();
  const { data: resp, isLoading, error } = useAxios('get', '/bookings/assigned', {}, { enabled: !!user });
  const bookings = resp?.data || [];

  const today = new Date().toISOString().slice(0,10);
  const todays = bookings.filter(b => (b.bookingDate || '').slice(0,10) === today);

  if (isLoading) return <div className="mockup-window border bg-base-200 p-4">Loading…</div>;
  if (error) return <div className="alert alert-error">{error.message || 'Failed to load schedule'}</div>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Today's Schedule</h3>
      <p className="text-sm text-gray-600 mb-4">Assigned events for today.</p>

      {todays.length === 0 ? (
        <div className="text-center text-gray-500">No events scheduled for today.</div>
      ) : (
        <div className="space-y-3">
          {todays.map(b => (
            <div key={b._id} className="card p-3 bg-base-100 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{b.serviceName}</div>
                  <div className="text-sm text-gray-500">Customer: {b.customerName} • {b.customerEmail}</div>
                  <div className="text-sm text-gray-500">Status: {b.status} • Progress: {b.progress ?? 0}%</div>
                  <div className="w-40 mt-2">
                    <div className="h-2 bg-base-200 rounded overflow-hidden">
                      <div className="h-2 bg-primary" style={{ width: `${b.progress ?? 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Booking: {b._id}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;
