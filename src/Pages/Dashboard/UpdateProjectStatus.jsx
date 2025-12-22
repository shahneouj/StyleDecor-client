import React, { useState } from 'react';
import useAuth from '../../Hook/useAuth.js';
import useAxios from '../../Hook/useAxios.js';
import { useQueryClient } from '@tanstack/react-query';

const statuses = ['assigned', 'in_progress', 'completed', 'cancelled'];

export default function UpdateProjectStatus() {
  const { user } = useAuth();
  const { data: resp, isLoading, error } = useAxios('get', '/bookings/assigned', {}, { enabled: !!user });
  const bookings = resp?.data || [];
  const queryClient = useQueryClient();

  const UpdateStatus = ({ booking }) => {
    const [status, setStatus] = useState(booking.status || 'assigned');
    const [progress, setProgress] = useState(booking.progress ?? (booking.status === 'completed' ? 100 : booking.status === 'in_progress' ? 50 : 0));
    const [loading, setLoading] = useState(false);
    const patch = useAxios('patch', `/bookings/${booking._id}/status`);

    const save = async (newStatus, newProgress) => {
      const target = newStatus || status;
      const prog = newProgress !== undefined ? newProgress : progress;
      if (!confirm(`Change status to '${target}' and progress to ${prog}%?`)) return;
      try {
        setLoading(true);
        console.log(target, prog);
        const json = await patch.mutateAsync({ status: target, progress: prog });
        if (json && json.success) {
          alert('Status updated');
          // If server returned updated booking, patch the cache for immediate UI update
          if (json.updated) {
            queryClient.setQueryData(['/bookings/assigned'], (old) => {
              if (!old) return old;
              const arr = (old.data || []).map((it) => (String(it._id) === String(json.updated._id) ? json.updated : it));
              return { ...old, data: arr };
            });
            // also set local state from server response
            setStatus(json.updated.status);
            setProgress(json.updated.progress ?? prog);
          } else {
            queryClient.invalidateQueries({ queryKey: ['/bookings/assigned'] });
          }
        } else throw new Error(json?.message || 'Update failed');
      } catch (err) {
        console.error('Update status error', err);
        alert(err?.response?.data?.message || err.message || 'Could not update status');
      } finally {
        setLoading(false);
      }
    };

    // Next step action
    const advance = () => {
      const idx = statuses.indexOf(status);
      const next = idx < statuses.length - 1 ? statuses[idx + 1] : statuses[statuses.length - 1];
      if (next === status) return;
      // map next status to a default progress
      const progressMap = { assigned: 0, in_progress: 50, completed: 100, cancelled: 0 };
      const nextProg = progressMap[next] ?? progress;
      setStatus(next);
      setProgress(nextProg);
      save(next, nextProg);
    };

    return (
      <div className="flex items-center gap-2">
        <select className="select select-bordered select-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <input type="range" min={0} max={100} className="range range-xs" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
          <div className="text-sm w-12 text-right">{progress}%</div>
        </div>
        <button className="btn btn-sm btn-primary" onClick={() => save()} disabled={loading}>{loading ? 'Saving…' : 'Save'}</button>
        <button className="btn btn-sm btn-secondary" onClick={advance} disabled={loading || status === 'completed'}>Next Step</button>
      </div>
    );
  };

  if (isLoading) return <div className="mockup-window border bg-base-200 p-4">Loading…</div>;
  if (error) return <div className="alert alert-error">{error.message || 'Failed to load assigned projects'}</div>;

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Update Project Status</h3>
      <p className="text-sm text-gray-600 mb-4">Update the status of your assigned projects.</p>

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
                <td><UpdateStatus booking={b} /></td>
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
}
