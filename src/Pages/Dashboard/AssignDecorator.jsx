import React, { useEffect, useState } from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';

const AssignDecorator = () => {
  const { user } = useAuth();
  const { data: pendingResp, isLoading: pendingLoading, error: pendingError, refetch: refetchPending } = useAxios('get', '/bookings/pending-assignment', {}, { enabled: !!user });
  const { data: decoratorsResp, isLoading: decoratorsLoading, error: decoratorsError } = useAxios('get', '/decorators', {}, { enabled: !!user });
  const pending = pendingResp?.data || [];
  const decorators = decoratorsResp?.data || [];

  useEffect(() => {
    if (pendingError) console.error('Pending bookings error', pendingError);
    if (decoratorsError) console.error('Decorators load error', decoratorsError);
  }, [pendingError, decoratorsError]);

  const AssignRow = ({ booking }) => {
    const [selected, setSelected] = useState('');
    const [loading, setLoading] = useState(false);
    const assign = useAxios('patch', `/bookings/${booking._id}/assign`);

    const handle = async () => {
      if (!selected) return alert('Please select a decorator');
      if (!confirm('Assign selected decorator to this booking?')) return;
      try {
        setLoading(true);
        const json = await assign.mutateAsync({ decoratorId: selected });
        if (json && json.success) {
          alert('Decorator assigned');
          refetchPending();
        } else {
          throw new Error(json?.message || 'Assign failed');
        }
      } catch (err) {
        console.error('Assign error', err);
        alert(err?.response?.data?.message || err.message || 'Could not assign decorator');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <select className="select select-bordered select-sm" value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="">Select Decorator</option>
          {decorators.map((d) => (
            <option key={d._id} value={d._id}>{d.name} ({d.email})</option>
          ))}
        </select>
        <button className="btn btn-sm btn-primary" onClick={handle} disabled={loading}>{loading ? 'Assigning…' : 'Assign'}</button>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Assign Decorator for On-Site Services</h3>
      <p className="text-sm text-gray-600 mb-4">Assign decorators to paid bookings that require on-site work.</p>

      {pendingLoading ? (
        <div className="mockup-window border bg-base-200 p-4">Loading…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Service</th>
                <th>Booking Date</th>
                <th>Customer</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((b) => (
                <tr key={b._id}>
                  <td>{b._id}</td>
                  <td>{b.serviceName}</td>
                  <td>{b.createdAt || '-'}</td>
                  <td>{b.customerName} <div className="text-xs">{b.customerEmail}</div></td>
                  <td>
                    <AssignRow booking={b} />
                  </td>
                </tr>
              ))}
              {pending.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">No pending bookings to assign</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignDecorator;
